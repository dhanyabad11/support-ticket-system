import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBKsDqCtoHsRDnDgf5aAV_65avzHwYulNA",
    authDomain: "support-ticket-system-61f1f.firebaseapp.com",
    projectId: "support-ticket-system-61f1f",
    storageBucket: "support-ticket-system-61f1f.appspot.com",
    messagingSenderId: "648716646201",
    appId: "1:648716646201:web:5bee0aa855866622941ae8",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
