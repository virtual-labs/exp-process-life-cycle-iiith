### Theory

#### What is a process?

In computing, a process is an instance of a computer program that is being executed by a computer's operating system (OS). A process consists of the program's code and its current activity, such as the values of its variables, the state of its I/O channels, and its position in memory.

Processes are managed by the operating system, which allocates resources such as CPU time, memory, and I/O devices to each process as needed. The OS also provides mechanisms for inter-process communication, synchronization, and coordination.

Each process is assigned a unique identifier, known as a process ID (PID), which can be used to identify and manage the process. The operating system maintains a process table that stores information about each running process, such as its PID, its priority, and its resource usage.

In a multitasking operating system, multiple processes may be running simultaneously, sharing the system resources. The OS schedules the execution of these processes, switching between them rapidly to give the illusion of parallel execution. This allows multiple programs to be run concurrently, which can improve the overall performance of the system.


#### What are process states?

As a process is executed, it undergoes a series of state changes that reflect the activity being performed by the user and the resources needed by the process. The specific states and their corresponding names can vary between different operating systems and literature sources, as they are not standardized. Nonetheless, the process state provides crucial information about the current status of a process and is used by the operating system to manage resources and scheduling.

The 4 main and most common states the process can exist as are:
* Ready: A process in the ready state is one that is waiting to be executed by the CPU, but is currently not running. The process is waiting for the CPU to allocate resources to it, and is typically waiting in a queue for its turn to run.

* Running: When a process is executing instructions on the CPU, it is in the running state.At any given time, there may be only one process in the running state on a single CPU.

* Waiting :if the process is in this state then it is waiting for either resources that it has requested for or waiting for a specific event  to occur so that it can go back to ready state and wait for dispatching The process is not using the CPU during this time and may be waiting for an indefinite period.

* Terminated: When a process has completed its execution or has been terminated by the operating system or by the user, it is in the terminated state. The process may still have some resources allocated to it, but it is no longer running.

####  What are the possible process state transitions?
![official process state cycle for exp 1](https://user-images.githubusercontent.com/66427446/219547278-8783a36b-1ad1-4068-9251-b3609e6a20cf.png)

* Ready → Running(dispatch):
  - The process has been dispatched to the CPU
  - The CPU will then either begin or resume execution of the process instructions

* Running → Ready(Preempt):
  - The process has been preempted
  - Meaning that the kernel has decided to schedule some other process for execution
  - This could be based on various criteria:
  - There is a process with higher priority that has become ready
  - The time slice or quantum of the process has passed.
 
* Running → Waiting(resource or Wait request):

   - The process in execution has decided to wait until the resources that it has requested for have been granted or it has decided to wait until a certain event the process is waiting for has been completed
   - There are 5 main reasons a process enters the wait state are:
     - Process requests for a resource
     - Process requests for I/O
     - Process wishes to wait for specific time interval
     - Waiting for message from another process
     - Waiting for action done by another process

* Waiting → Ready(Wait completed or resource request granted):
  - The resource request of the process has been granted
  - The event the process was waiting for has been completed

* Running → Terminated(terminate):
  - The process is terminated,this could be due to several reasons: 
    - Execution of program is completed
    - Self termination: 
      - the process has completed its execution completely
      - Process can no longer execute meaningfully
  In these cases the process makes a system call”terminate me”
    - Exceeding resource utilization: 
      - OS can limit the resources that a process may consume
      - If the process exceeds resource limit it will get aborted by the kernel
    - Abnormal conditions during execution:
      - If there are any abnormal conditions coming up during execution of instructions 
        - Execution of invalid instructions
        - Execution of privileged instructions
        - Memory protection violation
     - Incorrect interaction with other processes:
       - The kernel may abort a process if it gets involved in a deadlock.


#### Example of a process life cycle
![Theory example run for exp1](https://user-images.githubusercontent.com/66427446/219548032-b88bbcbf-b356-4a52-ba16-84ddad69b651.png)




