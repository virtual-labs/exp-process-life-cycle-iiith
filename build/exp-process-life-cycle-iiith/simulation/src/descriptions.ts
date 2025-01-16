import Driver from "driver.js";
export let descriptions = new Map<string, Driver.Step>();

descriptions.set("event_queue", {
  element: "#event_queue",
  popover: {
    title: "Events Queue",
    description:
      "The events queue collects the events coming in from external sources (the user, interrupts etc.), or the various requests from the processes that need to be handled (such as requests for resource allocation).",
    position: "right",
  },
});



descriptions.set("clock", {
  element: "#clock",
  popover: {
    title: "Clock",
    description:
      "The clock cycles help synchronize the execution and management of processes.",
  },
});

descriptions.set("CPU", {
  element: "#CPU",
  popover: {
    title: "The CPU",
    description: "The processes currently being executed appear in the CPU.",
  },
});

descriptions.set("IO", {
  element: "#IO",
  popover: {
    title: "The I/O Pool",
    description:
      "The processes which are currently using I/O resources appear in the I/O Pool.",
  },
});

descriptions.set("READY", {
  element: "#READY",
  popover: {
    title: "The Ready Pool",
    description:
      "The ready pool is where the processes wait before they are allowed to be executed.",
  },
});

descriptions.set("COMPLETED", {
  element: "#COMPLETED",
  popover: {
    title: "Terminated Processes",
    description: "The processes which have been terminated appear here.",
  },
});
descriptions.set("reset", {
  element: "#reset",
  popover: {
    title: "Reset kernel",
    description: "The kernel is reset to the initial stage.",
  },
});
descriptions.set("start", {
  element: "#start",
  popover: {
    title: "Start clock",
    description: "The clock starts to tick and processes come to the kernel.",
  },
});
descriptions.set("finish", {
  element: "#finish",
  popover: {
    title: "Finish clock",
    description: "The clock stops and you are given an option to print the performance report.  ",
  },
});
descriptions.set("init_tour", {
  element: "#init_tour",
  popover: {
    title: "Take a tour",
    description: "Take a tour of the simulation for understanding the functioning.",
  },
});
