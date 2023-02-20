import { initialize_processes } from './helper_functions';
var instruction = document.getElementById("instruction");
instruction.textContent = "No Instruction for now";
var log = [];
var log_ele = document.getElementById("log");
var current_time = 0;
var processes = initialize_processes(6);
var ready = [];
var io = [];
var completed = [];
var cpu_proc = null;
var prempt = 0;
var cpu_time = 2;
function create_process_ui(process) {
    var d = document.createElement('div');
    var p = document.createElement('p');
    p.textContent = "P" + String(process.id);
    d.appendChild(p);
    d.classList.add('process');
    return d;
}
function update_log() {
    var p = document.createElement('p');
    var l = log.length;
    p.textContent = "".concat(l, ". Time: ").concat(current_time, " ").concat(log[l - 1]);
    log_ele.appendChild(p);
}
var update_ready_queue = function () {
    var ready_queue = document.querySelector("#ready_queue .queue_body");
    ready_queue.innerHTML = "";
    ready.forEach(function (process) {
        var d = create_process_ui(process);
        ready_queue.appendChild(d);
        d.style.backgroundColor = "blue";
        d.onclick = function () {
            // check if sending the process to cpu is correct
            if (cpu_proc !== null) {
                instruction.textContent = "Think again! CPU is not empty. There can be only one process running in the CPU.";
                return;
            }
            cpu_proc = process;
            ready = ready.filter(function (proc) { return proc.id !== process.id; });
            log.push("Process P".concat(process.id, " is moved from ready pool to CPU"));
            update();
        };
    });
};
var update_io_queue = function () {
    var io_queue = document.querySelector("#io_queue .queue_body");
    io_queue.innerHTML = "";
    io.forEach(function (process) {
        var d = create_process_ui(process);
        d.style.backgroundColor = "purple";
        if (process.io != null && process.io.ticks === 0) {
            d.style.backgroundColor = "skyblue";
        }
        io_queue.appendChild(d);
        d.onclick = function () {
            if (process.io.ticks !== 0) {
                instruction.textContent = "Think again! The process is not done with IO.";
                return;
            }
            process.io.start_time = -1;
            ready.push(process);
            io = io.filter(function (proc) { return proc.id !== process.id; });
            log.push("Process P".concat(process.id, " is moved from IO pool to ready pool"));
            update();
            // // check if clicking "collect" is valid
            // let flag: Boolean = false;
            // for (let index = 0; index < io.length; index++) {
            //     if (io[index].io != null && io[index].io.ticks === 0) {
            //         flag = true;
            //         break;
            //     }
            // }
            // if (!flag) {
            //     instruction.textContent = `Think again! There is no process in IO pool that has completed IO.`;
            //     return;
            // }
            // let process: Process;
            // for (let index = 0; index < io.length; index++) {
            //     if (io[index].io != null && io[index].io.ticks === 0) {
            //         process = io[index];
            //         break;
            //     }
            // }
            // process.io.start_time = -1;
            // ready.push(process);
            // io = io.filter(proc => proc.id !== process.id);
            // log.push(`Sent the process P${process.id} from IO pool to ready pool`);
            // update();
        };
    });
};
var update_complete_pool = function () {
    var complete_pool = document.querySelector("#complete_pool .queue_body");
    complete_pool.innerHTML = "";
    completed.forEach(function (process) {
        var d = create_process_ui(process);
        d.style.backgroundColor = "black";
        complete_pool.appendChild(d);
    });
};
var update_cpu = function () {
    if (cpu_proc !== null) {
        var cpu_ele = document.querySelector("#cpu .queue_body");
        cpu_ele.innerHTML = "";
        var d = create_process_ui(cpu_proc);
        d.style.backgroundColor = "green";
        if (cpu_proc.io != null && cpu_proc.io.start_time === cpu_proc.cur_ticks) {
            d.style.backgroundColor = "brown";
        }
        else if (cpu_proc.cur_ticks === cpu_proc.ticks) {
            d.style.backgroundColor = "red";
        }
        else if (ready.length > 0 && prempt === cpu_time) {
            d.style.backgroundColor = "gray";
        }
        cpu_ele.appendChild(d);
        d.onclick = function () {
            // if the process needs io
            if (cpu_proc.io != null && cpu_proc.io.start_time === cpu_proc.cur_ticks) {
                io.push(cpu_proc);
                cpu_proc = null;
                prempt = 0;
                log.push("Sent process P".concat(io[io.length - 1].id, " to IO pool"));
                update();
            }
            // if the process is done
            else if (cpu_proc.cur_ticks === cpu_proc.ticks) {
                completed.push(cpu_proc);
                cpu_proc = null;
                prempt = 0;
                log.push("Terminated process P".concat(completed[completed.length - 1].id));
                update();
            }
            // if the process needs to be preempted
            else if (ready.length > 0 && prempt === cpu_time) {
                ready.push(cpu_proc);
                cpu_proc = null;
                prempt = 0;
                log.push("Preempted process P".concat(ready[ready.length - 1].id, ", and put it in ready queue"));
                update();
            }
            // else 
            else {
                instruction.textContent = "Think again! The process is still running in the CPU and doesn't need to be moved.";
            }
        };
    }
    else {
        var cpu_ele = document.querySelector("#cpu .queue_body");
        cpu_ele.innerHTML = "No Process in CPU";
    }
};
var update_instruction = function () {
    var inst = "";
    if (completed.length == 6) {
        inst = "Well Done! You have completed running all processes.";
    }
    else if (processes.length > 0 && processes[0].start_time == current_time) {
        // inst = `There is a create request for a new process P${processes[0].id}`;
        inst = "New Process: P".concat(processes[0].id);
    }
    else if (cpu_proc === null && ready.length > 0) {
        // inst = "The CPU is empty. Please select a process in ready queue for execution";
        inst = "";
    }
    else if (cpu_proc !== null && cpu_proc.io != null && cpu_proc.cur_ticks === cpu_proc.io.start_time) {
        // inst = `The process P${cpu_proc.id} in CPU needs IO.`;
        inst = "";
    }
    else if (cpu_proc !== null && cpu_proc.cur_ticks === cpu_proc.ticks) {
        // inst = `The process P${cpu_proc.id} in CPU hit the termination instruction.`;
        inst = "";
    }
    else if (cpu_proc !== null && ready.length > 0 && prempt == cpu_time) {
        // inst = `The process P${cpu_proc.id} in CPU completed its current cpu time.`;
        inst = "";
    }
    else {
        // io queue
        var flag = false;
        for (var index = 0; index < io.length; index++) {
            if (io[index].io != null && io[index].io.ticks === 0) {
                // inst = `The process P${io[index].id} in IO pool is done with IO.`;
                inst = "";
                flag = true;
                break;
            }
        }
        if (!flag) {
            // inst = `Advance the clock`;
            inst = "Clock Tick";
        }
    }
    instruction.textContent = inst;
};
function update_clock() {
    document.getElementById("clock_val").textContent = String(current_time);
}
function reset_highlighting() {
    document.getElementById("needs-io").style.backgroundColor = "white";
    document.getElementById("needs-preemption").style.backgroundColor = "white";
    document.getElementById("needs-termination").style.backgroundColor = "white";
    document.getElementById("io-complete").style.backgroundColor = "white";
}
function highlight_color_code() {
    var highlight_color = "#FFE4C4";
    reset_highlighting();
    // check if the process in cpu needs io
    if (cpu_proc !== null && cpu_proc.io != null && cpu_proc.cur_ticks === cpu_proc.io.start_time) {
        document.getElementById("needs-io").style.backgroundColor = highlight_color;
    }
    // check if the process in cpu hit the termination instruction
    else if (cpu_proc !== null && cpu_proc.cur_ticks === cpu_proc.ticks) {
        document.getElementById("needs-termination").style.backgroundColor = highlight_color;
    }
    // check if the process in cpu completed its current cpu time
    // used else if because if the process needs io and preemption at the same time, highlight only the io
    else if (cpu_proc !== null && prempt === cpu_time && ready.length > 0) {
        document.getElementById("needs-preemption").style.backgroundColor = highlight_color;
    }
    // check if the process in io pool is done with io
    for (var index = 0; index < io.length; index++) {
        if (io[index].io != null && io[index].io.ticks === 0) {
            document.getElementById("io-complete").style.backgroundColor = highlight_color;
            break;
        }
    }
}
var update = function () {
    update_instruction();
    update_ready_queue();
    update_cpu();
    update_io_queue();
    update_complete_pool();
    update_clock();
    highlight_color_code();
    if (log.length > 0) {
        update_log();
    }
};
update();
document.getElementById("advance_clock").onclick = function () {
    // check if the user has done all the required things before advancing the clock
    if (completed.length == 6) {
        instruction.textContent = "You have completed running all processes. Please refresh the page to start again.";
        return;
    }
    else if (processes.length > 0 && processes[0].start_time == current_time) {
        instruction.textContent = "Think again! There is a create request for the process P".concat(processes[0].id, ".");
        return;
    }
    else if (cpu_proc === null && ready.length > 0) {
        instruction.textContent = "Think again! The CPU is empty.";
        return;
    }
    else if (cpu_proc !== null && cpu_proc.io != null && cpu_proc.cur_ticks === cpu_proc.io.start_time) {
        instruction.textContent = "Think again! The process in CPU needs IO.";
        return;
    }
    else if (cpu_proc !== null && cpu_proc.cur_ticks === cpu_proc.ticks) {
        instruction.textContent = "Think again! The process P".concat(cpu_proc.id, " in CPU hit the termination instruction.");
        return;
    }
    else if (cpu_proc !== null && ready.length > 0 && prempt == cpu_time) {
        instruction.textContent = "Think again! The process P".concat(cpu_proc.id, " in CPU needs to be preempted.");
        return;
    }
    else {
        // io queue
        var flag = false;
        for (var index = 0; index < io.length; index++) {
            if (io[index].io != null && io[index].io.ticks === 0) {
                instruction.textContent = "Think again! The process P".concat(io[index].id, " in IO pool got IO and is waiting to go to ready pool.");
                flag = true;
                break;
            }
        }
        if (flag)
            return;
    }
    current_time = current_time + 1;
    if (cpu_proc !== null) {
        cpu_proc.cur_ticks = cpu_proc.cur_ticks + 1;
        prempt = prempt + 1;
    }
    for (var index = 0; index < io.length; index++) {
        io[index].io.ticks--;
    }
    log.push("Advanced clock to ".concat(current_time));
    update();
};
document.getElementById("create").onclick = function () {
    // check if clicking "create" is valid
    if (processes[0].start_time != current_time) {
        instruction.textContent = "Think again! There is no process ready to be created.";
        return;
    }
    if (processes.length > 0 && processes[0].start_time == current_time) {
        ready.push(processes[0]);
        processes.shift();
        log.push("Created process P".concat(ready[ready.length - 1].id));
        update();
    }
};
// document.getElementById("prempt").onclick = () => {
//     // check if clicking "prempt" is valid
//     if (cpu_proc === null) {
//         instruction.textContent = `Think again! The CPU is empty.`;
//         return;
//     }
//     else if (prempt != cpu_time || ready.length == 0) {
//         instruction.textContent = `Think again! The process P${cpu_proc.id} in CPU doesn't need to be preempted now.`;
//         return;
//     }
//     // if (cpu_proc !== null && prempt == cpu_time) {
//     ready.push(cpu_proc);
//     cpu_proc = null;
//     prempt = 0;
//     log.push(`Preempted process P${ready[ready.length - 1].id}, and put it in ready queue`);
//     update();
//     // }
// }
// document.getElementById("goto_io").onclick = () => {
//     // check if clicking "goto_io" is valid
//     if (cpu_proc === null) {
//         instruction.textContent = `Think again! The CPU is empty.`;
//         return;
//     }
//     else if (cpu_proc.cur_ticks < cpu_proc.io.start_time) {
//         instruction.textContent = `Think again! The process P${cpu_proc.id} in CPU doesn't need IO now.`;
//         return;
//     }
//     if (cpu_proc !== null && cpu_proc.io != null && cpu_proc.cur_ticks === cpu_proc.io.start_time) {
//         io.push(cpu_proc);
//         cpu_proc = null;
//         prempt = 0;
//         log.push(`Sent process P${io[io.length - 1].id} to IO pool`);
//         update();
//     }
// }
// document.getElementById("collect").onclick = () => {
//     // check if clicking "collect" is valid
//     let flag: Boolean = false;
//     for (let index = 0; index < io.length; index++) {
//         if (io[index].io != null && io[index].io.ticks === 0) {
//             flag = true;
//             break;
//         }
//     }
//     if (!flag) {
//         instruction.textContent = `Think again! There is no process in IO pool that has completed IO.`;
//         return;
//     }
//     let process: Process;
//     for (let index = 0; index < io.length; index++) {
//         if (io[index].io != null && io[index].io.ticks === 0) {
//             process = io[index];
//             break;
//         }
//     }
//     process.io.start_time = -1;
//     ready.push(process);
//     io = io.filter(proc => proc.id !== process.id);
//     log.push(`Sent the process P${process.id} from IO pool to ready pool`);
//     update();
// }
// document.getElementById("kill").onclick = () => {
//     // check if clicking "kill" is valid
//     if (cpu_proc === null) {
//         instruction.textContent = `Think again! The CPU is empty.`;
//         return;
//     }
//     else if (cpu_proc.cur_ticks != cpu_proc.ticks) {
//         instruction.textContent = `Think again! The process P${cpu_proc.id} in CPU hasn't hit its termination instruction yet.`;
//         return;
//     }
//     if (cpu_proc !== null && cpu_proc.cur_ticks === cpu_proc.ticks) {
//         completed.push(cpu_proc);
//         cpu_proc = null;
//         prempt = 0;
//         log.push(`Terminated process P${completed[completed.length - 1].id}`);
//         update();
//     }
// }
