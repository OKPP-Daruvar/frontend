import { auth } from "./firebaseConfig";
import { signOut, onAuthStateChanged } from "firebase/auth";

export const listenForAuthChanges = (setUser) => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const token = await user.getIdToken();
      localStorage.setItem("token", token);
      setUser(user);
    } else {
      localStorage.removeItem("token");
      setUser(null);
    }
  });
};

export const handleLogout = async () => {
  await signOut(auth);
  localStorage.removeItem("token");
  window.location.href = "/login";
};
