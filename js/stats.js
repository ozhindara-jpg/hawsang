import { db, auth } from "./firebase.js";

import {
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

const average = document.getElementById("average");
const highest = document.getElementById("highest");
const lowest = document.getElementById("lowest");
const count = document.getElementById("count");

const normalCount = document.getElementById("normalCount");
const highCount = document.getElementById("highCount");
const lowCount = document.getElementById("lowCount");

async function loadStats(user) {

    const q = query(
        collection(db, "readings"),
        where("userId", "==", user.uid)
    );

    const querySnapshot = await getDocs(q);

    let total = 0;
    let totalReadings = 0;

    let max = 0;
    let min = Infinity;

    let normal = 0;
    let high = 0;
    let low = 0;

    const dailyReadings = {};

    querySnapshot.forEach((doc) => {

        const data = doc.data();

        total += data.glucose;
        totalReadings++;

        if (data.glucose > max)
            max = data.glucose;

        if (data.glucose < min)
            min = data.glucose;

        if (data.glucose < 70) {

            low++;

        } else if (data.glucose <= 180) {

            normal++;

        } else {

            high++;

        }

        if (data.createdAt) {

            const date = new Date(data.createdAt.seconds * 1000);

            const day =
                date.getFullYear() + "-" +
                (date.getMonth() + 1) + "-" +
                date.getDate();

            if (!dailyReadings[day]) {

                dailyReadings[day] = [];

            }

            dailyReadings[day].push(data.glucose);

        }

    });

    if (totalReadings === 0) {

        average.textContent = 0;
        highest.textContent = 0;
        lowest.textContent = 0;
        count.textContent = 0;

        normalCount.textContent = 0;
        highCount.textContent = 0;
        lowCount.textContent = 0;

        return;
    }

    average.textContent = (total / totalReadings).toFixed(1);
    highest.textContent = max;
    lowest.textContent = min;
    count.textContent = totalReadings;

    normalCount.textContent = normal;
    highCount.textContent = high;
    lowCount.textContent = low;

    const dailyAverage = {};

    for (const day in dailyReadings) {

        const readings = dailyReadings[day];

        const sum = readings.reduce((a, b) => a + b, 0);

        dailyAverage[day] = sum / readings.length;

    }

    const labels = Object.keys(dailyAverage);
    const values = Object.values(dailyAverage);

    const ctx = document.getElementById("glucoseChart");

    new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "متوسط السكر",
                data: values,
                borderWidth: 3,
                tension: 0.3
            }]
        },
        options: {
            responsive: true
        }
    });

}

onAuthStateChanged(auth, (user) => {

    if (user) {

        loadStats(user);

    } else {

        window.location.href = "login.html";

    }

});