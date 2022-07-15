import { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { Storage } from "../utilities";
import styles, { colors } from "./styles";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-toast-message";

const DeviceId = (props) => {
  const [deviceId, setDeviceId] = useState(null);
  useEffect(() => {
    GetOrGenerateDeviceId(false).then((did) => {
      setDeviceId(did);
    });
  }, []);

  return (
    <View style={styles.deviceId}>
      <TouchableWithoutFeedback
        onPress={async () => {
          await Clipboard.setStringAsync(deviceId);
          Toast.show({
            text1: "copied to clipboard",
            type: "info",
            duration: 10,
          });
        }}
      >
        <View style={styles.deviceIdRow}>
          {deviceId &&
            deviceId.split("").map((letter, index) => (
              <Text key={index} style={styles.deviceIdLetter}>
                {letter}
              </Text>
            ))}
        </View>
      </TouchableWithoutFeedback>
      <TouchableOpacity
        onPress={async () => setDeviceId(await GetOrGenerateDeviceId(true))}
      >
        <View style={styles.deviceIdRegenerate}>
          <Text style={styles.deviceIdRegenerateText}>get a new device id</Text>
        </View>
      </TouchableOpacity>
      <Text style={{ ...styles.text, marginTop: 20 }}>
        <Text style={{ fontWeight: "bold" }}>this is your device id</Text>.
        input this into the sender's "target device" field to initiate the file
        transfer. you will be prompted before a download to your device begins.
      </Text>
      <TouchableOpacity style={{ marginTop: 20 }}>
        <Text
          style={{
            ...styles.text,
            textDecorationColor: colors.secondary,
            textDecorationLine: "underline",
          }}
        >
          need help?
        </Text>
      </TouchableOpacity>
    </View>
  );
};
const makeId = (length) => {
  var result = "";
  var characters = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const GetOrGenerateDeviceId = async (force = false) => {
  const storedId = await Storage.get("deviceId");
  // see if storedId is null
  if (storedId !== null && !force) {
    return storedId;
  }
  const deviceId = makeId(6);
  await Storage.set("deviceId", deviceId);
  console.log(deviceId);
  return deviceId;
};

export default DeviceId;
export { GetOrGenerateDeviceId };
