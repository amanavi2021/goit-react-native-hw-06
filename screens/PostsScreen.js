import React, { useState, useEffect } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { useDispatch } from "react-redux";
import { logOutDB } from "../redux/auth/operations";
import MapScreen from "./nestedScreens/MapScreen";
import CommentsScreen from "./nestedScreens/CommentsScreen";
import DefaultScreen from "./nestedScreens/DefaultScreen";
import Home from "./Home";
import { NavigationContainer } from "@react-navigation/native";

const NestedScreen = createStackNavigator();

export default function PostsScreen({ route }) {
  return (
    <NestedScreen.Navigator>
      <NestedScreen.Screen
        name="Posts"
        // component={DefaultScreen}
        component={Home}
        options={{
          headerShown: false,
        }}
      />
      <NestedScreen.Screen
        name="Comments"
        component={CommentsScreen}
        options={{
          title: "Коментарі",
          headerTintColor: "#212121",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 17,
          },
        }}
      />
      <NestedScreen.Screen
        name="Map"
        component={MapScreen}
        options={{
          title: "Мапа",
          headerTintColor: "#212121",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 17,
          },
        }}
      />
    </NestedScreen.Navigator>
  );
}

const styles = StyleSheet.create({
  logOutSvg: {
    position: "absolute",
    right: 16,
    top: -16,
  },
});
