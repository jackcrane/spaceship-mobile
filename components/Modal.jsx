import { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import styles from "./styles";
import LottieView from "lottie-react-native";

const ModalBase = (props) => {
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  useEffect(() => {
    Keyboard.addListener("keyboardWillShow", () => {
      setKeyboardOpen(true);
    });
    Keyboard.addListener("keyboardWillHide", () => {
      setKeyboardOpen(false);
    });
  }, []);
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.open}
      onRequestClose={() => {
        console.log("Close requested");
      }}
    >
      <KeyboardAvoidingView
        style={styles.modalContent}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View
          style={{ ...styles.modalView, minHeight: keyboardOpen ? 300 : 400 }}
        >
          {/* <Text>{context.modalContent}</Text> */}
          <View style={styles.modalScroll}>
            <View style={styles.modalInner}>
              <ScrollView
                refreshControl={
                  <RefreshControl
                    refreshing={false}
                    onRefresh={() => {
                      props.onClose();
                    }}
                  />
                }
              >
                {props.children}
              </ScrollView>
              {/* <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={props.onClose}
              >
                <Text style={styles.modalCloseButtonText}>cancel</Text>
              </TouchableOpacity> */}
              <View style={styles.footer}>
                <LottieView
                  style={{
                    width: 40,
                    height: 40,
                  }}
                  autoPlay={true}
                  // Find more Lottie files at https://lottiefiles.com/featured
                  source={require("../assets/down.json")}
                />
                <Text style={styles.footerText}>
                  pull down to close this popup
                </Text>
                <LottieView
                  style={{
                    width: 40,
                    height: 40,
                  }}
                  autoPlay={true}
                  // Find more Lottie files at https://lottiefiles.com/featured
                  source={require("../assets/down.json")}
                />
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ModalBase;
