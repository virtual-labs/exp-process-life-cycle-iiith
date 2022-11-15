import { Process, initialize_processes } from './helper_functions';

let instruction = document.getElementById("instruction");

instruction.textContent = "No Instruction for now";

let isWrong: Boolean = false;
let wrongMovePos: number = -1;
let whatIsWrong: string = "";
let log: string[] = [];

const log_ele = document.getElementById("log");

let current_time: number = 0;
let processes: Process[] = initialize_processes(6);
// console.log(processes);
let ready: Process[] = [];
let io: Process[] = [];
let completed: Process[] = [];
let cpu_proc: Process | null = null;
let prempt: number = 0;
const cpu_time = 3;

function create_process_ui(process: Process): HTMLDivElement {
    const d = document.createElement('div');
    let p = document.createElement('p');
    p.textContent = "P" + String(process.id);
    d.appendChild(p);
    // let p2 = document.createElement('p');
    // p2.textContent = "Remaining Time: " + String(process.ticks - process.cur_ticks);
    // d.appendChild(p2);
    d.classList.add('process');
    return d;
}

function update_log() {
    // log_ele.innerHTML = "";
    // log.forEach((log: string) => {
    //     const p = document.createElement('p');
    //     p.textContent = log;
    //     log_ele.appendChild(p);
    // })
    const p = document.createElement('p');
    const l = log.length;
    p.textContent = `${l}. Time: ${current_time} ${log[l - 1]}`;
    log_ele.appendChild(p);
}

let update_ready_queue = () => {
    const ready_queue = document.querySelector("#ready_queue .queue_body");
    ready_queue.innerHTML = "";
    ready.forEach((process: Process) => {
        // const p = document.createElement('p');
        // p.textContent = "P" + String(process.id);
        // p.classList.add('process');
        const d = create_process_ui(process);
        ready_queue.appendChild(d);
        d.style.backgroundColor = "blue";
        d.onclick = (event: MouseEvent) => {
            // check if sending the process to cpu is correct
            if (cpu_proc !== null) {
                if (!isWrong) {
                    whatIsWrong = `You have sent the process P${process.id} to CPU while CPU is not empty.`;
                }
                wrong_move();
            }
            
            // console.log("hello eswar")
            cpu_proc = process;
            ready = ready.filter(proc => proc.id !== process.id);
            log.push(`Process P${process.id} is moved from ready pool to CPU`);
            update();
        }
    });
}

let update_io_queue = () => {
    const io_queue = document.querySelector("#io_queue .queue_body");
    io_queue.innerHTML = "";
    io.forEach((process: Process) => {
        // const p = document.createElement('p');
        // p.textContent = "P" + String(process.id);
        // p.classList.add('process');
        const d = create_process_ui(process);
        d.style.backgroundColor = "gray";
        if (process.io != null && process.io.ticks === 0) {
            d.style.backgroundColor = "yellow";
        }
        io_queue.appendChild(d);
    })
}

let update_complete_pool = () => {
    const complete_pool = document.querySelector("#complete_pool .queue_body");
    complete_pool.innerHTML = "";
    completed.forEach((process: Process) => {
        // const p = document.createElement('p');
        // p.textContent = "P" + String(process.id);
        // p.classList.add('process');
        const d = create_process_ui(process);
        d.style.backgroundColor = "black";
        complete_pool.appendChild(d);
    })
}


let update_cpu = () => {
    if (cpu_proc !== null) {
        // console.log("pora yedava");
        const cpu_ele = document.querySelector("#cpu .queue_body");
        cpu_ele.innerHTML = "";
        // const p = document.createElement('p');
        // p.textContent = "P" + String(cpu_proc.id);
        // p.classList.add('process');
        const d = create_process_ui(cpu_proc);
        d.style.backgroundColor = "green";
        if (cpu_proc.io != null && cpu_proc.io.start_time === cpu_proc.cur_ticks) {
            d.style.backgroundColor = "gray";
        }
        else if (cpu_proc.cur_ticks === cpu_proc.ticks) {
            d.style.backgroundColor = "black";
        }
        else if (ready.length > 0 && prempt === cpu_time) {
            d.style.backgroundColor = "blue";
        }
        cpu_ele.appendChild(d);
    }
    else {
        const cpu_ele = document.querySelector("#cpu .queue_body");
        cpu_ele.innerHTML = "No Process in CPU";
    }
}

function result(): string {
    if (isWrong) {
        return `Incorrect. Your first major mistake is at ${wrongMovePos + 1}th move.` + whatIsWrong;
    }
    else {
        return "Well Done! You have successfully completed running all the processes using correct context switches.";
    }
}

