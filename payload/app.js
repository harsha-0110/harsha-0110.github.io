document.addEventListener("DOMContentLoaded", () => {
    const installButton = document.getElementById("installApp");
    const ipInput = document.getElementById("ip");
    const portInput = document.getElementById("port");
    const payloadInput = document.getElementById("payload");
    const sendButton = document.getElementById("sendPayload");
    const toggleThemeButton = document.getElementById("toggleTheme");

    // Load saved IP/Port
    ipInput.value = localStorage.getItem("ps4_ip") || "";
    portInput.value = localStorage.getItem("ps4_port") || "9020";

    ipInput.addEventListener("input", () => {
        localStorage.setItem("ps4_ip", ipInput.value);
    });

    portInput.addEventListener("input", () => {
        localStorage.setItem("ps4_port", portInput.value);
    });

    // Toggle Theme
    toggleThemeButton.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
    });

    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
    }

    function getPayload(payload, onLoadEndCallback) {
        const req = new XMLHttpRequest();
        req.open("GET", payload);
        req.responseType = "arraybuffer";
        req.onload = (event) => onLoadEndCallback && onLoadEndCallback(req, event);
        req.send();
    }

    // Function to send payload
    function sendPayload(url, data, onLoadEndCallback) {
        const req = new XMLHttpRequest();
        req.open("POST", url, true);
        req.onload = (event) => onLoadEndCallback && onLoadEndCallback(req, event);
        req.send(data);
    }

    // Handle Send Payload Button Click
    sendButton.addEventListener("click", () => {
        const ip = ipInput.value.trim();
        const port = portInput.value.trim() || "9020"; // Default port
        const file = payloadInput.files[0];

        if (!ip || !port || !file) {
            alert("Please enter IP, Port, and select a payload file.");
            return;
        }

        const url = `http://${ip}:${port}`;
        getPayload(file, (req) => {
            if ((req.status === 200 || req.status === 304) && req.response) {
              sendPayload(payloadUrl, req.response, (req) => {
                if (req.status === 200) {
                    alert("Payload Sent Successfully!");
                } else {
                    alert(`Error: ${req.status} ${req.statusText}`);
                }
              });
            }
        });

        /*const reader = new FileReader();
        reader.onload = function (event) {
            const data = event.target.result;
            sendPayload(url, data, (req) => {
                if (req.status === 200) {
                    alert("Payload Sent Successfully!");
                } else {
                    alert(`Error: ${req.status} ${req.statusText}`);
                }
            });
        };

        reader.readAsArrayBuffer(file);*/
    });

    // Install App as PWA
    let deferredPrompt; // Store the event

    window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault();
        deferredPrompt = e;
        installButton.style.display = "block"; // Show the button

        installButton.addEventListener("click", () => {
            if (deferredPrompt) {
                deferredPrompt.prompt(); // Show install prompt

                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === "accepted") {
                        console.log("User installed app");
                    } else {
                        console.log("User dismissed install prompt");
                    }
                    deferredPrompt = null; // Reset the prompt event
                });
            }
        });
    });
});
