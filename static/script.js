const startButton =
    document.getElementById("startButton");

const stopButton =
    document.getElementById("stopButton");

const clearButton =
    document.getElementById("clearButton");

const status =
    document.getElementById("status");

const demoInput =
    document.getElementById("demoInput");

const eventsBox =
    document.getElementById("events");

const counter =
    document.getElementById("counter");


let monitoring = false;
let eventCount = 0;


/* =========================
   Start Monitoring
========================= */

startButton.addEventListener("click", function () {

    monitoring = true;

    status.textContent = "ACTIVE";

    status.classList.remove("off");

    status.classList.add("on");

    demoInput.focus();

});


/* =========================
   Stop Monitoring
========================= */

stopButton.addEventListener("click", function () {

    monitoring = false;

    status.textContent = "OFFLINE";

    status.classList.remove("on");

    status.classList.add("off");

});


/* =========================
   Keyboard Event
========================= */

demoInput.addEventListener(
    "keydown",
    async function (event) {

        if (!monitoring) {
            return;
        }


        let key = event.key;


        /* Readable names for special keys */

        if (key === " ") {
            key = "SPACE";
        }

        else if (key === "Enter") {
            key = "ENTER";
        }

        else if (key === "Backspace") {
            key = "BACKSPACE";
        }

        else if (key === "Tab") {
            key = "TAB";
        }

        else if (key === "Escape") {
            key = "ESC";
        }


        /* Ignore unidentified events */

        if (key === "Unidentified") {
            return;
        }


        eventCount++;

        counter.textContent = eventCount;

        addEvent(key);


        /* Send event to Flask */

        try {

            await fetch("/log-key", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    key: key
                })

            });

        }

        catch (error) {

            console.log(
                "Could not send event."
            );

        }

    }
);


/* =========================
   Display Event
========================= */

function addEvent(key) {

    const empty =
        eventsBox.querySelector(".empty-state");

    if (empty) {
        empty.remove();
    }


    const eventElement =
        document.createElement("div");

    eventElement.className = "event";


    const time =
        new Date().toLocaleTimeString();


    eventElement.textContent =
        `[${time}]    ${key}`;


    eventsBox.appendChild(
        eventElement
    );


    eventsBox.scrollTop =
        eventsBox.scrollHeight;

}


/* =========================
   Clear Log
========================= */

clearButton.addEventListener(
    "click",
    async function () {

        eventCount = 0;

        counter.textContent = "0";


        eventsBox.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">
                    ⌨
                </div>

                <p>No activity recorded</p>

                <span>
                    Start monitoring and type in the sandbox.
                </span>

            </div>
        `;


        try {

            await fetch(
                "/clear-log",
                {
                    method: "POST"
                }
            );

        }

        catch (error) {

            console.log(
                "Could not clear server log."
            );

        }

    }
);
