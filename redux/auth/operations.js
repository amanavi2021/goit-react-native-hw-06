import { auth, authMethods } from "../../firebase/config";
import { authSlice } from "./authSlice";
export const registerDB =
  ({ login, email, password }) =>
  async (dispatch, getState) => {
    try {
      // console.log("auth", auth);
      await authMethods.createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      console.dir("current", user);

      // user.updateProfile({
      //   displayName: login,
      // });

      // const { uid, displayName } = auth.currentUser;

      await dispatch(
        authSlice.actions.updateUserProfile({
          userId: user.uid,
          login: login,
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

// const logOutUser = () => async (dispatch, getState) => {};
