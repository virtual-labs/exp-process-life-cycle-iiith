# Linux Process States

- Running or Runnable (R)
    
    Running is actively running and allocated to a CPU/CPU core or thread. This will affect CPU utilisation metrics in terms of real-time usage.The distinction between running and runnable is that a runnable process is ready and lined up to be run. Therefore it is queued up to be running
    
- Uninterruptible Sleep (D)
    
    The Uninterruptible state is mostly used by device drivers waiting for disk or network I/O. The process will wake only if a waited upon resource becomes available or the process times out (Time Out has to be specified at process creation)
    
- Interruptable Sleep (S)
    
    An Interruptible sleep state means the process is waiting either for a particular time slot or for a particular event to occur
    
- Stopped (T)
    
    Processes can end when they call the exit system themselves or receive signals to end. When a process runs the exit system call, it releases its data structures, but it does not release its slot in the process table. Instead, it sends a SIGCHLD signal to the parent. It is up to the parent process to release the child process slot so that the parent can determine if the process exited successfully
    
- Zombie (Z)
    
    Between the time when the process terminates and the parent releases the child process, the child enters into what is referred to as a Zombie state. A process can remain in a Zombie state if the parent process should die before it has a chance to release the process slot of the child process
    

Virtual Lab PLM Experiment Process States

- Running - CPU
- Waiting - Ready Pool
- Using IO Resources - I/O Pool
- Terminated - Terminated Processes

Comparisons between the above 2 models

- The Running state for both models are similar
- The VLPLM Waiting state can be mapped to the Runnable State in Linux
- Linux processes go into the Uninterruptible Sleep State when waiting for I/O Resources
- The VLPLM Terminated State can be mapped to the Stopped State in Linux

## References

[](https://tldp.org/LDP/tlk/kernel/processes.html)

**Linux System Programming, 2nd Edition** - Robert Love