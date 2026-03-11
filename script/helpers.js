function log(text, type = "log") {
	console[type](new Date().toLocaleString(), text);
}

function playerDummy(action, dummy = undefined) {
	const itemsToClone = ["equipment", "energy", "maxEnergy", "hp", "maxHp", "strength"];
	if (action == "create") {
		const dummy = new Object();
		itemsToClone.forEach((item) => {
			dummy[item] = structuredClone(player[item]);
		});
		return dummy
	} else if (action == "restore") {
		itemsToClone.forEach((item) => {
			player[item] = structuredClone(dummy[item]);
		});
	}
}

function restorePlayerDummy(dummy) {}

function runEvents() {
	if (events.length > 0) {
		events[0]();
		events.shift();
		runEvents();
	}
}

function deleteItem(itemid) {
	document.querySelectorAll(".mapcell_actor_" + itemid).forEach((cell) => {
		cell.remove();
	});
	map.content(actors[itemid].pos.x, actors[itemid].pos.y, false);
	delete actors[itemid];
}

function lineOfSight(x1, y1, x2, y2, range) {
	const lineOfSight = bresenham([x1, y1], [x2, y2]);
	if (lineOfSight.length > range) {
		return false;
	} else {
		let result = true;
		lineOfSight.forEach((step) => {
			if (map.exists(step[0], step[1]) == false) {
				result = false;
			}
		});
		return result;
	}
}

function uninteruptedLine(x1, y1, x2, y2) {
	const line = bresenham([x1, y1], [x2, y2]);
	let result = true;
	line.forEach((step) => {
		if (map.passable(step[0], step[1]) == false) {
			result = false;
		}
	});
	return result;
}

function cloneTable(data) {
	return JSON.parse(JSON.stringify(data));
}

function status(data) {
	let object = cloneTable(data);
	for (k of Object.keys(object)) {
		this[k] = object[k];
	}
	statuses[data.id] = this;
}

function getDir(x1, y1, x2, y2) {
	if (y1 > y2) {
		return 0;
	} else if (x1 < x2) {
		return 1;
	} else if (y1 < y2) {
		return 2;
	} else if (x1 > x2) {
		return 3;
	}
}

function capitalize(sentence) {
	return sentence.substring(0, 1).toUpperCase() + sentence.substring(1);
}

function numtotext(num) {
	let numbers = [
		"zero",
		"one",
		"two",
		"three",
		"four",
		"five",
		"six",
		"seven",
		"eight",
		"nine",
		"ten",
		"eleven",
		"twelve",
		"thirteen",
		"fourteen",
		"fifteen",
		"sixteen",
		"seventeen",
		"eighteen",
		"nineteen",
		"twenty",
	];
	if (num <= 20) {
		return numbers[num];
	} else {
		return num;
	}
}

function suffix(number) {
	let tenths = number % 10,
		hundreds = number % 100;
	if (tenths == 1 && hundreds != 11) {
		return number + "st";
	}
	if (tenths == 2 && hundreds != 12) {
		return number + "nd";
	}
	if (tenths == 3 && hundreds != 13) {
		return number + "rd";
	}
	return number + "th";
}

function getRandomInt(max) {
	return Math.floor(Math.random() * (max + 1));
}

const removeDuplicates = (arr) => [...new Set(arr)];

function limit(val, min, max) {
	if (val < min) {
		return min;
	} else if (val > max) {
		return max;
	} else {
		return val;
	}
}

function wrap(val, min, max) {
	while (val < min) {
		val += max;
	}
	while (val > max) {
		val -= max;
	}
	return val;
}

function makeDijkstraMap(destX, destY) {
	let queue = new Array();
	let newDijkstraMap = new Object();
	item = {
		x: destX,
		y: destY,
		val: 0,
	};
	queue.push(item);

	function testItem(x, y, val) {
		if (newDijkstraMap[x] == undefined) {
			newDijkstraMap[x] = {};
		}
		if ((newDijkstraMap[x][y] == undefined || newDijkstraMap[x][y] > val) && map.passable(x, y)) {
			newDijkstraMap[x][y] = val;
			item = {
				x: x,
				y: y,
				val: val,
			};
			queue.push(item);
		} else if (map.passable(x, y) == false && map.exists(x, y) == true) {
			newDijkstraMap[x][y] = 99999999;
		}
	}

	while (queue.length > 0) {
		let current = queue.shift();

		testItem(current.x, current.y - 1, current.val + 1);
		testItem(current.x - 1, current.y, current.val + 1);
		testItem(current.x + 1, current.y, current.val + 1);
		testItem(current.x, current.y + 1, current.val + 1);
	}

	return newDijkstraMap;
}

function pathFromDijkstra(dijkstraMap, sourceX, sourceY) {
	function readDijkstra(x, y) {
		if (dijkstraMap[x]) {
			if (dijkstraMap[x][y]) {
				return dijkstraMap[x][y];
			} else {
				return 99999999;
			}
		} else {
			return 99999999;
		}
	}

	function compareByVal(a, b) {
		return a.val - b.val;
	}

	function addResult(x, y, currentVal) {
		let newVal = readDijkstra(x, y);
		if (newVal < currentVal) {
			return {
				newX: x,
				newY: y,
				val: newVal,
			};
		}
	}

	const path = new Array();
	path.push([sourceX, sourceY]);
	let currentX = sourceX;
	let currentY = sourceY;
	let currentVal = readDijkstra(currentX, currentY);
	let escape = false;
	while (escape == false) {
		let results = new Array();
		results.push(addResult(currentX, currentY - 1, currentVal));
		results.push(addResult(currentX - 1, currentY, currentVal));
		results.push(addResult(currentX + 1, currentY, currentVal));
		results.push(addResult(currentX, currentY + 1, currentVal));
		// results.push(addResult(currentX - 1, currentY - 1, currentVal));
		// results.push(addResult(currentX + 1, currentY - 1, currentVal));
		// results.push(addResult(currentX - 1, currentY + 1, currentVal));
		// results.push(addResult(currentX + 1, currentY + 1, currentVal));
		results = results.filter((item) => item != undefined);
		results.sort(compareByVal);
		if (results.length == 0 || results[0].val >= 99999999) {
			escape = true;
		} else {
			currentVal = results[0].val;
			currentX = results[0].newX;
			currentY = results[0].newY;
			path.push([currentX, currentY]);
			if (currentVal <= 0) {
				escape = true;
			}
		}
	}
	return path;
}

/* Got this from https://github.com/thejonwithnoh/bresenham-js*/
function bresenham(pos1, pos2) {
	let delta = pos2.map(function (value, index) {
		return value - pos1[index];
	});
	let increment = delta.map(Math.sign);
	let absDelta = delta.map(Math.abs);
	let absDelta2 = absDelta.map(function (value) {
		return 2 * value;
	});
	let maxIndex = absDelta.reduce(function (accumulator, value, index) {
		return value > absDelta[accumulator] ? index : accumulator;
	}, 0);
	let error = absDelta2.map(function (value) {
		return value - absDelta[maxIndex];
	});

	let result = [];
	let current = pos1.slice();
	for (let j = 0; j < absDelta[maxIndex]; j++) {
		result.push(current.slice());
		for (let i = 0; i < error.length; i++) {
			if (error[i] > 0) {
				current[i] += increment[i];
				error[i] -= absDelta2[maxIndex];
			}
			error[i] += absDelta2[i];
		}
	}
	result.push(current.slice());
	return result;
}
