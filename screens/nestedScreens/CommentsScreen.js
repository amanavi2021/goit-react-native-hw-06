import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { db } from "../../firebase/config";
import { collection, addDoc, getDoc, getDocs, doc } from "firebase/firestore";
import { selectUser } from "../../redux/auth/selectors";
import SendSvg from "../../assets/images/send.svg";

export default function CommentsScreen({ route }) {
  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState([]);
  const postId = route.params.postId;
  const photo = route.params.photo;
  const { login } = useSelector(selectUser);

  useEffect(() => {
    getAllComments();
  }, []);

  const getAllComments = async () => {
    const docRef = doc(db, "posts", postId);
    try {
      const snapshot = await getDocs(
        collection(db, `posts/${docRef.id}/comments`)
      );
      snapshot.forEach((doc) => {
        setAllComments((comments) => [
          ...comments,
          { ...doc.data(), id: doc.id },
        ]);
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const createComment = async () => {
    const docRef = doc(db, "posts", postId);
    const docSnap = await getDoc(docRef);
    const newComment = { comment, login };

    if (docSnap.exists()) {
      const commentRef = addDoc(
        collection(db, `posts/${docRef.id}/comments`),
        newComment
      );
    } else {
      console.log("No such document!");
    }

    setAllComments((prevComments) => [...prevComments, newComment]);
    setComment("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.takePhotoContainer}>
        <Image source={{ uri: photo }} style={styles.image} />
      </View>
      <FlatList
        data={allComments}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.commentWrapper}>
            <Text>{item.login}</Text>
            <View style={styles.textWrapper}>
              <Text style={styles.photoTitle}>{item.comment}</Text>
            </View>
          </View>
        )}
      />
      <View style={styles.inputWrapper}>
        <TextInput
          style={{
            ...styles.input,
            borderColor: "#E8E8E8",
          }}
          placeholder="Коментувати..."
          placeholderTextColor={"#BDBDBD"}
          value={comment}
          // onFocus={() => handleFocusEmail()}
          // onBlur={() => setHasFocusEmail(false)}
          onChangeText={setComment}
        />
        <TouchableOpacity activeOpacity={0.8} onPress={createComment}>
          <SendSvg style={styles.btnIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "flex-end",
    paddingLeft: 16,
    paddingRight: 16,
  },
  image: {
    height: 240,
    borderRadius: 8,
  },
  input: {
    height: 51,
    borderRadius: 100,
    marginTop: 43,
    paddingLeft: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F6F6F6",
    borderWidth: 1,
    borderColor: "#E8E8E8",
    fontSize: 16,
    fontFamily: "Roboto-Regular",
  },
  btnIcon: {
    position: "absolute",
    bottom: 8,
    right: 16,
  },
  inputWrapper: {
    position: "relative",
    marginTop: 32,
    marginBottom: 16,
  },
  commentWrapper: {
    display: "flex",
    flexDirection: "row",
    marginTop: 24,
    gap: 16,
  },
  textWrapper: {
    backgroundColor: "#F6F6F6",
    padding: 16,
  },
});
