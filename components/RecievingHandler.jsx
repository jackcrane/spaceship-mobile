import LottieView from "lottie-react-native";
import { useRef, useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles, { colors } from "./styles";
import useWebSocket from "react-use-websocket";
import Toast from "react-native-toast-message";
import { GetOrGenerateDeviceId } from "./DeviceId";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";

import ModalBase from "./Modal";

const truncate = (input) =>
  input.length > 23 ? `${input.substring(0, 20)}…` : input;

const RecievingHandler = (props) => {
  const animation = useRef(null);
  useEffect(() => {
    animation?.current?.play();
  }, [connectionState]);
  const [connectionState, setConnectionState] = useState("connecting");
  const switchStateForSpecs = (state) => {
    switch (state) {
      case "connecting":
        return {
          animation: require("../assets/beacon-yellow.json"),
          color: colors.yellow,
          text: "establishing connection",
        };
      case "connected":
        return {
          animation: require("../assets/beacon-green.json"),
          color: colors.green,
          text: "connected, ready to recieve",
        };
      case "disconnected":
        return {
          animation: require("../assets/beacon-red.json"),
          color: colors.red,
          text: "disconnected but retrying",
        };
      default:
        return "connecting";
    }
  };

  // let socketUrl = "ws://beige-jobs-admire-104-28-202-120.loca.lt/v3/subscribe";
  // let basicUrl = "http://beige-jobs-admire-104-28-202-120.loca.lt";
  let socketUrl = "wss://spaceship.jackcrane.rocks/v3/subscribe";
  let basicUrl = "https://spaceship.jackcrane.rocks";

  const conn = useWebSocket(socketUrl, {
    onOpen: async () => {
      setConnectionState("connected");
      console.log("Connected");
      let id = await GetOrGenerateDeviceId();
      conn.sendMessage(
        JSON.stringify({ type: "Spaceship.RegisterDeviceId", deviceId: id })
      );
      setInterval(async () => {
        let newId = await GetOrGenerateDeviceId();
        if (newId !== id) {
          console.log("New ID generated!");
          id = newId;
          conn.sendMessage(
            JSON.stringify({
              type: "Spaceship.UnregisterDeviceId",
              deviceId: id,
            })
          );
          conn.sendMessage(
            JSON.stringify({
              type: "Spaceship.RegisterDeviceId",
              deviceId: newId,
            })
          );
        }
      }, 250);
    },
    onClose: () => {
      setConnectionState("disconnected");
    },
    onMessage: (message) => {
      console.log("MESSAGE", message);
      const data = JSON.parse(message.data);
      console.log(data);
      console.log("Message received");
      if (data.message === "Spaceship.NewDownloadAvailible") {
        setDownloadNotifModalOpen(true);
        setDownloadNotifModalData(data);
      } else if (data.message === "Spaceship.FileDownloadUri") {
        // alert(JSON.stringify(data));
        downloadFromUri(data.fileUri);
        console.log("File Download Uri");
      }
    },
    shouldReconnect: (closeEvent) => true,
    onError: (error) => {
      console.log(error);
      setConnectionState("disconnected");
    },
  });

  let gUri;
  const [globalUri, setGlobalUri] = useState(null);
  const downloadFromUri = (uri) => {
    setStage("downloading");
    console.log("Downloading from uri");
    let endpoint = basicUrl + "/" + uri;
    console.log(endpoint);
    FileSystem.downloadAsync(endpoint, FileSystem.documentDirectory + uri).then(
      () => {
        gUri = uri;
        console.log(gUri);
        setGlobalUri(gUri);
        setStage("where");
      }
    );
  };

  const [downloadNotifModalOpen, setDownloadNotifModalOpen] = useState(false);
  const [downloadNotifModalData, setDownloadNotifModalData] = useState({});

  const [stage, setStage] = useState("prompt");

  const cameraRoll = async () => {
    console.log({ globalUri });
    await MediaLibrary.saveToLibraryAsync(
      FileSystem.documentDirectory + globalUri
    );
    setStage("done");
  };
  const share = async () => {
    console.log({ globalUri });
    await Sharing.shareAsync(FileSystem.documentDirectory + globalUri);
    setStage("done");
  };

  return (
    <>
      <View
        style={{
          ...styles.recievingHandlerBeaconContainer,
          borderColor: switchStateForSpecs(connectionState).color,
        }}
      >
        <LottieView
          source={switchStateForSpecs(connectionState).animation}
          style={{
            width: 24,
            height: 24,
          }}
          speed={1}
          autoPlay={true}
          ref={animation}
        />
        <Text>{switchStateForSpecs(connectionState).text}</Text>
      </View>
      <ModalBase
        open={downloadNotifModalOpen}
        onClose={() => {
          setDownloadNotifModalOpen(false);
        }}
      >
        {stage === "prompt" ? (
          <>
            <View style={styles.recievingHandlerModalContainer}>
              <LottieView
                source={require("../assets/planet.json")}
                style={{
                  width: 100,
                  height: 100,
                  marginVertical: -10,
                  marginBottom: -40,
                }}
                speed={1}
                autoPlay={true}
              />
            </View>
            <Text style={styles.recievingHandlerModalTitle}>
              someone is trying to send you a file
            </Text>
            {downloadNotifModalData.fileName && (
              <View style={styles.recievingHandlerModalTable}>
                <View style={styles.recievingHandlerModalTableRow}>
                  <Text style={styles.smallText}>file name:</Text>
                  <Text style={styles.smallText}>
                    {truncate(downloadNotifModalData.fileName)}
                  </Text>
                </View>
                <View style={styles.recievingHandlerModalTableRow}>
                  <Text style={styles.smallText}>file size:</Text>
                  <Text style={styles.smallText}>
                    {downloadNotifModalData.fileSize}
                  </Text>
                </View>
                <View style={styles.recievingHandlerModalTableRow}>
                  <Text style={styles.smallText}>extension:</Text>
                  <Text style={styles.smallText}>
                    {(() => {
                      let strs =
                        downloadNotifModalData.fileName.split(/[\s.]+/);
                      return strs[strs.length - 1];
                    })()}
                  </Text>
                </View>
              </View>
            )}
            <View style={styles.row}>
              <TouchableOpacity
                onPress={() => {
                  conn.sendMessage(
                    JSON.stringify({
                      type: "Spaceship.RecipientUserRejected",
                    })
                  );
                  setDownloadNotifModalOpen(false);
                }}
              >
                <View
                  style={{
                    ...styles.button,
                    minWidth: "45%",
                    backgroundColor: colors.red,
                  }}
                >
                  <Text style={styles.buttonText}>reject</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  conn.sendMessage(
                    JSON.stringify({
                      type: "Spaceship.RecipientUserAccepted",
                    })
                  );
                }}
              >
                <View
                  style={{
                    ...styles.button,
                    minWidth: "45%",
                    backgroundColor: colors.green,
                  }}
                >
                  <Text style={styles.buttonText}>accept</Text>
                </View>
              </TouchableOpacity>
            </View>
          </>
        ) : stage === "downloading" ? (
          <>
            <View style={styles.recievingHandlerModalContainer}>
              <LottieView
                source={require("../assets/downloading.json")}
                style={{
                  width: 100,
                  height: 100,
                }}
                speed={1}
                autoPlay={true}
              />
              <Text style={styles.recievingHandlerModalTitle}>
                downloading...
              </Text>
            </View>
          </>
        ) : stage === "where" ? (
          <>
            <View style={styles.recievingHandlerModalContainer}>
              <LottieView
                source={require("../assets/save.json")}
                style={{
                  width: 100,
                  height: 100,
                }}
                speed={1}
                autoPlay={true}
              />
              <Text style={{ ...styles.text, textAlign: "center" }}>
                where do you want to download the file
              </Text>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    cameraRoll();
                  }}
                >
                  <View
                    style={{
                      ...styles.button,
                      minWidth: "45%",
                    }}
                  >
                    <Text style={styles.buttonText}>camera roll</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    share();
                  }}
                >
                  <View
                    style={{
                      ...styles.button,
                      minWidth: "45%",
                    }}
                  >
                    <Text style={styles.buttonText}>somewhere else</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : stage === "done" ? (
          <View style={{ alignItems: "center" }}>
            <LottieView
              source={require("../assets/success.json")}
              style={{
                width: 200,
                height: 200,
              }}
              speed={1}
              autoPlay={true}
            />
            <Text style={styles.recievingHandlerModalTitle}>
              file downloaded successfully
            </Text>
          </View>
        ) : (
          <></>
        )}
      </ModalBase>
    </>
  );
};

export default RecievingHandler;
