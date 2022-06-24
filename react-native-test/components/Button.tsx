import React from "react";
import { Pressable } from "react-native";
import AppText from "./AppText";

function Button({ styles, children, onPress, testStyle }: Props) {
    return (
        <Pressable onPress={() => onPress()} style={styles}>
            <AppText style={testStyle}>{children}</AppText>
        </Pressable>
    );
}

interface Props {
    onPress: Function,
    children: React.ReactNode,
    styles?: any,
    testStyle?: any,
    [otherProps: string]: any,
}
export default Button;