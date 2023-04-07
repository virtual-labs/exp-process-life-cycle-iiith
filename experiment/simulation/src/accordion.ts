export function initialize_accordion() {
    let log = <HTMLElement> document.getElementById("observations_button");
    let observations = <HTMLElement> log.nextElementSibling;
    log.classList.toggle("active");
    observations.style.display = "flex";
    observations.style.flexDirection = "column";
    observations.style.overflow = "scroll";
    observations.style.maxHeight = observations.scrollHeight + "px";

    let accordion = document.getElementsByClassName("accordion");

    for(let i = 0; i < accordion.length; i++) {
        accordion[i].addEventListener("click", () => {
            accordion[i].classList.toggle("active");
            let panel = <HTMLElement> accordion[i].nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.transition = "0.2s";
                panel.style.display = "none";
                panel.style.maxHeight = null;
            } else {
                panel.style.display = "flex";
                panel.style.flexDirection = "column";
                panel.style.overflow = "scroll";
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });
    }

}

export function update_accordion () {
    let log = <HTMLElement> document.getElementById("observations_button");
    let observations = <HTMLElement> log.nextElementSibling;

    if (log.classList.contains("active"))
        return;

    observations.style.display = "flex";
    observations.style.flexDirection = "column";
    observations.style.overflow = "scroll";
    observations.style.maxHeight = observations.scrollHeight + "px";
}