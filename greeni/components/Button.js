import React from "react";
import { TouchableOpacity, Text, Image, StyleSheet } from "react-native";
import colors from "../theme/colors";

// 커스텀 버튼
// 타이틀, 너비, 높이, 색상, 테두리, 비활성화 다르게 설정가능하도록 기본 설정만 해둠

const Button = ({
    title = 'untitled',
    fontSize = 18,
    width = 108,
    height = 49,
    backgroundColor = colors.green,
    borderRadius = 24.5,
    borderWidth = 0,
    borderColor = 'transparent',
    onPress = () => null,
    icon = null,
    disabled = false,
}) => {

    // 비활성화 상태일 때 배경색은 lightGray60으로 하고
    //  활성화 상태일 때는 backgroundColor로
    const btnBackgroundColor = disabled ? colors.lightGray60 : backgroundColor;

    return (
        <TouchableOpacity
            style={[
                styles.button,
                {
                    width,
                    height,
                    backgroundColor: btnBackgroundColor,
                    borderRadius,
                    borderWidth,
                    borderColor,
                },
            ]}
            // 비활성화 상태일 때는 눌러도 동작 안 함
            onPress={disabled ? null : onPress}
            disabled={disabled}
        >
            <Text style={[ styles.title, { fontSize }]}>
                {title}
            </Text>
            {icon && (
                <Image source={icon} style={styles.icon} resizeMode="contain" />
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    title: {
        fontFamily: "WantedSans-Bold",
        color: colors.brown,
    },
    icon: {
        width: 16,
        height: 16,
        marginLeft: 7,
    },
});

export default Button;