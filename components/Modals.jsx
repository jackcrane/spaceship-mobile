import { View, Text, TouchableOpacity, TextInput } from "react-native";
import styles, { colors } from "./styles";
import ModalBase from "./Modal";
import DeviceId from "./DeviceId";
import { useEffect, useState } from "react";

export const Modals = (props) => (
  <>
    <ModalBase
      open={props.uploadTypesModalShown}
      onClose={() => props.setUploadTypesModalShown(false)}
    >
      <UploadModalContent {...props} />
    </ModalBase>
    <ModalBase
      open={props.recieveModalShown}
      onClose={() => props.setRecieveModalShown(false)}
    >
      <DeviceId />
    </ModalBase>
  </>
);

const UploadModalContent = (props) => {
  const [stage, setStage] = useState(0);
  const [target, setTarget] = useState("");
  useEffect(() => {
    props.setTarget(target);
  }, [target]);
  return (
    <>
      {stage === 0 ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="target device"
            placeholderTextColor={"#A1A1A2"}
            textAlign="center"
            maxLength={6}
            autoFocus={true}
            onChangeText={(e) => setTarget(e.toUpperCase())}
            value={target}
          />
          <Text style={styles.text}>
            this is where you should put the 6-digit device id of the device you
            want to send to.
          </Text>
          {target.length === 6 && (
            <TouchableOpacity
              onPress={() => {
                setStage(1);
              }}
            >
              <View style={styles.button}>
                <Text style={styles.buttonText}>next</Text>
              </View>
            </TouchableOpacity>
          )}
        </>
      ) : (
        <>
          <TouchableOpacity
            onPress={() => {
              props.uploadFromFiles(() => {
                props.setUploadTypesModalShown(false);
              });
            }}
          >
            <View style={{ ...styles.button, ...styles.buttonLight }}>
              <Text style={{ ...styles.buttonText, ...styles.buttonTextLight }}>
                from files
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              props.uploadFromImages(() => {
                props.setUploadTypesModalShown(false);
              });
            }}
          >
            <View style={{ ...styles.button, ...styles.buttonLight }}>
              <Text style={{ ...styles.buttonText, ...styles.buttonTextLight }}>
                from photos
              </Text>
            </View>
          </TouchableOpacity>
        </>
      )}
    </>
  );
};
