import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCu9-k9iQUPt22jB73vr07Fz9cNWmgWBis",
  authDomain: "glucose-tracker-9e0a0.firebaseapp.com",
  projectId: "glucose-tracker-9e0a0",
  storageBucket: "glucose-tracker-9e0a0.firebasestorage.app",
  messagingSenderId: "1006215388165",
  appId: "1:1006215388165:web:2948255cc3a011ea74506c"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

export { db, auth };
