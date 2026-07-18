import { db, auth } from "./firebase.js";
import { glucoseStatus } from "./utils.js";

import {
    collection,
    getDocs,
    deleteDoc,
    doc,
    query,
    where,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

const readingsContainer = document.getElementById("readingsContainer");
const searchInput = document.getElementById("searchInput");

const filterStatus = document.getElementById("filterStatus");

onAuthStateChanged(auth, (user) => {

    if (user) {

        loadReadings(user);

    } else {

        window.location.href = "login.html";

    }

});

async function loadReadings(user) {

    readingsContainer.innerHTML = "";

    const q = query(
        collection(db, "readings"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {

        readingsContainer.innerHTML = `
            <div class="reading-card">
                <h2>لا توجد قراءات بعد</h2>
                <p>قم بإضافة أول قراءة من الصفحة الرئيسية.</p>
            </div>
        `;

        return;
    }


    const search =
searchInput.value.toLowerCase();

const filter =
filterStatus.value;
    querySnapshot.forEach((document) => {

        const data = document.data();
        const id = document.id;

        const status = glucoseStatus(data.glucose);

        const matchesSearch =

String(data.glucose).includes(search)

||

(data.note || "")
.toLowerCase()
.includes(search);

let matchesFilter = true;

if(filter==="normal"){

    matchesFilter = status.text==="طبيعي";

}

if(filter==="high"){

    matchesFilter = status.text==="مرتفع";

}

if(filter==="low"){

    matchesFilter = status.text==="منخفض";

}

if(!matchesSearch || !matchesFilter){

    return;

}

        let date = "-";

        if (data.createdAt) {

            date = new Date(
                data.createdAt.seconds * 1000
            ).toLocaleString();

        }

        readingsContainer.innerHTML += `

        <div class="reading-card">

            <div class="reading-top">

                <div>

                    <h2 style="color:${status.color};">
                        ${data.glucose} mg/dL
                    </h2>

                    <span
                        style="
                        color:${status.color};
                        font-weight:bold;
                        ">
                        ${status.text}
                    </span>

                </div>

                <div>

                    📅 ${date}

                </div>

            </div>

            <hr>

            <p>
                💉 <strong>الأنسولين:</strong>
                ${data.insulin || "-"}
            </p>

            <p>
                📝 <strong>الملاحظات:</strong>
                ${data.note || "لا توجد ملاحظات"}
            </p>

            <div class="reading-buttons">

                <button onclick="editReading('${id}')">
                    ✏️ تعديل
                </button>

                <button onclick="deleteReading('${id}')">
                    🗑️ حذف
                </button>

            </div>

        </div>

        `;

    });

}

window.deleteReading = async function (id) {

    const answer = confirm("هل تريد حذف هذه القراءة؟");

    if (!answer) return;

    try {

        await deleteDoc(doc(db, "readings", id));

        alert("تم حذف القراءة");

        loadReadings(auth.currentUser);

    } catch (error) {

        console.error(error);

        alert("حدث خطأ أثناء الحذف");

    }

};

window.editReading = function (id) {

    localStorage.setItem("editId", id);

    window.location.href = "index.html";

};

searchInput.addEventListener("input",()=>{

    loadReadings(auth.currentUser);

});

filterStatus.addEventListener("change",()=>{

    loadReadings(auth.currentUser);

});