let highestZIndex = 20;

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

function closeWindow(id) {
    const windowElement = getWindow(id);

    if (!windowElement) return;

    windowElement.style.display = "none";

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

function openGitHub() {
    window.open(
        "https://github.com/BlurzzUD/site",
        "_blank",
        "noopener,noreferrer"
    );
}

/*
 * Open an application from the Dock.
 * Most apps are intentionally placeholders for now;
 * their real windows can be added without changing the
 * Dock/window system.
 */
function openApp(app) {
    const windowMap = {
        finder: "finder-window",
        safari: "safari-window"
    };

    const windowId = windowMap[app];
    const appWindow = getWindow(windowId);

    if (!appWindow) {
        console.log(`App window not found: ${app}`);
        return;
    }

    appWindow.style.display = "flex";
    appWindow.classList.remove("minimized");

    requestAnimationFrame(() => {
        focusWindow(appWindow);
        setDockRunning(app, true);
    });
}


function setupDockMagnification() {
    const dock = document.querySelector(".dock");
    const items = [...document.querySelectorAll(".dock-item")];

    if (!dock || !items.length) return;

    dock.addEventListener("mousemove", (event) => {
        const dockRect = dock.getBoundingClientRect();
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

function setupWindows() {
    const windows = [
        ...document.querySelectorAll(".mac-window")
    ];

    windows.forEach((windowElement) => {
        windowElement.addEventListener(
            "pointerdown",
            () => focusWindow(windowElement)
        );

        setDockRunning(
            windowElement.dataset.app,
            true
        );
    });
}

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

function setupKeyboardShortcuts() {
    document.addEventListener("keydown", (event) => {
        /*
         * Escape exits fullscreen/maximized state.
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
         * Cmd/Ctrl + Shift + F opens Finder.
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

document.addEventListener("DOMContentLoaded", () => {
    setupWindows();
    setupDock();
    setupDockMagnification();
    setupKeyboardShortcuts();
});