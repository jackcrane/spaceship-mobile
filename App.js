// In App.js in a new project

import * as React from "react";
import { Text, LogBox } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomePage from "./components/HomePage";
import Toast from "react-native-toast-message";
import { StatusBar } from "expo-status-bar";
import { toastConfig } from "./components/toastConfig";

LogBox.ignoreLogs([
  "ViewPropTypes will be removed from React Native.",
  "ViewPropTypes will be removed from React Native. Migrate to ViewPropTypes exported from 'deprecated-react-native-prop-types'",
  "Require cycles are allowed, but can result in uninitialized values. Consider refactoring to remove the need for a cycle.",
]);

const pages = {
  Home: () => <HomePage />,
};

const Stack = createNativeStackNavigator();

const ModalContext = React.createContext();

function App() {
  return (
    <>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={pages.Home}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast config={toastConfig} />
    </>
  );
}

export default App;
