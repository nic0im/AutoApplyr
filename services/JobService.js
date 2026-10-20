export class JobService {

    constructor(tabId) {

        this.tabId = tabId;

        this.offers = [];
    }


    async send(message) {

        if (!this.tabId) {

            throw new Error(
                "JobService has no tab ID"
            );
        }


        return await chrome.tabs.sendMessage(
            this.tabId,
            message
        );
    }


    async loadOffers() {

        console.log(
            "[JobService] Loading offers"
        );


        const response =
            await this.send({
                action: "GET_JOB_OFFERS"
            });


        if (!response?.success) {

            throw new Error(
                response?.error ||
                "Could not load job offers"
            );
        }


        this.offers =
            response.offers || [];


        console.log(
            "[JobService] Offers:",
            this.offers
        );


        return this.offers;
    }


    async selectJob(index) {

        console.log(
            "[JobService] Selecting job:",
            index
        );


        const response =
            await this.send({
                action: "SELECT_JOB",
                index
            });


        if (!response) {
            return false;
        }


        return response.success === true;
    }


    async nextPage() {

        console.log(
            "[JobService] Going to next page"
        );


        const response =
            await this.send({
                action: "NEXT_PAGE"
            });


        if (!response) {
            return false;
        }


        return response.success === true;
    }
}