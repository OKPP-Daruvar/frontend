import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAwFMV6GidqDnezpdESWY6Aq187zX00HhQ",
  authDomain: "forms-okpp.firebaseapp.com",
  projectId: "forms-okpp",
  storageBucket: "forms-okpp.firebasestorage.app",
  messagingSenderId: "768414984805",
  appId: "1:768414984805:web:82c7f2c71e960b5759b48c",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
