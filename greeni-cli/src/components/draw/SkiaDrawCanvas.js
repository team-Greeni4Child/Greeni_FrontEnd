import React, { useCallback, useMemo, useRef, useState } from "react";
import { View, StyleSheet, PanResponder } from "react-native";
import { Canvas, Path, Skia, Group } from "@shopify/react-native-skia";

// stroke: { path: SkPath, color: string, width: number, isEraser: boolean }
export default function SkiaDrawCanvas({
  tool = "pen", // "pen" | "eraser" | "photo"
  penColor = "#000000",
  penWidth = 10,
  eraserWidth = 18,
  enabled = true,
}) {
  const [strokes, setStrokes] = useState([]);

  const currentPathRef = useRef(Skia.Path.Make());
  const currentStyleRef = useRef({
    color: penColor,
    width: penWidth,
    isEraser: false,
  });
  const isDrawingRef = useRef(false);

  const [, setTick] = useState(0); // 리렌더 트리거용(값은 안 씀)

  const wrapRef = useRef(null);
  const boundsRef = useRef(null);

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

      const isEraser = tool === "eraser";
      currentStyleRef.current = {
        color: isEraser ? "transparent" : penColor, 
        width: isEraser ? eraserWidth : penWidth,
        isEraser,
      };

      isDrawingRef.current = true;

      setTick((t) => t + 1);
    },
    [tool, penColor, penWidth, eraserWidth]
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

    setStrokes((prev) => [
      ...prev,
      { path: finished, color: style.color, width: style.width, isEraser: style.isEraser },
    ]);

    currentPathRef.current = Skia.Path.Make();
    setTick((t) => t + 1);
  }, []);

  const panResponder = useMemo(() => {
    const canDraw = enabled && (tool === "pen" || tool === "eraser");

    return PanResponder.create({
      onStartShouldSetPanResponder: () => canDraw,
      onMoveShouldSetPanResponder: () => canDraw,

      onPanResponderGrant: (evt) => {
        if (!canDraw) return;
        measureBounds();

        const { pageX, pageY } = evt.nativeEvent;
        if (!isInsidePage(pageX, pageY)) return;

        const local = toLocal(pageX, pageY);
        if (!local) return;

        beginStroke(local.x, local.y);
      },

      onPanResponderMove: (evt) => {
        if (!canDraw) return;

        const { pageX, pageY } = evt.nativeEvent;

        if (!isInsidePage(pageX, pageY)) {
          endStroke();
          return;
        }

        const local = toLocal(pageX, pageY);
        if (!local) return;

        extendStroke(local.x, local.y);
      },

      onPanResponderRelease: () => {
        if (!canDraw) return;
        endStroke();
      },

      onPanResponderTerminate: () => {
        if (!canDraw) return;
        endStroke();
      },
    });
  }, [enabled, tool, measureBounds, isInsidePage, toLocal, beginStroke, extendStroke, endStroke]);

  const live = currentStyleRef.current;

  return (
    <View ref={wrapRef} style={styles.wrap} onLayout={measureBounds} {...panResponder.panHandlers}>
      <Canvas style={styles.canvas}>
        <Group layer>
          {strokes.map((s, idx) => (
            <Path
              key={idx}
              path={s.path}
              style="stroke"
              strokeWidth={s.width}
              strokeJoin="round"
              strokeCap="round"
              color={s.isEraser ? "transparent" : s.color}
              blendMode={s.isEraser ? "clear" : "srcOver"}
            />
          ))}

          <Path
            path={currentPathRef.current}
            style="stroke"
            strokeWidth={live.width}
            strokeJoin="round"
            strokeCap="round"
            color={live.isEraser ? "transparent" : live.color}
            blendMode={live.isEraser ? "clear" : "srcOver"}
          />
        </Group>
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  canvas: { flex: 1 },
});
