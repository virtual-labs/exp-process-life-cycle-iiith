import { Event } from "../src/Event";
import * as config from "../src/config";
const evt = new Event(0, "hhh");
const evt2 = new Event(6, "hell")
const ioneed_event = new Event(3, config.IONEEDED, 30, 3, config.INTERNAL)
const iodone_event = new Event(4, config.IODONE, 40, 3, config.INTERNAL)

test("Creating new Event", () => {
    expect(evt.id).toBe(0);
    expect(evt.name).toBe("hhh");
    expect(evt2.id).toEqual(6);
    expect(evt2.name).toBe("hell");
})

test("Checking for External Event", () => {
    expect(evt.type).toBe(config.EXTERNAL);

});

test("Checking for IO_needed Event", () => {
    expect(ioneed_event.type).toBe(config.INTERNAL);
});

test("Checking for IO_done Event",  () => {
    expect(iodone_event.type).toBe(config.INTERNAL);
});

//test cases for 03.04.2023
const request_proc_event = new Event(3);

test("check for request new process event", () => {
    expect(request_proc_event.type).toBe(config.EXTERNAL);
    expect(request_proc_event.type).not.toBe(config.INTERNAL);
    expect(request_proc_event.pid).toBe(3);
});
// test("Checking for the state of the Event", () => {
//     const 
//     expect(IEvent.name).toBe()
//     )
