import AsyncStorage from "@react-native-async-storage/async-storage";

export const Storage = {
  set: async (key, value) => {
    try {
      await AsyncStorage.setItem(`@${key}`, value);
    } catch (e) {
      console.error(e);
    }
  },
  get: async (key) => {
    try {
      const value = await AsyncStorage.getItem(`@${key}`);
      if (value !== null) {
        // value previously stored
      }
      // console.log(value)
      return value;
    } catch (e) {
      console.error(e);
    }
  },
};
