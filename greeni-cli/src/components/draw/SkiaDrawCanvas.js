import React, { useCallback, useMemo, useRef, useState } from "react";
import { View, StyleSheet, PanResponder } from "react-native";
import { Canvas, Path, Skia } from "@shopify/react-native-skia";

// stroke: { path: SkPath, color: string, width: number }
export default function SkiaDrawCanvas({ penColor, penWidth, enabled = true }) {
  const [strokes, setStrokes] = useState([]);

  // 드래그 중인 path
  const currentPathRef = useRef(Skia.Path.Make());
  const currentStyleRef = useRef({ color: penColor, width: penWidth });
  const isDrawingRef = useRef(false);

  // 리렌더 트리거
  const [tick, setTick] = useState(0);

  // 캔버스 View ref + window 좌표(bounds)
  const wrapRef = useRef(null);
  const boundsRef = useRef(null); // { x, y, width, height }

  // 최신 스타일 업데이트(그리기 도중 옵션 변경 방지용은 begin에서 고정)
  currentStyleRef.current = { color: penColor, width: penWidth };

  const measureBounds = useCallback(() => {
    // measureInWindow는 비동기 콜백
    wrapRef.current?.measureInWindow((x, y, width, height) => {
      boundsRef.current = { x, y, width, height };
    });
  }, []);

  const toLocal = useCallback((pageX, pageY) => {
    const b = boundsRef.current;
    if (!b) return null;
    return { x: pageX - b.x, y: pageY - b.y };
  }, []);

  const isInsidePage = useCallback((pageX, pageY) => {
    const b = boundsRef.current;
    if (!b) return false;
    return (
      pageX >= b.x &&
      pageX <= b.x + b.width &&
      pageY >= b.y &&
      pageY <= b.y + b.height
    );
  }, []);

  const beginStroke = useCallback(
    (x, y) => {
      const p = Skia.Path.Make();
      p.moveTo(x, y);
      currentPathRef.current = p;

      // 시작 시점 스타일 고정
      currentStyleRef.current = { color: penColor, width: penWidth };
      isDrawingRef.current = true;

      setTick((t) => t + 1);
    },
    [penColor, penWidth]
  );

  const extendStroke = useCallback((x, y) => {
    if (!isDrawingRef.current) return;
    currentPathRef.current.lineTo(x, y);
    setTick((t) => t + 1);
  }, []);

  const endStroke = useCallback(() => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;

    const finished = currentPathRef.current.copy();
    const style = currentStyleRef.current;

    setStrokes((prev) => [...prev, { path: finished, color: style.color, width: style.width }]);

    currentPathRef.current = Skia.Path.Make();
    setTick((t) => t + 1);
  }, []);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => enabled,
        onMoveShouldSetPanResponder: () => enabled,

        onPanResponderGrant: (evt) => {
          if (!enabled) return;

          // 시작 시점에 bounds 확정
          measureBounds();

          const { pageX, pageY } = evt.nativeEvent;
          if (!isInsidePage(pageX, pageY)) return;

          const local = toLocal(pageX, pageY);
          if (!local) return;

          beginStroke(local.x, local.y);
        },

        onPanResponderMove: (evt) => {
          if (!enabled) return;

          const { pageX, pageY } = evt.nativeEvent;

          // 영역 벗어나면 즉시 스트로크 종료(튀는 직선 차단)
          if (!isInsidePage(pageX, pageY)) {
            endStroke();
            return;
          }

          const local = toLocal(pageX, pageY);
          if (!local) return;

          extendStroke(local.x, local.y);
        },

        onPanResponderRelease: () => {
          if (!enabled) return;
          endStroke();
        },

        onPanResponderTerminate: () => {
          if (!enabled) return;
          endStroke();
        },
      }),
    [enabled, measureBounds, isInsidePage, toLocal, beginStroke, extendStroke, endStroke]
  );

  // tick은 리렌더용이라 실제 값은 안 씀
  // eslint-disable-next-line no-unused-vars
  const _ = tick;

  return (
    <View
      ref={wrapRef}
      style={styles.wrap}
      onLayout={() => {
        // 레이아웃 변할 때마다 bounds 갱신
        measureBounds();
      }}
      {...panResponder.panHandlers}
    >
      <Canvas style={styles.canvas}>
        {strokes.map((s, idx) => (
          <Path
            key={idx}
            path={s.path}
            color={s.color}
            style="stroke"
            strokeWidth={s.width}
            strokeJoin="round"
            strokeCap="round"
          />
        ))}

        <Path
          path={currentPathRef.current}
          color={penColor}
          style="stroke"
          strokeWidth={penWidth}
          strokeJoin="round"
          strokeCap="round"
        />
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  canvas: { flex: 1 },
});
