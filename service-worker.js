
import {ApplyController} from "./application/ApplyController.js";

const controllers = new Map();

chrome.runtime.onMessage.addListener(
    async (message, sender, sendResponse) => {

        console.log(
            "[Service Worker] Message:",
            message
        );

        try {

            switch (message.action) {

                case "ApplyCurrentJob":
                    await startApply(
                        message.tabId || sender.tab?.id
                    );

                    sendResponse({
                        success: true
                    });

                    break;


                case "STOP_APPLY":
                    stopApply(
                        message.tabId || sender.tab?.id
                    );

                    sendResponse({
                        success: true
                    });

                    break;


                case "TEST":

                    console.log(
                        "Communication with service worker working"
                    );

                    sendResponse({
                        success: true,
                        message: "Service worker communication working"
                    });

                    break;


                case "GET_STATUS": {

                    const tabId =
                        message.tabId || sender.tab?.id;

                    const controller =
                        controllers.get(tabId);

                    sendResponse({
                        success: true,
                        running: controller
                            ? controller.running
                            : false
                    });

                    break;
                }


                default:

                    sendResponse({
                        success: false,
                        error: "Unknown action"
                    });
            }

        } catch (error) {

            console.error(
                "[Service Worker] Error:",
                error
            );

            sendResponse({
                success: false,
                error: error.message
            });
        }

        return true;
    }
);


async function startApply(tabId) {

    if (!tabId) {

        throw new Error(
            "Could not determine LinkedIn tab."
        );
    }


    if (controllers.has(tabId)) {

        console.log(
            "Controller already exists for tab:",
            tabId
        );

        return;
    }


    console.log(
        "Creating ApplyController for tab:",
        tabId
    );


    const controller =
        new ApplyController(tabId);


    controllers.set(
        tabId,
        controller
    );


    /*
     * Do not await this here.
     *
     * The controller runs its own application process.
     */
    controller.start()
        .catch(error => {

            console.error(
                "[Service Worker] Controller error:",
                error
            );

            controllers.delete(tabId);
        });
}


function stopApply(tabId) {

    const controller =
        controllers.get(tabId);


    if (!controller) {

        console.log(
            "No controller found for tab:",
            tabId
        );

        return;
    }


    controller.stop();

    controllers.delete(tabId);


    console.log(
        "Controller stopped for tab:",
        tabId
    );
}