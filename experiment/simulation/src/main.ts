import { IResponce } from "./Kernel";
import { UI } from "./UI";
const ui = new UI();
// ui.createProcess();
// ui.createProcess();
// ui.createProcess();
// ui.console_display();
ui.display_all();

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
    ui.start_timer();
});
document.getElementById("move_to_io").addEventListener("click", () => {
    check_error(ui.kernel.moveProcess(ui.kernel.selectedProcess, "IO"));
    var modal = document.getElementById("process_popup");
    modal.style.display = "none";
    ui.display_all();
    ui.start_timer();
});
document.getElementById("move_to_cpu").addEventListener("click", () => {
    check_error(ui.kernel.moveProcess(ui.kernel.selectedProcess, "CPU"));
    var modal = document.getElementById("process_popup");
    modal.style.display = "none";
    ui.display_all();
    ui.start_timer();
});
document.getElementById("move_to_completed").addEventListener("click", () => {
    check_error(ui.kernel.moveProcess(ui.kernel.selectedProcess, "COMPLETED"));
    var modal = document.getElementById("process_popup");
    modal.style.display = "none";
    ui.display_all();
    ui.start_timer();
});
// document.getElementById("create_button").addEventListener("click", () => {
//     (ui.createProcess());
//     var modal = document.getElementById("create_process_popup");
//     modal.style.display = "none";
//     ui.display_all();
//     ui.start_timer();
// });

document.getElementById("create_process").addEventListener("click", () => {
    // ui.kernel.events[ui.kernel.selectedEvent].do
    ui.createProcess();
    ui.start_timer();
})

var modal = document.getElementById("process_popup");
            let span: HTMLElement = document.getElementsByClassName("close")[0] as HTMLElement;
span.onclick = function() {
    modal.style.display = "none";
    ui.display_all();
    ui.start_timer();
}
// window.onclick = function(event) {
//     if (event.target == modal) {
//         modal.style.display = "none";
//     }
// }

// let timerId = setInterval(() => {
//     ui.kernel.advanceClock(false);
//     ui.display_all();
// }, 2000);

// document.getElementById("clock").addEventListener("click", () => {
//     clearInterval(timerId);
// })


