import { db, auth } from "./firebase.js";
import { glucoseStatus } from "./utils.js";

import {
    collection,
    getDocs,
    query,
    where,
    orderBy,
    limit
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

const statusCard = document.getElementById("statusCard");
const statusTitle = document.getElementById("statusTitle");
const statusMessage = document.getElementById("statusMessage");

const lastReading = document.getElementById("lastReading");
const averageReading = document.getElementById("averageReading");
const readingCount = document.getElementById("readingCount");

async function loadDashboard(user) {

    // عدد القراءات والمتوسط
    const readingsQuery = query(
        collection(db, "readings"),
        where("userId", "==", user.uid)
    );

    const snapshot = await getDocs(readingsQuery);

    let total = 0;
    let count = 0;

    snapshot.forEach((doc) => {
        total += Number(doc.data().glucose);
        count++;
    });

    readingCount.textContent = count;

    if (count > 0) {
        averageReading.textContent = (total / count).toFixed(1);
    } else {
        averageReading.textContent = "--";
    }

    // آخر قراءة
    const lastQuery = query(
        collection(db, "readings"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc"),
        limit(1)
    );

    const lastSnapshot = await getDocs(lastQuery);

    if (!lastSnapshot.empty) {

        const data = lastSnapshot.docs[0].data();

        const status = glucoseStatus(data.glucose);

        // بطاقة آخر قراءة
        lastReading.innerHTML = `
            <div style="font-size:38px;color:${status.color};font-weight:bold;">
                ${data.glucose}
            </div>

            <div style="margin-top:10px;color:${status.color};font-size:18px;">
                ${status.text}
            </div>
        `;

        // بطاقة الحالة
        if (data.glucose < 70) {

            statusCard.style.background = "#ef4444";

            statusTitle.textContent = "🔴 مستوى السكر منخفض";

            statusMessage.textContent =
                "يفضل تناول مصدر سريع للسكر ثم إعادة القياس إذا لزم الأمر.";

        } else if (data.glucose <= 180) {

            statusCard.style.background = "#22c55e";

            statusTitle.textContent = "🟢 مستوى السكر طبيعي";

            statusMessage.textContent =
                "استمر على نفس الخطة وواصل المتابعة.";

        } else {

            statusCard.style.background = "#f59e0b";

            statusTitle.textContent = "🟠 مستوى السكر مرتفع";

            statusMessage.textContent =
                "راجع نظامك الغذائي واتبع تعليمات طبيبك.";

        }

    } else {

        lastReading.textContent = "--";

        statusCard.style.background = "#6b7280";

        statusTitle.textContent = "لا توجد قراءات";

        statusMessage.textContent =
            "ابدأ بإضافة أول قراءة للسكر.";

    }

}

onAuthStateChanged(auth, (user) => {

    if (user) {

        loadDashboard(user);

    } else {

        window.location.href = "login.html";

    }

});