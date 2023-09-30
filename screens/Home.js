import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { logOutDB } from "../redux/auth/operations";
// import PostsScreen from "./PostsScreen";
import CreatePostsScreen from "./CreatePostsScreen";
import ProfileScreen from "./ProfileScreen";
import DefaultScreen from "./nestedScreens/DefaultScreen";
import GridSvg from "../assets/images/grid.svg";
import UserSvg from "../assets/images/user.svg";
import UnionSvg from "../assets/images/union.svg";
import ArrowSvg from "../assets/images/arrow-left.svg";
import LogOutSvg from "../assets/images/log-out.svg";

const Tabs = createBottomTabNavigator();

export default function Home() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const logOut = () => {
    dispatch(logOutDB());
  };

  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Default") {
            iconName = "";
            return <GridSvg />;
          }
          if (route.name === "CreatePosts") {
            iconName = "";
            return (
              <View style={styles.unionSvgWrapper}>
                <UnionSvg />
              </View>
            );
          }
          if (route.name === "Profile") {
            iconName = "";
            return <UserSvg />;
          }
        },
        tabBarLabelStyle: {
          display: "none",
        },
      })}
    >
      <Tabs.Screen
        name="Default"
        // component={PostsScreen}
        component={DefaultScreen}
        options={{
          title: "Публікації",
          headerTintColor: "#212121",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 17,
          },

          headerRight: () => (
            <TouchableOpacity
              style={{ position: "relative" }}
              activeOpacity={0.8}
              onPress={logOut}
            >
              <LogOutSvg style={styles.logOutSvg} width={25} height={25} />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="CreatePosts"
        component={CreatePostsScreen}
        options={{
          title: "Створити публікацію",
          headerTintColor: "#212121",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 17,
          },
          headerRight: () => (
            <TouchableOpacity
              style={{ position: "relative" }}
              activeOpacity={0.8}
              onPress={() => navigation.goBack()}
            >
              <ArrowSvg style={styles.arrowSvg} width={25} height={25} />
            </TouchableOpacity>
          ),
          // tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
        }}
      />
    </Tabs.Navigator>
  );
}

const styles = StyleSheet.create({
  unionSvgWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 9,
    marginBottom: 9,
    borderRadius: 20,
    backgroundColor: "#FF6C00",
    width: 70,
    height: 40,
  },
  logOutSvg: {
    position: "absolute",
    right: 16,
    top: -16,
  },
  arrowSvg: {
    position: "absolute",
    left: -370,
    top: -12,
  },
});
