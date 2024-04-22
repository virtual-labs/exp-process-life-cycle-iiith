import Driver from "driver.js"
import { imperatives } from "../src/imperatives"


describe("To check that the data is set", () => {

    test("Testing for the data set", () => {
        const something = new Map<string, Driver.Step>();
        //checking to see if the map is empty.
        expect(something.size).toBe(0);
    //Setting data to handling events.
    something.set("Handling_events",
                    {element: "#all_events",
                        popover:{
                            title: "How to handle events",
                            description:"Each event arriving..."
                        }});
    //Checking if the size is updated.
        expect(something.size).toBe(1);
    //To see if the data is set correctly.
        expect(something.get("Handling_events")).toEqual(
                             {element: "#all_events",
                                popover:{
                                    title: "How to handle events",
                                    description:"Each event arriving..."
                        }});
        
                        
    }
    );
    
});