/* VARIABLES INITIALIZATION */

const timer = document.getElementById("timer");
const monitor = document.getElementById("monitor");
const list = document.getElementById("solve-list");
const scramble = document.getElementById("scramble");
const scrambleImage = document.getElementById("scramble-img");

var cstimerWorker = (function() {
	var worker = new Worker('/node_modules/cstimer_module/cstimer_module.js');

	var callbacks = {};
	var msgid = 0;

	worker.onmessage = function(e) {
		var data = e.data; //data: [msgid, type, ret]
		var callback = callbacks[data[0]];
		delete callbacks[data[0]];
		callback && callback(data[2]);
	}

	function callWorkerAsync(type, details) {
		return new Promise(function(type, details, resolve) {
			++msgid;
			callbacks[msgid] = resolve;
			worker.postMessage([msgid, type, details]);
		}.bind(null, type, details));
	}

	return {
		getScrambleTypes: function() {
			return callWorkerAsync('scrtype');
		},
		getScramble: function() {
			return callWorkerAsync('scramble', Array.prototype.slice.apply(arguments));
		},
		setSeed: function(seed) {
			return callWorkerAsync('seed', [seed]);
		},
		setGlobal: function(key, value) {
			return callWorkerAsync('set', [key, value]);
		},
		getImage: function(scramble, type) {
			return callWorkerAsync('image', [scramble, type]);
		}
	}
})();

let isInspecting = false;
let startInspect;

let isHolding = false;
let startHold;

let isTiming = false;
let startTime;

let scrambleStr;

let timingId;
let holdingId;
const HOLDING_TIME = 500;
const TOTAL_INSPECTION_TIME = 15000;
const TIME_KEY = ' ';
const UI_UPDATING_RATE = 10;

let solveList = [];

/* LOAD EMELEMTS FOR THE FIRST TIME */

if (!localStorage.getItem("333")) {
    localStorage.setItem("333", "[]");
} else {
    loadSolveFromLocal();
}

loadScrambleAndImage();

/* FUNCTIONS */

function loadSolveFromLocal() {
    solveList = JSON.parse(localStorage.getItem("333"));
    for (let i in solveList) {
        pushSolveToList(parseInt(i) + 1, solveList[i]);
    }
}

function timingUpdate() {
    const now = new Date().getTime();
    const diff = now - startTime;

    timer.innerHTML = displayTime(diff);
}

function holdingUpdate() {
    const now = new Date().getTime();
    const diff = now - startHold;

    if (diff >= HOLDING_TIME) {
        timer.innerHTML = "0.000";
        timer.style.color = "#66FF00";
    } else {
        timer.style.setProperty("--percent", `${diff / HOLDING_TIME * 100}%`);
    }
}

function timeStopHandler() {
    clearInterval(timingId);
    const stopTime = new Date().getTime();
    const time = stopTime - startTime;
    
    timer.innerHTML = displayTime(time);
    
    const solve = {
        "id": `${startTime}`,
        "time": `${time}`,
        "scramble": scrambleStr,
        "penalty": "None"
    }

    loadScrambleAndImage();
    setScrambleAndImageVisibility(true);
    
    solveList.push(solve);
    pushSolveToList(solveList.length, solve);
    pushSolveToLocalStorage(solve);

    isTiming = false;
}

function holdingStartHandler() {
    timer.style.color = "rgba(0, 0, 0, 0.1)";
    
    startHold = new Date().getTime();
    isHolding = true;
    
    holdingId = setInterval(holdingUpdate, UI_UPDATING_RATE);
}

function holdingStopHandler() {
    // HoldingStop
    const stopHold = new Date().getTime();
    const holdingTime = stopHold - startHold;
    clearInterval(holdingId);
    timer.style.color = "white";

    if (holdingTime >= HOLDING_TIME) {
        // start timing
        startTime = new Date().getTime();
        isTiming = true;
        timingId = setInterval(timingUpdate, UI_UPDATING_RATE);

        setScrambleAndImageVisibility(false);
    }
    isHolding = false;
}

function pushSolveToLocalStorage() {
    solveString = JSON.stringify(solveList);

    localStorage.setItem("333", solveString);
}

function pushSolveToList(order, solve) {

    const newSolve = `
        <li>
            <span class="order">${order}</span>
            <span class="time">${displayTime(solve["time"])}</span>
        </li>
    `;

    $("#solve-list").prepend(newSolve);
}

function displayTime(ms) {
    return `${(ms / 1000).toFixed(3)}`
}

function clearList() {
    localStorage.clear();
    location.reload();
}

function loadScrambleAndImage() {
    var queue = cstimerWorker.getScramble('333').then(function(scrStr) {
        scrambleStr = scrStr;
        scramble.innerText = scrStr;
        return cstimerWorker.getImage(scrStr, '333');
    }).then(function(svgImage) {
        scrambleImage.innerHTML = svgImage;
    });
}

function setScrambleAndImageVisibility(isVisible) {
    var visibility = isVisible ? "block" : "none";

    scramble.style.display = visibility;
    scrambleImage.style.display = visibility;
}

/* EVENT LISTENERS */

window.addEventListener("keydown", (e) => {
    // monitor.innerHTML = `Down: key = ${e.key}, code = ${e.code}, ${new Date().getTime() - startHold}`;
    if (!isHolding) {
        if (isTiming) {
            // TimeStopHandler
            timeStopHandler();
        } else if (e.key == TIME_KEY) {
            // HoldingStart
            holdingStartHandler();
        }
    }
});

window.addEventListener("keyup", (e) => {
    // monitor.innerHTML = `Up: key = ${e.key}, code = ${e.code}, ${isHolding}`;
    if (isHolding) {
        holdingStopHandler();
    }
});

/*
    - Holding effect for the timer -ok
    - Number format for the timer -ok
    - Save the time using localStorage -ok
    - Implement the settings feature for each local user

    - Load the scramble and scramble image -ok
    - Refresh scramble after every solution -ok
    - Hide the scramble and image when timer is running -ok

    note: The competitor must start the solve within 15 seconds of the start of the inspection. Penalty: time penalty (+2 seconds).
    note: The competitor must start the solve within 17 seconds of the start of the inspection. Penalty: disqualification of the attempt (DNF).
*/
