import { auth } from "./firebase.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

// إنشاء حساب
const registerBtn = document.getElementById("registerBtn");

if (registerBtn) {

    registerBtn.addEventListener("click", async () => {

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {

            await createUserWithEmailAndPassword(auth, email, password);

            alert("تم إنشاء الحساب بنجاح");

            window.location.href = "login.html";

        } catch (error) {

            alert(error.message);

        }

    });

}

// تسجيل الدخول
const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {

    loginBtn.addEventListener("click", async () => {

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {

            await signInWithEmailAndPassword(auth, email, password);

            alert("تم تسجيل الدخول");

            window.location.href = "index.html";

        } catch (error) {

            alert(error.message);

        }

    });

}