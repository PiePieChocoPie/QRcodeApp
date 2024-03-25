import { StyleSheet, Text, View } from 'react-native';
import {createContext, useEffect, useState} from "react";
import {NavigationContainer} from "@react-navigation/native";
import AppNavigator from './AppNavigator';

export default function App() {

  useEffect(() => {

  }, []);

  return (
    <NavigationContainer>
      <View style={styles.container}>
        <AppNavigator/>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});