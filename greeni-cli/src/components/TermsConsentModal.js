import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Dimensions,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import TermsRow from "./TermsRow";
import Button from "./Button";
import colors from "../theme/colors";

const { width: W, height: H } = Dimensions.get("window");

const TERMS_ITEMS = [
  {
    key: "parentConsent",
    title: "만 14세 미만 법정대리인 동의",
    required: true,
  },
  {
    key: "privacyConsent",
    title: "개인정보 수집·이용 동의",
    required: true,
  },
  {
    key: "serviceConsent",
    title: "이용약관 동의",
    required: true,
  },
];

export default function TermsConsentModal({
  visible = false,
  terms = {},
  onClose,
  onToggleTerm,
  onPressDetail,
  onSubmit,
}) {
  const [renderModal, setRenderModal] = useState(visible);

  const translateY = useSharedValue(H);
  const overlayOpacity = useSharedValue(0);

  const requiredItems = useMemo(() => TERMS_ITEMS.filter(item => item.required), []);

  const isAllChecked = useMemo(() => {
    return TERMS_ITEMS.every(item => !!terms[item.key]);
  }, [terms]);

  const isRequiredChecked = useMemo(() => {
    return requiredItems.every(item => !!terms[item.key]);
  }, [requiredItems, terms]);

  useEffect(() => {
    if (visible) {
      setRenderModal(true);

      translateY.value = withTiming(0, {
        duration: 260,
        easing: Easing.out(Easing.cubic),
      });

      overlayOpacity.value = withTiming(1, {
        duration: 220,
        easing: Easing.out(Easing.cubic),
      });
    } else if (renderModal) {
      translateY.value = withTiming(H, {
        duration: 220,
        easing: Easing.in(Easing.cubic),
      });

      overlayOpacity.value = withTiming(
        0,
        {
          duration: 180,
          easing: Easing.in(Easing.cubic),
        },
        finished => {
          if (finished) {
            runOnJS(setRenderModal)(false);
          }
        },
      );
    }
  }, [visible, renderModal, translateY, overlayOpacity]);

  const handleToggleAll = () => {
    const nextValue = !isAllChecked;

    TERMS_ITEMS.forEach(item => {
      if (!!terms[item.key] !== nextValue) {
        onToggleTerm?.(item.key);
      }
    });
  };

  const handleClose = () => {
    translateY.value = withTiming(H, {
      duration: 220,
      easing: Easing.in(Easing.cubic),
    });

    overlayOpacity.value = withTiming(
      0,
      {
        duration: 180,
        easing: Easing.in(Easing.cubic),
      },
      finished => {
        if (finished) {
          runOnJS(onClose)?.();
        }
      },
    );
  };

  const handleSubmit = () => {
    if (!isRequiredChecked) return;
    onSubmit?.();
  };

  const overlayAnimStyle = useAnimatedStyle(() => {
    return {
      opacity: overlayOpacity.value,
    };
  });

  const sheetAnimStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  if (!renderModal) return null;

  return (
    <Modal
      visible={renderModal}
      transparent
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
      navigationBarTranslucent
    >
      <Animated.View style={[styles.overlay, overlayAnimStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />

        <Animated.View style={[styles.sheet, sheetAnimStyle]}>
          <View style={styles.sheetInner}>
            <TouchableOpacity style={styles.closeButton} activeOpacity={0.8} onPress={handleClose}>
              <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>

            <Text style={styles.title}>잠시만요!</Text>
            <Text style={styles.subTitle}>서비스 이용을 위해 약관 동의가 필요해요.</Text>

            <View style={styles.divider} />

            <Text style={styles.guideText}>
              본 서비스는 만 14세 미만 아동을 대상으로 하며,{"\n"}
              회원가입은 반드시 보호자가 진행해야 합니다.
            </Text>

            <TouchableOpacity
              style={styles.allAgreeRow}
              activeOpacity={0.2}
              onPress={handleToggleAll}
            >
              <Text style={styles.allAgreeText}>
                {isAllChecked ? "전체 동의 해제" : "전체 동의"}
              </Text>
            </TouchableOpacity>

            <View style={styles.termsList}>
              {TERMS_ITEMS.map(item => (
                <View key={item.key} style={styles.rowWrap}>
                  <TermsRow
                    checked={!!terms[item.key]}
                    required={item.required}
                    title={item.title}
                    onToggle={() => onToggleTerm?.(item.key)}
                    onPressDetail={() => onPressDetail?.(item.key)}
                  />
                </View>
              ))}
            </View>

            <View style={styles.buttonWrap}>
              <Button
                title="가입하기"
                width={W * 0.82}
                height={42}
                borderRadius={8}
                fontSize={12}
                onPress={handleSubmit}
                disabled={!isRequiredChecked}
                disabledColor="#E2E2E2"
              />
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.lightGray95,
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: -3,
    backgroundColor: "transparent",
  },
  sheetInner: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 3,
    borderColor: colors.greenDark,
    minHeight: 500,
    paddingHorizontal: 25,
    paddingTop: 30,
    paddingBottom: 160,
  },
  closeButton: {
    position: "absolute",
    top: 15,
    right: 15,
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  closeText: {
    fontSize: 35,
    lineHeight: 35,
    color: colors.greenDark,
    fontFamily: "Maplestory_Light",
  },
  title: {
    fontSize: 25,
    lineHeight: 30,
    color: colors.brown,
    fontFamily: "Maplestory_Bold",
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 12,
    lineHeight: 15,
    color: colors.brown,
    fontFamily: "Maplestory_Light",
    marginBottom: 14,
  },
  divider: {
    width: "100%",
    height: 2,
    backgroundColor: colors.greenDark,
    marginVertical: 5,
  },
  guideText: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.brown,
    fontFamily: "Maplestory_Light",
    marginVertical: 20,
  },
  allAgreeRow: {
    alignSelf: "flex-start",
    marginBottom: 6,
  },
  allAgreeText: {
    fontSize: 10,
    lineHeight: 14,
    color: "#9A9A9A",
    fontFamily: "Maplestory_Light",
  },
  termsList: {
    width: "100%",
    marginBottom: 0,
  },
  rowWrap: {
    paddingVertical: 2,
  },
  buttonWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 80,
    alignItems: "center",
  },
});
