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
  const wasInsideRef = useRef(false);

  const [, setTick] = useState(0); // 리렌더 트리거용(값은 안 씀)

  const wrapRef = useRef(null);
  const originRef = useRef({ x: 0, y: 0 });
  const sizeRef = useRef({ width: 0, height: 0 });

  const updateBounds = useCallback(() => {
    requestAnimationFrame(() => {
      wrapRef.current?.measure((x, y, width, height, pageX, pageY) => {
        originRef.current = { x: pageX, y: pageY };
        sizeRef.current = { width, height };
      });
    });
  }, []);

  const toLocalFromPage = useCallback((pageX, pageY) => {
    const { x, y } = originRef.current;
    return {
      x: pageX - x,
      y: pageY - y,
    };
  }, []);

  const isInsideLocal = useCallback((x, y) => {
    const { width, height } = sizeRef.current;
    return x >= 0 && x <= width && y >= 0 && y <= height;
  }, []);

  const clampToCanvas = useCallback((x, y) => {
    const { width, height } = sizeRef.current;
    return {
      x: Math.max(0, Math.min(x, width)),
      y: Math.max(0, Math.min(y, height)),
    };
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

        const { pageX, pageY } = evt.nativeEvent;
        const local = toLocalFromPage(pageX, pageY);
        const inside = isInsideLocal(local.x, local.y);

        wasInsideRef.current = inside;

        if (!inside) return;

        beginStroke(local.x, local.y);
      },

      onPanResponderMove: (evt) => {
        if (!canDraw) return;

        const { pageX, pageY } = evt.nativeEvent;
        const local = toLocalFromPage(pageX, pageY);
        const inside = isInsideLocal(local.x, local.y);
        const wasInside = wasInsideRef.current;

        if (inside) {
          if (wasInside) {
            extendStroke(local.x, local.y);
          } else {
            beginStroke(local.x, local.y);
          }
        } else if (wasInside) {
          const edge = clampToCanvas(local.x, local.y);
          extendStroke(edge.x, edge.y);
          endStroke();
        }

        wasInsideRef.current = inside;
      },

      onPanResponderRelease: () => {
        if (!canDraw) return;
        endStroke();
        wasInsideRef.current = false;
      },

      onPanResponderTerminate: () => {
        if (!canDraw) return;
        endStroke();
        wasInsideRef.current = false;
      },

      onPanResponderTerminationRequest: () => false,
    });
  }, [enabled, tool, toLocalFromPage, isInsideLocal, clampToCanvas, beginStroke, extendStroke, endStroke]);

  const live = currentStyleRef.current;

  return (
    <View
      ref={wrapRef}
      style={styles.wrap}
      onLayout={updateBounds}
      {...panResponder.panHandlers}
    >
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
