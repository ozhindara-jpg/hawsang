const currentPage = window.location.pathname.split("/").pop();

const navbar = `
<nav class="navbar">

    <div class="logo">
        🩸 Glucose Tracker
    </div>

    <div class="nav-links">

        <a href="index.html" ${currentPage === "index.html" ? 'class="active"' : ""}>
            🏠 الرئيسية
        </a>

        <a href="history.html" ${currentPage === "history.html" ? 'class="active"' : ""}>
            📜 السجل
        </a>

        <a href="stats.html" ${currentPage === "stats.html" ? 'class="active"' : ""}>
            📊 الإحصائيات
        </a>

        <a href="profile.html" ${currentPage === "profile.html" ? 'class="active"' : ""}>
    👤 الحساب
        </a>

    </div>

</nav>
`;

document.getElementById("navbar").innerHTML = navbar;