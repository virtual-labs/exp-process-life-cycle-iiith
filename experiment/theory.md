### Link your theory in here

From creation to completion the process goes through many state transitions.
We will be experimenting with 5 stages:
* New
* Ready
* Running
* Wait
* Kill

### New:

In this stage the process is yet to be created and is in the form of a program in the secndary memory waitng for OS to create the process.

### Ready:

In this state the process has been created and is waiting in the main memory for the CPU to execute process instructions.

### Running:

The process has been chosen from the ready queue and the CPU is executing the instuctions in the process.

### Waiting:

The process might request access to I/O or need user input,when this happens we send the process to waiting state.

### Kill:
The process has been completed or is terminated and PCB gets deleted.


We will also be looking into peemption in this experiment.This is basically when the process is forcfully pulled out of the CPU and put in the ready state.

---------------------------------------------------------------------------------------------------------------------------------------------------------

## Context Switching




