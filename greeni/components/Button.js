import React, {Component} from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

// 커스텀 버튼
// 크기, 색, 타이들 다르게 설정가능하도록 기본 설정만 해둠

export default class Button extends Component {

    static defaultProps = {
        title: 'untitled',
        buttonColor: '#000',
        titleColor: '#fff',
        width: 108,
        height: 49,
        borderRadius: 24.5,
        onPress: () => null,
    }

    constructor(props) {
        super(props);
    }

    render(){
        return (
            <TouchableOpacity
                style={[styles.button, {backgroundColor: this.props.buttonColor, width: this.props.width, height: this.props.height, borderRadius: this.props.borderRadius}]}
                onPress={this.props.onPress}>
                <Text
                    style={[styles.title, {color:this.props.titleColor}]}>
                    {this.props.title}
                </Text>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        borderRadius: 5,
    },
    title: {
        fontSize: 15,
    }
})