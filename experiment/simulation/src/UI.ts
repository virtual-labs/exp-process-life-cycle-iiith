import { Event } from "./Event";
import { IResponce, Kernel } from "./Kernel";
import { Process } from "./Process";
import * as config from "./config";
import Driver from "driver.js";
import { descriptions } from "./descriptions";
const html2canvas = require("html2canvas");
// require('jspdf-autotable');
import autoTable from "jspdf-autotable";
import Chart from "chart.js";
// import material/dialog
// import { MDCDialog } from "@material/dialog";
// import { MDCRipple } from "@material/ripple";


export { UI };
class UI {
  kernel: Kernel;
  timerId: NodeJS.Timer;
  ready_pool: HTMLElement;
  io_pool: HTMLElement;
  cpu: HTMLElement;
  terminated_pool: HTMLElement;
  timer_paused: Boolean;

  descriptions: Map<string, Driver.Step>;
  imperatives: Map<string, Driver.Step>;
  drivers: Map<string, Driver>;

  constructor() {
    const data = localStorage.getItem("data");
    this.kernel = new Kernel();
    if (data !== null) this.kernel.setData(JSON.parse(data));
    // this.start_timer();
    this.timer_paused = true;


    if(!this.isPractice()) {
      document.getElementById("log").style.display="none";
      document.getElementById("moves").style.display="none";
  }

    if (this.kernel.clock > 0)
      document.getElementById("start").childNodes[0].textContent = "Resume";

    this.ready_pool = document.querySelector("#READY .queue_body");
    this.io_pool = document.querySelector("#IO .queue_body");
    this.cpu = document.querySelector("#CPU .queue_body");
    this.terminated_pool = document.querySelector("#COMPLETED .queue_body");

    this.timerId = null;

    this.initialize_events();
    this.initialize_accordion();

    this.imperatives = this.imperatives_map();
    // this.main_tour();
    // this.information_popover("#event_queue");
  }

  is_ex_paused() {
    return document.getElementById("start").childNodes[0].nodeValue !== "Pause";
  }

  start_timer() {
    if (this.timerId === null && this.kernel.selectedEvent === -1) {
      this.timerId = setInterval(() => {
        this.kernel.advanceClock(false);
        this.display_all();
      }, 2000);
    }
  }

