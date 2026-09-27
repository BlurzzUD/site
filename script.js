let highestZIndex = 100;


/* =========================
   Helpers
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

    dockItem.classList.toggle(
        "running",
        running
    );
}


/* =========================
   Window controls
========================= */

function closeWindow(id) {
    const windowElement = getWindow(id);

    if (!windowElement) return;

    windowElement.style.display = "none";

    windowElement.classList.remove(
        "minimized",
        "maximized"
    );

    setDockRunning(
        windowElement.dataset.app,
        false
    );
}


function minimizeWindow(id) {
    const windowElement = getWindow(id);

    if (!windowElement) return;

    windowElement.classList.add(
        "minimized"
    );
}


function restoreWindow(id) {
    const windowElement = getWindow(id);

    if (!windowElement) return;

    windowElement.style.display = "flex";

    windowElement.classList.remove(
        "minimized"
    );

    focusWindow(windowElement);

    setDockRunning(
        windowElement.dataset.app,
        true
    );
}


function maximizeWindow(id) {
    const windowElement = getWindow(id);

    if (!windowElement) return;

    windowElement.classList.toggle(
        "maximized"
    );

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

    const safari =
        document.getElementById(
            "safari-window"
        );

    if (!safari) {
        console.error(
            "Safari window not found!"
        );

        return;
    }

    safari.style.display = "flex";
    safari.style.visibility = "visible";
    safari.style.opacity = "1";
    safari.style.pointerEvents = "auto";

    safari.classList.remove(
        "minimized"
    );

    focusWindow(safari);

    setDockRunning(
        "safari",
        true
    );
}


function reloadSafari() {
    const frame =
        document.getElementById(
            "safari-frame"
        );

    if (!frame) return;

    frame.src = frame.src;
}


/* =========================
   Messages
========================= */

function openMessages() {
    console.log("Opening Messages");

    const messages =
        document.getElementById(
            "messages-window"
        );

    if (!messages) {
        console.error(
            "Messages window not found!"
        );

        return;
    }

    messages.style.display = "flex";
    messages.style.visibility = "visible";
    messages.style.opacity = "1";
    messages.style.pointerEvents = "auto";

    messages.classList.remove(
        "minimized"
    );

    focusWindow(messages);

    setDockRunning(
        "messages",
        true
    );
}


/* =========================
   General app launcher
========================= */

function openApp(app) {
    console.log(
        "Opening app:",
        app
    );

    if (app === "finder") {

        const finder =
            document.getElementById(
                "finder-window"
            );

        if (!finder) {
            console.error(
                "Finder window not found!"
            );

            return;
        }

        finder.style.display = "flex";
        finder.style.visibility = "visible";
        finder.style.opacity = "1";
        finder.style.pointerEvents = "auto";

        finder.classList.remove(
            "minimized"
        );

        focusWindow(finder);

        setDockRunning(
            "finder",
            true
        );

        return;
    }


    if (app === "safari") {
        openSafari();
        return;
    }


    if (app === "messages") {
        openMessages();
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
        ...document.querySelectorAll(
            ".dock-item"
        )
    ];

    dockItems.forEach((dockItem) => {

        dockItem.addEventListener(
            "click",
            () => {

                const app =
                    dockItem.dataset.app;

                if (!app) return;

                openApp(app);
            }
        );

    });
}


/* =========================
   Dock magnification
========================= */

function setupDockMagnification() {
    const dock =
        document.querySelector(
            ".dock"
        );

    const items = [
        ...document.querySelectorAll(
            ".dock-item"
        )
    ];

    if (!dock || !items.length) {
        return;
    }

    dock.addEventListener(
        "mousemove",
        (event) => {

            const mouseX =
                event.clientX;

            items.forEach((item) => {

                const rect =
                    item.getBoundingClientRect();

                const center =
                    rect.left +
                    rect.width / 2;

                const distance =
                    Math.abs(
                        mouseX - center
                    );

                item.classList.toggle(
                    "near",
                    distance < 110 &&
                    distance > 35
                );
            });
        }
    );


    dock.addEventListener(
        "mouseleave",
        () => {

            items.forEach((item) => {
                item.classList.remove(
                    "near"
                );
            });

        }
    );
}


/* =========================
   Window setup
========================= */

function setupWindows() {
    const windows = [
        ...document.querySelectorAll(
            ".mac-window"
        )
    ];

    windows.forEach((windowElement) => {

        windowElement.addEventListener(
            "pointerdown",
            () => {
                focusWindow(
                    windowElement
                );
            }
        );


        if (
            window.getComputedStyle(
                windowElement
            ).display !== "none"
        ) {

            setDockRunning(
                windowElement.dataset.app,
                true
            );
        }

    });
}


/* =========================
   Messages interactions
========================= */

function setupMessages() {

    const conversations = [
        ...document.querySelectorAll(
            ".message-conversation"
        )
    ];

    conversations.forEach(
        (conversation) => {

            conversation.addEventListener(
                "click",
                () => {

                    conversations.forEach(
                        (item) => {
                            item.classList.remove(
                                "active"
                            );
                        }
                    );

                    conversation.classList.add(
                        "active"
                    );
                }
            );

        }
    );


    const input =
        document.querySelector(
            ".messages-input-area input"
        );

    const sendButton =
        document.querySelector(
            ".send-message"
        );

    if (!input || !sendButton) {
        return;
    }


    function sendMessage() {

        const text =
            input.value.trim();

        if (!text) return;

        const messagesContent =
            document.querySelector(
                ".messages-content"
            );

        if (!messagesContent) {
            return;
        }


        const row =
            document.createElement(
                "div"
            );

        row.className =
            "message-row sent";


        const bubble =
            document.createElement(
                "div"
            );

        bubble.className =
            "message-bubble";


        const paragraph =
            document.createElement(
                "p"
            );

        paragraph.textContent =
            text;


        bubble.appendChild(
            paragraph
        );

        row.appendChild(
            bubble
        );

        messagesContent.appendChild(
            row
        );


        input.value = "";

        messagesContent.scrollTop =
            messagesContent.scrollHeight;
    }


    sendButton.addEventListener(
        "click",
        sendMessage
    );


    input.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Enter") {

                event.preventDefault();

                sendMessage();
            }

        }
    );
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
                (event.metaKey ||
                    event.ctrlKey) &&
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
   Start
========================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupWindows();
        setupDock();
        setupDockMagnification();
        setupMessages();
        setupKeyboardShortcuts();

        console.log(
            "Blurzzd desktop initialized."
        );
    }
);