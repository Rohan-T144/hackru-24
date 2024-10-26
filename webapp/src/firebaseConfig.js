import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDzfaK4J73AhvEzBs2ZaUAien6jLVqtoxM",
  authDomain: "hackru-24-28749.firebaseapp.com",
  projectId: "hackru-24-28749",
  storageBucket: "hackru-24-28749.appspot.com",
  messagingSenderId: "178565103196",
  appId: "1:178565103196:web:0f99e989b67e65aebcf099"
};

// Initialize Firebase and Auth
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
