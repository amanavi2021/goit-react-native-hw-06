import { auth, authMethods } from "../../firebase/config";
import { authSlice } from "./authSlice";

const { updateUserProfile, authStateChange, authSignOut } = authSlice.actions;

export const registerDB =
  ({ login, email, password }) =>
  async (dispatch, getState) => {
    try {
      // console.log("auth", auth);
      await authMethods.createUserWithEmailAndPassword(auth, email, password);
      const user = await auth.currentUser;

      console.log("current", user);

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
      // console.log("current user", {
      //   userId: uid,
      //   login: displayName,
      // });
      // console.log("user.uid", );
    } catch (error) {
      // console.log("error.message", error.message);
      throw error;
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
      console.log("credential", credentials.user);
      return credentials.user;
    } catch (error) {
      throw error;
    }
  };

export const logOutDB = () => async (dispatch, getState) => {
  // await authMethods.signOut();
  dispatch(authSignOut());
};