let update_instruction = () => {
    let inst: string = `Advance the clock`;
    if (completed.length == 6) {
        inst = result();
    }
    else if (processes.length > 0 && processes[0].start_time == current_time) {
        inst = `There is a create request for a new process P${processes[0].id}`;
    }
    else if (cpu_proc === null && ready.length > 0) {
        // inst = "The CPU is empty. Please select a process in ready queue for execution";
        inst = "";
    }
    else if (cpu_proc !== null && cpu_proc.io != null && cpu_proc.cur_ticks === cpu_proc.io.start_time) {
        inst = `The process P${cpu_proc.id} in CPU needs IO.`;
    }
    else if (cpu_proc !== null && cpu_proc.cur_ticks === cpu_proc.ticks) {
        inst = `The process P${cpu_proc.id} in CPU hit the termination instruction.`;
    }
    else if (cpu_proc !== null && prempt == cpu_time) {
        inst = `The process P${cpu_proc.id} in CPU completed its current cpu time.`;
    }
    else {
        // io queue
        let flag: Boolean = false;
        for (let index = 0; index < io.length; index++) {
            if (io[index].io != null && io[index].io.ticks === 0) {
                inst = `The process P${io[index].id} in IO pool is done with IO.`;
                break;
            }
        }
    }
    instruction.textContent = inst;
}

function update_clock() {
    document.getElementById("clock_val").textContent = String(current_time);
}

let update = () => {
    update_instruction();
    update_ready_queue();
    update_cpu();
    update_io_queue();
    update_complete_pool();
    update_clock();
    if(log.length > 0) {
        update_log();
    }
    console.log(log);
}

update();

function wrong_move(): void {
    if (!isWrong) {
        isWrong = true;
        wrongMovePos = log.length;
        console.log(wrongMovePos);
    }
}

document.getElementById("advance_clock").onclick = (event: MouseEvent) => {
    // check if the user has done all the required things before advancing the clock
    if (completed.length == 6) {
        alert("You have completed running all processes. Please refresh the page to start again.");
        return;
    }
    else if (processes.length > 0 && processes[0].start_time == current_time) {
        // alert("Please create the new process before advancing the clock.");
        if (!isWrong) {
            whatIsWrong = "You did not create the new process before advancing the clock.";
        }
        wrong_move();
    }
    else if (cpu_proc === null && ready.length > 0) {
        // alert("The CPU is empty. Please select a process in ready queue for execution");
        if (!isWrong) {
            whatIsWrong = "The CPU was empty. You did not select a process in ready pool for execution before advancing the clock.";
        }
        wrong_move();
    }
    else if (cpu_proc !== null && cpu_proc.io != null && cpu_proc.cur_ticks === cpu_proc.io.start_time) {
        // alert("The process in CPU needs IO. Please send it to IO queue by clicking IO.");
        if (!isWrong) {
            whatIsWrong = "The process in CPU needed IO. You did not send it to IO pool before advancing the clock.";
        }
        wrong_move();
    }
    else if (cpu_proc !== null && cpu_proc.cur_ticks === cpu_proc.ticks) {
        // alert("The process in CPU completed its work. Please send it to complete pool by clicking Complete.");
        if (!isWrong) {
            whatIsWrong = `The process P${cpu_proc.id} in CPU hit the termination instruction. You did not terminate it before advancing the clock.`;
        }
        wrong_move();
    }
    else if (cpu_proc !== null && prempt == cpu_time) {
        // alert("The process in CPU completed its current cpu time. Please send it to ready queue by clicking Prempt.");
        if (!isWrong) {
            whatIsWrong = `The process P${cpu_proc.id} in CPU needed to be preempted. You did not preempt it before advancing the clock.`;
        }
        wrong_move();
    }
    else {
        // io queue
        // let flag: Boolean = false;
        for (let index = 0; index < io.length; index++) {
            if (io[index].io != null && io[index].io.ticks === 0) {
                // alert(`The process P${io[index].id} in IO queue got IO. Please collect data and send it to ready queue by clicking Collect.`);
                if (!isWrong) {
                    whatIsWrong = `The process P${io[index].id} in IO pool got IO. You did not send it to ready pool before advancing the clock.`;
                }
                wrong_move();
                // flag = true;
                break;
            }
        }
        // if (flag) return;
    }

    current_time = current_time + 1;
    if (cpu_proc !== null) {
        cpu_proc.cur_ticks = cpu_proc.cur_ticks + 1;
        prempt = prempt + 1;
    }
    for (let index = 0; index < io.length; index++) {
        io[index].io.ticks--;
    }
    log.push(`Advanced clock to ${current_time}`);
    update();
}

