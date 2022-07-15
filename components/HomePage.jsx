import {
  View,
  Text,
  TouchableOpacity,
  LogBox,
  ActionSheetIOS,
  Animated,
  TouchableWithoutFeedback,
  Alert,
  Platform,
} from "react-native";
import styles from "./styles";
import LottieView from "lottie-react-native";

import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as DocumentPicker from "expo-document-picker";
import { useEffect, useRef, useState } from "react";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import { Modals } from "./Modals";
import RecievingHandler from "./RecievingHandler";

const endpoint = "spaceship.jackcrane.rocks";
// const endpoint = "beige-jobs-admire-104-28-202-120.loca.lt";

const HomePage = (props) => {
  const [running, setRunning] = useState(false);
  const [spaceshipPressed, setSpaceshipPressed] = useState(false);
  const speed = useRef(new Animated.Value(0)).current;

  const animation = useRef(null);
  useEffect(() => {
    if (running || spaceshipPressed) {
      Animated.timing(speed, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(speed, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
    // running ? animation.current?.play() : animation.current?.pause();
  }, [running, spaceshipPressed]);

  const toggleRunning = () => {
    setRunning(!running);
  };

  const uploadFile = async (closeCallback) => {
    const d = await DocumentPicker.getDocumentAsync();
    closeCallback();
    if (d.type === "success") {
      setRunning(true);
      console.log(d);
      console.log("Uploading");
      const f = await FileSystem.uploadAsync(
        `http://${endpoint}/v3/upload`,
        d.uri,
        {
          mimeType: d.mimeType,
          fieldName: d.name,
          headers: {
            mimeType: d.mimeType,
            fieldName: d.name,
            target,
          },
        }
      );
      console.log(f.status);
      if (f.status === 200) {
        console.log("done");
        setRunning(false);
        Toast.show({
          text1: "uploaded",
          type: "success",
          duration: 3000,
          position: "bottom",
        });
      } else {
        let d = JSON.parse(f.body);
        console.log("error", d);
        setRunning(false);
        Toast.show({
          text1: "something went wrong",
          text2: d.message,
          type: "error",
          duration: 3000,
          position: "bottom",
        });
      }
    }
  };
  const uploadImage = async (closeCallback) => {
    let permissionsResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionsResult.granted === false) {
      console.log("Permission Denied");
      alert("Permission Denied");
      return;
    }
    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    closeCallback();
    if (pickerResult.cancelled !== true) {
      setRunning(true);
      setTimeout(() => {
        setRunning(false);
        Toast.show({
          text1: "connection timed out",
          text2: "is the recipient connected?",
          type: "error",
          duration: 3000,
        });
      }, 1000 * 30);
      console.log("Uploading");
      console.log(pickerResult);
      const f = await FileSystem.uploadAsync(
        `http://${endpoint}/v3/upload`,
        pickerResult.uri,
        {
          fieldName: pickerResult.uri.substring(
            pickerResult.uri.lastIndexOf("/") + 1,
            pickerResult.uri.length
          ),
          headers: {
            fieldName: pickerResult.uri.substring(
              pickerResult.uri.lastIndexOf("/") + 1,
              pickerResult.uri.length
            ),
            target,
          },
        }
      );
      console.log(f.status);
      if (f.status === 200) {
        console.log("done");
        setRunning(false);
        Toast.show({
          text1: "uploaded",
          type: "success",
          duration: 3000,
          position: "bottom",
        });
      } else {
        let d = JSON.parse(f.body);
        console.log("error", d);
        setRunning(false);
        Toast.show({
          text1: "something went wrong",
          text2: d.message,
          type: "error",
          duration: 3000,
          position: "bottom",
        });
      }
    }
  };

  const [uploadTypesModalShown, setUploadTypesModalShown] = useState(false);
  const [recieveModalShown, setRecieveModalShown] = useState(false);
  const getFile = async () => {
    setUploadTypesModalShown(true);
  };
  const recieveFile = async () => {
    setRecieveModalShown(true);
  };

  const [target, setTarget] = useState("");

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <RecievingHandler target={target} />
        {/* <Airplane style={styles.icon} width={150} height={150} /> */}
        <TouchableWithoutFeedback
          onPressIn={() => {
            setSpaceshipPressed(true);
          }}
          onPressOut={() => {
            setSpaceshipPressed(false);
          }}
        >
          <LottieView
            ref={animation}
            style={{
              width: 400,
              height: 400,
            }}
            speed={speed}
            // Find more Lottie files at https://lottiefiles.com/featured
            source={require("../assets/rocket.json")}
          />
        </TouchableWithoutFeedback>
        <Text style={styles.caption}>
          {!running ? (
            <Text>pick out a file to spaceship</Text>
          ) : (
            <Text>uploading...</Text>
          )}
        </Text>
        <TouchableOpacity onPress={() => getFile()}>
          <View style={styles.button}>
            <Text style={{ ...styles.buttonText, fontSize: 40 }}>
              send a file
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => recieveFile()}>
          <View style={{ ...styles.button, ...styles.buttonLight }}>
            <Text
              style={{
                ...styles.buttonText,
                ...styles.buttonTextLight,
                fontSize: 40,
              }}
            >
              recieve a file
            </Text>
          </View>
        </TouchableOpacity>
        <Modals
          uploadTypesModalShown={uploadTypesModalShown}
          setUploadTypesModalShown={setUploadTypesModalShown}
          uploadFromFiles={uploadFile}
          uploadFromImages={uploadImage}
          recieveModalShown={recieveModalShown}
          setRecieveModalShown={setRecieveModalShown}
          setTarget={(t) => {
            setTarget(t);
          }}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default HomePage;
