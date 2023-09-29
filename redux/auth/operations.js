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
  ({ login, email, password }) =>
  async (dispatch, getState) => {
    try {
      // console.log("auth", auth);
      try {
        const newUser = await authMethods.createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
      } catch (error) {
        throw error.message;
      }
      // await authMethods.createUserWithEmailAndPassword(auth, email, password);
      // if (newUser) {
      const user = await auth.currentUser;

      // console.log("current", user);

      await authMethods.updateProfile(user, { displayName: login });

      const { uid, displayName } = await auth.currentUser;
      // console.log("upload", upload);

      // user.updateProfile({
      //   displayName: login,
      // });

      // const { uid, displayName } = auth.currentUser;

      await dispatch(
        updateUserProfile({
          userId: uid,
          login: displayName,
        })
      );
      // }

      // console.log("current user", {
      //   userId: uid,
      //   login: displayName,
      // });
      // console.log("user.uid", );
    } catch (error) {
      // console.log("error.message", error.message);
      throw error.message;
    }
  };

// export const authStateChanged = async (onChange = () => {}) => {
//   authMethods.onAuthStateChanged((user) => {
//     onChange(user);
//   });
// };

export const loginDB =
  ({ email, password }) =>
  async (dispatch, getState) => {
    try {
      const credentials = await authMethods.signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      // console.log("credential", credentials.user);
      const { uid, displayName } = credentials.user;
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
  // await authMethods.signOut();
  dispatch(authSignOut());
};

export const authStateChanged = () => async (dispatch, getState) => {
  // const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    // onChange(user);
    if (user) {
      // console.log("usser", user);
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
