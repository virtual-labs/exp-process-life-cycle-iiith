import { UI } from "./UI";
const ui = new UI();
ui.kernel.createProcess();
ui.display_processes();
ui.kernel.createProcess();
ui.display_processes();
ui.kernel.createProcess();
ui.display_processes();
// console.log(kernel.processes)
// console.log(kernel.get_terminatable_procs());
// // kernel.terminate(1);
// console.log(kernel.get_terminatable_procs());
// console.log(kernel.external_events);