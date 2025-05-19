import { getFirestore } from 'firebase/firestore'
import app from "@/store/firestore/firebasedb";

const firestore = getFirestore(app)
export default firestore
