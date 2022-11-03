import {Process, initialize_processes} from './helper_functions';

let instruction = document.getElementById("instruction");

instruction.textContent = "No Instruction for now";

let current_time: number = 0;
let processes: Process[] = initialize_processes(6);
let ready: Process[] = [];
let io: Process[] = [];
let completed: Process[] = [];
let cpu_proc: Process | null = null;
let prempt: number = 0;
const cpu_time = 2;

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

let update_io_queue = () => {
  const io_queue = document.querySelector("#io_queue .queue_body");
  io_queue.innerHTML = "";
  io.forEach((process: Process) => {
    const p = document.createElement('p');
    p.textContent = "P" + String(process.id);
    p.classList.add('process');
    io_queue.appendChild(p);
  })
}

let update_complete_pool = () => {
  const complete_pool = document.querySelector("#complete_pool .queue_body");
  complete_pool.innerHTML = "";
  completed.forEach((process: Process) => {
    const p = document.createElement('p');
    p.textContent = "P" + String(process.id);
    p.classList.add('process');
    complete_pool.appendChild(p);
  })
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
  let inst: string = `${current_time} Please Click Advance the clock.`;
  if(completed.length == 6){
    inst = "Well Done! You have completed running all processes."
  }
  else if(processes.length > 0 && processes[0].start_time == current_time){
    inst = `There is a new process P${processes[0].id} request please create it`;
  }
  else if(cpu_proc === null && ready.length > 0) {
    inst = "The CPU is empty. Please select a process in ready queue for execution"
  }
  else if(cpu_proc !== null && cpu_proc.cur_ticks === cpu_proc.io.start_time){
    inst = `The process P${cpu_proc.id} in CPU needs IO. Send it to IO queue by clicking GoTo IO.` 
  }
  else if(cpu_proc !== null && cpu_proc.cur_ticks === cpu_proc.ticks){
    inst = `The process P${cpu_proc.id} in CPU completed its work. Kill it by clicking Kill.` 
  }
  else if(cpu_proc !== null && prempt == cpu_time){
    inst = `The process P${cpu_proc.id} in CPU completed its current cpu time. Prempt it by clicking Prempt.` 
  }
  else {
    // io queue
    let flag: Boolean = false;
    for (let index = 0; index < io.length; index++) {
      if(io[index].io.ticks === 0) {
          inst = `The process P${io[index].id} in IO queue got IO. Collect data and send it to ready queue by clicking Collect.`;
          break; 
      }
    }
  }
  instruction.textContent = inst;
}

let update = () => {
  update_instruction();
  update_ready_queue();
  update_cpu();
  update_io_queue();
  update_complete_pool();
}

update();

document.getElementById("advance_clock").onclick = (event : MouseEvent) => {
  current_time = current_time + 1;
  if(cpu_proc !== null){
    cpu_proc.cur_ticks = cpu_proc.cur_ticks + 1;
    prempt = prempt + 1;
  }
  for (let index = 0; index < io.length; index++) {
    io[index].io.ticks--;
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
  if(cpu_proc !== null && prempt == cpu_time){
    ready.push(cpu_proc);
    cpu_proc = null;
    prempt = 0;
    update();
  }
}

document.getElementById("goto_io").onclick = (event: MouseEvent) => {
  if(cpu_proc !== null && cpu_proc.cur_ticks === cpu_proc.io.start_time){
    io.push(cpu_proc);
    console.log("In Goto IO");
    console.log(cpu_proc);
    cpu_proc = null;
    prempt = 0;
    update();
  }
}

document.getElementById("collect").onclick = (event: MouseEvent) => {
  let process : Process;
  for (let index = 0; index < io.length; index++) {
    if(io[index].io.ticks === 0) {
        process = io[index];
        break; 
    }
  }
  process.io.start_time = -1;
  ready.push(process);
  io = io.filter(proc => proc.id !== process.id);
  update();
}

document.getElementById("kill").onclick = (event: MouseEvent) => {
  if(cpu_proc !== null && cpu_proc.cur_ticks === cpu_proc.ticks){
    completed.push(cpu_proc);
    cpu_proc = null;
    prempt = 0;
    update();
  }
}