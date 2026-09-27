let highestZIndex = 100;

function getWindow(id) {
    return document.getElementById(id);
}

function focusWindow(windowElement) {
    if (!windowElement) return;

    highestZIndex += 1;
    windowElement.style.zIndex = highestZIndex;
}

function setDockRunning(app, running) {
    const dockItem = document.querySelector(
        `.dock-item[data-app="${app}"]`
    );

    if (!dockItem) return;

    dockItem.classList.toggle("running", running);
}


/* =========================
   Window controls
========================= */

function closeWindow(id) {
    const windowElement = getWindow(id);

    if (!windowElement) return;

    windowElement.style.display = "none";
    windowElement.classList.remove("minimized");
    windowElement.classList.remove("maximized");

    setDockRunning(
        windowElement.dataset.app,
        false
    );
}

function minimizeWindow(id) {
    const windowElement = getWindow(id);

    if (!windowElement) return;

    windowElement.classList.add("minimized");
}

function restoreWindow(id) {
    const windowElement = getWindow(id);

    if (!windowElement) return;

    windowElement.style.display = "flex";
    windowElement.classList.remove("minimized");

    focusWindow(windowElement);

    setDockRunning(
        windowElement.dataset.app,
        true
    );
}

function maximizeWindow(id) {
    const windowElement = getWindow(id);

    if (!windowElement) return;

    windowElement.classList.toggle("maximized");

    focusWindow(windowElement);
}


/* =========================
   GitHub
========================= */

function openGitHub() {
    window.open(
        "https://github.com/BlurzzUD/site",
        "_blank",
        "noopener,noreferrer"
    );
}


/* =========================
   Safari
========================= */

function openSafari() {
    console.log("Opening Safari");

    const safari = document.getElementById("safari-window");

    if (!safari) {
        console.error("ERROR: #safari-window does not exist!");
        return;
    }

    console.log("Safari element found:", safari);

    /*
     * Force Safari to be visible.
     */
    safari.style.display = "flex";
    safari.style.visibility = "visible";
    safari.style.opacity = "1";
    safari.style.pointerEvents = "auto";

    /*
     * Remove minimized state.
     */
    safari.classList.remove("minimized");

    /*
     * Bring Safari above every other window.
     */
    focusWindow(safari);

    /*
     * Mark Safari as running in the Dock.
     */
    setDockRunning("safari", true);

    console.log(
        "Safari display:",
        safari.style.display
    );

    console.log(
        "Safari computed display:",
        window.getComputedStyle(safari).display
    );
}


/* =========================
   General app launcher
========================= */

function openApp(app) {
    console.log("Opening app:", app);

    if (app === "safari") {
        openSafari();
        return;
    }

    if (app === "finder") {
        const finder = document.getElementById(
            "finder-window"
        );

        if (!finder) {
            console.error(
                "ERROR: #finder-window does not exist!"
            );
            return;
        }

        finder.style.display = "flex";
        finder.style.visibility = "visible";
        finder.style.opacity = "1";
        finder.style.pointerEvents = "auto";

        finder.classList.remove("minimized");

        focusWindow(finder);

        setDockRunning("finder", true);

        return;
    }

    console.log(
        `No window has been created for ${app} yet.`
    );
}


/* =========================
   Dock
========================= */

function setupDock() {
    const dockItems = [
        ...document.querySelectorAll(".dock-item")
    ];

    dockItems.forEach((dockItem) => {

        dockItem.addEventListener("click", () => {

            const app = dockItem.dataset.app;

            if (!app) return;

            openApp(app);
        });
    });
}


/* =========================
   Dock magnification
========================= */

function setupDockMagnification() {
    const dock = document.querySelector(".dock");

    const items = [
        ...document.querySelectorAll(".dock-item")
    ];

    if (!dock || !items.length) return;

    dock.addEventListener("mousemove", (event) => {

        const mouseX = event.clientX;

        items.forEach((item) => {

            const rect =
                item.getBoundingClientRect();

            const center =
                rect.left + rect.width / 2;

            const distance =
                Math.abs(mouseX - center);

            item.classList.toggle(
                "near",
                distance < 110 && distance > 35
            );
        });
    });

    dock.addEventListener("mouseleave", () => {

        items.forEach((item) => {
            item.classList.remove("near");
        });
    });
}


/* =========================
   Window setup
========================= */

function setupWindows() {
    const windows = [
        ...document.querySelectorAll(".mac-window")
    ];

    windows.forEach((windowElement) => {

        windowElement.addEventListener(
            "pointerdown",
            () => {
                focusWindow(windowElement);
            }
        );

        /*
         * Finder starts visible.
         * Hidden windows stay stopped.
         */
        if (
            window.getComputedStyle(windowElement).display !==
            "none"
        ) {
            setDockRunning(
                windowElement.dataset.app,
                true
            );
        }
    });
}


/* =========================
   Keyboard shortcuts
========================= */

function setupKeyboardShortcuts() {

    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Escape") {

                const windows = [
                    ...document.querySelectorAll(
                        ".mac-window"
                    )
                ];

                windows.sort(
                    (a, b) =>
                        Number(
                            b.style.zIndex || 0
                        ) -
                        Number(
                            a.style.zIndex || 0
                        )
                );

                const focusedWindow =
                    windows[0];

                if (
                    focusedWindow &&
                    focusedWindow.classList.contains(
                        "maximized"
                    )
                ) {
                    focusedWindow.classList.remove(
                        "maximized"
                    );
                }
            }


            if (
                (event.metaKey || event.ctrlKey) &&
                event.shiftKey &&
                event.key.toLowerCase() === "f"
            ) {
                event.preventDefault();

                openApp("finder");
            }
        }
    );
}


/* =========================
   Safari reload
========================= */

function reloadSafari() {
    const frame =
        document.getElementById("safari-frame");

    if (!frame) return;

    frame.src = frame.src;
}


/* =========================
   Start
========================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupWindows();
        setupDock();
        setupDockMagnification();
        setupKeyboardShortcuts();

        console.log(
            "Blurzzd desktop initialized."
        );
    }
);