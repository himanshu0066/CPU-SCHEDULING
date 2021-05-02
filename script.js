rows = document.querySelectorAll('.row');
rowNumber = document.querySelector('.row_number');
algorithm = document.querySelector('.algorithms');
arrival = document.querySelectorAll('.arrival');
burst = document.querySelectorAll('.burst');
priority = document.querySelectorAll('.priority');
simulate = document.querySelector('.simulate');
ReadyQ = document.querySelectorAll('.readyprocess');
GanttChart = document.querySelectorAll('.chart_element');
CurJob = document.querySelector('.current-job');
CurTime = document.querySelector('.current_time');
Utilization = document.querySelector('.utilization');
Table_start = document.querySelectorAll('.start');
Table_wait = document.querySelectorAll('.wait');
Table_remaining = document.querySelectorAll('.remaining');
Table_finish = document.querySelectorAll('.finish-time');
Table_turnaround = document.querySelectorAll('.turn');
Table_percentage = document.querySelectorAll('.percent');
Avgwaiting = document.querySelector('.waiting');
Avgturnaround = document.querySelector('.turnaround');
QuantumValue = document.querySelector('.quantum');
stop = document.querySelector('.stop');
speed = document.querySelector('.speed');
next = document.querySelector('.next-step');
finish = document.querySelector('.finish');
StartAnother = document.querySelector('.start-another');
restart = document.querySelector('.restart');

speed_value = 1;


colors = ["#fff", "#fccd68", "#60d952", "#44bbbd", "#5577d4", "#9f55d4", "#ed58de", "#ed5858", "#6effa5", "#e6fc68", "#269922"];

Live = false, pause = false, next_value = false;

//to finish the simulation
finish.addEventListener('click', () => {
    location.reload();
})

//To start another simulation
StartAnother.addEventListener('click', () => {
    location.reload();
})

//To restart the simulation
restart.addEventListener('click', () => {
    location.reload();
})

//To finish the simulation 
finish.addEventListener('click', () => {
    speed_value = 1000;
    console.log("now speed is " + speed_value);
})

//To stop a a particular value
stop.addEventListener('click', () => {
    console.log("Live is " + Live + " and pause is " + pause);
    if (Live == true && pause == false)
        pause = true;
    else
        pause = false;

})

//To move to next step
next.addEventListener('click', () => {
    if (pause == true)
        next_value = true;
})


function Initiate() {
    ChangeRows(1);
}

//function to change the number of rows in the table
function ChangeRows(val) {
    for (i = 0; i < val; i++) {
        rows[i].style.visibility = "visible";
    }
    for (i = val; i < 10; i++) {
        rows[i].style.visibility = "hidden";
    }
}

//function to return the arrival times
function getArrivalTimes() {
    i = 0;
    arrivalTime = [];
    while (rows[i].style.visibility == "visible") {
        arrivalTime.push(arrival[i++].value);
    }
    return arrivalTime;
}

//function to return the burst times
function getBurstTimes() {
    i = 0;
    burstTime = [];
    while (rows[i].style.visibility == "visible") {
        burstTime.push(burst[i++].value);
    }
    return burstTime;
}

//Function to return the priority list of the processes
function getPriorityList() {
    i = 0;
    PriorityList = [];
    while (rows[i].style.visibility == "visible")
        PriorityList.push(priority[i++].value);

    return PriorityList;
}


//Function to initialize the table
function InitializeTable(ArrivalTime, BurstTime) {
    n = ArrivalTime.length;
    for (i = 0; i < n; i++) {
        Table_remaining[i].value = BurstTime[i];
        Table_start[i].value = 0;
        Table_wait[i].value = 0;
        Table_finish[i].value = 0;
        Table_turnaround[i].value = 0;
        Table_percentage[i].value = 0;
    }
    return;
}

//Change the number of rows to a specified value
rowNumber.addEventListener('change', () => {
    ChangeRows(rowNumber.value);
})

//function to add incoming processes to ready queue
function AddReadyProcesses(ArrivalTime, time) {
    n = ArrivalTime.length, m = 0;
    for (i = 0; i < n; i++) {
        if (ArrivalTime[i] == time) {
            m++;
            ReadyQueue.push(i + 1);
        }
    }
    return m;
}

