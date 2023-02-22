import { IResponce } from "./Kernel";
import { UI } from "./UI";
const ui = new UI();
ui.createProcess();
ui.createProcess();
ui.createProcess();
ui.console_display();

function check_error(err:IResponce) {
    if (err.status === "OK") {
        console.log("Success: " + err.message);
    } else {
        alert("Error: " + err.message);
    }
}

document.getElementById("move_to_ready").addEventListener("click", () => {
    check_error(ui.kernel.moveProcess(ui.kernel.selectedProcess, "READY"));
    var modal = document.getElementById("process_popup");
    modal.style.display = "none";
    ui.display_all();
});
document.getElementById("move_to_io").addEventListener("click", () => {
    check_error(ui.kernel.moveProcess(ui.kernel.selectedProcess, "IO"));
    var modal = document.getElementById("process_popup");
    modal.style.display = "none";
    ui.display_all();
});
document.getElementById("move_to_cpu").addEventListener("click", () => {
    check_error(ui.kernel.moveProcess(ui.kernel.selectedProcess, "CPU"));
    var modal = document.getElementById("process_popup");
    modal.style.display = "none";
    ui.display_all();
});
document.getElementById("move_to_completed").addEventListener("click", () => {
    check_error(ui.kernel.moveProcess(ui.kernel.selectedProcess, "COMPLETED"));
    var modal = document.getElementById("process_popup");
    modal.style.display = "none";
    ui.display_all();
});
document.getElementById("create_button").addEventListener("click", () => {
    (ui.createProcess());
    var modal = document.getElementById("create_process_popup");
    modal.style.display = "none";
    ui.display_all();
});



