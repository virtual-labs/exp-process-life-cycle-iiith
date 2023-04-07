import { Process } from "./Process";
import * as config from "./config"

export function display_pools(processes: Process[], add_to_pool){
    const ready_pool = document.querySelector('#READY .queue_body');
    const io_pool = document.querySelector('#IO .queue_body');
    const cpu = document.querySelector('#CPU .queue_body');
    const terminated_pool = document.querySelector('#COMPLETED .queue_body');

    ready_pool.innerHTML = "";
    io_pool.innerHTML = "";
    cpu.innerHTML = "";
    terminated_pool.innerHTML = "";

    for(let i=0; i < processes.length; i++){
        let p = processes[i];
        if(p.state === config.READY)
            add_to_pool(p, this.ready_pool);
        else if(p.state === config.RUNNING)
            add_to_pool(p, this.cpu);
        else if(p.state === config.BLOCKED)
            add_to_pool(p, this.io_pool);
        else if(p.state === config.TERMINATED)
            add_to_pool(p, this.terminated_pool);
    }
}

function is_ex_paused(){
    return document.getElementById("start").childNodes[0].nodeValue !== "Pause";
}

export function initialize_pools(process_dragover_handler, process_drop_handler) {
    const ready_pool = document.querySelector('#READY .queue_body');
    const io_pool = document.querySelector('#IO .queue_body');
    const cpu = document.querySelector('#CPU .queue_body');
    const terminated_pool = document.querySelector('#COMPLETED .queue_body');

    ready_pool.addEventListener("dragover", process_dragover_handler);
    io_pool.addEventListener("dragover", process_dragover_handler);
    cpu.addEventListener("dragover", process_dragover_handler);
    terminated_pool.addEventListener("dragover", process_dragover_handler);
    
    ready_pool.addEventListener("drop", process_drop_handler);
    io_pool.addEventListener("drop", process_drop_handler);
    cpu.addEventListener("drop", process_drop_handler);
    terminated_pool.addEventListener("drop", process_drop_handler);
}