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

<<<<<<< HEAD

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
    const key = Object.keys(test_set);
    expect(keys).toContain("name");
    expect(keys).toContain("pid");
    expect(keys).toContain("time");
    expect(keys).toContain("id");
    expect(keys).toContain("responceId");
    expect(keys).toContain("type");
    expect(keys).toContain("state");
});

test("Checking for the killed event", () => {
    const event_kill = new Event();
    event_kill.killed(3);
    expect(event_kill.state).toBe(config.KILLED)
    expect(event_kill.responceId).toBe(3)
});

test("Checking for set Responce Id", () => {
    evt2.setResponceId(3);
    expect(evt2.responceId).toBe(3);
    expect(evt2.state).toBe(config.DONE);
})

test("Checking for Create Elements", () => {
    const eve = new Event('test_event', 1, config.EXTERNAL, 0)
    const result = eve.createElement();
    expect(result.tagName).toBe('DIV');
    expect(result.classList.contains('event')).toBe(true);  
})

test('should create a paragraph element for the event type', () => {
    const event = new Event('test_event', 1, config.EXTERNAL, 0);
    const result = event.createElement();
    expect(result.querySelector('.event_type')).not.toBeNull();
    expect(result.querySelector('.event_type').tagName).toBe('P');
  });

  test('should set the background color of the event type paragraph element to #0ec8b4 for external events', () => {
    const event = new Event(0, config.IONEEDED, 5, 1, config.EXTERNAL);
    const result = event.createElement();
    expect(result.querySelector('.event_type').style.backgroundColor).toBe('rgb(14, 200, 180)');
  });

    test('should set the background color of the event type paragraph element to #1128ee for internal events', () => {
    const event = new Event(0, 'test_event', 5, 1, config.INTERNAL);
    const result = event.createElement();
    expect(result.querySelector('.event_type').style.backgroundColor).toBe('rgb(17, 40, 238)');
  });

    test
    ('should create a paragraph element for the event name', () => {
    const event = new Event('test_event', 1, config.EXTERNAL, 0);
    const result = event.createElement();
    expect(result.querySelector('.event_name')).not.toBeNull();
    expect(result.querySelector('.event_name').tagName).toBe('P');
  });

    test
    ('should set the text of the event name paragraph element to the event name', () => {
    const event = new Event(1, 'test_event', 1, 0, config.EXTERNAL);
    const result = event.createElement();
    expect(result.querySelector('.event_name').textContent).toBe('test_event');
  });

    test
    ('should create a paragraph element for the event pid', () => {
    const event = new Event('test_event', 1, config.EXTERNAL, 0);
    const result = event.createElement();
    expect(result.querySelector('.event_pid')).not.toBeNull();
    expect(result.querySelector('.event_pid').tagName).toBe('P');
  });

    test
    ('should set the text of the event pid paragraph element to "P<sub>id</sub>: {pid}"', () => {
    const event = new Event('test_event', 1, config.EXTERNAL, 0);
    const result = event.createElement();
    expect(result.querySelector('.event_pid').innerHTML).toBe('P<sub>id</sub>: 1');
  });

    test
    ('should create a paragraph element for the event time', () => {
    const event = new Event('test_event', 1, config.EXTERNAL, 0);
    const result = event.createElement();
    expect(result.querySelector('.event_time')).not.toBeNull();
    expect(result.querySelector('.event_time').tagName).toBe('P');
  });

    test
    ('should set the text of the event time paragraph element to "t<sub>e</sub>: {time}"', () => {
    const event = new Event('test_event', 1, config.EXTERNAL, 0);
    const result = event.createElement();
    expect(result.querySelector('.event_time').innerHTML).toBe('t<sub>e</sub>: 0');
  });
=======

const response_event = new Event();
test("Testing for response time for an event", () => {
    response_event.setResponceId(5);
    expect(response_event.state).toBe(config.DONE);
    //expect(response_event.rid).toBe(5);
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
});
>>>>>>> 2b9c0a7 (adding testcases)
