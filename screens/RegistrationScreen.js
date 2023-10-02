import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
// import { selectUser } from "../redux/auth/selectors";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { registerDB } from "../redux/auth/operations";
import { onAuthStateChanged } from "firebase/auth";
import { storage, db } from "../firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import AddSvg from "../assets/images/add.svg";
import DeleteSvg from "../assets/images/delete.svg";

const initialState = {
  login: "",
  email: "",
  password: "",
  photo: null,
};

export default function RegistrationScreen() {
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [showPassword, setIsShowPassword] = useState(false);
  const [state, setState] = useState(initialState);
  const [hasFocusLogin, setHasFocusLogin] = useState(false);
  const [hasFocusEmail, setHasFocusEmail] = useState(false);
  const [hasFocusPassword, setHasFocusPassword] = useState(false);
  // const [user, setUser] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [photoURL, setPhotoURL] = useState(null);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    keyboardHide();
    await uploadPhotoToServer();
    console.log(photoURL);
    console.log({ ...state, photoURL });

    dispatch(registerDB({ ...state, photoURL }));

    // const authStateChanged = async (onChange = () => {}) => {
    //   onAuthStateChanged(async (user) => {
    //     onChange(user);
    //   });
    // };

    setState(initialState);
  };

  const keyboardHide = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
  };

  const handleFocusLogin = () => {
    setIsShowKeyboard(true);
    setHasFocusLogin(true);
  };

  const handleFocusEmail = () => {
    setIsShowKeyboard(true);
    setHasFocusEmail(true);
  };

  const handleFocusPassword = () => {
    setIsShowKeyboard(true);
    setHasFocusPassword(true);
  };

  const toggleShowPassword = () => {
    setIsShowPassword(!showPassword);
    console.log("you here");
  };

  const pickImageAsync = async () => {
    if (photo) {
      setPhoto(null);
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowEditing: true,
        quality: 1,
      });
      const currentPhoto = result.assets[0].uri;
      // console.log(result.assets[0].uri);
      setPhoto(currentPhoto);
    }
  };

  const uploadPhotoToServer = async () => {
    const response = await fetch(photo);
    const file = await response.blob();
    const uniqueUserID = Date.now().toString();
    const storageRef = ref(storage, `userImages/${uniqueUserID}`);

    await uploadBytes(storageRef, file).then((snapshot) => {});
    await getDownloadURL(ref(storage, `userImages/${uniqueUserID}`))
      .then((url) => {
        console.log("url", url);
        setPhotoURL(url);
      })
      .catch((error) => {
        console.log("err", error);
      });
  };

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <View style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : "height"}
        >
          <View style={styles.wrapper}>
            <View style={styles.avatarWrapper}>
              <Image source={{ uri: photo }} style={styles.avatar} />
              <TouchableOpacity activeOpacity={0.8} onPress={pickImageAsync}>
                {photo ? (
                  <DeleteSvg style={styles.addIcon} />
                ) : (
                  <AddSvg style={styles.addIcon} />
                )}
              </TouchableOpacity>
            </View>
            <View
              style={{
                ...styles.form,
                marginBottom: isShowKeyboard ? 20 : 79,
              }}
            >
              <View style={styles.header}>
                <Text style={styles.headerTitle}>Реєстрація</Text>
              </View>
              <View>
                <TextInput
                  style={{
                    ...styles.input,
                    borderColor: hasFocusLogin ? "#FF6C00" : "#E8E8E8",
                  }}
                  placeholder="Логін"
                  placeholderTextColor={"#BDBDBD"}
                  value={state.login}
                  onFocus={() => handleFocusLogin()}
                  onBlur={() => setHasFocusLogin(false)}
                  onChangeText={(value) =>
                    setState((prevState) => ({ ...prevState, login: value }))
                  }
                />
              </View>
              <View style={{ marginTop: 16 }}>
                <TextInput
                  style={{
                    ...styles.input,
                    borderColor: hasFocusEmail ? "#FF6C00" : "#E8E8E8",
                  }}
                  placeholder="Адреса електронної пошти"
                  placeholderTextColor={"#BDBDBD"}
                  value={state.email}
                  onFocus={() => handleFocusEmail()}
                  onBlur={() => setHasFocusEmail(false)}
                  onChangeText={(value) =>
                    setState((prevState) => ({ ...prevState, email: value }))
                  }
                />
              </View>
              <View
                style={{
                  marginTop: 16,
                  position: "relative",
                }}
              >
                <TextInput
                  style={{
                    ...styles.input,
                    borderColor: hasFocusPassword ? "#FF6C00" : "#E8E8E8",
                  }}
                  placeholder="Пароль"
                  placeholderTextColor={"#BDBDBD"}
                  value={state.password}
                  onFocus={() => handleFocusPassword()}
                  onBlur={() => setHasFocusPassword(false)}
                  onChangeText={(value) =>
                    setState((prevState) => ({
                      ...prevState,
                      password: value,
                    }))
                  }
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={toggleShowPassword}
                >
                  <Text style={styles.btnShowPasswordTitle}>Показати</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.btn}
                activeOpacity={0.8}
                onPress={handleSubmit}
              >
                <Text style={styles.btnTitle}>Зареєстуватися</Text>
              </TouchableOpacity>
              <View style={styles.linkWrapper}>
                <Text style={styles.link}>Вже є акаунт?</Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate("Login")}
                >
                  <Text style={styles.link}>Увійти</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
        <ImageBackground
          style={styles.image}
          source={require("../assets/images/BG.jpg")}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "flex-end",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  wrapper: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  form: {
    marginHorizontal: 16,
  },
  inputTitle: {
    color: "#f0f8ff",
    marginBottom: 10,
    fontSize: 18,
  },
  input: {
    borderWidth: 1,

    backgroundColor: "#F6F6F6",
    height: 51,
    padding: 16,
    borderRadius: 8,
    color: "#212121",
    fontFamily: "Roboto-Regular",
    fontSize: 16,
  },
  btn: {
    height: 51,
    borderRadius: 100,
    marginTop: 43,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF6C00",
    borderColor: "transparent",
  },
  btnTitle: {
    marginHorizontal: 20,
    fontSize: 16,
    fontFamily: "Roboto-Regular",
    color: "#fff",
  },
  header: {
    alignItems: "center",
    marginTop: 92,
    marginBottom: 32,
  },
  headerTitle: {
    fontFamily: "Roboto-Medium",
    fontSize: 30,
    color: "#212121",
  },
  linkWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  link: {
    fontFamily: "Roboto-Medium",
    fontSize: 16,
    color: "#1B4371",
    marginTop: 16,
  },
  btnShowPasswordTitle: {
    display: "flex",
    position: "absolute",
    bottom: 16,
    right: 16,
    fontFamily: "Roboto-Medium",
    fontSize: 16,
    color: "#1B4371",
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    position: "absolute",
    bottom: -63,
    left: 130,
    width: 120,
    height: 120,
    borderRadius: 16,
    backgroundColor: "#F6F6F6",
    marginRight: "auto",
    marginLeft: "auto",
  },

  addIcon: {
    // position: "absolute",
    // right: 132,
    // top: 20,
    marginLeft: 235,
    // marginTop: 30,
    // borderWidth: 1,
    // borderColor: "#tomato",
  },
});
