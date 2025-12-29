import React, { useMemo, useState, useCallback } from "react";
import { View, Image, StyleSheet } from "react-native";
import colors from "../theme/colors";

/**
 * props:
 *  - emotions: Array<string>  // 예: ["joy", "sad", "angry", ...] 또는 네가 쓰는 key들
 *  - sourceMap: Record<string, any> // key -> require("...") 매핑
 *  - max: number (default 31)
 *  - seed: number (default 1234)  // 같은 달/같은 사용자면 고정 추천
 *  - style: any (optional)
 */
export default function EmotionVander({
  emotions = [],
  sourceMap = {},
  max = 31,
  seed = 1234,
  style,
}) {
  const [box, setBox] = useState({ w: 0, h: 0 });

  const onLayout = useCallback((e) => {
    const { width, height } = e.nativeEvent.layout;
    setBox({ w: width, h: height });
  }, []);

  // ✅ deterministic random (리렌더되어도 위치가 “랜덤하게” 튀지 않게)
  const mulberry32 = (a) => {
    return function () {
      let t = (a += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  // ✅ 개수 늘수록 크기가 줄어들게 (최대 31 기준)
  const baseSize = useMemo(() => {
    const minWH = Math.min(box.w, box.h);
    if (!minWH) return 0;

    const maxSize = minWH * 0.62; // 처음엔 큼
    const minSize = minWH * 0.22; // 많아지면 작게
    const t = max <= 1 ? 1 : Math.min(1, Math.max(0, (emotions.length - 1) / (max - 1)));
    return maxSize - (maxSize - minSize) * t;
  }, [box.w, box.h, emotions.length, max]);

  // ✅ “첫 번째 사진처럼” 겹치면서 한쪽(오른쪽-아래 쪽)에 쌓이는 배치
  const placed = useMemo(() => {
    if (!box.w || !box.h || !baseSize) return [];

    const rand = mulberry32(seed);
    const pad = 8;

    return emotions.map((key, i) => {
      // 아이콘마다 크기를 약간씩 다르게
      const rSize = 0.82 + rand() * 0.38; // 0.82 ~ 1.20
      const size = Math.max(16, baseSize * rSize);

      // 배치 가능 범위
      const maxX = Math.max(0, box.w - size - pad);
      const maxY = Math.max(0, box.h - size - pad);

      // ✅ 오른쪽/아래로 bias 주기 (0.55~1.0 영역 위주)
      const rx = 0.55 + rand() * 0.45;
      const ry = 0.55 + rand() * 0.45;

      const x = pad + maxX * rx;
      const y = pad + maxY * ry;

      // 위에 쌓이는 느낌 (나중에 들어온 게 위로)
      const zIndex = 10 + i;

      return { key, x, y, size, zIndex };
    });
  }, [box.w, box.h, baseSize, emotions, seed]);

  return (
    <View onLayout={onLayout} style={[styles.container, style]}>
      {placed.map((p, idx) => {
        const src = sourceMap[p.key];
        if (!src) return null;

        return (
          <Image
            key={`${p.key}-${idx}`}
            source={src}
            resizeMode="contain"
            style={[
              styles.face,
              {
                width: p.size,
                height: p.size,
                left: p.x,
                top: p.y,
                zIndex: p.zIndex,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    borderWidth: 2,
    borderColor: colors.pink,
    borderRadius: 10,
    backgroundColor: colors.ivory, // 너가 쓰던 배경과 맞춤
    overflow: "hidden",
    position: "relative",
  },
  face: {
    position: "absolute",
  },
});
