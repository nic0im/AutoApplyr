
import {detectApplicationState} from "./services/Helpers.js";

export class ApplyStateMachine {

    constructor(applicationService) {
        this.applicationService = applicationService;
        this.observer = null;
        this.currentState = null;
    }


    async run() {

        console.log("[StateMachine] Starting");

        await this.applicationService.start();

        await this.clickApply();

        this.startObserver();
    }


    async clickApply() {

        const response =
            await this.applicationService.clickApply();


        if (!response?.success) {

            throw new Error(
                response?.error ||
                "Could not click Apply"
            );
        }
    }


    async process() {

        const state = detectApplicationState();

        if (state === this.currentState) {
            return;
        }

        this.currentState = state;

        switch (state) {

            case "CONTACT_INFO_FORM":
                console.log("[StateMachine] fillcontactInfo()");
                await this.applicationService.fillContactInfo();
                break;

            case "RESUME_FORM":
                await this.applicationService.selectResume();
                break;

            case "QUESTIONS_FORM":
                await this.applicationService.answerQuestions();
                break;

            case "CONFIRM_FORM":
                await this.applicationService.submit();
                break;

            case "SUCCESS":
                await this.applicationService.closeSuccessMessage();
                this.stopObserver();
                break;
        }
    }

     startObserver() {

         const observer = new MutationObserver(() => {
             const dialog = document.querySelector("dialog[open]");

             if (dialog) {
                 this.process();
             }
         });

         observer.observe(document.documentElement, {
             childList: true,
             subtree: true,
             attributes: true,
             attributeFilter: ["open"]
         });


     }

    stopObserver() {
        this.observer?.disconnect();
        this.observer = null;
    }

    async submit() {

        const response =
            await this.applicationService.submit();


        if (!response?.success) {

            throw new Error(
                response?.error ||
                "Could not submit application"
            );
        }
    }
}