//Function to display the ready queue
function ShowReadyQueue() {
    n = ReadyQueue.length;
    for (i = 0; i < n; i++) {
        ReadyQ[i].style.background = colors[ReadyQueue[i]];
        ReadyQ[i].innerText = ReadyQueue[i];
    }
    m = ReadyQ.length;
    for (i = n; i < m; i++) {
        ReadyQ[i].style.background = "#ccc";
        ReadyQ[i].innerText = "";
    }
    return;
}

//Function to update the table after a unit time
function UpdateTable(ArrivalTime, BurstTime, Process, time) {
    if (Table_remaining[Process - 1].value == BurstTime[Process - 1])
        Table_start[Process - 1].value = time;
    if (Table_remaining[Process - 1].value > 0)
        Table_remaining[Process - 1].value--;
    if (Table_remaining[Process - 1].value == 0)
        Table_finish[Process - 1].value = time + 1;
    Table_turnaround[Process - 1].value++;
    n = ReadyQueue.length;
    for (i = 0; i < n; i++) {
        Table_turnaround[ReadyQueue[i] - 1].value++;
        Table_wait[ReadyQueue[i] - 1].value++;
    }
    //Table_percentage[Process - 1].value = 100 - parseInt((Table_remaining[Process - 1] / (+BurstTime[Process - 1])) * 100);
    total = parseInt(+BurstTime[Process - 1]);
    left = total - Table_remaining[Process - 1].value;
    perc = (left / total) * 100;
    Table_percentage[Process - 1].value = parseInt(perc);

}

//Function to calculate and display the average value of waiting and turnaround time
function CalculateAverage(n) {
    x = 0, y = 0;
    for (i = 0; i < n; i++) {
        x += (+Table_wait[i].value);
        y += (+Table_turnaround[i].value);

    }


    Avgwaiting.innerText = (x / n).toFixed(3);
    Avgturnaround.innerText = (y / n).toFixed(3);
    return;
}

//Function to sort the queue on the basis of burst time
function SortQueueSJF(BurstTime) {
    n = ReadyQueue.length;

    ans = [];
    for (i = 0; i < n; i++)
        ans.push(+BurstTime[ReadyQueue[i] - 1]);

    for (i = 0; i < n; i++) {
        for (j = 0; j < n - i - 1; j++) {
            if (ans[j + 1] < ans[j]) {
                temp = ans[j]; ans[j] = ans[j + 1]; ans[j + 1] = temp;
                temp = ReadyQueue[j]; ReadyQueue[j] = ReadyQueue[j + 1]; ReadyQueue[j + 1] = temp;
            }
        }
    }
    return;
}

//Function to sort the processes on the basis of priority
function SortQueuePriority(PriorityList) {
    n = ReadyQueue.length;
    ans = [];
    for (i = 0; i < n; i++)
        ans.push(+PriorityList[ReadyQueue[i] - 1]);

    for (i = 0; i < n; i++) {
        for (j = 0; j < n - i - 1; j++) {
            if (ans[j + 1] > ans[j]) {
                temp = ans[j]; ans[j] = ans[j + 1]; ans[j + 1] = temp;
                temp = ReadyQueue[j]; ReadyQueue[j] = ReadyQueue[j + 1]; ReadyQueue[j + 1] = temp;
            }
        }
    }
    return;
}

//Function to simulate the FCFS algorithm
function SimulateFCFS(ArrivalTime, BurstTime) {
    ReadyQueue = [];
    time = 0;
    Process = undefined, GanttIndex = 0, processLeft = ArrivalTime.length, idleTime = 0;

    Simulation = setInterval(() => {
        console.log(pause + "   " + next_value);
        if (pause == true && next_value == false)
            pause = true;
        else {
            processLeft -= AddReadyProcesses(ArrivalTime, time);

            if (Process == undefined && ReadyQueue.length == 0 && processLeft == 0) {
                clearInterval(Simulation);
                return;
            }

            if (Process == undefined)
                Process = ReadyQueue.shift();

            ShowReadyQueue();

            //To show the current time
            CurTime.innerText = time + "->" + (time + 1);

            if (Process == undefined) {
                GanttChart[GanttIndex].style.background = colors[0];
                GanttChart[GanttIndex++].innerText = "ID";
                CurJob.innerText = "IDLE";
                idleTime++;
            }
            else {
                GanttChart[GanttIndex].style.background = colors[Process];
                GanttChart[GanttIndex++].innerText = Process;
                CurJob.innerText = "P" + Process;
                UpdateTable(ArrivalTime, BurstTime, Process, time);
                if (Table_remaining[Process - 1].value == 0)
                    Process = undefined;

            }

            //To calculate and display the average values of waiting and turnaround time
            CalculateAverage(ArrivalTime.length);

            time++;
            //To display the CPU utilization
            if (time == 0) Utilization.innerText = "100%";
            else Utilization.innerText = parseInt(((time - idleTime) / time) * 100) + "%";
            next_value = false;
            console.log("here the sppedd value is " + speed_value);
        }
    }, 1000 / speed_value)

}

