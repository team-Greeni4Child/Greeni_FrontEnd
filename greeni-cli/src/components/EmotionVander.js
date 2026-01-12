import React, { useMemo, useState, useCallback } from "react";
import { View, Image, StyleSheet } from "react-native";

// 난수 생성기
// 같은 Seed(a)면 배치 결과가 항상 동일하게
const mulberry32 = (a) => {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

// 어떤 값을 min~max 사이로 강제 제한
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

export default function EmotionVander({
  emotions = [],       // old → new, 감정 키 배열
  sourceMap = {},      // 감정 키 -> 이미지 source 매핑
  max = 31,
  seed = 1234,
  style,
  gap = 0,             // 감정 이미지끼리 최소 간격
  padding = 0,         // 컨테이너 가장자리와 이미지 사이 여백

  // 튜닝(추천 기본값)
  xSamples = 120,      // 후보 x 샘플 개수 (클수록 더 좋은 자리 찾음)
  leftBias = 0.75,     // 0~1 (1에 가까울수록 왼쪽 선호)
  compressPasses = 12, // 전체 배치 후 "왼쪽으로 밀고 다시 떨어뜨리기" 반복 횟수
}) {
  const [box, setBox] = useState({ w: 0, h: 0 }); // 컨테이너 크기 측정 상태

  // 실제 렌더된 크기
  const onLayout = useCallback((e) => {
    const { width, height } = e.nativeEvent.layout;
    setBox({ w: width, h: height });
  }, []);

  const displayEmotions = useMemo(() => {
    if (emotions.length <= max) return emotions;
    return emotions.slice(-max); // emotions 개수가 max 넘으면 최근 max개 디스플레이
  }, [emotions, max]);

  // 감정 많아질수록 작아지게
  const baseSize = useMemo(() => {
    const minWH = Math.min(box.w, box.h);
    if (!minWH) return 0;

    const n = displayEmotions.length;
    const maxSize = minWH * 0.42; // 감정 적을 때는 최대 크기 maxSize
    const minSize = minWH * 0.16; // 감정 많을 때는 최소 크기 minSize
    const t = max <= 1 ? 1 : clamp((n - 1) / (max - 1), 0, 1);
    return maxSize - (maxSize - minSize) * t;
  }, [box.w, box.h, displayEmotions.length, max]);

  const placed = useMemo(() => {
    const w = box.w, h = box.h;
    const n = displayEmotions.length;
    if (!w || !h || !baseSize || n === 0) return [];

    const rng = mulberry32(seed);

    // 겹침 검사 함수
    const collides = (cand, items, ignoreIdx = -1) => {
      for (let k = 0; k < items.length; k++) {
        if (k === ignoreIdx) continue;
        const it = items[k];
        const dx = cand.cx - it.cx;
        const dy = cand.cy - it.cy;
        const rr = cand.r + it.r + gap;
        if (dx * dx + dy * dy < rr * rr) return true;
      }
      return false;
    };

    // 중력 함수
    const settleY = (cx, r, items, ignoreIdx = -1) => {
      const bottom = h - padding - r;
      let cy = bottom;

      for (let k = 0; k < items.length; k++) {
        if (k === ignoreIdx) continue;
        const it = items[k];
        const dx = cx - it.cx;
        const minDist = r + it.r + gap;

        if (Math.abs(dx) >= minDist) continue;

        const dy = Math.sqrt(minDist * minDist - dx * dx);
        const candidateCy = it.cy - dy;
        if (candidateCy < cy) cy = candidateCy;
      }

      const top = padding + r;
      return Math.max(top, Math.min(cy, bottom));
    };

    // 압축 함수
    const pushLeftAndSettle = (items, idx) => {
      const it = items[idx];
      const r = it.r;
      const minX = padding + r;

      let best = { cx: it.cx, cy: it.cy };
      let improved = false;

      // 현재 위치에서 왼쪽으로 여러 스텝 시도
      const steps = 22;
      const maxShift = Math.min(60, w * 0.35); // 한 번에 너무 멀리 밀지 않기
      for (let s = 1; s <= steps; s++) {
        const cx = Math.max(minX, it.cx - (maxShift * s) / steps);
        const cy = settleY(cx, r, items, idx);
        const cand = { cx, cy, r };

        if (collides(cand, items, idx)) continue;

        // 평가 기준:
        // 1) 더 아래(cy가 더 큼)면 무조건 좋음
        // 2) 아래는 같거나 비슷하면 더 왼쪽(cx가 작음)이 좋음
        const downBetter = cand.cy > best.cy + 0.5;
        const leftBetter = Math.abs(cand.cy - best.cy) <= 0.5 && cand.cx < best.cx - 0.5;

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

    const items = [];

    // 1) 먼저 “중력 + 왼쪽 선호”로 하나씩 배치
    for (let i = 0; i < n; i++) {
      const key = displayEmotions[i];
      if (!sourceMap[key]) continue;

      // 크기 랜덤
      let size = baseSize * (0.65 + rng() * 0.4);
      size = Math.max(16, Math.min(size, Math.min(w, h) * 0.55));
      const r = size / 2;

      // 회전/스케일 랜덤
      const rr = rng();
      let rotate;
      if (rr < 0.78) rotate = rng() * 60 - 30;
      else rotate = rng() * 360 - 180;
      const scale = 0.95 + rng() * 0.12;

      const minX = padding + r;
      const maxX = w - padding - r;

      let best = null;
      let bestScore = -Infinity;

      for (let t = 0; t < xSamples; t++) {
        // 왼쪽 편향 샘플링: u^p는 0쪽(왼쪽)에 더 몰림
        const u = rng();
        const p = 1 + leftBias * 5; // 1~6
        const biased = Math.pow(u, p); // 0에 몰림
        const cx = minX + biased * (maxX - minX);

        const cy = settleY(cx, r, items);
        const cand = { cx, cy, r };
        if (collides(cand, items)) continue;

        // 점수: 아래(cy) 우선, 그 다음 왼쪽(-cx)
        // cy 범위가 커서 영향이 크므로, x는 약하게만 반영
        const score = cy * 1000 - cx * 2;
        if (score > bestScore) {
          bestScore = score;
          best = cand;
        }
      }

      // 자리 못 찾으면 조금 줄여 재시도
      if (!best) {
        let local = Math.max(14, size * 0.9);
        for (let pass = 0; pass < 3 && !best; pass++) {
          const lr = local / 2;
          const minX2 = padding + lr;
          const maxX2 = w - padding - lr;

          for (let t = 0; t < xSamples; t++) {
            const u = rng();
            const p = 1 + leftBias * 5;
            const cx = minX2 + Math.pow(u, p) * (maxX2 - minX2);
            const cy = settleY(cx, lr, items);
            const cand = { cx, cy, r: lr };
            if (collides(cand, items)) continue;

            const score = cy * 1000 - cx * 2;
            if (score > bestScore) {
              bestScore = score;
              best = cand;
              size = local;
            }
          }
          local *= 0.92;
        }
      }

      if (!best) continue;

      items.push({
        key,
        size,
        r: size / 2,
        cx: best.cx,
        cy: best.cy,
        rotate,
        scale,
        zIndex: 10 + i,
      });
    }

    // 2) 전체 “압축”: 왼쪽으로 밀고 다시 떨어뜨리기를 여러 번 반복
    for (let pass = 0; pass < compressPasses; pass++) {
      // 오래된 것부터(아래에 깔린 것) 먼저 밀어두면 안정적
      for (let i = 0; i < items.length; i++) {
        pushLeftAndSettle(items, i);
      }
    }

    // 렌더용 변환
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
    box.w, box.h, baseSize, displayEmotions, sourceMap,
    seed, gap, padding, xSamples, leftBias, compressPasses
  ]);

  return (
    <View onLayout={onLayout} style={[styles.container, style]}>
      {placed.map((p, idx) => (
        <Image
          key={`${p.key}-${idx}`}
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
