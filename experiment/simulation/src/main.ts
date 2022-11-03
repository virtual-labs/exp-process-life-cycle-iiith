import {Process, initialize_processes} from './helper_functions';

let instruction = document.getElementById("instruction");

instruction.textContent = "No Instruction for now";

let current_time: number = 0;
let processes: Process[] = initialize_processes(6);
let ready: Process[] = [];
let io_queue: Process[] = [];
let completed: Process[] = initialize_processes(6);
let cpu_proc: Process | null = null;
let prempt: number = 0;

let update_ready_queue = () => {
  const ready_queue = document.querySelector("#ready_queue .queue_body");
  ready_queue.innerHTML = "";
  ready.forEach((process:Process) => {
    const p = document.createElement('p');
    p.textContent = "P" + String(process.id);
    p.classList.add('process');
    ready_queue.appendChild(p);
    p.onclick = (event: MouseEvent) => {
      console.log("hello eswar")
      cpu_proc = process;
      ready = ready.filter(proc => proc.id !== process.id);
      update();
    }
  });
}

let update_cpu = () => {
  if(cpu_proc !== null){
    console.log("pora yedava");
    const cpu_ele = document.querySelector("#cpu .queue_body");
    cpu_ele.innerHTML = "";
    const p = document.createElement('p');
    p.textContent = "P" + String(cpu_proc.id);
    p.classList.add('process');
    cpu_ele.appendChild(p);
  }
  else {
    const cpu_ele = document.querySelector("#cpu .queue_body");
    cpu_ele.innerHTML = "No Process in CPU";
  }
}

let update_instruction = () => {
  let inst: string = `${current_time} No instruction for now`;
  if(processes.length > 0 && processes[0].start_time == current_time){
    inst = `${current_time} There is a new process P${processes[0].id} request please create it`;
  }
  else if(cpu_proc !== null && cpu_proc.cur_ticks === cpu_proc.io.start_time){
    inst = `${current_time} The process P${cpu_proc.id} in CPU needs IO. Send it to IO queue by clicking GoTo IO.` 
  }
  instruction.textContent = inst;
}

let update = () => {
  update_instruction();
  update_ready_queue();
  update_cpu();
}

update();

document.getElementById("advance_clock").onclick = (event : MouseEvent) => {
  current_time = current_time + 1;
  if(cpu_proc !== null){
    cpu_proc.cur_ticks = cpu_proc.cur_ticks + 1;
    prempt = prempt + 1;
  }
  update();
}

document.getElementById("create").onclick = (event: MouseEvent) => {
  if(processes.length > 0 && processes[0].start_time == current_time){
    ready.push(processes[0]);
    processes.shift();
    update();
  }
}

document.getElementById("prempt").onclick = (event: MouseEvent) => {
  if(cpu_proc !== null){
    ready.push(cpu_proc);
    cpu_proc = null;
    update();
  }
}

document.getElementById("goto_io").onclick = (event: MouseEvent) => {
  if(cpu_proc !== null && cpu_proc.cur_ticks === cpu_proc.io.start_time){
    io_queue.push(cpu_proc);
    cpu_proc = null;
    update_cpu();
  }
}