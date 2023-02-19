import { UI } from "./UI";
const ui = new UI();
ui.createProcess();
ui.createProcess();
ui.createProcess();
ui.createProcess();
ui.createProcess();
ui.createProcess();
ui.createProcess();
ui.createProcess();



document.getElementById("clock").addEventListener("click", () => {
    ui.update_clock();
});