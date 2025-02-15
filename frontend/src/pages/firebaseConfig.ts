import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA-sTOxpppPEsqtgfs1OAd_Q6BCLxWb2e8",
  authDomain: "green-ledger.firebaseapp.com",
  projectId: "green-ledger",
  storageBucket: "green-ledger.firebasestorage.app",
  messagingSenderId: "1075843157478",
  appId: "1:1075843157478:web:8687c7e79a337ea5571a27"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
