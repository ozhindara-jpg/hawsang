import { db, auth } from "./firebase.js";

import {
    collection,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

const email = document.getElementById("email");
const count = document.getElementById("count");
const logoutBtn = document.getElementById("logoutBtn");

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "login.html";
        return;

    }

    email.textContent = user.email;

    const q = query(
        collection(db, "readings"),
        where("userId", "==", user.uid)
    );

    const snapshot = await getDocs(q);

    count.textContent = snapshot.size;

});

logoutBtn.addEventListener("click", async () => {

    const answer = confirm("هل تريد تسجيل الخروج؟");

    if (!answer) return;

    await signOut(auth);

    window.location.href = "login.html";

});