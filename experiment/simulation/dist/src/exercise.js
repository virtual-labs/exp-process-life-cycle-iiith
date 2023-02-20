import { initialize_processes } from './helper_functions';
var instruction = document.getElementById("instruction");
instruction.textContent = "No Instruction for now";
var isWrong = false;
var wrongMovePos = -1;
var whatIsWrong = "";
var log = [];
var log_ele = document.getElementById("log");
var current_time = 0;
var processes = initialize_processes(6);
var ready = [];
var io = [];
var completed = [];
var cpu_proc = null;
var prempt = 0;
var cpu_time = 3;
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
                if (!isWrong) {
                    whatIsWrong = "You have sent the process P".concat(process.id, " to CPU while CPU is not empty.");
                }
                wrong_move();
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
    }
    else {
        var cpu_ele = document.querySelector("#cpu .queue_body");
        cpu_ele.innerHTML = "No Process in CPU";
    }
};
function result() {
    if (isWrong) {
        return "Incorrect. Your first major mistake is at ".concat(wrongMovePos + 1, "th move.") + whatIsWrong;
    }
    else {
        return "Well Done! You have successfully completed running all the processes using correct context switches.";
    }
}
var update_instruction = function () {
    var inst = "";
    if (completed.length == 6) {
        inst = result();
    }
    else if (processes.length > 0 && processes[0].start_time == current_time) {
        inst = "There is a create request for a new process P".concat(processes[0].id);
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
    else if (cpu_proc !== null && prempt == cpu_time) {
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
            inst = "Advance the Clock";
        }
    }
    instruction.textContent = inst;
};
function update_clock() {
    document.getElementById("clock_val").textContent = String(current_time);
}
var update = function () {
    update_instruction();
    update_ready_queue();
    update_cpu();
    update_io_queue();
    update_complete_pool();
    update_clock();
    if (log.length > 0) {
        update_log();
    }
    console.log(log);
};
update();
function wrong_move() {
    if (!isWrong) {
        isWrong = true;
        wrongMovePos = log.length;
        console.log(wrongMovePos);
    }
}
document.getElementById("advance_clock").onclick = function () {
    // check if the user has done all the required things before advancing the clock
    if (completed.length == 6) {
        alert("You have completed running all processes. Please refresh the page to start again.");
        return;
    }
    else if (processes.length > 0 && processes[0].start_time == current_time) {
        if (!isWrong) {
            whatIsWrong = "You did not create the new process before advancing the clock.";
        }
        wrong_move();
    }
    else if (cpu_proc === null && ready.length > 0) {
        if (!isWrong) {
            whatIsWrong = "The CPU was empty. You did not select a process in ready pool for execution before advancing the clock.";
        }
        wrong_move();
    }
    else if (cpu_proc !== null && cpu_proc.io != null && cpu_proc.cur_ticks === cpu_proc.io.start_time) {
        if (!isWrong) {
            whatIsWrong = "The process in CPU needed IO. You did not send it to IO pool before advancing the clock.";
        }
        wrong_move();
    }
    else if (cpu_proc !== null && cpu_proc.cur_ticks === cpu_proc.ticks) {
        if (!isWrong) {
            whatIsWrong = "The process P".concat(cpu_proc.id, " in CPU hit the termination instruction. You did not terminate it before advancing the clock.");
        }
        wrong_move();
    }
    else if (cpu_proc !== null && prempt == cpu_time) {
        if (!isWrong) {
            whatIsWrong = "The process P".concat(cpu_proc.id, " in CPU needed to be preempted. You did not preempt it before advancing the clock.");
        }
        wrong_move();
    }
    else {
        // io queue
        // let flag: Boolean = false;
        for (var index = 0; index < io.length; index++) {
            if (io[index].io != null && io[index].io.ticks === 0) {
                if (!isWrong) {
                    whatIsWrong = "The process P".concat(io[index].id, " in IO pool got IO. You did not send it to ready pool before advancing the clock.");
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
    for (var index = 0; index < io.length; index++) {
        io[index].io.ticks--;
    }
    log.push("Advanced clock to ".concat(current_time));
    update();
};
document.getElementById("create").onclick = function () {
    // check if clicking "create" is valid
    if (processes[0].start_time != current_time) {
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
        log.push("Created process P".concat(ready[ready.length - 1].id));
        update();
    }
};
document.getElementById("prempt").onclick = function () {
    // check if clicking "prempt" is valid
    if (cpu_proc === null) {
        // if (!isWrong) {
        //     whatIsWrong = "You clicked \"Prempt\" when the CPU was empty.";
        // }
        // wrong_move();
        instruction.textContent = "The CPU is empty. There is no process to preempt.";
        return;
    }
    else if (prempt != cpu_time) {
        if (!isWrong) {
            whatIsWrong = "The process P".concat(cpu_proc.id, " in CPU has not completed its current cpu time. You did not wait for it to complete before preempting it.");
        }
        wrong_move();
        // return;
    }
    // if (cpu_proc !== null && prempt == cpu_time) {
    ready.push(cpu_proc);
    cpu_proc = null;
    prempt = 0;
    log.push("Preempted process P".concat(ready[ready.length - 1].id, ", and put it in ready queue"));
    update();
    // }
};
document.getElementById("goto_io").onclick = function () {
    // check if clicking "goto_io" is valid
    if (cpu_proc === null) {
        instruction.textContent = "The CPU is empty. There is no process to send to IO.";
        return;
    }
    else if (cpu_proc.cur_ticks < cpu_proc.io.start_time) {
        if (!isWrong) {
            whatIsWrong = "The process P".concat(cpu_proc.id, " in CPU did not need IO. But you sent it to IO pool.");
        }
        wrong_move();
        // return;
    }
    // if (cpu_proc !== null && cpu_proc.cur_ticks === cpu_proc.io.start_time) {
    io.push(cpu_proc);
    cpu_proc = null;
    prempt = 0;
    log.push("Sent process P".concat(io[io.length - 1].id, " to IO pool"));
    update();
    // }
};
document.getElementById("collect").onclick = function () {
    // check if clicking "collect" is valid
    if (io.length === 0) {
        instruction.textContent = "The IO pool is empty. There is no process to send to Ready Pool.";
        return;
    }
    var process;
    var flag = false;
    for (var index = 0; index < io.length; index++) {
        if (io[index].io != null && io[index].io.ticks === 0) {
            flag = true;
            process = io[index];
            break;
        }
    }
    if (!flag) {
        if (!isWrong) {
            whatIsWrong = "There was no process in IO pool that had completed IO. You did not wait for it to complete before sending it to ready pool.";
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
    io = io.filter(function (proc) { return proc.id !== process.id; });
    log.push("Sent the process P".concat(process.id, " from IO pool to ready pool"));
    update();
};
document.getElementById("kill").onclick = function () {
    // check if clicking "kill" is valid
    if (cpu_proc === null) {
        alert("There is no process in CPU to terminate.");
        return;
    }
    else if (cpu_proc.cur_ticks != cpu_proc.ticks) {
        if (!isWrong) {
            whatIsWrong = "You terminated the process P".concat(cpu_proc.id, " in CPU before it hit its termination instruction.");
        }
        wrong_move();
        // return;
    }
    // if (cpu_proc !== null && cpu_proc.cur_ticks === cpu_proc.ticks) {
    completed.push(cpu_proc);
    cpu_proc = null;
    prempt = 0;
    log.push("Terminated process P".concat(completed[completed.length - 1].id));
    update();
    // }
};
