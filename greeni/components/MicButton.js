// components/MicButton.js
import React, { useState, useEffect } from "react";
import { TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";
import colors from "../theme/colors";

const { width: W, height: H } = Dimensions.get("window");

const micIcons = [
  require("../assets/images/mic1.png"),
  require("../assets/images/mic2.png"),
  require("../assets/images/mic3.png"),
  require("../assets/images/mic4.png"),
];

export default function MicButton() {
  const [active, setActive] = useState(false);
  const [frame, setFrame] = useState(0);

  useEffect(() => {

    let interval;
    if (active) {
      interval = setInterval(() => {
        setFrame((prev) => {
          const next = (prev + 1) % micIcons.length;
          return next;
        });
      }, 200);
    } else {
      if (frame > 0) {
        interval = setInterval(() => {
          setFrame((prev) => {
            const next = prev > 0 ? prev - 1 : 0;
            return next;
          });
        }, 200);
      }
    }

    return () => {
      clearInterval(interval);
    };
  }, [active]); // 의존성: active만

  const toggleMic = () => {
    setActive((prev) => !prev);
  };

  return (
    <TouchableOpacity onPress={toggleMic} style={styles.button} >
      <Image source={micIcons[frame]} style={styles.icon} />
    </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    alignItems: 'center',
    bottom: H * 0.06,
  },
  icon: {
    width: 165, 
    height: 165
  },
});
