const applyCurrentJobBtn =
    document.getElementById("applyCurrentJob");

const stopButton =
    document.getElementById("stop");

const testButton =
    document.getElementById("test");

const status =
    document.getElementById("status");


async function getCurrentTab() {

    const tabs =
        await chrome.tabs.query({
            active: true,
            currentWindow: true
        });


    return tabs[0];
}


testButton.addEventListener(
    "click",
    async () => {

        const response =
            await chrome.runtime.sendMessage({
                action: "TEST"
            });


        console.log(
            "Test response:",
            response
        );


        status.innerText =
            response?.message ||
            "Test completed";
    }
);


applyCurrentJobBtn.addEventListener(
    "click",
    async () => {

        const tab =
            await getCurrentTab();


        if (!tab?.id) {

            status.innerText =
                "No active tab";

            return;
        }


        const response =
            await chrome.runtime.sendMessage({
                action: "ApplyCurrentJob",
                tabId: tab.id
            });


        console.log(
            "Start response:",
            response
        );


        if (response?.success) {

            status.innerText =
                "Applying...";
        } else {

            status.innerText =
                response?.error ||
                "Could not start";
        }
    }
);


stopButton.addEventListener(
    "click",
    async () => {

        const tab =
            await getCurrentTab();


        if (!tab?.id) {
            return;
        }


        const response =
            await chrome.runtime.sendMessage({
                action: "STOP_APPLY",
                tabId: tab.id
            });


        console.log(
            "Stop response:",
            response
        );


        status.innerText =
            "Stopped";
    }
);