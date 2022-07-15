import * as React from "react";
import { View } from "react-native";
import { BaseToast, ErrorToast } from "react-native-toast-message";
import { colors } from "./styles";

export const toastConfig = {
  success: (props) => (
    <BaseToast
      position="bottom"
      {...props}
      style={{
        borderColor: colors.secondary,
        borderLeftColor: colors.secondary,
        backgroundColor: colors.primary,
        borderWidth: 2,
        borderLeftWidth: 2,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 25,
        fontWeight: "400",
        color: colors.secondary,
      }}
      text2Style={{
        fontSize: 15,
        fontWeight: "400",
        color: colors.secondary,
      }}
      // text1={`${(<Text>⦿</Text>)}${props.text1}`}
      renderLeadingIcon={() => (
        <View
          style={{
            alignSelf: "center",
            width: 15,
            height: 15,
            backgroundColor: colors.green,
            borderRadius: 100,
            marginLeft: 15,
          }}
        />
      )}
    />
  ),
  error: (props) => (
    <ErrorToast
      position="bottom"
      {...props}
      style={{
        borderColor: colors.secondary,
        borderLeftColor: colors.secondary,
        backgroundColor: colors.primary,
        borderWidth: 2,
        borderLeftWidth: 2,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 30,
        fontWeight: "400",
        color: colors.secondary,
      }}
      text2Style={{
        fontSize: 15,
        fontWeight: "400",
        color: colors.secondary,
      }}
      renderLeadingIcon={() => (
        <View
          style={{
            alignSelf: "center",
            width: 15,
            height: 15,
            backgroundColor: colors.red,
            borderRadius: 100,
            marginLeft: 15,
          }}
        />
      )}
    />
  ),
  info: (props) => (
    <BaseToast
      position="bottom"
      {...props}
      style={{
        borderColor: colors.secondary,
        borderLeftColor: colors.secondary,
        backgroundColor: colors.primary,
        borderWidth: 2,
        borderLeftWidth: 2,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 25,
        fontWeight: "400",
        color: colors.secondary,
      }}
      text2Style={{
        fontSize: 15,
        fontWeight: "400",
        color: colors.secondary,
      }}
      // text1={`${(<Text>⦿</Text>)}${props.text1}`}
      renderLeadingIcon={() => (
        <View
          style={{
            alignSelf: "center",
            width: 15,
            height: 15,
            backgroundColor: colors.yellow,
            borderRadius: 100,
            marginLeft: 15,
          }}
        />
      )}
    />
  ),
};
