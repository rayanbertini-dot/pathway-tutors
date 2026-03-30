import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAUZnCBKoGb7TN5eD3Q3L2b63od981tqJI",
  authDomain: "pathway-tutors.firebaseapp.com",
  projectId: "pathway-tutors",
  storageBucket: "pathway-tutors.firebasestorage.app",
  messagingSenderId: "288419201836",
  appId: "1:288419201836:web:0e559e68e922b58f1ea289"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
