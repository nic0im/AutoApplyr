import { JobService } from "../services/JobService.js";
import { ApplicationService } from "../services/ApplicationService.js";
import { ApplyStateMachine } from "../ApplyStateMachine.js";


export class ApplyController {

    constructor(tabId) {
        this.tabId = tabId;

        this.jobService = new JobService(tabId);
        this.applicationService = new ApplicationService(tabId);

        this.stateMachine = new ApplyStateMachine(
            this.applicationService
        );

        this.running = false;
    }

    async start() {
        if (this.running) return;

        this.running = true;

        try {
            await this.applySelectedJob();
        } catch (error) {
            console.error("Application failed:", error);
            this.stop();
        }
        return true;
    }

    async applySelectedJob() {

        console.log("Starting application");

        await this.stateMachine.run();
        return true;
    }

    stop() {
        this.running = false;
    }
}