export function detectApplicationState() {
    const dialog = document.querySelector("dialog[open]");

    if (!dialog) {
        const host = document.querySelector("#interop-outlet");
        const shadowRoot = host?.shadowRoot;
        const modal = shadowRoot?.querySelector("div[data-test-modal]");

        if (modal?.textContent?.includes("Se ha enviado tu solicitud")) {
            return "SUCCESS";
        }

        return "UNKNOWN";
    }

    const title = dialog
        .querySelector('div[data-component-type] p')
        ?.textContent
        ?.trim();

    switch (title) {
        case "Información de contacto":
            return "CONTACT_INFO_FORM";

        case "Currículum*":
            return "RESUME_FORM";

        case "Preguntas adicionales":
            return "QUESTIONS_FORM";

        case "El empleador también recibirá una copia de tu perfil.":
            return "CONFIRM_FORM";

        default:
            return "UNKNOWN";
    }
}

let testInterval = setInterval(() => {
    console.log(detectApplicationState());
},500)