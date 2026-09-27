let highestZIndex = 20;

/* =========================
   Window helpers
========================= */

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

    setTimeout(() => {
        setDockRunning(
            windowElement.dataset.app,
            true
        );
    }, 180);
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
   Open apps
========================= */

function openApp(app) {

    /* Finder */
    if (app === "finder") {
        const finder = getWindow("finder-window");

        if (!finder) {
            console.error("Finder window not found!");
            return;
        }

        finder.style.display = "flex";
        finder.classList.remove("minimized");

        requestAnimationFrame(() => {
            focusWindow(finder);
            setDockRunning("finder", true);
        });

        return;
    }

    /* Safari */
    if (app === "safari") {
        const safari = getWindow("safari-window");

        if (!safari) {
            console.error("Safari window not found!");
            return;
        }

        safari.style.display = "flex";
        safari.classList.remove("minimized");

        requestAnimationFrame(() => {
            focusWindow(safari);
            setDockRunning("safari", true);
        });

        return;
    }

    /* Other apps */
    console.log(`Opening ${app}`);
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
            const rect = item.getBoundingClientRect();
            const center = rect.left + rect.width / 2;
            const distance = Math.abs(mouseX - center);

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
         * Only show the running indicator
         * for windows that are actually visible.
         */
        if (
            windowElement.style.display !== "none" &&
            !windowElement.classList.contains("minimized")
        ) {
            setDockRunning(
                windowElement.dataset.app,
                true
            );
        }
    });
}

/* =========================
   Dock setup
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
   Keyboard shortcuts
========================= */

function setupKeyboardShortcuts() {
    document.addEventListener("keydown", (event) => {

        /*
         * Escape exits maximized mode.
         */
        if (event.key === "Escape") {

            const windows = [
                ...document.querySelectorAll(".mac-window")
            ];

            if (!windows.length) return;

            windows.sort(
                (a, b) =>
                    Number(b.style.zIndex || 0) -
                    Number(a.style.zIndex || 0)
            );

            const focusedWindow = windows[0];

            if (
                focusedWindow &&
                focusedWindow.classList.contains("maximized")
            ) {
                focusedWindow.classList.remove("maximized");
            }
        }

        /*
         * Cmd/Ctrl + Shift + F
         * opens Finder.
         */
        if (
            (event.metaKey || event.ctrlKey) &&
            event.shiftKey &&
            event.key.toLowerCase() === "f"
        ) {
            event.preventDefault();

            openApp("finder");
        }
    });
}

/* =========================
   Start everything
========================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {
        setupWindows();
        setupDock();
        setupDockMagnification();
        setupKeyboardShortcuts();
    }
);