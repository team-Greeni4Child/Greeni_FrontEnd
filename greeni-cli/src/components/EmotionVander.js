import React, { useMemo, useState, useCallback } from "react";
import { View, Image, StyleSheet } from "react-native";
import colors from "../theme/colors";

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

  // deterministic random
  const mulberry32 = (a) => {
    return function () {
      let t = (a += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  // ✅ 개수 늘수록 더 작아지게
  const baseSize = useMemo(() => {
    const minWH = Math.min(box.w, box.h);
    if (!minWH) return 0;

    const maxSize = minWH * 0.52;
    const minSize = minWH * 0.16;
    const t =
      max <= 1
        ? 1
        : Math.min(1, Math.max(0, (emotions.length - 1) / (max - 1)));
    return maxSize - (maxSize - minSize) * t;
  }, [box.w, box.h, emotions.length, max]);

  // ✅ 겹치지 않게 + 아래에서부터 쌓이게 + 회전/스케일 랜덤
  const placed = useMemo(() => {
    if (!box.w || !box.h || !baseSize) return [];

    const pad = 6;
    const items = [];

    const count = emotions.length;
    const minCell = Math.max(18, baseSize * 0.95);
    const cols = Math.max(1, Math.floor((box.w - pad * 2) / minCell));
    const cellW = (box.w - pad * 2) / cols;
    const cellH = cellW;
    const rows = Math.max(1, Math.ceil(count / cols));

    for (let i = 0; i < count; i++) {
      const key = emotions[i];
      const rand = mulberry32(seed + i);

      const rowFromBottom = Math.floor(i / cols);
      const row = rows - 1 - rowFromBottom;
      const col = i % cols;

      const jitterX = (rand() - 0.5) * (cellW * 0.25);
      const jitterY = (rand() - 0.5) * (cellH * 0.25);

      const size = Math.max(16, cellW * (0.65 + rand() * 0.3));

      let x = pad + col * cellW + (cellW - size) / 2 + jitterX;
      let y = pad + row * cellH + (cellH - size) / 2 + jitterY;

      x = Math.max(pad, Math.min(x, box.w - size - pad));
      y = Math.max(pad, Math.min(y, box.h - size - pad));

      // ✅ 회전 더 자유롭게:
      // - 대부분은 "자연스러운 각도" (-25~+25)
      // - 일부는 크게 돌아감 (최대 180도까지 가능)
      const r = rand();
      let rotate;
      if (r < 0.75) {
        // 75%: 자연스럽게
        rotate = (rand() * 50) - 25; // -25 ~ +25
      } else {
        // 25%: 크게 (부호도 랜덤)
        const sign = rand() < 0.5 ? -1 : 1;
        rotate = sign * (60 + rand() * 120); // 60 ~ 180
      }

      const scale = 0.98 + rand() * 0.06;

      items.push({
        key,
        x,
        y,
        size,
        rotate,
        scale,
        zIndex: 10 + i,
      });
    }

    return items;
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
                transform: [{ rotate: `${p.rotate}deg` }, { scale: p.scale }],
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
    backgroundColor: colors.ivory,
    overflow: "hidden",
    position: "relative",
  },
  face: {
    position: "absolute",
  },
});
