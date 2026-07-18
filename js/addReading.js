import { db, auth } from "./firebase.js";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const glucoseInput = document.getElementById("glucose");
const insulinInput = document.getElementById("insulin");
const noteInput = document.getElementById("note");
const saveBtn = document.getElementById("saveBtn");

const editId = localStorage.getItem("editId");

// إذا كان المستخدم يريد تعديل قراءة
if (editId) {
  loadReading();
}

async function loadReading() {
  try {

    const docRef = doc(db, "readings", editId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {

      const data = docSnap.data();

      glucoseInput.value = data.glucose;
      insulinInput.value = data.insulin ?? "";
      noteInput.value = data.note ?? "";

      saveBtn.textContent = "تحديث القراءة";

    }

  } catch (error) {

    console.error(error);

  }
}

saveBtn.addEventListener("click", async () => {

  const glucose = glucoseInput.value;
  const insulin = insulinInput.value;
  const note = noteInput.value;

  if (!glucose) {
    alert("يرجى إدخال نسبة السكر");
    return;
  }

  try {

    // تعديل قراءة موجودة
    if (editId) {

      await updateDoc(doc(db, "readings", editId), {

        glucose: Number(glucose),
        insulin: insulin ? Number(insulin) : null,
        note: note

      });

      localStorage.removeItem("editId");

      alert("تم تحديث القراءة بنجاح");

    }

    // إضافة قراءة جديدة
    else {

      await addDoc(collection(db, "readings"), {

        glucose: Number(glucose),
        insulin: insulin ? Number(insulin) : null,
        note: note,
        createdAt: new Date(),
        userId: auth.currentUser.uid

      });

      alert("تم حفظ القراءة بنجاح");

    }

    glucoseInput.value = "";
    insulinInput.value = "";
    noteInput.value = "";

    window.location.href = "history.html";

  } catch (error) {

    console.error(error);

    alert("حدث خطأ");

  }

});