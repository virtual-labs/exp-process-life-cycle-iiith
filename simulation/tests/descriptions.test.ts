/**
 * @jest-environment jsdom
 */
import {UI} from "../src/UI"
import Driver from "driver.js"
import { descriptions } from "../src/descriptions";
// event-queue
    test("event queue desription testing",() => {
        const something = new Map<string, Driver.Step>();

        expect(something.size).toBe(0);

        something.set("event_queue",{  element: "#event_queue",
        popover: {
        title: "Events Queue",
        description:
            "The events queue collects the events coming in from external sources (the user, interrupts etc.), or the various requests from the processes that need to be handled (such as requests for resource allocation).",
        position: "right",
        },
        });

        expect(something.size).toBe(1);
        expect(something.get("event_queue")).toEqual({  element: "#event_queue",
        popover: {
        title: "Events Queue",
        description:
            "The events queue collects the events coming in from external sources (the user, interrupts etc.), or the various requests from the processes that need to be handled (such as requests for resource allocation).",
        position: "right",
        },
        });

    });


//cpu
    test("cpu description testing",() => {
        const something = new Map<string, Driver.Step>();

        expect(something.size).toBe(0);

        something.set("cpu",  {
            element: "#CPU",
            popover: {
              title: "The CPU",
              description: "The processes currently being executed appear in the CPU.",
            },
        });

        expect(something.size).toBe(1);
        expect(something.get("cpu")).toEqual( {
            element: "#CPU",
            popover: {
              title: "The CPU",
              description: "The processes currently being executed appear in the CPU.",
            },
        });

    });


//clock
test("clock description",() => {
    const something = new Map<string, Driver.Step>();
    expect(something.size).toBe(0);
    something.set("clock",  {
        element: "#clock",
        popover: {
          title: "Clock",
          description:
            "The clock cycles help synchronize the execution and management of processes.",
        },
    });
    expect(something.size).toBe(1);
    expect(something.get("clock")).toEqual( {
        element: "#clock",
        popover: {
          title: "Clock",
          description:
            "The clock cycles help synchronize the execution and management of processes.",
        },
    });
    
});

//IO

test("IO description",() => {
    const something = new Map<string, Driver.Step>();

    expect(something.size).toBe(0);

    something.set("IO",  {
        element: "#IO",
        popover: {
          title: "The I/O Pool",
          description:
            "The processes which are currently using I/O resources appear in the I/O Pool.",
        },
      });

    expect(something.size).toBe(1);
    expect(something.get("IO")).toEqual({
        element: "#IO",
        popover: {
          title: "The I/O Pool",
          description:
            "The processes which are currently using I/O resources appear in the I/O Pool.",
        },
      });

});

//ready
test("ready description",() => {
    const something = new Map<string, Driver.Step>();
    expect(something.size).toBe(0);
    something.set("READY",  {
        element: "#READY",
        popover: {
          title: "The Ready Pool",
          description:
            "The ready pool is where the processes wait before they are allowed to be executed.",
        },
      });
    expect(something.size).toBe(1);
    expect(something.get("READY")).toEqual( {
        element: "#READY",
        popover: {
          title: "The Ready Pool",
          description:
            "The ready pool is where the processes wait before they are allowed to be executed.",
        },
      });
    
});

//completed
test("completed description",() => {
    const something = new Map<string, Driver.Step>();
    expect(something.size).toBe(0);
    something.set("COMPLETED",  {
        element: "#COMPLETED",
        popover: {
          title: "Terminated Processes",
          description: "The processes which have been terminated appear here.",
        },
      });
    expect(something.size).toBe(1);
    expect(something.get("COMPLETED")).toEqual( {
        element: "#COMPLETED",
        popover: {
          title: "Terminated Processes",
          description: "The processes which have been terminated appear here.",
        },
      });
    
});
//reset

test("reset description",() => {
    const something = new Map<string, Driver.Step>();
    expect(something.size).toBe(0);
    something.set("reset",  {
        element: "#reset",
        popover: {
          title: "Reset kernel",
          description: "The kernel is reset to the initial stage.",
        },
      });
    expect(something.size).toBe(1);
    expect(something.get("reset")).toEqual( {
        element: "#reset",
        popover: {
          title: "Reset kernel",
          description: "The kernel is reset to the initial stage.",
        },
      });
});

//start
test("start description",() => {
    const something = new Map<string, Driver.Step>();
    expect(something.size).toBe(0);
    something.set("start",   {
        element: "#start",
        popover: {
          title: "Start clock",
          description: "The clock starts to tick and processes come to the kernel.",
        },
      });
    expect(something.size).toBe(1);
    expect(something.get("start")).toEqual(  {
        element: "#start",
        popover: {
          title: "Start clock",
          description: "The clock starts to tick and processes come to the kernel.",
        },
      });
});

//finish
test("finish description",() => {
    const something = new Map<string, Driver.Step>();
    expect(something.size).toBe(0);
    something.set("finish",    {
        element: "#finish",
        popover: {
          title: "Finish clock",
          description: "The clock stops and you are given an option to print the performance report.  ",
        },
      });
    expect(something.size).toBe(1);
    expect(something.get("finish")).toEqual(  {
        element: "#finish",
        popover: {
          title: "Finish clock",
          description: "The clock stops and you are given an option to print the performance report.  ",
        },
      });
});


//init_tour

test("init_tour description",() => {
    const something = new Map<string, Driver.Step>();
    expect(something.size).toBe(0);
    something.set("init_tour",    {
        element: "#init_tour",
        popover: {
          title: "Take a tour",
          description: "Take a tour of the simulation for understanding the functioning.",
        },
      });
    expect(something.size).toBe(1);
    expect(something.get("init_tour")).toEqual(  {
        element: "#init_tour",
        popover: {
          title: "Take a tour",
          description: "Take a tour of the simulation for understanding the functioning.",
        },
      });
});