import SvgUri from "react-native-svg-uri";
import { View } from "react-native";

const AirplaneIcon = (props) => (
  <View>
    <SvgUri
      width={props.width}
      height={props.height}
      source={require("../assets/AirplaneIcon.svg")}
    />
  </View>
);

export default AirplaneIcon;
