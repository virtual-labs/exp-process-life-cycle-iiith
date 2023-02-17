import { Event } from "./Event";
import { Kernel } from "./Kernel";
class UI {
    kernel : Kernel;

    update_events() {
        let event_queue = document.getElementById("event_queue");
        event_queue.innerHTML = "";
        for (let index = 0; index < this.kernel.events.length; index++) {
            const element: Event = this.kernel.events[index];
            let event_element = document.createElement("section");
            event_element.classList.add("event");

            let event_name = document.createElement("p");
        }
    }
}