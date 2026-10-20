export class ApplicationService {

    constructor(tabId) {

        this.tabId = tabId;
    }


    async send(message) {

        if (!this.tabId) {

            throw new Error(
                "ApplicationService has no tab ID"
            );
        }

        return await chrome.tabs.sendMessage(
            this.tabId,
            message
        );
    }


    async start() {

        console.log(
            "[ApplicationService] Starting application"
        );


        const response =
            await this.send({
                action: "START_APPLICATION"
            });


        if (!response?.success) {

            throw new Error(
                response?.error ||
                "Could not start application"
            );
        }


        return response;
    }


    async clickApply() {

        return await this.send({
            action: "CLICK_APPLY"
        });
    }


    async fillField(field, value) {

        return await this.send({
            action: "FILL_FIELD",
            field,
            value
        });
    }


    async clickNext() {

        return await this.send({
            action: "CLICK_NEXT"
        });
    }

    async closeApplication() {

        return await this.send({
            action: "CLOSE_APPLICATION"
        });
    }

    async fillContactInfo(){
        return await this.send({
            action: "CLICK_NEXT"
        });
    };

    async selectResume(){
        return await this.send({
            action: "CLICK_NEXT"
        });
    };

    async answerQuestions(){

        //IMPLEMENT LOGIC FOR ANSWERING

        return await this.send({
            action: "REVIEW_OR_NEXT_FORM"
        });
    };

    async submit() {

        return await this.send({
            action: "SUBMIT_APPLICATION"
        });
    }

    async closeSuccessMessage() {
        return await this.send({
            action: "CLOSE_SUCCESS_MESSAGE"
        })
    }

}