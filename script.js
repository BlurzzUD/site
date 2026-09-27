function closeWindow() {
    document.getElementById("leiras").style.display = "none";

    document.querySelector(".dock").classList.remove("show");
    document.querySelector(".footer").classList.remove("dock-open");
}


function minimizeWindow() {
    const leiras = document.getElementById("leiras");
    const dock = document.querySelector(".dock");
    const footer = document.querySelector(".footer");

    leiras.classList.add("minimized");

    setTimeout(() => {
        dock.classList.add("show");
        footer.classList.add("dock-open");
    }, 200);
}


function restoreWindow() {
    const leiras = document.getElementById("leiras");
    const dock = document.querySelector(".dock");
    const footer = document.querySelector(".footer");

    dock.classList.remove("show");
    footer.classList.remove("dock-open");

    leiras.classList.remove("minimized");
}


function maximizeWindow() {
    const leiras = document.getElementById("leiras");

    leiras.classList.toggle("maximized");
}