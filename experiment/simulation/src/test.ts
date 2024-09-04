import { Kernel } from "./Kernel";
import { Process } from "./Process";

// const g = 0;
const kernel = new Kernel();
// console.log(`hello ${g}`)
kernel.selectEvent(0)
console.log(kernel.createProcess());
kernel.advanceClock();
// kernel.createProcess();
// kernel.createProcess();
console.log(kernel.getData());
// console.log(kernel.processes)
// console.log(kernel.get_terminatable_procs());
// // kernel.terminate(1);
// console.log(kernel.get_terminatable_procs());
// console.log(kernel.external_events);