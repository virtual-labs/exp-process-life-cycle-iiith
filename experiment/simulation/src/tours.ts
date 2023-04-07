import { main_tour } from "./main_tour";

export function initialize_tours() {
    document.getElementById("init_tour")
    .addEventListener("click", (e) => {
        setTimeout(() => {
            main_tour();
        });
    });    
}