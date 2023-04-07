import { is_ex_paused } from "./src/helper_functions";


export function display_clock(ticks: number) {
    let clock = document.getElementById("clock");
    let clock_span = document.getElementById("clock_val");
    clock_span.innerHTML = ticks.toString();
    if(ticks !== 0 && is_ex_paused())
        clock_span.innerHTML += " (Paused)";
}
