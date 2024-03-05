// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
// import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCpwbjUepJG9Rr6tpP5y623u50KDKNR2us",
  authDomain: "lorees-portfolio.firebaseapp.com",
  databaseURL: "https://lorees-portfolio-default-rtdb.firebaseio.com",
  projectId: "lorees-portfolio",
  messagingSenderId: "302818642647",
  appId: "1:302818642647:web:504f7ab67b9f07f5f5fe92",
  measurementId: "G-570SY899VH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
const db = getFirestore(app);

const docRef1 = doc(db, "cities", "jUiVU5u0HnJ1OgfQi1Jm");
const docSnap1 = await getDoc(docRef1);
const data = docSnap1.data();

const docRef2 = doc(db, "cities", "jBEHey0hlqleFHLo0MLw");
const docSnap2 = await getDoc(docRef2);
const pics = docSnap2.data();


console.log(data);
console.log(pics);

export {data, pics};