import {IResponce} from "./Kernel"
import {UI} from "./UI"
import Driver from "driver.js"

const ui = new UI();
const tutorial = new Driver();

// ui.start_timer();
ui.display_all();

document.getElementById("create_process").addEventListener("click", () => {
    // ui.kernel.events[ui.kernel.selectedEvent].do
    ui.createProcess();
    ui.start_timer();
});
