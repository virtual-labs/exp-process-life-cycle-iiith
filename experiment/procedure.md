### Procedure

We have 7 components:

* Instruction box(used to let users know what to do)
* Running queue:will be where the live processes will be placed
* CPU
* I/O queue:where the process will go if the process has any I/O calles where it will wait for data collection.
* Completed queue:This is where all the completed processes are placed
* Log : This is where all actions get recorded
* Controls : This is where all the buttons that the user can play with are placed


Steps of the simulator:

1. We will receive a notification from the instruction box saying that there is a process that needs to be created. We will click on the create process button and it can be seen that a process has appeared in the running queue.
2. Click on the process to send it to the CPU.
  a. Once we are in the CPU we can use one of 4 different buttons:
  b. Click Advance_Clock:  We can advance the clock cycle by clicking this button.
  c. Click Preempt: We might receive an instruction saying that the process in the CPU needs to get preempted so we will have to push the process back to the running queue by clicking this button.
  d. Click Go_to_I/O : If we receive an instruction saying the current process has I/O calls then we will need to push the process from the CPU to the I/O queue by clicking the button.
3. Click Kill: Once the process is completed we will receive an instruction saying we need to kill the process as it is completed so now the process can be pushed to the completed process queue where it can no longer be accessed.
- Inside the I/O queue we will wait for the instruction saying the process can collect the data ,here we can click the Collect_data which will do so and then send the process back to the running queue.