//Function to simulate the SJF scheduling
function SimulateSJF(ArrivalTime, BurstTime) {
    ReadyQueue = [];
    time = 0, Process = undefined, idleTime = 0;
    GanttIndex = 0, processLeft = ArrivalTime.length;
    Simulation = setInterval(() => {
        if (pause == true && next_value == false)
            pause = true;
        else {
            processLeft -= AddReadyProcesses(ArrivalTime, time);
            SortQueueSJF(BurstTime);

            //To check if all processes are completed
            if (Process == undefined && ReadyQueue.length == 0 && processLeft == 0) {
                clearInterval(Simulation);
                return;
            }

            //To dequeue a process from the ready queue
            if (Process == undefined || Table_remaining[Process - 1].value == 0) {
                Process = ReadyQueue.shift();
            }

            //To display the ready queue
            ShowReadyQueue();

            //To update the current time
            CurTime.innerText = time + "->" + (time + 1);

            if (Process == undefined) {
                GanttChart[GanttIndex].style.background = colors[0];
                GanttChart[GanttIndex++].innerText = "ID";
                CurJob.innerText = "IDLE";
                idleTime++;
            }
            else {
                CurJob.innerText = "P" + Process;
                GanttChart[GanttIndex].style.background = colors[Process];
                GanttChart[GanttIndex++].innerText = Process;
                UpdateTable(ArrivalTime, BurstTime, Process, time);
                if (Table_remaining[Process - 1].value == 0)
                    Process = undefined;

            }

            //To calculate the average values of waiting and turnaround time
            CalculateAverage(ArrivalTime.length);

            time++;

            //To display the CPU utilization
            if (time == 0) Utilization.innerText = "100%";
            else Utilization.innerText = parseInt(((time - idleTime) / time) * 100) + "%";
            next_value = false;
        }

    }, 1000 / speed_value)

}

//Function to simulate Round Robin
function SimulateRR(ArrivalTime, BurstTime) {
    ReadyQueue = [];
    time = 0, quantum = QuantumValue.value;
    Process = undefined, GanttIndex = 0, processLeft = ArrivalTime.length, q = quantum, idleTime = 0;
    Simulation = setInterval(() => {
        if (pause == true && next_value == false)
            pause = true;
        else {
            processLeft -= AddReadyProcesses(ArrivalTime, time);

            //To check if all processes are finished
            if (Process == undefined && ReadyQueue.length == 0 && processLeft == 0) {
                clearInterval(Simulation);
                return;
            }

            //If a process has run quantum amount of time
            if (q == quantum) {

                if (Process != undefined) {
                    if (Table_remaining[Process - 1].value > 0)
                        ReadyQueue.push(Process);
                }
                Process = ReadyQueue.shift();
                if (Process == undefined)
                    q = quantum;
                else
                    q = 0;
            }

            //to Display the ready queue
            ShowReadyQueue();

            //To update the current time
            CurTime.innerText = time + "->" + (time + 1);


            //To check if the CPU is idle
            if (Process == undefined) {
                GanttChart[GanttIndex].style.background = colors[0];
                GanttChart[GanttIndex++].innerText = "ID";
                CurJob.innerText = "IDLE";
                idleTime++;
            }
            else {
                GanttChart[GanttIndex].style.background = colors[Process];
                GanttChart[GanttIndex++].innerText = Process;
                CurJob.innerText = "P" + Process;
                UpdateTable(ArrivalTime, BurstTime, Process, time);
                q++;
                if (Table_remaining[Process - 1].value == 0) {
                    Process = undefined;
                    q = quantum;
                }
            }

            //To calculate and display the average values of waiting and turnaround time
            CalculateAverage(ArrivalTime.length);

            time++;
            //To display the CPU utilization
            if (time == 0) Utilization.innerText = "100%";
            else Utilization.innerText = parseInt(((time - idleTime) / time) * 100) + "%";
            next_value = false;
        }
    }, 1000 / speed_value)

}

