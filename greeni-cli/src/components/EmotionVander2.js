import React, { useMemo, useState, useCallback } from "react";
import { View, Image, StyleSheet } from "react-native";

const mulberry32 = (a) => () => {
  let t = (a += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

export default function EmotionVanderAggregateStackFixed({
  emotions = [],
  sourceMap = {},
  style,

  keys = ["angry", "sad", "happy", "surprised", "anxiety"],

  // 절대 기준(한 달 최대)
  maxCount = 31,

  seed = 1234,
  gap = 0,
  padding = 0,

  // 크기 튜닝
  // count=1일 때 크기 (minWH 비율)
  minSizeRatio = 0.22,
  // count=31일 때 크기 (minWH 비율) -> "꽉 찬" 느낌
  maxSizeRatio = 0.92,

  // 배치 튜닝
  xSamples = 260,
  leftBias = 0.92,
  compressPasses = 22,
}) {
  const [box, setBox] = useState({ w: 0, h: 0 });

  const onLayout = useCallback((e) => {
    const { width, height } = e.nativeEvent.layout;
    setBox({ w: width, h: height });
  }, []);

  // 1) 카운트 집계
  const counts = useMemo(() => {
    const c = {};
    for (const k of keys) c[k] = 0;
    for (const e of emotions) {
      if (c[e] != null) c[e] += 1;
    }
    return c;
  }, [emotions, keys]);

  // 2) 표시할 감정들
  const itemsToShow = useMemo(() => {
    return keys
      .map((k) => ({ key: k, count: counts[k] || 0 }))
      .filter((x) => x.count > 0 && !!sourceMap[x.key]);
  }, [counts, keys, sourceMap]);

  const placed = useMemo(() => {
    const w = box.w;
    const h = box.h;
    if (!w || !h || itemsToShow.length === 0) return [];

    const rng = mulberry32(seed);

    const collides = (cand, items, ignoreIdx = -1) => {
      for (let i = 0; i < items.length; i++) {
        if (i === ignoreIdx) continue;
        const it = items[i];
        const dx = cand.cx - it.cx;
        const dy = cand.cy - it.cy;
        const rr = cand.r + it.r + gap;
        if (dx * dx + dy * dy < rr * rr) return true;
      }
      return false;
    };

    const settleY = (cx, r, items, ignoreIdx = -1) => {
      const bottom = h - padding - r;
      let cy = bottom;

      for (let i = 0; i < items.length; i++) {
        if (i === ignoreIdx) continue;
        const it = items[i];

        const dx = cx - it.cx;
        const minDist = r + it.r + gap;
        if (Math.abs(dx) >= minDist) continue;

        const dy = Math.sqrt(minDist * minDist - dx * dx);
        const candidate = it.cy - dy;
        if (candidate < cy) cy = candidate;
      }

      const top = padding + r;
      return clamp(cy, top, bottom);
    };

    const pushLeftAndSettle = (items, idx) => {
      const it = items[idx];
      const r = it.r;
      const minX = padding + r;

      let best = { cx: it.cx, cy: it.cy };
      let improved = false;

      const steps = 28;
      const maxShift = Math.min(120, w * 0.7);

      for (let s = 1; s <= steps; s++) {
        const cx = Math.max(minX, it.cx - (maxShift * s) / steps);
        const cy = settleY(cx, r, items, idx);
        const cand = { cx, cy, r };
        if (collides(cand, items, idx)) continue;

        const downBetter = cand.cy > best.cy + 0.5;
        const leftBetter =
          Math.abs(cand.cy - best.cy) <= 0.5 && cand.cx < best.cx - 0.5;

        if (downBetter || leftBetter) {
          best = { cx: cand.cx, cy: cand.cy };
          improved = true;
        }
      }

      if (improved) {
        it.cx = best.cx;
        it.cy = best.cy;
      }
    };

    // 절대 기준 크기 함수 (다른 감정 변화의 영향 0)
    // 로그 곡선이라 2~5 차이도 확 커지고, 31이면 상한까지 감
    const minWH = Math.min(w, h);
    const baseMin = minWH * minSizeRatio;
    const baseMax = minWH * maxSizeRatio;

    const countToSize = (count) => {
      const c = clamp(count, 1, maxCount);

      // 0..1 정규화 (log)
      // c=1 -> 0, c=maxCount -> 1
      const t = Math.log(c) / Math.log(maxCount);

      return baseMin + (baseMax - baseMin) * t;
    };

    const items = [];
    const sorted = [...itemsToShow].sort((a, b) => b.count - a.count);

    for (let i = 0; i < sorted.length; i++) {
      const { key, count } = sorted[i];

      const rotate =
        rng() < 0.85 ? rng() * 40 - 20 : rng() * 360 - 180;
      const scale = 0.98 + rng() * 0.04;

      // 배치 실패해도 절대 스킵하지 않고,
      //    "그 감정만" 계속 줄여서라도 무조건 놓는다.
      let base = countToSize(count);
      base = clamp(base, 18, minWH * 0.98);

      let best = null;
      let bestScore = -Infinity;
      let finalSize = base;

      // 강제로라도 놓기 위해 shrink를 넓게(마지막엔 꽤 작아질 수 있음)
      const shrinkTries = [1.0, 0.92, 0.85, 0.78, 0.72, 0.66, 0.60, 0.54, 0.48];

      for (const shrink of shrinkTries) {
        const size = base * shrink;
        const r = size / 2;

        const minX = padding + r;
        const maxX = w - padding - r;

        best = null;
        bestScore = -Infinity;

        for (let t = 0; t < xSamples; t++) {
          const u = rng();
          const p = 1 + leftBias * 5;
          const biased = Math.pow(u, p);
          const cx = minX + biased * (maxX - minX);

          const cy = settleY(cx, r, items);
          const cand = { cx, cy, r };
          if (collides(cand, items)) continue;

          const score = cy * 1000 - cx * 2;
          if (score > bestScore) {
            bestScore = score;
            best = cand;
          }
        }

        if (best) {
          finalSize = size;
          break;
        }
      }

      // 그래도 못 놓으면(거의 없음) 마지막 응급 배치: 맨 왼쪽 바닥
      if (!best) {
        const size = Math.max(18, base * 0.42);
        const r = size / 2;
        const cx = padding + r;
        const cy = settleY(cx, r, items);
        best = { cx, cy, r };
        finalSize = size;
      }

      items.push({
        key,
        count,
        size: finalSize,
        r: finalSize / 2,
        cx: best.cx,
        cy: best.cy,
        rotate,
        scale,
        zIndex: 10 + i,
      });
    }

    for (let pass = 0; pass < compressPasses; pass++) {
      for (let i = 0; i < items.length; i++) {
        pushLeftAndSettle(items, i);
      }
    }

    return items.map((it) => ({
      key: it.key,
      size: it.size,
      x: it.cx - it.size / 2,
      y: it.cy - it.size / 2,
      rotate: it.rotate,
      scale: it.scale,
      zIndex: it.zIndex,
    }));
  }, [
    box.w,
    box.h,
    itemsToShow,
    sourceMap,
    seed,
    gap,
    padding,
    maxCount,
    minSizeRatio,
    maxSizeRatio,
    xSamples,
    leftBias,
    compressPasses,
  ]);

  return (
    <View onLayout={onLayout} style={[styles.container, style]}>
      {placed.map((p) => (
        <Image
          key={p.key}
          source={sourceMap[p.key]}
          resizeMode="contain"
          style={[
            styles.face,
            {
              width: p.size,
              height: p.size,
              left: p.x,
              top: p.y,
              zIndex: p.zIndex,
              transform: [{ rotate: `${p.rotate}deg` }, { scale: p.scale }],
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    position: "relative",
  },
  face: { position: "absolute" },
});
