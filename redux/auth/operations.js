import { authMethods } from "../../firebase/config";
import { authSlice } from "./authSlice";

const { updateUserProfile, authStateChange, authSignOut } = authSlice.actions;
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  signOut,
} from "firebase/auth";
import { auth } from "../../firebase/config";

export const registerDB =
  ({ login, email, password, photoURL }) =>
  async (dispatch, getState) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);

      const user = await auth.currentUser;

      await authMethods.updateProfile(user, {
        displayName: login,
        photoURL: photoURL,
      });

      console.log("photo reg", photoURL);

      const { uid, displayName } = await auth.currentUser;
      // console.log("auth", auth.currentUser);

      await dispatch(
        updateUserProfile({
          userId: uid,
          login: displayName,
          photo: photoURL,
        })
      );
    } catch (error) {
      throw error.message;
    }
  };

export const loginDB =
  ({ email, password }) =>
  async (dispatch, getState) => {
    try {
      const credentials = await authMethods.signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { uid, displayName } = credentials.user;
      console.log("credentials", credentials.user);
      await dispatch(
        updateUserProfile({
          userId: uid,
          login: displayName,
        })
      );

      return credentials.user;
    } catch (error) {
      throw error;
    }
  };

export const logOutDB = () => async (dispatch, getState) => {
  dispatch(authSignOut());
};

export const authStateChanged = () => async (dispatch, getState) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      dispatch(
        updateUserProfile({
          userId: user.uid,
          login: user.displayName,
        })
      );
      dispatch(authStateChange({ stateChanged: true }));
    }
  });
};