//Function to simulate the Priority Scheduling
function SimulatePriority(ArrivalTime, BurstTime, PriorityList) {
    ReadyQueue = [];
    time = 0, Process = undefined, idleTime = 0;
    GanttIndex = 0, processLeft = ArrivalTime.length;

    Simulation = setInterval(() => {
        if (pause == true && next_value == false)
            pause = true;
        else {
            processLeft -= AddReadyProcesses(ArrivalTime, time);
            SortQueuePriority(PriorityList);

            //To check if all processes are completed
            if (Process == undefined && ReadyQueue.length == 0 && processLeft == 0) {
                clearInterval(Simulation);
                return;
            }

            //To dequeue a process from the ready queue
            if (Process == undefined || Table_remaining[Process - 1].value == 0) {
                Process = ReadyQueue.shift();
            }

            //To display the ready queue
            ShowReadyQueue();

            //To update the current time
            CurTime.innerText = time + "->" + (time + 1);

            if (Process == undefined) {
                GanttChart[GanttIndex].style.background = colors[0];
                GanttChart[GanttIndex++].innerText = "ID";
                CurJob.innerText = "IDLE";
                idleTime++;
            }
            else {
                CurJob.innerText = "P" + Process;
                GanttChart[GanttIndex].style.background = colors[Process];
                GanttChart[GanttIndex++].innerText = Process;
                UpdateTable(ArrivalTime, BurstTime, Process, time);
                if (Table_remaining[Process - 1].value == 0)
                    Process = undefined;

            }

            //To calculate the average values of waiting and turnaround time
            CalculateAverage(ArrivalTime.length);

            time++;

            //To display the CPU utilization
            if (time == 0) Utilization.innerText = "100%";
            else Utilization.innerText = parseInt(((time - idleTime) / time) * 100) + "%";
            next_value = false;
        }
    }, 1000 / speed_value)

}

//Function for FCFS scheduling
function FCFS() {
    ArrivalTime = getArrivalTimes();
    BurstTime = getBurstTimes();

    InitializeTable(ArrivalTime, BurstTime);
    SimulateFCFS(ArrivalTime, BurstTime);
}

//Function to start the round robin scheduling
function SJF() {
    ArrivalTime = getArrivalTimes();
    BurstTime = getBurstTimes();
    var n = ArrivalTime.length;


    InitializeTable(ArrivalTime, BurstTime);
    SimulateSJF(ArrivalTime, BurstTime);
}

//Function to start the round robin scheduling
function RR() {
    ArrivalTime = getArrivalTimes();
    BurstTime = getBurstTimes();

    InitializeTable(ArrivalTime, BurstTime);
    SimulateRR(ArrivalTime, BurstTime);
}

//Function for Priority scheduling
function Priority() {
    ArrivalTime = getArrivalTimes();
    BurstTime = getBurstTimes();
    PriorityList = getPriorityList();
    InitializeTable(ArrivalTime, BurstTime);
    SimulatePriority(ArrivalTime, BurstTime, PriorityList);
}

//Event listener for simulate button
simulate.addEventListener('click', () => {
    if (Live == true)
        return;
    Live = true;
    if (speed.value == 1)
        speed_value = 1;
    else if (speed.value == 2)
        speed_value = 2;
    else if (speed.value == 3)
        speed_value = 3;
    else if (speed.value == 4)
        speed_value = 4;
    else if (speed.value == 5)
        speed_value = 5;

    if (algorithm.value == "FCFS") {
        FCFS();
    }
    else if (algorithm.value == "SJF")
        SJF();
    else if (algorithm.value == "ROUND ROBIN")
        RR();
    else if (algorithm.value == "PRIORITY")
        Priority();



})


Initiate();