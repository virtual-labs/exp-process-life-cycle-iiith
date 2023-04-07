import { descriptions } from "./descriptions";
import Driver from "driver.js";

export function main_tour () {
    const driver: Driver = new Driver({
        animate: true,
        opacity: 0.8,
        padding: 5,
        showButtons: true,
        overlayClickNext: true,
    });

    let main_tour_steps: Driver.Step [] =
        [
            descriptions.get("event_queue"),
            descriptions.get("clock"),
            descriptions.get("CPU"),
            descriptions.get("READY"),
            descriptions.get("IO"),
            descriptions.get("COMPLETED"),

            // imperatives.get("handling_events"),
            // imperatives.get("handling_events_req_process_1"),
            // imperatives.get("handling_events_req_procesdriver.highlight(descriptions.get(element_id));s_2"),
            // imperatives.get("handling_events_req_process_3"),

        ];

    driver.defineSteps(main_tour_steps);
    driver.start();
}