document.getElementById("create").onclick = () => {
    // check if clicking "create" is valid
    if (processes[0].start_time != current_time) {
        // alert("There is no process that is ready to be created.");
        // if (!isWrong) {
        //     whatIsWrong = "You clicked \"Create\" when there was no process ready to be created.";
        // }
        // wrong_move();
        instruction.textContent = "There is no process that is ready to be created.";
        return;
    }

    if (processes.length > 0 && processes[0].start_time == current_time) {
        ready.push(processes[0]);
        processes.shift();
        log.push(`Created process P${ready[ready.length - 1].id}`);
        update();
    }
}

document.getElementById("prempt").onclick = () => {
    // check if clicking "prempt" is valid
    if (cpu_proc === null) {
        // alert("The CPU is empty. There is no process to preempt.");
        // if (!isWrong) {
        //     whatIsWrong = "You clicked \"Prempt\" when the CPU was empty.";
        // }
        // wrong_move();
        instruction.textContent = "The CPU is empty. There is no process to preempt.";
        return;
    }
    else if (prempt != cpu_time) {
        // alert("The process in CPU has not completed its current cpu time. Please wait for it to complete.");
        if (!isWrong) {
            whatIsWrong = `The process P${cpu_proc.id} in CPU has not completed its current cpu time. You did not wait for it to complete before preempting it.`;
        }
        wrong_move();
        // return;
    }

    // if (cpu_proc !== null && prempt == cpu_time) {
    ready.push(cpu_proc);
    cpu_proc = null;
    prempt = 0;
    log.push(`Preempted process P${ready[ready.length - 1].id}, and put it in ready queue`);
    update();
    // }
}

document.getElementById("goto_io").onclick = () => {
    // check if clicking "goto_io" is valid
    if (cpu_proc === null) {
        // alert("The CPU is empty. There is no process to send to IO.");
        instruction.textContent = "The CPU is empty. There is no process to send to IO.";
        return;
    }
    else if (cpu_proc.io != null && cpu_proc.cur_ticks != cpu_proc.io.start_time) {
        // alert("The process in CPU doesn't need IO now.");
        if (!isWrong) {
            whatIsWrong = `The process P${cpu_proc.id} in CPU did not need IO. But you sent it to IO pool.`;
        }
        wrong_move();
        // return;
    }

    // if (cpu_proc !== null && cpu_proc.cur_ticks === cpu_proc.io.start_time) {
    io.push(cpu_proc);
    // console.log("In Goto IO");
    // console.log(cpu_proc);
    cpu_proc = null;
    prempt = 0;
    log.push(`Sent process P${io[io.length - 1].id} to IO pool`);
    update();
    // }
}

document.getElementById("collect").onclick = () => {
    // check if clicking "collect" is valid
    if (io.length === 0) {
        // alert("The IO pool is empty. There is no process to send to Ready Pool.");
        instruction.textContent = "The IO pool is empty. There is no process to send to Ready Pool.";
        return;
    }

    let process: Process;
    let flag: Boolean = false;
    for (let index = 0; index < io.length; index++) {
        if (io[index].io != null && io[index].io.ticks === 0) {
            flag = true;
            process = io[index];
            break;
        }
    }
    if (!flag) {
        // alert("There is no process in IO pool that has completed IO.");
        if (!isWrong) {
            whatIsWrong = `There was no process in IO pool that had completed IO. You did not wait for it to complete before sending it to ready pool.`;
        }
        wrong_move();
        process = io[0]; // send the first process if none of the process has completed IO
        // return;
    }

    // for (let index = 0; index < io.length; index++) {
    //     if (io[index].io.ticks === 0) {
    //         process = io[index];
    //         break;
    //     }
    // }
    process.io.start_time = -1;
    ready.push(process);
    io = io.filter(proc => proc.id !== process.id);
    log.push(`Sent the process P${process.id} from IO pool to ready pool`);
    update();
}

document.getElementById("kill").onclick = (event: MouseEvent) => {
    // check if clicking "kill" is valid
    if (cpu_proc === null) {
        alert("There is no process in CPU to terminate.");
        return;
    }
    else if (cpu_proc.cur_ticks != cpu_proc.ticks) {
        // alert("The process in CPU has not hit its termination instruction yet.");
        if (!isWrong) {
            whatIsWrong = `You terminated the process P${cpu_proc.id} in CPU before it hit its termination instruction.`;
        }
        wrong_move();
        // return;
    }

    // if (cpu_proc !== null && cpu_proc.cur_ticks === cpu_proc.ticks) {
    completed.push(cpu_proc);
    cpu_proc = null;
    prempt = 0;
    log.push(`Terminated process P${completed[completed.length - 1].id}`);
    update();
    // }
}
