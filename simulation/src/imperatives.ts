import Driver from "driver.js"
export let imperatives = new Map<string, Driver.Step>();

imperatives.set("handling_events",
                {element: "#all_events",
                    popover: {
                        title: "How to Handle Events.",
                        description: "Each event arriving in the events queue requires some action from your side. To begin handling an event, click to select it from the events queue. The clock will be stopped when you select any event, and will remain stopped for the duration of handling of that event, or its cancellation."
                    }});

imperatives.set("handling_events_req_process_1",
                {element: "#create_process",
                    popover: {
                        title: "The reqProcess Event.",
                        description: "Handling the reqProcess event requires you to trigger the command to create a new process. You can do that by cliking the create process button. Remember, a reqProcess event must be selected before issuing the create process command."
                    }});

imperatives.set("handling_events_req_process_2",
                {element: "#READY",
                    popover: {
                        title: "The reqProcess Event.",
                        description: "Newly created processes appear in the Ready Pool, where they wait until they are allowed to start execution in the CPU."
                    }});

imperatives.set("handling_events_req_process_3",
                {element: "#event_queue",
                    popover: {
                        title: "The reqProcess Event.",
                        description: "Once the current event has been handled, the clock starts again, and you can begin handling other events.."
                    }});
