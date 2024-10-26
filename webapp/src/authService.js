import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebaseConfig";

// Sign up with email and password
export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error during signup:", error.message);
    throw error;
  }
};

// Log in with email and password
export const logIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error during login:", error.message);
    throw error;
  }
};

// Log out
export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error during logout:", error.message);
  }
};