  end_timer() {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  toggle_timer() {
    if (this.timer_paused === true) {
      this.start_timer();
      this.timer_paused = false;
      console.log("Timer Started.");
    } else {
      this.end_timer();
      this.timer_paused = true;
      console.log("Timer Paused.");
    }
  }

  // private functions
  console_display() {
    // console.log(this.kernel.getData());
    console.log(this.kernel.wrongMoves);
    return;
    // console.log("Proceeses");
    // for(let i = 0; i < this.kernel.processes.length; i++) {
    //     console.log(this.kernel.processes[i]);
    // }
    // // console.log("")
    // for(let i = 0; i < this.kernel.events.length; i++) {
    //     console.log(this.kernel.events[i]);
    // }
    // console.log(this.kernel)
  }
  add_to_pool(p: Process, pool: HTMLElement) {
    // create a div for process inside pool
    let process_div = document.createElement("div");
    process_div.classList.add("process");
    process_div.draggable = true;
    process_div.id = "Process" + p.pid.toString();
    process_div.innerHTML = p.name;
    // add event listeners

    let process_dragstart_handler = (event) => {
      if (this.is_ex_paused()) return;
      // console.log(event.target.id);

      if (this.kernel.selectedEvent === -1) this.end_timer();
      console.log("hello" + this.kernel.selectedEvent);
      event.dataTransfer.dropEffect = "move";
      event.dataTransfer.setData("text/plain", event.target.id);
    };

    let process_dragend_handler = (event: DragEvent) => {
      if (this.is_ex_paused()) return;
      this.start_timer();
      // this.toggle_timer();
    };

    process_div.addEventListener("dragstart", process_dragstart_handler);
    process_div.addEventListener("dragend", process_dragend_handler);

    // process_div.addEventListener("click", () => {
    //     this.end_timer();
    //     this.kernel.selectedProcess = p.pid;
    //     var modal = document.getElementById("process_popup");
    //     let span: HTMLElement = document.getElementsByClassName("close")[0] as HTMLElement;
    //     modal.style.display = "block";
    // });
    pool.appendChild(process_div);
  }
  add_to_events_queue(e: Event) {
    if (e.state === config.DONE || e.state === config.KILLED) return;
    let events = document.getElementById("all_events");
    let event_div = e.createElement();
    // let event_div = document.createElement("div");
    // event_div.classList.add("event");
    event_div.id = "Event" + e.id.toString();
    if (this.kernel.selectedEvent === e.id) {
      event_div.classList.add("selected");
    }
    // if(e.name === config.IONEEDED || e.name === config.IODONE || e.name === config.TERMINATE){
    //     event_div.innerHTML = e.name + " " + e.pid.toString();
    // }
    // else {
    //     event_div.innerHTML = e.name;
    // }
    // event_div.onclick = () => {
    //     console.log("Hello Akshay");
    // }
    event_div.addEventListener("click", () => {
      if (this.is_ex_paused()) return;
      if (this.kernel.selectedEvent === e.id) {
        this.kernel.selectEvent(-1);
        // this.start_timer();
        // this.toggle_timer();
        this.start_timer();
      } else {
        this.end_timer();
        this.kernel.selectEvent(e.id);
      }

      // if(e.name == "REQUESTPROC"){
      //     this.end_timer();
      //     var modal = document.getElementById("create_process_popup");
      //     let span: HTMLElement = document.getElementsByClassName("close")[1] as HTMLElement;
      //     modal.style.display = "block";
      //     span.onclick = function() {
      //         modal.style.display = "none";
      //     }
      //     window.onclick = function(event) {
      //         if (event.target == modal) {
      //             modal.style.display = "none";
      //         }
      //     }
      //     this.kernel.selectEvent(-1);
      // }
      this.display_all();
    });
    events.appendChild(event_div);
  }

  ///////////////////////////////

  update_clock() {
    return this.kernel.advanceClock();
  }
  createProcess() {
    // this.kernel.selectEvent(0);
    const res = this.kernel.createProcess();
    this.display_all();
    return res;
  }
  display_clock() {
    let clock = document.getElementById("clock");
    let clock_span = document.getElementById("clock_val");
    clock_span.innerHTML = this.kernel.clock.toString();
    if (this.kernel.clock !== 0 && this.is_ex_paused())
      clock_span.innerHTML += " (Paused)";
    else if(this.kernel.selectedEvent !== -1){
      clock_span.classList.add("clock_paused");
    }
    else {
      clock_span.classList.remove("clock_paused");
    }
  }
  display_processes() {
    // clear all pools
    let processes = document.getElementsByClassName("process");
    while (processes.length > 0) {
      processes[0].remove();
    }

    for (let i = 0; i < this.kernel.processes.length; i++) {
      let p = this.kernel.processes[i];
      if (p.state === config.READY) this.add_to_pool(p, this.ready_pool);
      else if (p.state === config.RUNNING) this.add_to_pool(p, this.cpu);
      else if (p.state === config.BLOCKED) this.add_to_pool(p, this.io_pool);
      else if (p.state === config.TERMINATED)
        this.add_to_pool(p, this.terminated_pool);
    }
    // console.log(this.kernel.processes);
    // console.log(config.cpu)
    // console.log(this.cpu);
    // cons1ole.log(this.kernel.getData());
  }
  display_events() {
    // remove all events
    let events_list = document.getElementsByClassName("event");
    while (events_list.length > 0) {
      events_list[0].remove();
    }
    // add events
    for (let i = 0; i < this.kernel.events.length; i++) {
      let e = this.kernel.events[i];
      this.add_to_events_queue(e);
    }
    if (this.kernel.selectedEvent !== -1) {
      let e = document.getElementById(
        "Event" + this.kernel.selectedEvent.toString()
      );
      e.classList.add("selected");
      // e.remove();
    }
  }

  display_theory() {
    let theory = document.getElementById("theory");
    theory.innerHTML = "";

    // dialog box for theory using @material/dialog with button
    let dialog = document.createElement("dialog");
    dialog.classList.add("mdl-dialog");
    dialog.style.width = "800px";
    dialog.style.height = "620px";
    let title = document.createElement("h6");
    title.classList.add("mdl-dialog__title");
    title.innerText = "What is a process?";
    let content = document.createElement("div");
    content.classList.add("mdl-dialog__content");
    content.innerHTML = "<p>In computing, a process is an instance of a computer program that is being executed by a computer's operating system (OS). A process consists of the program's code and its current activity, such as the values of its variables, the state of its I/O channels, and its position in memory.</p><br /><p>Processes are managed by the operating system, which allocates resources such as CPU time, memory, and I/O devices to each process as needed. The OS also provides mechanisms for inter-process communication, synchronization, and coordination.</p><br /><p>Each process is assigned a unique identifier, known as a process ID (PID), which can be used to identify and manage the process. The operating system maintains a process table that stores information about each running process, such as its PID, its priority, and its resource usage.</p><br /><p>In a multitasking operating system, multiple processes may be running simultaneously, sharing the system resources. The OS schedules the execution of these processes, switching between them rapidly to give the illusion of parallel execution. This allows multiple programs to be run concurrently, which can improve the overall performance of the system.</p><br />";
    let actions = document.createElement("div");
    actions.classList.add("mdl-dialog__actions");
    let close = document.createElement("button");
    close.classList.add("mdl-button");
    close.classList.add("close");
    close.innerText = "Close";
    close.addEventListener("click", () => {
        dialog.close();
        }
    );
    actions.appendChild(close);
    dialog.appendChild(title);
    dialog.appendChild(content);
    dialog.appendChild(actions);
    theory.appendChild(dialog);

    // button to open dialog box
    let button = document.createElement("button");
    button.classList.add("mdl-button");
    button.classList.add("mdl-js-button");
    button.classList.add("mdl-button--raised");
    button.classList.add("mdl-button--colored");
    button.innerText = title.innerText;
    button.addEventListener("click", () => {
        dialog.showModal();
    }
    );
    theory.appendChild(button);
  }

  display_theory2() {
    let theory = document.getElementById("theory2");
    theory.innerHTML = "";

    // dialog box for theory using @material/dialog with button
    let dialog = document.createElement("dialog");
    dialog.classList.add("mdl-dialog");
    dialog.style.width = "800px";
    dialog.style.height = "620px";
    let title = document.createElement("h6");
    title.classList.add("mdl-dialog__title");
    title.innerText = "What are process states?";
    // add a blank line
    let br = document.createElement("br");
    let content = document.createElement("div");
    content.classList.add("mdl-dialog__content");
    content.innerHTML = "<p>As a process is executed, it undergoes a series of state changes that reflect the activity being performed by the user and the resources needed by the process. The specific states and their corresponding names can vary between different operating systems and literature sources, as they are not standardized. Nonetheless, the process state provides crucial information about the current status of a process and is used by the operating system to manage resources and scheduling.</p><p>The 4 main and most common states the process can exist as are:</p><ul><li>Ready: A process in the ready state is one that is waiting to be executed by the CPU, but is currently not running. The process is waiting for the CPU to allocate resources to it, and is typically waiting in a queue for its turn to run.</li><li>Running: When a process is executing instructions on the CPU, it is in the running state. At any given time, there may be only one process in the running state on a single CPU.</li><li>Waiting : If the process is in this state then it is waiting for either resources that it has requested for or waiting for a specific event to occur so that it can go back to ready state and wait for dispatching The process is not using the CPU during this time and may be waiting for an indefinite period.</li><li>Terminated: When a process has completed its execution or has been terminated by the operating system or by the user, it is in the terminated state. The process may still have some resources allocated to it, but it is no longer running.</li></ul>";
    let actions = document.createElement("div");
    actions.classList.add("mdl-dialog__actions");
    let close = document.createElement("button");
    close.classList.add("mdl-button");
    close.classList.add("close");
    close.innerText = "Close";
    close.addEventListener("click", () => {
        dialog.close();
        }
    );
    actions.appendChild(close);
    dialog.appendChild(title);
    dialog.appendChild(br);
    dialog.appendChild(content);
    dialog.appendChild(actions);
    theory.appendChild(dialog);

    // button to open dialog box
    let button = document.createElement("button");
    button.classList.add("mdl-button");
    button.classList.add("mdl-js-button");
    button.classList.add("mdl-button--raised");
    button.classList.add("mdl-button--colored");
    
    button.innerText = title.innerText;
    button.addEventListener("click", () => {
        dialog.showModal();
    }
    );
    theory.appendChild(button);
  }

  display_graph1() {
    let theory = document.getElementById("graph1");
    theory.innerHTML = "";

    let dialog = document.createElement("dialog");
    dialog.classList.add("mdl-dialog");
    dialog.style.width = "650px";
    dialog.style.height = "520px";

    let title = document.createElement("h6");
    title.classList.add("mdl-dialog__title");
    title.style.width = "100%";
    title.style.height = "50px";
  
    title.innerText = "Wrong Moves vs Time";
    let content = document.createElement("div");
    content.classList.add("mdl-dialog__content");

    // put content center aligned
    content.style.textAlign = "center";

    let lineChart = document.createElement("canvas");
    lineChart.id = "lineChart";
    lineChart.width = 450;
    lineChart.height = 350;
    let ctx = lineChart.getContext("2d");

    let move = []
    for (let i = 0; i < this.kernel.clock; i++) {
      // check if kernel.moves array has a entry with time=i
      let temp;
      Array.from(this.kernel.moves.values()).map((val) => {
        if(val.time == i){
          temp = val;
        }
      });
      let move_ith;
      if(temp) {
        move_ith = {
          moveMade: temp.moveMade,
          validNum: temp.validNum,
          time: i,
          pid: temp.pid,
        }
      } else {
        move_ith = {
          moveMade: "No move was made",
          validNum: 0,
          time: i,
          pid: -1,
        }
      }
      move.push(move_ith);
    }

    let myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: move.map((val) => val.time),
        datasets: [
          {
            // label: "Wrong move",
            data: move.map((val) => val.validNum),
            backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)"],
            pointBackgroundColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
            pointBorderColor: "#fff",
            pointRadius : 7,
            fill: false,
            tension: 0.1,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              min: -1,
              max: 1,
              stepSize: 1,
              callback: function(value, index, values) {
                if (value === 0 || value === 1 || value === -1) {
                  return value.toString();
                } else {
                  return "";
                }
              }
            }
          }]
        },
        tooltips: {
          enabled: true,
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function(tooltipItem, data) {
              var value = move[tooltipItem.index].moveMade;
              if(move[tooltipItem.index].pid != -1) {
                return `Process with ID ${move[tooltipItem.index].pid} was moved from ${value}.`
              }
              return value;
            }
          }
        },
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            usePointStyle: true,
            generateLabels: function() {
              const legendLabels = [];
              legendLabels.push({
                text: "Valid move",
                fillStyle: "rgba(54, 162, 235, 1)",
                strokeStyle: "rgba(54, 162, 235, 1)",
                lineWidth: 2,
                pointStyle: 'circle',
                hidden: false
              });

              legendLabels.push({
                text: "Wrong move",
                fillStyle: "rgba(255, 99, 132, 1)",
                strokeStyle: "rgba(255, 99, 132, 1)",
                lineWidth: 2,
                pointStyle: 'circle',
                hidden: false
              });
              
              legendLabels.push({
                text: "No move",
                fillStyle: "rgb(228, 208, 10, 1)",
                strokeStyle: "rgb(228, 208, 10, 1)",
                lineWidth: 2,
                pointStyle: 'circle',
                hidden: false,
              });
      
              return legendLabels;
            }
          },
        },
        responsive: false,
        maintainAspectRatio: false,
      },
    });

    // show blue color points for data values 1 and red points for value 0
    myChart.data.datasets[0].pointBackgroundColor = myChart.data.datasets[0].data.map(
      (val) => (val === 1 ? "rgba(54, 162, 235, 1)" : (val === 0 ? "rgb(228, 208, 10, 1)" : "rgba(255, 99, 132, 1)"))
    );
    myChart.update();
    myChart.data.datasets[0].pointRadius = myChart.data.datasets[0].data.map(
      (val) => (val === 1 ? 7 : (val === 0 ? 4 : 7))
    );
    myChart.update();
    content.appendChild(lineChart);
    let actions = document.createElement("div");
    actions.classList.add("mdl-dialog__actions");
    let close = document.createElement("button");
    close.classList.add("mdl-button");
    close.classList.add("close");
    close.innerText = "Close";
    close.addEventListener("click", () => {
        dialog.close();
        }
    );
    actions.appendChild(close);
    dialog.appendChild(title);
    dialog.appendChild(content);
    dialog.appendChild(actions);
    theory.appendChild(dialog);

    // create a &#9432; button inside the button
    let graphinfo = document.createElement("span");
    graphinfo.classList.add("mdl-tooltip");
    graphinfo.setAttribute("data-mdl-for", "graph1");
    graphinfo.innerText = "This graph shows the wrong moves made by the user in the current session against time.";
    graphinfo.style.width = "300px";
    graphinfo.style.height = "110px";
    graphinfo.style.fontSize = "16px";
    graphinfo.style.lineHeight = "1.3";

    // button to open dialog box
    let button = document.createElement("button");
    button.classList.add("mdl-button");
    button.innerText = `Wrong Moves: ${this.kernel.wrongMoves}    📊`;
    button.addEventListener("click", () => {
        dialog.showModal();
    }
    );
    button.appendChild(graphinfo);
    theory.appendChild(button);
    // theory.appendChild(graphinfo);
  }

  display_graph2() {
    let theory = document.getElementById("graph2");
    theory.innerHTML = "";

    // dialog box for theory using @material/dialog with button
    let dialog = document.createElement("dialog");
    dialog.classList.add("mdl-dialog");
    // increase size of the dialog box
    dialog.style.width = "650px";
    dialog.style.height = "520px";

    let title = document.createElement("h5");
    title.classList.add("mdl-dialog__title");
    title.innerText = "Average Event Wait Time vs Time";
    title.style.width = "100%";
    title.style.height = "50px";
    let content = document.createElement("div");
    content.classList.add("mdl-dialog__content");

    let lineChart = document.createElement("canvas");
    lineChart.id = "lineChart";
    lineChart.width = 350;
    lineChart.height = 350;
    let ctx = lineChart.getContext("2d");
    let myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: Array.from(this.kernel.cummAvgEvntWaitTime.keys()).map((val) => val + 1),
        datasets: [
          {
            label: "Average Event Wait Time",
            data: this.kernel.cummAvgEvntWaitTime,
            backgroundColor: ["rgba(255, 99, 132, 0.2)"],
            borderColor: ["rgba(255, 99, 132, 1)"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        // graph size
        responsive: false,
        maintainAspectRatio: false,

        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
    content.appendChild(lineChart);
    
    let actions = document.createElement("div");
    actions.classList.add("mdl-dialog__actions");
    let close = document.createElement("button");
    close.classList.add("mdl-button");
    close.classList.add("close");
    close.innerText = "Close";
    close.addEventListener("click", () => {
        dialog.close();
        }
    );
    actions.appendChild(close);
    dialog.appendChild(title);
    dialog.appendChild(content);
    dialog.appendChild(actions);
    theory.appendChild(dialog);

    let graphinfo = document.createElement("span");
    graphinfo.classList.add("mdl-tooltip");
    graphinfo.setAttribute("data-mdl-for", "graph2");
    graphinfo.innerText = "This graph shows the average event wait time throughout the session.";
    graphinfo.style.width = "300px";
    graphinfo.style.height = "100px";
    graphinfo.style.fontSize = "16px";
    graphinfo.style.lineHeight = "1.3";

    // button to open dialog box
    let button = document.createElement("button");
    button.classList.add("mdl-button");
    // button.classList.add("mdl-js-button");
    // button.classList.add("mdl-button--raised");
    // button.classList.add("mdl-button--colored");
    if(!this.isPractice()) return;
    button.innerText = `Average Event Wait time: ${this.kernel.getAverageWaitTime()}    📊`;
    button.addEventListener("click", () => {
        dialog.showModal();
    }
    );
    theory.appendChild(button);
    button.appendChild(graphinfo);
  }

  display_graph3() {
    let theory = document.getElementById("graph3");
    theory.innerHTML = "";

    let dialog = document.createElement("dialog");
    dialog.classList.add("mdl-dialog");
    // increase size of the dialog box
    dialog.style.width = "680px";
    dialog.style.height = "520px";

    let title = document.createElement("h6");
    title.classList.add("mdl-dialog__title");
    title.innerText = "Cumulative CPU Idle Time vs Time";
    title.style.width = "100%";
    title.style.height = "50px";
    let content = document.createElement("div");
    content.classList.add("mdl-dialog__content");

    let lineChart = document.createElement("canvas");
    lineChart.id = "lineChart";
    lineChart.width = 350;
    lineChart.height = 350;
    let ctx = lineChart.getContext("2d");
    let myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: Array.from(this.kernel.cummCPUIdle.keys()).map((val) => val + 1),
        datasets: [
          {
            label: "Cumulative CPU Idle Time",
            data: this.kernel.cummCPUIdle,
            backgroundColor: ["rgba(255, 99, 132, 0.2)"],
            borderColor: ["rgba(255, 99, 132, 1)"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        // graph size
        responsive: false,
        maintainAspectRatio: false,

        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
    content.appendChild(lineChart);
    
    let actions = document.createElement("div");
    actions.classList.add("mdl-dialog__actions");
    let close = document.createElement("button");
    close.classList.add("mdl-button");
    close.classList.add("close");
    close.innerText = "Close";
    close.addEventListener("click", () => {
        dialog.close();
        }
    );
    actions.appendChild(close);
    dialog.appendChild(title);
    dialog.appendChild(content);
    dialog.appendChild(actions);
    theory.appendChild(dialog);

    let graphinfo = document.createElement("span");
    graphinfo.classList.add("mdl-tooltip");
    graphinfo.setAttribute("data-mdl-for", "graph3");
    graphinfo.innerText = "This graph shows the CPU Idle time between the time intervals.";
    graphinfo.style.width = "300px";
    graphinfo.style.height = "100px";
    graphinfo.style.fontSize = "16px";
    graphinfo.style.lineHeight = "1.3";

    if(!this.isPractice()) return;
    // button to open dialog box
    let button = document.createElement("button");
    button.classList.add("mdl-button");
    // button.classList.add("mdl-js-button");
    // button.classList.add("mdl-button--raised");
    // button.classList.add("mdl-button--colored");
    button.innerText = `Cumulative CPU Idle time: ${this.kernel.cpuIdle}     📊`;
    button.addEventListener("click", () => {
        dialog.showModal();
    }
    );

    button.appendChild(graphinfo);
    theory.appendChild(button);
  }

  display_graph4() {
    let theory = document.getElementById("graph4");
    theory.innerHTML = "";

    // dialog box for theory using @material/dialog with button
    let dialog = document.createElement("dialog");
    dialog.classList.add("mdl-dialog");
    // increase size of the dialog box
    dialog.style.width = "650px";
    dialog.style.height = "520px";

    let title = document.createElement("h6");
    title.classList.add("mdl-dialog__title");
    title.innerText = "Cumulative CPU IO Idle Time vs Time";
    title.style.width = "100%";
    title.style.height = "50px";
    let content = document.createElement("div");
    content.classList.add("mdl-dialog__content");

    let lineChart = document.createElement("canvas");
    lineChart.id = "lineChart";
    lineChart.width = 350;
    lineChart.height = 350;
    let ctx = lineChart.getContext("2d");
    let myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: Array.from(this.kernel.cummCPUIOWaitTime.keys()).map((val) => val + 1),
        datasets: [
          {
            label: "Cumulative CPU IO Time",
            data: this.kernel.cummCPUIOWaitTime,
            backgroundColor: ["rgba(255, 99, 132, 0.2)"],
            borderColor: ["rgba(255, 99, 132, 1)"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        // graph size
        responsive: false,
        maintainAspectRatio: false,

        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
    content.appendChild(lineChart);
    
    let actions = document.createElement("div");
    actions.classList.add("mdl-dialog__actions");
    let close = document.createElement("button");
    close.classList.add("mdl-button");
    close.classList.add("close");
    close.innerText = "Close";
    close.addEventListener("click", () => {
        dialog.close();
        }
    );
    actions.appendChild(close);
    dialog.appendChild(title);
    dialog.appendChild(content);
    dialog.appendChild(actions);
    theory.appendChild(dialog);

    let graphinfo = document.createElement("span");
    graphinfo.classList.add("mdl-tooltip");
    graphinfo.setAttribute("data-mdl-for", "graph4");
    graphinfo.innerText = "This graph shows the CPU IO time between the time intervals.";
    graphinfo.style.width = "300px";
    graphinfo.style.height = "100px";
    graphinfo.style.fontSize = "16px";
    graphinfo.style.lineHeight = "1.3";

    if(!this.isPractice()) return;2

    // button to open dialog box
    let button = document.createElement("button");
    button.classList.add("mdl-button");
    // button.classList.add("mdl-js-button");
    // button.classList.add("mdl-button--raised");
    // button.classList.add("mdl-button--colored");
    button.innerText = `Cumulative CPU IO Idle time: ${this.kernel.getCPUIOWaitTime()}      📊`;
    button.addEventListener("click", () => {
        dialog.showModal();
    }
    );
    button.appendChild(graphinfo);
    theory.appendChild(button);
  }

  display_theory3() {
    let theory = document.getElementById("theory3");
    theory.innerHTML = "";

    // dialog box for theory using @material/dialog with button
    let dialog = document.createElement("dialog");
    dialog.classList.add("mdl-dialog");
    dialog.style.width = "800px";
    dialog.style.height = "620px";
    let title = document.createElement("h6");
    title.classList.add("mdl-dialog__title");
    title.innerText = "Comparison with acutal OS";
    // add a blank line
    let br = document.createElement("br");
    let content = document.createElement("div");
    content.classList.add("mdl-dialog__content");
    content.innerHTML = "<div><p></p><p>The experiment defines four states that a process can be in. Those being Running, Waiting, Using IO Resources and finally Terminated. Let us contrast this with the running of an actual Operating System such as Linux. The Linux OS defines five states that a process can be in which are</p><ul><li>Running or Runnable (R)<p>A running process is actively allocated to a CPU core and affects the CPU utilization metrics. A runnable process is ready and lined up to run</p></li></ul><ul><li>Uninterruptible Sleep (D)<p>The Uninterruptible state is mostly used by device drivers waiting for disk or network I/O. The process will wake only if a waited upon resource becomes available or the process times out (Time Out has to be specified at process creation)</p></li></ul><ul><li>Interruptable Sleep (S)<p>An Interruptible sleep state means the process is waiting either for a particular time slot or for a particular event to occur</p></li></ul><ul><li>Stopped (T)<p>Processes can end when they call the exit system themselves or receive signals to end. When a process runs the exit system call, it releases its data structures, but it does not release its slot in the process table. Instead, it sends a SIGCHLD signal to the parent. It is up to the parent process to release the child process slot so that the parent can determine if the process exited successfully</p></li></ul><ul><li>Zombie (Z)<p>Between the time when the process terminates and the parent releases the child process, the child enters into what is referred to as a Zombie state. A process can remain in a Zombie state if the parent process should die before it has a chance to release the process slot of the child process</p></li></ul><p>Drawing comparisons between the experiment and a real life OS such as Linux we can see that a process is in the Running state in both the scenarios when actively using CPU resources. The experiment model adds a Waiting state which the Linux OS categorises as a Runnable process, although does not establish any hard distinction. A process which is waiting for I/O resources enters Uninterruptible Sleep in Linux. A Terminated process in the experiment parallels a process in the Stopped state in Linux</p><p>Using the uptime command in the Linux Shell we can see the load average values of the CPU where the load value measures CPU Utilisation at any time.</p><pre><code>uptime 17:02:14 up  4:50,  1 user,  load average: 0.94, 0.73, 0.63</code></pre><p>The three values seen are load values averaged over 1 minute, 5 minute and 15 minute intervals respectively. We can draw detailed comparisons between how the experiment performs vs Linux OS using the above.</p></div>";
    let actions = document.createElement("div");
    actions.classList.add("mdl-dialog__actions");
    let close = document.createElement("button");
    close.classList.add("mdl-button");
    close.classList.add("close");
    close.innerText = "Close";
    close.addEventListener("click", () => {
        dialog.close();
        }
    );
    actions.appendChild(close);
    dialog.appendChild(title);
    dialog.appendChild(br);
    dialog.appendChild(content);
    dialog.appendChild(actions);
    theory.appendChild(dialog);

    // button to open dialog box
    let button = document.createElement("button");
    button.classList.add("mdl-button");
    button.classList.add("mdl-js-button");
    button.classList.add("mdl-button--raised");
    button.classList.add("mdl-button--colored");
    
    button.innerText = title.innerText;
    button.addEventListener("click", () => {
        dialog.showModal();
    }
    );
    theory.appendChild(button);
  }
  

  display_intro() {
    let intro1 = document.getElementById("intro1");
    intro1.innerHTML = "";
    let dialog = document.createElement("dialog");
    dialog.classList.add("mdl-dialog");
    let title = document.createElement("h6");
    title.classList.add("mdl-dialog__title");
    title.innerText = "Objective";
    let content = document.createElement("div");
    content.classList.add("mdl-dialog__content");
    content.innerHTML = "<ul><p> Our objective in this experiment is to understand the life cycle of a process as managed by an operating system. The experiment provides you with the apparatus to observe and control the processes as needed. </p </ul>";
    let actions = document.createElement("div");
    actions.classList.add("mdl-dialog__actions");
    let close = document.createElement("button");
    close.classList.add("mdl-button");
    close.classList.add("close");
    close.innerText = "Close";
    close.addEventListener("click", () => {
        dialog.close();
        }
    );
    actions.appendChild(close);
    dialog.appendChild(title);
    dialog.appendChild(content);
    dialog.appendChild(actions);
    intro1.appendChild(dialog);

    // button to open dialog box
    let button = document.createElement("button");
    button.classList.add("mdl-button");
    button.classList.add("mdl-js-button");
    button.classList.add("mdl-button--raised");
    button.classList.add("mdl-button--colored");
    button.innerText = 'Objective';
    button.addEventListener("click", () => {
        dialog.showModal();
    }
    );
    intro1.appendChild(button);
  }

  display_intro2() {
    let intro1 = document.getElementById("intro2");
    intro1.innerHTML = "";
    let dialog = document.createElement("dialog");
    dialog.classList.add("mdl-dialog");
    let title = document.createElement("h6");
    title.classList.add("mdl-dialog__title");
    title.innerText = "Intuition";
    let content = document.createElement("div");
    content.classList.add("mdl-dialog__content");
    content.innerHTML = " Act in response to Events <p> You are to observe the events that arrive in the events queue, and respond to them with an appropriate action so as to manage the processes in an efficient manner, as per the process state model discussed in theory.</p>";
    let actions = document.createElement("div");
    actions.classList.add("mdl-dialog__actions");
    let close = document.createElement("button");
    close.classList.add("mdl-button");
    close.classList.add("close");
    close.innerText = "Close";
    close.addEventListener("click", () => {
        dialog.close();
        }
    );
    actions.appendChild(close);
    dialog.appendChild(title);
    dialog.appendChild(content);
    dialog.appendChild(actions);
    intro1.appendChild(dialog);

    // button to open dialog box
    let button = document.createElement("button");
    button.classList.add("mdl-button");
    button.classList.add("mdl-js-button");
    button.classList.add("mdl-button--raised");
    button.classList.add("mdl-button--colored");
    button.innerText = 'Intuition';
    button.addEventListener("click", () => {
        dialog.showModal();
    }
    );
    intro1.appendChild(button);
  }

  display_intro3() {
    let intro1 = document.getElementById("intro3");
    intro1.innerHTML = "";
    let dialog = document.createElement("dialog");
    dialog.classList.add("mdl-dialog");
    let title = document.createElement("h6");
    title.classList.add("mdl-dialog__title");
    title.innerText = "Apparatus";
    let content = document.createElement("div");
    content.classList.add("mdl-dialog__content");
    content.innerHTML = "<ol> <li>Events Queue</li><li>CPU</li><li>Ready Pool</li><li>I/O Pool</li><li>Terminated Processes Bin</li> </ol>";
    let actions = document.createElement("div");
    actions.classList.add("mdl-dialog__actions");
    let close = document.createElement("button");
    close.classList.add("mdl-button");
    // change colour of close button
    close.classList.add("close");
    close.innerText = "Close";
    close.addEventListener("click", () => {
        dialog.close();
        }
    );
    actions.appendChild(close);
    dialog.appendChild(title);
    dialog.appendChild(content);
    dialog.appendChild(actions);
    intro1.appendChild(dialog);

    // button to open dialog box
    let button = document.createElement("button");
    button.classList.add("mdl-button");
    button.classList.add("mdl-js-button");
    button.classList.add("mdl-button--raised");
    button.classList.add("mdl-button--colored");
    button.innerText = 'Apparatus';
    button.addEventListener("click", () => {
        dialog.showModal();
    }
    );
    intro1.appendChild(button);
  }


  display_procedure() {
    let procedure = document.getElementById("procedure");
    procedure.innerHTML = "";

    // dialog box for procedure using @material/dialog with button
    let dialog = document.createElement("dialog");
    dialog.classList.add("mdl-dialog");
    dialog.style.width = "600px";
    dialog.style.height = "400px";
    let title = document.createElement("h6");
    title.classList.add("mdl-dialog__title");
    title.innerText = "What are the components?";
    let content = document.createElement("div");
    content.classList.add("mdl-dialog__content");
    content.innerHTML = "<p>We have 7 components:</p>    <ul>    <li>Instruction box</li>    <li>Ready pool: Where the live processes will be placed</li>    <li>CPU: where the process in execution is placed</li>    <li>I/O pool: where the process will go if the process has any I/O calls.</li>    <li>Completed pool: This is where all the completed processes are placed.</li>    <li>Controls: This is where all the buttons that the you can play with are placed.</li>    <li>Log: Where all actions on the process get recorded</li>    </ul>";
    let actions = document.createElement("div");
    actions.classList.add("mdl-dialog__actions");
    let close = document.createElement("button");
    close.classList.add("mdl-button");
    close.classList.add("close");
    close.innerText = "Close";
    close.addEventListener("click", () => {
        dialog.close();
        }
    );
    actions.appendChild(close);
    dialog.appendChild(title);
    dialog.appendChild(content);
    dialog.appendChild(actions);
    procedure.appendChild(dialog);

    // button to open dialog box
    let button = document.createElement("button");
    button.classList.add("mdl-button");
    button.classList.add("mdl-js-button");
    button.classList.add("mdl-button--raised");
    button.classList.add("mdl-button--colored");
    button.innerText = title.innerText;
    button.addEventListener("click", () => {
        dialog.showModal();
    }
    );
    procedure.appendChild(button);
  }
  display_procedure2() {
    let procedure = document.getElementById("procedure2");
    procedure.innerHTML = "";

    // dialog box for procedure using @material/dialog with button
    let dialog = document.createElement("dialog");
    dialog.classList.add("mdl-dialog");
    dialog.style.width = "600px";
    dialog.style.height = "400px";
    let title = document.createElement("h6");
    title.classList.add("mdl-dialog__title");
    title.innerText = "What are the controls?";
    let content = document.createElement("div");
    content.classList.add("mdl-dialog__content");
    content.innerHTML = "<p>We have 6 controls:</p>    <ul>    <li>Create Process and put it in Ready Pool</li>    <li>CPU to Ready Pool</li>    <li>CPU to IO Pool</li>    <li>IO Pool to Ready Pool</li>    <li>Terminate the Process in CPU</li>    <li>Advance Clock</li>    </ul>";
    let actions = document.createElement("div");
    actions.classList.add("mdl-dialog__actions");
    let close = document.createElement("button");
    close.classList.add("mdl-button");
    close.classList.add("close");
    close.innerText = "Close";
    close.addEventListener("click", () => {
        dialog.close();
        }
    );
    actions.appendChild(close);
    dialog.appendChild(title);
    dialog.appendChild(content);
    dialog.appendChild(actions);
    procedure.appendChild(dialog);

    // button to open dialog box
    let button = document.createElement("button");
    button.classList.add("mdl-button");
    button.classList.add("mdl-js-button");
    button.classList.add("mdl-button--raised");
    button.classList.add("mdl-button--colored");
    button.innerText = title.innerText;
    button.addEventListener("click", () => {
        dialog.showModal();
    }
    );
    procedure.appendChild(button);
  }

  display_procedure3() {
    let procedure = document.getElementById("procedure3");
    procedure.innerHTML = "";

    // dialog box for procedure using @material/dialog with button
    let dialog = document.createElement("dialog");
    dialog.classList.add("mdl-dialog");
    dialog.style.width = "600px";
    dialog.style.height = "400px";
    let title = document.createElement("h6");
    title.classList.add("mdl-dialog__title");
    title.innerText = "Steps of the simulator";
    let content = document.createElement("div");
    content.classList.add("mdl-dialog__content");
    content.innerHTML = "Coming Soon...";
    let actions = document.createElement("div");
    actions.classList.add("mdl-dialog__actions");
    let close = document.createElement("button");
    close.classList.add("mdl-button");
    close.classList.add("close");
    close.innerText = "Close";
    close.addEventListener("click", () => {
        dialog.close();
        }
    );
    actions.appendChild(close);
    dialog.appendChild(title);
    dialog.appendChild(content);
    dialog.appendChild(actions);
    procedure.appendChild(dialog);

    // button to open dialog box
    let button = document.createElement("button");
    button.classList.add("mdl-button");
    button.classList.add("mdl-js-button");
    button.classList.add("mdl-button--raised");
    button.classList.add("mdl-button--colored");
    button.innerText = title.innerText;
    button.addEventListener("click", () => {
        dialog.showModal();
    }
    );
    procedure.appendChild(button);
  }


  display_analytics() {
    if(!this.isPractice()){
      console.log("Display Anallytics");
      return;
    }
    let analytics = document.getElementById("analytics");
    analytics.innerHTML = "";
    let wm = document.createElement("li");
    wm.innerText = `Total Wrong Moves: ${this.kernel.wrongMoves}`;
    let aet = document.createElement("li");
    aet.innerText = `Average Event Wait time: ${this.kernel.getAverageWaitTime()}`;
    let cpuIdle = document.createElement("li");
    cpuIdle.innerText = `Cumulative CPU Idle time: ${this.kernel.cpuIdle}`;
    let cpuIOIdle = document.createElement("li");
    cpuIOIdle.innerText = `Cumulative CPU IO Idle time: ${this.kernel.getCPUIOWaitTime()}`;

    // analytics.appendChild(wm);
    // analytics.appendChild(aet);
    // analytics.appendChild(cpuIdle);
    // analytics.appendChild(cpuIOIdle);
    // analytics.appendChild(lineChart);
    // analytics.appendChild(lineChart1);
  }

  display_log() { 
    let html = `<thead><tr><th>t<sub>e</sub></th><th>Event</th>
        <th>t<sub>r</sub></th><th>Action</th></tr></thead><tbody>`;
    for (let index = 0; index < this.kernel.log.records.length; index++) {
      const element = this.kernel.log.records[index];
      let action = "";
      if (element.event < 0) {
        html += `<tr><td>NA</td><td>NA</td>
                <td>${element.responce_time}</td><td>moveProcess(${
          -element.event - 1
        }, CPU)</td></tr>`;
      } else {
        const e = this.kernel.events[element.event];
        if (e.name === config.REQUESTPROC) action = `createProcess(${e.pid})`;
        else if (e.name === config.IONEEDED)
          action = `moveProcess(${e.pid}, ${config.IO})`;
        else if (e.name === config.IODONE)
          action = `moveProcess(${e.pid}, ${config.READY})`;
        else if (e.name === config.TERMINATE)
          action = `moveProcess(${e.pid}, ${config.COMPLETED})`;
        html += `<tr><td>${e.time}</td><td>${e.name}(${e.pid})</td>
                <td>${element.responce_time}</td><td>${action}</td></tr>`;
      }
    }
    html += '</tbody';
    let log = document.getElementById("log");
    log.innerHTML = html;

    // console.log(log.childElementCount);
  }

  display_moves() {
    let log = document.getElementById("moves");
    let html = `<thead><tr><th>time</th><th>source</th><th>dest</th>
        <th>pid</th><th>valid</th></tr></thead><tbody>`;
    for (let index = 0; index < this.kernel.moves.length; index++) {
      const element = this.kernel.moves[index];
      html += `<tr><td>${element.time}</td><td>${element.source}</td>
                <td>${element.dest}</td><td>${element.pid}</td><td>${element.valid}</td></tr>`;
    }
    log.innerHTML = html + `</tbody>`;

    // console.log(log.childElementCount);
  }

  isPractice(){
    return window.location.href.split("/").slice(-1)[0] === "practice.html";
  }

  display_all() {
    localStorage.setItem("data", JSON.stringify(this.kernel.getData()));
    this.display_clock();
    this.display_processes();
    this.display_events();
    this.display_log();
    this.display_moves();
    this.display_graph1();
    this.display_graph2();
    this.display_graph3();
    this.display_graph4();
    this.display_analytics();
    
    this.update_accordion();
    this.display_intro();
    this.display_intro2();
    this.display_intro3();
    this.display_theory();
    this.display_theory2();
    this.display_theory3();
    this.display_procedure();
    this.display_procedure2();
    this.display_procedure3();
    this.console_display();
    if (
      this.kernel.selectedEvent !== -1 &&
      this.kernel.events[this.kernel.selectedEvent].name === config.REQUESTPROC
    )
      document.getElementById("create_process").style.visibility = "visible";
    else document.getElementById("create_process").style.visibility = "hidden";
    // this.console_display();
  }

  showDialog(message: string) {
    if(!this.isPractice()) return;
    const dialogBox = document.createElement("p");
    dialogBox.textContent = message;
    const inst = document.getElementById("instruction");
    // inst.innerHTML = "";
    inst.appendChild(dialogBox);
    setTimeout(() => {
      inst.removeChild(dialogBox);
    }, 10000);
  }

  initialize_events() {
    document.getElementById("toggle_accordion").addEventListener("click", (event) => {
      let button = document.getElementById("toggle_accordion");
      if(button.innerText.trim() === "Close accordion") {
        button.innerText = "Open accordion";
        document.querySelector(".instructions_panel").classList.add("none_display");
      }
      else {
        button.innerText = "Close accordion";
        document.querySelector(".instructions_panel").classList.remove("none_display");
      }
    })

    let process_drop_handler = (event) => {
      if (this.is_ex_paused()) return;
      event.preventDefault();
      const data = event.dataTransfer.getData("text/plain");
      console.log(data);

      console.log("Process Drop Handler");

      let bin = event.target.parentNode.id;
      let dropped_pid = +data.split("s")[2]; // Split data = ["proce", "", "<id>"]
      let dropped_process = this.kernel.processes[dropped_pid];

      let response = this.kernel.moveProcess(dropped_pid, bin);
      if (response.status === config.ERROR) {
        // alert("Error: " + response.message);
        this.showDialog(response.message);
      }
      this.display_all();
    };

    // let process_dragstart_handler = (event) => {
    //     this.end_timer();
    //     this.display_all();
    // }

    // let process_dragend_handler = (event) => {
    //     this.start_timer();
    //     this.display_all();
    // }

    let process_dragover_handler = (event: DragEvent) => {
      if (this.is_ex_paused()) return;
      event.preventDefault();
      // event.dataTransfer.dropEffect = "move";

      console.log("Drag Over");

      // if (this.kernel.selectedEvent === -1)
      //     this.end_timer();
    };

    // document.querySelectorAll('.process').forEach((element) => {
    //     element.addEventListener("dragstart", process_dragstart_handler);
    //     element.addEventListener("dragend", process_dragend_handler);
    // })

    this.ready_pool.addEventListener("dragover", process_dragover_handler);
    this.io_pool.addEventListener("dragover", process_dragover_handler);
    this.cpu.addEventListener("dragover", process_dragover_handler);
    this.terminated_pool.addEventListener("dragover", process_dragover_handler);

    this.ready_pool.addEventListener("drop", process_drop_handler);
    this.io_pool.addEventListener("drop", process_drop_handler);
    this.cpu.addEventListener("drop", process_drop_handler);
    this.terminated_pool.addEventListener("drop", process_drop_handler);

    document.getElementById("init_tour").addEventListener("click", (e) => {
      setTimeout(() => {
        this.main_tour();
      });
    });

    // let start_button_handler = () => {
    //     this.toggle_timer();

    //     // let button_text = document.getElementById("start").childNodes[0].nodeValue;
    //     if (!this.timer_paused) {
    //         document.getElementById("start")
    //             .childNodes[0].nodeValue = "Pause";

    //     }
    //     else {
    //         document.getElementById("start")
    //             .childNodes[0].nodeValue = "Start";
    //     }

    // };
    let pause_driver = new Driver({
      animate: true,
      allowClose: false,
      overlayClickNext: false,
      padding: 0,
    });

    let start_button_handler = () => {
      const val = document.getElementById("start").childNodes[0].nodeValue.trim();
      // const val = event.target.childNodes[0].nodeValue;
      if (val === "Start" || val === "Resume") {
        document.getElementById("start").childNodes[0].nodeValue = "Pause";
        this.display_all();
        this.start_timer();
        // pause_driver.reset();
      } else {
        document.getElementById("start").childNodes[0].nodeValue = "Resume";
        this.display_all();
        this.end_timer();
        //pause_driver.highlight("#start");
      }
    };


    let reset_button_handler = () => {
      // start_button_handler(); // XXX: Pass instance of the appropriate Event Type
      // The start_button_handler starts the timer, so keep the stop_timer logic after it.

      this.kernel.reset();
      this.timer_paused = false;
      document.getElementById("start").childNodes[0].nodeValue = "Start";
      // this.toggle_timer();
      this.end_timer();
      this.display_all();
    };

    let formatDate = () => {
      const date = new Date();
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = String(date.getFullYear());
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${day}${month}${year}_${hours}${minutes}${seconds}`;
    };
    let finish_button_handler = () => {
      const { jsPDF } = require("jspdf"); // will automatically load the node version
      const confirmed: boolean = window.confirm(
        "Do you want to download your analytics ?"
      );
      if (confirmed) {
        // User clicked OK
        const doc = new jsPDF();
        doc.setFontSize(25);
        doc.text("Process Life Cycle Student Report", 35, 20);
        doc.setFontSize(10);
        doc.text(`Timestamp: ${Date()}`, 20, 30);
        doc.setFontSize(15);
        doc.text(`1. Wrong Moves: ${this.kernel.wrongMoves}`, 20, 50);
        doc.text(
          `2. Average Event Wait time: ${this.kernel.getAverageWaitTime()}`,
          20,
          60
        );
        doc.text(`3. CPU Idle time: ${this.kernel.cpuIdle}`, 20, 70);
        doc.text(
          `4. CPU IO Wait time: ${this.kernel.getCPUIOWaitTime()}`,
          20,
          80
        );
        doc.text("Observation Table", 20, 90);
        autoTable(doc, { html: "#log", startY: 100 });

        const pdfDataUri = doc.output("datauristring");
        const iframe = document.createElement("iframe");
        iframe.style.height = "80%";
        iframe.style.width = "80%";
        iframe.src = pdfDataUri;

        const downloadButton = document.createElement("a");
        downloadButton.innerText = "Download";
        downloadButton.href = pdfDataUri;
        downloadButton.download = `${formatDate()}.pdf`;
        const containerDiv = document.createElement("div");
        containerDiv.appendChild(iframe);
        containerDiv.appendChild(downloadButton);

        const win = window.open("", "", "width=1000,height=800");
        win.moveTo(
          (window.screen.width - 1000) / 2,
          (window.screen.height - 800) / 2
        );
        win.document.body.appendChild(containerDiv);

        // doc.save(`${formatDate()}.pdf`);
      } else {
        // User clicked Cancel
      }
      reset_button_handler();
    };

    document.getElementById("create_process").addEventListener("click", () => {
      if (this.is_ex_paused()) return;
      // ui.kernel.events[ui.kernel.selectedEvent].do
      const res: IResponce = this.createProcess();
      if (res.status === "OK") {
        this.timer_paused = true;
        // this.toggle_timer();
        this.display_all();
        this.start_timer();
      } else {
        this.showDialog(res.message);
      }
    });

    document
      .getElementById("reset")
      .addEventListener("click", reset_button_handler);

    document
      .getElementById("start")
      .addEventListener("click", start_button_handler);

    document
      .getElementById("finish")
      .addEventListener("click", finish_button_handler);

    document.querySelectorAll(".info").forEach((ele) => {
      const driver = new Driver();
      let hoverTimeout;
      ele.addEventListener("mouseover", (event) => {
        hoverTimeout = setTimeout(() => {
          console.log("Hovered for 1 second.");
          const { target } = event;
          const parent_node = (target as HTMLElement).parentNode;
          const element_id = (parent_node as HTMLElement).id;
          console.log(element_id);
          driver.highlight(descriptions.get(element_id));
        }, 1000);
      });
      ele.addEventListener("mouseout", (event) => {
        clearTimeout(hoverTimeout);
        const activeElement = driver.getHighlightedElement();
        console.log("released");
        driver.reset();
      });
    });

    document.querySelectorAll(".exp_controls_info").forEach((ele) => {
      const driver = new Driver();
      let hoverTimeout;
      ele.addEventListener("mouseover", (event) => {
        hoverTimeout = setTimeout(() => {
          const { target } = event;
          const targetElement = target as HTMLElement;
          const element_id =
            targetElement.tagName == "P"
              ? (targetElement.parentNode as HTMLElement).id
              : targetElement.id;
          console.log(element_id);
          driver.highlight(descriptions.get(element_id));
        }, 1000);
      });
      ele.addEventListener("mouseout", (event) => {
        clearTimeout(hoverTimeout);
        const activeElement = driver.getHighlightedElement();
        console.log("released");
        driver.reset();
      });
    });

    document.querySelectorAll(".meta_controls_info").forEach((ele) => {
      const driver = new Driver();
      let hoverTimeout;
      ele.addEventListener("mouseover", (event) => {
        hoverTimeout = setTimeout(() => {
          const { target } = event;
          const targetElement = target as HTMLElement;
          const element_id =
            targetElement.tagName == "P"
              ? (targetElement.parentNode as HTMLElement).id
              : targetElement.id;
          console.log(element_id);
          driver.highlight(descriptions.get(element_id));
        }, 1000);
      });
      ele.addEventListener("mouseout", (event) => {
        clearTimeout(hoverTimeout);
        const activeElement = driver.getHighlightedElement();
        console.log("released");
        driver.reset();
      });
    });
  }

  initialize_accordion() {
    if(this.isPractice()){
      let log = <HTMLElement>document.getElementById("observations_button");
      let observations = <HTMLElement>log.nextElementSibling;
      log.classList.toggle("active");
      observations.style.display = "flex";
      observations.style.flexDirection = "column";
      observations.style.overflow = "scroll";
      observations.style.maxHeight = observations.scrollHeight + "px";
    }

    let accordion = document.getElementsByClassName("accordion");

    for (let i = 0; i < accordion.length; i++) {
      accordion[i].addEventListener("click", () => {
        accordion[i].classList.toggle("active");
        if(accordion[i].classList.contains("active") && !this.is_ex_paused()){
          this.end_timer();
          document.getElementById("start").childNodes[0].nodeValue = "Resume";
          this.display_all();
          this.end_timer();
        }
        let panel = <HTMLElement>accordion[i].nextElementSibling;
        if (panel.style.maxHeight) {
          panel.style.transition = "0.2s";
          panel.style.display = "none";
          panel.style.maxHeight = null;
        } else {
          panel.style.display = "flex";
          panel.style.flexDirection = "column";
          panel.style.overflow = "scroll";
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
    }
  }

  update_accordion() {
    if(this.isPractice()){
      let log = <HTMLElement>document.getElementById("observations_button");
      let observations = <HTMLElement>log.nextElementSibling;

      if (log.classList.contains("active")) return;

      observations.style.display = "flex";
      observations.style.flexDirection = "column";
      observations.style.overflow = "scroll";
      observations.style.maxHeight = observations.scrollHeight + "px";
    }
  }

  main_tour() {
    const driver: Driver = new Driver({
      animate: true,
      opacity: 0.8,
      padding: 5,
      showButtons: true,
      overlayClickNext: true,
    });

    let main_tour_steps: Driver.Step[] = [
      descriptions.get("event_queue"),
      descriptions.get("clock"),
      descriptions.get("CPU"),
      descriptions.get("READY"),
      descriptions.get("IO"),
      descriptions.get("COMPLETED"),

      // this.imperatives.get("handling_events"),
      // this.imperatives.get("handling_events_req_process_1"),
      // this.imperatives.get("handling_events_req_procesdriver.highlight(descriptions.get(element_id));s_2"),
      // this.imperatives.get("handling_events_req_process_3"),
    ];

    driver.defineSteps(main_tour_steps);
    driver.start();
  }

  imperatives_map() {
    let imperatives = new Map<string, Driver.Step>();

    imperatives.set("handling_events", {
      element: "#all_events",
      popover: {
        title: "How to Handle Events.",
        description:
          "Each event arriving in the events queue requires some action from your side. To begin handling an event, click to select it from the events queue. The clock will be stopped when you select any event, and will remain stopped for the duration of handling of that event, or its cancellation.",
      },
    });

    imperatives.set("handling_events_req_process_1", {
      element: "#create_process",
      popover: {
        title: "The reqProcess Event.",
        description:
          "Handling the reqProcess event requires you to trigger the command to create a new process. You can do that by cliking the create process button. Remember, a reqProcess event must be selected before issuing the create process command.",
      },
    });

    imperatives.set("handling_events_req_process_2", {
      element: "#READY",
      popover: {
        title: "The reqProcess Event.",
        description:
          "Newly created processes appear in the Ready Pool, where they wait until they are allowed to start execution in the CPU.",
      },
    });

    imperatives.set("handling_events_req_process_3", {
      element: "#event_queue",
      popover: {
        title: "The reqProcess Event.",
        description:
          "Once the current event has been handled, the clock starts again, and you can begin handling other events..",
      },
    });

    return imperatives;
  }

  information_popover(element_id) {
    const driver = new Driver();
    driver.highlight(descriptions.get(element_id));
  }
}
