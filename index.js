console.log(
    "[Content Script] AutoApplyr loaded"
);


chrome.runtime.onMessage.addListener(
    (message, sender, sendResponse) => {

        console.log(
            "[Content Script] Received:",
            message
        );


        handleMessage(message)
            .then(result => {

                sendResponse(result);
            })
            .catch(error => {

                console.error(
                    "[Content Script] Error:",
                    error
                );


                sendResponse({
                    success: false,
                    error: error.message
                });
            });

        return true;
    }
);


async function handleMessage(message) {

    switch (message.action) {


        case "GET_JOB_OFFERS":

            return getJobOffers();


        case "SELECT_JOB":

            return selectJob(
                message.index
            );


        case "NEXT_PAGE":

            return nextPage();


        case "START_APPLICATION":

            return startApplication();


        case "CLICK_APPLY":

            return clickApply();


        case "FILL_FIELD":

            return fillField(
                message.field,
                message.value
            );


        case "CLICK_NEXT":

            return clickNext();


        case "SUBMIT_APPLICATION":

            return submitApplication();


        case "CLOSE_APPLICATION":

            return closeApplication();

        case "test":

            return test();


        default:

            return {
                success: false,
                error:
                    `Unknown content action: ${message.action}`
            };
    }
}

function test(){

}

/*
 * ------------------------------------------
 * JOB FUNCTIONS
 * ------------------------------------------
 */


function getJobOffers() {

    /*
     * These selectors are examples.
     *
     * You will need to adjust them to
     * LinkedIn's current DOM.
     */

    const elements =
        document.querySelectorAll(
            'div[componentkey*="job-card-component"][class^="_"]'
        );


    const offers =
        Array.from(elements)
            .map((element, index) => {

                return {
                    index,

                    title:
                        element
                            .querySelector(
                                'span[aria-hidden="true"]'
                            )
                            ?.innerText
                            ?.trim() || "",

                    company:
                        element
                            .querySelectorAll(
                                "p"
                            )[1]
                            ?.innerText
                            ?.trim() || ""
                };
            });


    return {
        success: true,
        offers
    };
}


async function selectJob(index) {

    const jobs =
        document.querySelectorAll(
            'div[componentkey*="job-card-component"][class^="_"]'
        );


    const job =
        jobs[index];


    if (!job) {

        return {
            success: false,
            error: "Job not found"
        };
    }


    job.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });


    job.click();


    /*
     * Give LinkedIn some time to load
     * the job details.
     */

    await sleep(1000);


    return {
        success: true
    };
}


async function nextPage() {

    // const host = document.querySelector("#interop-outlet");
    //
    // if (!host?.shadowRoot) {
    //     return {
    //         success: false,
    //         error: "ShadowRoot is missing"
    //     };
    // }
    //
    // const buttons = host.shadowRoot.querySelectorAll(
    //     "button"
    // );
    //
    //
    // const nextButton =
    //     Array.from(buttons)
    //         .find(button =>
    //             button.innerText
    //                 ?.trim()
    //                 .toLowerCase()
    //                 .includes("siguiente")
    //         );


    if (!nextButton) {

        return {
            success: false,
            error: "Next page button not found"
        };
    }


    nextButton.click();


    await sleep(1500);


    return {
        success: true
    };
}


/*
 * ------------------------------------------
 * APPLICATION FUNCTIONS
 * ------------------------------------------
 */


async function startApplication() {

    console.log(
        "[Content Script] Starting application"
    );


    return {
        success: true
    };
}


async function clickApply() {

    console.log(
        "[Content Script] Looking for Apply button"
    );


    const applyButton = document.querySelector(
        'button[aria-label="Solicitud sencilla"]'
    );


    if (!applyButton) {

        return {
            success: false,
            error: "Apply button not found"
        };
    }


    applyButton.click();


    await sleep(1000);


    return {
        success: true
    };
}


async function fillField(field, value) {

    console.log(
        "[Content Script] Filling:",
        field
    );


    /*
     * You can expand this mapping.
     */

    const selectors = {

        phone:
            'input[type="tel"]',

        email:
            'input[type="email"]',

        firstName:
            'input[name="firstName"]',

        lastName:
            'input[name="lastName"]'
    };


    const selector =
        selectors[field];


    if (!selector) {

        return {
            success: false,
            error:
                `Unknown field: ${field}`
        };
    }


    const element =
        document.querySelector(selector);


    if (!element) {

        return {
            success: false,
            error:
                `Field not found: ${field}`
        };
    }


    element.focus();


    element.value = value;


    /*
     * React/LinkedIn may listen to
     * input/change events.
     */

    element.dispatchEvent(
        new Event(
            "input",
            {
                bubbles: true
            }
        )
    );


    element.dispatchEvent(
        new Event(
            "change",
            {
                bubbles: true
            }
        )
    );


    return {
        success: true
    };
}


async function clickNext() {

    const buttons = document.querySelectorAll('button[componentkey]');

    const nextButton = Array.from(buttons).find(
        button => button.innerText.trim() === "Siguiente"
    );

    const reviewButton = Array.from(buttons).find(
        button => button.innerText.trim() === "Revisar"
    );

    if (nextButton) {
        nextButton.click();
    } else if (reviewButton) {
        reviewButton.click();
    } else {
        return {
            success: false,
            error: "Next or Review button not found"
        };
    }


    await sleep(1000);


    return {
        success: true
    };
}

async function submitApplication() {

    const buttons =
        document.querySelectorAll(
            "button"
        );


    const submitButton =
        Array.from(buttons)
            .find(button => {

                const text =
                    button.innerText
                        ?.trim()
                        .toLowerCase();

                return (
                    text === "submit application" ||
                    text === "submit"
                );
            });


    if (!submitButton) {

        return {
            success: false,
            error: "Submit button not found"
        };
    }


    submitButton.click();


    await sleep(1500);


    return {
        success: true
    };
}


async function closeApplication() {

    /*
     * Find LinkedIn's close button.
     *
     * This selector will likely need adjustment.
     */

    const closeButton =
        document.querySelector(
            'button[aria-label="Dismiss"]'
        );


    if (closeButton) {

        closeButton.click();
    }


    return {
        success: true
    };
}


/*
 * ------------------------------------------
 * UTILITIES
 * ------------------------------------------
 */


function sleep(ms) {

    return new Promise(
        resolve =>
            setTimeout(resolve, ms)
    );
}