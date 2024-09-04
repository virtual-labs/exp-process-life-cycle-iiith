/**
 * @jest-environment jsdom
 */
import { Event } from "../src/Event";
import * as config from "../src/config";
const evt = new Event(0, config.TERMINATE, 23, 2, config.DONE);
const evt2 = new Event(6, "hell")
const ioneeded_event = new Event(4, config.IONEEDED, 31, 4, config.INTERNAL)
const iodone_event = new Event(4, config.IODONE, 40, 4, config.INTERNAL)
//const infant_state = new Event(4, config.INFANT,
test("Creating new Event", () => {
    expect(evt.id).toBe(0);
    expect(evt.name).toBe(config.TERMINATE);
    expect(evt2.id).toEqual(6);
    expect(evt2.name).toBe("hell");
})

test("Checking for External Event", () => {
    expect(evt.type).toBe(config.DONE);
    expect(evt.state).toBe(config.ACTIVE);

});

test("Checking for IO_needed Event", () => {
    expect(ioneed_event.type).toBe(config.INTERNAL);
    expect(ioneed_event.state).toBe(config.ACTIVE);
});

test("Checking for IO_done Event",  () => {
    expect(iodone_event.type).toBe(config.INTERNAL);
    expect(iodone_event.state).toBe(config.ACTIVE);

});

//test cases for 03.04.2023
const request_proc_event = new Event(3);

test("check for request new process event", () => {
    expect(request_proc_event.type).toBe(config.EXTERNAL);
    expect(request_proc_event.type).not.toBe(config.INTERNAL);
    expect(request_proc_event.state).toEqual(config.ACTIVE);
    expect(request_proc_event.id).toBe(3);
});


const response_event = new Event();
test("Testing for response time for an event", () => {
    response_event.setResponceId(5);
    expect(response_event.state).toBe(config.DONE);
    //expect(response_event.rid).toBe(5);
//test cases for 05.04.2023
const event = new Event(3)
const data = event.getData();
const keys = Object.keys(data);
const test_data = () => {
    expect(keys).toContain("name");
    expect(keys).toContain("pid");
    expect(keys).toContain("time");
    expect(keys).toContain("id");
    expect(keys).toContain("responceId");
    expect(keys).toContain("type");
    expect(keys).toContain("state");
}
test("Checking for the items in the Event Array", test_data);


test("Checking for the items set by set data", () => {
    event.setData(data);
    const test_set = event.getData();
    const keys  = Object.keys(test_set);
    expect(keys).toContain("name");
    expect(keys).toContain("pid");
    expect(keys).toContain("time");
    expect(keys).toContain("id");
    expect(keys).toContain("responceId");
    expect(keys).toContain("type");
    expect(keys).toContain("state");
});

const killed_event = new Event();
test("Testing for killed event", () => {
    killed_event.killed(7);
    expect(killed_event.state).toBe(config.KILLED);
    expect(killed_event.pid).toBe(-1);
});
//  const getData_event = new Event();
// test("Testing for get data event", () => {
//     getData_event.setData("string",4,20,4,4,config.EXTERNAL,config.ACTIVE);
//     expect(getData_event.getData).toBe();
// });

//trial
// describe("Test for get-set", () => {
//     let getset_event;
// beforeEach(() => {
//     const getset_event = new Event('test', 1, 22, 1, '456', config.EXTERNAL, config.ACTIVE);
//   });

//   test("Testing get data event", () => {
//     const trial_data = {
//         name: 'test',
//         pid: 1,
//         time: 22,
//         id: 1,
//         responceId: '456',
//         type: config.EXTERNAL,
//         state: config.ACTIVE
//           };
//     expect(getset_event.getData()).toBe(trial_data);

        
//   })});

const createElement_test = new Event('E', 1, 1,  1, 1, config.EXTERNAL, config.ACTIVE)
test("Testing create element event", () => {
    const element = createElement_test.createElement()
    expect(element.classList).toBe("event");
})
});
