import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIRESTORE_APIKEY,
    authDomain: process.env.NEXT_PUBLIC_FIRESTORE_AUTHDOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIRESTORE_PROJECTID,
    storageBucket: process.env.NEXT_PUBLIC_FIRESTORE_STORAGEBUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIRESTORE_MESSAGINGSENDERID,
    appId: process.env.NEXT_PUBLIC_FIRESTORE_APPID,
    measurementId: process.env.NEXT_PUBLIC_FIRESTORE_MEASUREMENTID
};

const app = initializeApp(firebaseConfig);

export default app