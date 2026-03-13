function makeMap(generator = "default") {
	const map = new Object();
	map.reference = new Array();
	map.width = 0;
	map.height = 0;
	map.content = new Object();
	map.readMap = function (x, y) {
		if (map.content[x] == undefined || map.content[x][y] == undefined) {
			return undefined;
		} else {
			return map.content[x][y];
		}
	};
	map.writeMap = function (x, y, val) {
		if (x > map.width) {
			map.width = x;
		}
		if (y > map.height) {
			map.height = y;
		}
		if (map.content[x] == undefined) {
			map.content[x] = new Object();
		}
		if (map.content[x][y] == undefined) {
			map.content[x][y] = new Object();
			map.content[x][y].x = x;
			map.content[x][y].y = y;
			map.content[x][y].contents = new Object();
		}
		if (val == undefined) {
			delete map.content[x][y];
		} else {
			for (const [key, value] of Object.entries(val)) {
				if (value == undefined) {
					delete map.content[x][y].contents[key];
				} else {
					map.content[x][y].contents[key] = value;
				}
			}
		}
	};

	map.passable = function (x, y) {
		const cell = map.readMap(x, y);
		if (cell == undefined || cell.contents.blocked == true || cell.contents.occupant != undefined) {
			return false;
		} else {
			return true;
		}
	};
	map.exists = function (x, y) {
		const cell = map.readMap(x, y);
		if (cell == undefined) {
			return false;
		} else {
			return true;
		}
	};
	map.buildReference = function () {
		map.reference.length = 0;
		for (let x in map.content) {
			for (let y in map.content[x]) {
				map.reference.push(map.content[x][y]);
			}
		}
	};
	map.getEmptySpot = function (iteration = 0) {
		let location = map.reference[getRandomInt(map.reference.length)];
		if (
			location &&
			location.x &&
			location.y &&
			map.passable(location.x, location.y) &&
			(location.x == map.entrance.x && location.y == map.entrance.y) == false &&
			(location.x == map.entrance.x + 1 && location.y == map.entrance.y) == false
		) {
			return location;
		} else {
			iteration++;
			if (iteration > 40) {
				return false;
			} else {
				return map.getEmptySpot(iteration);
			}
		}
	};

	if (generator == "default") {
		const buffer = 10;
		const width = getRandomInt(30) + 30;
		const height = (getRandomInt(1) + 3) * 2 - 1;

		// create base rectangle
		const tile = new Object();
		tile.type = "floor";
		for (let x = buffer; x < width + buffer; x++) {
			for (let y = buffer; y < height + buffer; y++) {
				map.writeMap(x, y, tile);
			}
		}

		// add narrows
		const narrowWidth = getRandomInt(3) + 1;
		const narrowHeight = getRandomInt(Math.floor((height - 3) / 2) + 1);
		const narrowNum = getRandomInt(3) + 3;
		const narrowSpacing = Math.floor(width / narrowNum);
		for (let i = 0; i < narrowNum; i++) {
			const narrowX = buffer + i * narrowSpacing + Math.floor(narrowSpacing / 2);
			for (let x = narrowX; x < narrowX + narrowWidth; x++) {
				for (let y = buffer; y < buffer + narrowHeight; y++) {
					map.writeMap(x, y, undefined);
				}
				for (let y = buffer + height - narrowHeight; y < buffer + height; y++) {
					map.writeMap(x, y, undefined);
				}
			}
		}

		// add entrance and exit
		map.entrance = { x: buffer - 1, y: Math.floor(height / 2) + buffer };
		map.exit = { x: width + buffer, y: Math.floor(height / 2) + buffer };
		map.writeMap(map.entrance.x, map.entrance.y, { type: "floor" });
		map.writeMap(map.exit.x, map.exit.y, { type: "floor" });

		// add pillars
		if (level.number == 1 || getRandomInt(4) < 2) {
			for (let pillarX = map.entrance.x + 4; pillarX < map.exit.x; pillarX += getRandomInt(4) + 2) {
				map.writeMap(pillarX, map.entrance.y - 1, undefined);
				map.writeMap(pillarX, map.entrance.y + 1, undefined);
			}
		}
	}

	map.buildReference();
	return map;
}

function createScreen() {
	//set options
	setOptions();
	// order layers
	screen.appendChild(screenWorldLayer);
	screenWorldLayer.appendChild(screenMapLayer);
	screenWorldLayer.appendChild(screenActorLayer);
	screen.appendChild(screenInterfaceLayer);
	screen.classList = "screen";
	screenWorldLayer.classList = "layer screenWorldLayer";
	screenMapLayer.classList = "layer screenMapLayer";
	screenActorLayer.classList = "layer screenActorLayer";
	screenInterfaceLayer.classList = "layer screenInterfaceLayer";
}

function addActor(x, y, type) {
	let actor = new Object();
	actor.id = actors.length;
	actor.type = type;
	actor.strength = 1;
	if (actor.type == "player") {
		actor.symbol = "@";
		actor.color = "var(--bg)";
		actor.vision = 32;
		actor.ai = false;
		actor.maxHp = 6;
		actor.maxEnergy = 6;
		actor.name = "You";
	} else if (actor.type == "mook") {
		actor.symbol = "M";
		actor.color = "var(--purple-dim)";
		actor.vision = 24;
		actor.ai = true;
		actor.maxHp = 3;
		actor.maxEnergy = 4;
		actor.name = "Mook";
	} else if (actor.type == "trooper") {
		actor.symbol = "T";
		actor.color = "var(--blue-dim)";
		actor.vision = 24;
		actor.ai = true;
		actor.maxHp = 2;
		actor.maxEnergy = 6;
		actor.name = "Trooper";
	} else if (actor.type == "brute") {
		actor.symbol = "B";
		actor.color = "var(--red-dim)";
		actor.vision = 24;
		actor.ai = true;
		actor.maxHp = 6;
		actor.maxEnergy = 6;
		actor.name = "Brute";
		actor.strength = 2;
	} else if (actor.type == "firstaid") {
		actor.symbol = "⊠";
		actor.color = "var(--red-dim)";
		actor.vision = 0;
		actor.ai = false;
		actor.maxHp = 6;
		actor.maxEnergy = 0;
		actor.name = "First Aid kit";
		actor.strength = 0;
	} else if (actor.type == "knife") {
		actor.symbol = "►";
		actor.color = "var(--bg4)";
		actor.vision = 0;
		actor.ai = false;
		actor.maxHp = 6;
		actor.maxEnergy = 0;
		actor.name = "knife";
		actor.strength = 0;
	} else if (actor.type == "hammer") {
		actor.symbol = "⍑";
		actor.color = "var(--bg4)";
		actor.vision = 0;
		actor.ai = false;
		actor.maxHp = 6;
		actor.maxEnergy = 0;
		actor.name = "hammer";
		actor.strength = 0;
	} else if (actor.type == "sword") {
		actor.symbol = "†";
		actor.color = "var(--bg4)";
		actor.vision = 0;
		actor.ai = false;
		actor.maxHp = 6;
		actor.maxEnergy = 0;
		actor.name = "sword";
		actor.strength = 0;
	}
	actor.focusing = false;
	actor.hp = actor.maxHp;
	actor.energy = actor.maxEnergy;
	actor.inventory = new Array();
	actor.equipment = new Array();
	actor.addItem = function (itemId) {
		if (actor.equipment.length > 0) {
			let spot = actor.closestEmpty();
			let item = addActor(spot.x, spot.y, actor.equipment[0].id);
			drawActor(item);
		}
		actor.equipment[0] = weapons[itemId];
	};
	actor.throw = function (target) {
		if (actor.equipment.length > 0) {
			let start = actor.closestEmpty();
			let end = target.closestEmpty();
			let item = addActor(start.x, start.y, actor.equipment[0].id);
			drawActor(item);
			item.move(end.x, end.y);
			target.getHit(2);
			actor.equipment.length = 0;
		}
	};
	actor.activeAttack = new Object();
	actor.activeAttack.cost = function () {
		if (actor.equipment.length > 0) {
			return actor.equipment[0].cost;
		} else {
			return 2;
		}
	};
	actor.activeAttack.damage = function () {
		if (actor.equipment.length > 0) {
			return actor.equipment[0].damage;
		} else {
			return actor.strength;
		}
	};
	actor.seen = false;
	actor.visible = false;
	actor.pos = new Object();
	actor.pos.x = x;
	actor.pos.y = y;
	actor.aware = false;
	actor.awareX = false;
	actor.awareY = false;
	actor.skip = 0;
	actor.path = new Array();
	actor.addToPath = function (step) {
		actor.path.push(step);
	};
	actor.addMovementToPath = function (targetX, targetY) {
		if (Math.abs(actor.pos.x - targetX) + Math.abs(actor.pos.y - targetY) == 1) {
			actor.addToPath({ x: targetX, y: targetY, type: "move", cost: 1 });
		} else {
			const path = pathFromDijkstra(actor.dijkstraMap, targetX, targetY);
			path.reverse().forEach((step) => {
				nextStep = new Object();
				nextStep.type = "move";
				nextStep.x = step[0];
				nextStep.y = step[1];
				nextStep.cost = 1;
				actor.addToPath(nextStep);
			});
		}
	};
	actor.pendingCost = function () {
		let pendingCost = 0;
		actor.path.forEach((step) => {
			if (step.cost > 0) {
				pendingCost += step.cost;
			}
		});
		return pendingCost;
	};
	actor.takeAim = function (target) {
		let path = bresenham([actor.pos.x, actor.pos.y], [target.pos.x, target.pos.y]);
		newPath = new Array();
		path.forEach((step) => {
			newPath.push({ x: step[0], y: step[1] });
		});
		newPath.shift();
		const action = new Object();
		lastUniqueId++;
		action.id = "cachedAction" + lastUniqueId;
		action.type = "areaAttack";
		action.damage = actor.activeAttack.damage();
		action.path = newPath;
		action.source = actor;
		action.target = target;
		action.piercing = false;
		actor.focusing = action.id;
		cachedActions.push(action);
		newPath.forEach((step) => {
			let cell = document.getElementById(step.x + "_" + step.y);
			if (cell && cell.classList) {
				cell.classList.add("danger", "" + action.id);
			}
		});
	};
	actor.bigSwing = function (target, useX = actor.pos.x, useY = actor.pos.y) {
		let path = new Array();
		let items = [
			{ x: useX - 1, y: useY - 2 },
			{ x: useX, y: useY - 2 },
			{ x: useX + 1, y: useY - 2 },
			{ x: useX - 2, y: useY - 1 },
			{ x: useX - 1, y: useY - 1 },
			{ x: useX, y: useY - 1 },
			{ x: useX + 1, y: useY - 1 },
			{ x: useX + 2, y: useY - 1 },
			{ x: useX - 2, y: useY },
			{ x: useX - 1, y: useY },
			{ x: useX + 1, y: useY },
			{ x: useX + 2, y: useY },
			{ x: useX - 2, y: useY + 1 },
			{ x: useX - 1, y: useY + 1 },
			{ x: useX, y: useY + 1 },
			{ x: useX + 1, y: useY + 1 },
			{ x: useX + 2, y: useY + 1 },
			{ x: useX - 1, y: useY + 2 },
			{ x: useX, y: useY + 2 },
			{ x: useX + 1, y: useY + 2 },
		];
		items.forEach((item) => {
			if (map.exists(item.x, item.y)) {
				path.push(item);
			}
		});
		const action = new Object();
		lastUniqueId++;
		action.id = "cachedAction" + lastUniqueId;
		action.type = "areaAttack";
		action.damage = 3;
		action.path = path;
		action.source = actor;
		action.target = target;
		action.piercing = true;
		actor.focusing = action.id;
		cachedActions.push(action);
		action.path.forEach((step) => {
			let cell = document.getElementById(step.x + "_" + step.y);
			if (cell) {
				cell.classList.add("danger", "" + action.id);
			}
		});
	};
	actor.sees = function (x, y) {
		return lineOfSight(actor.pos.x, actor.pos.y, x, y, actor.vision);
	};
	actor.visibility = function () {
		if (document.getElementById(actor.pos.x + "_" + actor.pos.y).classList.contains("visible")) {
			actor.actorElement.classList.remove("hidden");
		} else {
			actor.actorElement.classList.add("hidden");
		}
	};
	actor.attack = function (target) {
		target.getHit(actor.activeAttack.damage());
	};
	actor.move = function (x, y) {
		map.writeMap(actor.pos.x, actor.pos.y, { occupant: undefined });
		actor.pos.x = x;
		actor.pos.y = y;
		map.writeMap(actor.pos.x, actor.pos.y, { occupant: actor });
		actor.actorElement.style.left = actor.pos.x * options.cellSize + 1 + "px";
		actor.actorElement.style.top = actor.pos.y * options.cellSize + 1 + "px";
		actor.visibility();
		if (actor.type == "player") {
			if (actor.pos.x == map.exit.x && actor.pos.y == map.exit.y) {
				greenRoom();
			}
		}
	};
	actor.fling = function (x, y, source) {
		const path = bresenham([actor.pos.x, actor.pos.y], [x, y]);
		let endX = actor.pos.x;
		let endY = actor.pos.y;
		let escape = false;
		let lastCell = map.readMap(actor.pos.x, actor.pos.y);
		actor.actorElement.classList.add("fling");
		path.forEach((step, index) => {
			let cell = map.readMap(step[0], step[1]);
			if (cell == undefined) {
				escape = true;
				actor.getHit(2);
				if (lastCell == undefined) {
					let newTarget = actor.closestEmpty(actor.pos.x, actor.pos.y);
					endX = newTarget.x;
					endY = newTarget.y;
				} else if (lastCell.occupant) {
					let newTarget = actor.closestEmpty(occupant.pos.x, occupant.pos.y);
					endX = newTarget.x;
					endY = newTarget.y;
				}
				actor.move(endX, endY);
			} else if (cell.contents.occupant && cell.contents.occupant != source && cell.contents.occupant != actor) {
				escape = true;
				endX = step[0];
				endY = step[1];
				const collisionActor = cell.contents.occupant
				if (actor.pos.x < collisionActor.pos.x) {
					collisionActor.fling(collisionActor.pos.x + 2, collisionActor.pos.y, actor);
				} else if (actor.pos.x > collisionActor.pos.x) {
					collisionActor.fling(collisionActor.pos.x - 2, collisionActor.pos.y, actor);
				} else if (actor.pos.y < collisionActor.pos.y) {
					collisionActor.fling(collisionActor.pos.x, collisionActor.pos.y + 2, actor);
				} else if (actor.pos.y > collisionActor.pos.y) {
					collisionActor.fling(collisionActor.pos.x, collisionActor.pos.y - 2, actor);
				}
				actor.getHit(2);
				collisionActor.getHit(1);
				actor.move(endX, endY);
			} else if (escape == false) {
				endX = step[0];
				endY = step[1];
			}
			lastCell = cell;
		});
		if (escape == false) {
			actor.move(endX, endY);
		}
		if (actor.focusing) {
			clearCachedAttack(actor.focusing);
			actor.focusing = false;
		}
	};
	actor.followPath = function () {
		let path = actor.path;
		let lastStepType = "";
		if (actor.type == "player" && actor.energy >= 0) {
			if (view.mode == "cinematic") {
				view.angle = limit(getRandomInt((path.length / 7) * 30) + 60, 10, 90);
			} else if (view.mode == "dynamic") {
				view.angle = limit(getRandomInt((path.length / 7) * 60) + 30, 10, 90);
			} else {
				view.angle = 0;
			}
			state.moving = true;
		}
		function step(nextStep) {
			lastStepType = nextStep.type;
			let stepped = true;
			if (actor.energy >= nextStep.cost) {
				if (nextStep.type == "move") {
					if (map.passable(nextStep.x, nextStep.y)) {
						actor.move(nextStep.x, nextStep.y);
					} else {
						stepped = false;
					}
				} else if (nextStep.type == "get") {
					actor.addItem(nextStep.target.type);
					nextStep.target.actorElement.remove();
				} else if (nextStep.type == "throw") {
					actor.throw(nextStep.target);
				} else if (nextStep.type == "attack") {
					actor.attack(nextStep.target);
				} else if (nextStep.type == "shove") {
					if (actor.pos.x < nextStep.target.pos.x) {
						nextStep.target.fling(actor.pos.x + 3, actor.pos.y, actor);
					} else if (actor.pos.x > nextStep.target.pos.x) {
						nextStep.target.fling(actor.pos.x - 3, actor.pos.y, actor);
					} else if (actor.pos.y < nextStep.target.pos.y) {
						nextStep.target.fling(actor.pos.x, actor.pos.y + 3, actor);
					} else if (actor.pos.y > nextStep.target.pos.y) {
						nextStep.target.fling(actor.pos.x, actor.pos.y - 3, actor);
					}
				} else if (nextStep.type == "toss") {
					if (actor.pos.x < nextStep.target.pos.x) {
						nextStep.target.fling(actor.pos.x - 4, actor.pos.y, actor);
					} else if (actor.pos.x > nextStep.target.pos.x) {
						nextStep.target.fling(actor.pos.x + 4, actor.pos.y, actor);
					} else if (actor.pos.y < nextStep.target.pos.y) {
						nextStep.target.fling(actor.pos.x, actor.pos.y - 4, actor);
					} else if (actor.pos.y > nextStep.target.pos.y) {
						nextStep.target.fling(actor.pos.x, actor.pos.y + 4, actor);
					}
				}

				actor.energy -= nextStep.cost;
				updateFov();
				// update awareness
				if (actor.type == "player") {
					// check if enemies see player
					actors.forEach((item) => {
						// if (item.ai) {
						if (item.sees(actor.pos.x, actor.pos.y)) {
							item.aware = true;
							item.awareX = actor.pos.x;
							item.awareY = actor.pos.y;
						}
						// }
					});
				} else {
					if (actor.sees(player.pos.x, player.pos.y)) {
						actor.aware = true;
						actor.awareX = player.pos.x;
						actor.awareY = player.pos.y;
					}
				}
			} else {
				stepped = false;
			}
			return stepped;
		}

		function nextStep() {
			function endPath() {
				if (actor.type == "player") {
					if (view.mode == "cinematic") {
						view.angle = getRandomInt(20) + 10;
					} else if (view.mode == "dynamic") {
						view.angle = 0;
					} else {
						view.angle = 0;
					}
					state.moving = false;
				}
				actor.dijkstraMap = makeDijkstraMap(actor.pos.x, actor.pos.y);
				clearPendingPath();
			}

			if (path.length > 0) {
				let stepped = step(path[0]);
				path.shift();

				if (stepped) {
					if (path.length <= 1) {
						setTimeout(nextStep, 200);
					} else {
						if (lastStepType == "move") {
							setTimeout(nextStep, 75);
						} else {
							setTimeout(nextStep, 250);
						}
					}
				} else {
					endPath();
				}
			} else {
				endPath();
			}
			updateView();
		}

		nextStep();
	};
	actor.getHit = function (dam) {
		actor.hp -= dam;
		updateInterfaceBars();
		actor.actorElement.classList.remove("gotHit");
		actor.actorElement.classList.add("gotHit");
		if (
			actor.type != "player" &&
			player.equipment.length > 0 &&
			player.equipment[0].id == "hammer" &&
			getRandomInt(3) < 2
		) {
			actor.skipTurn();
		}
		document.getElementById(actor.pos.x + "_" + actor.pos.y).classList.add("bloody");
		if (actor.hp <= 0) {
			if (actor.type == "player") {
				setTimeout(deathScreen(), 250);
			} else {
				actor.ai = false;
				map.writeMap(actor.pos.x, actor.pos.y, { occupant: undefined });
				actor.actorElement.classList.add("down");
				if (actor.focusing) {
					clearCachedAttack(actor.focusing);
					actor.focusing = false;
				}
			}
		}
	};

	actor.planGetItem = function (target) {
		if (actor.path[actor.path.length - 1] && actor.path[actor.path.length - 1].type == "move") {
			actor.path.pop();
		}
		const nextStep = new Object();
		nextStep.type = "get";
		nextStep.cost = 1;
		nextStep.target = target;
		actor.addToPath(nextStep);
	};
	actor.planThrow = function (target) {
		const nextStep = new Object();
		nextStep.type = "throw";
		nextStep.cost = 2;
		nextStep.target = target;
		actor.addToPath(nextStep);
	};
	actor.planAttack = function (target) {
		if (actor.path[actor.path.length - 1] && actor.path[actor.path.length - 1].type == "move") {
			actor.path.pop();
		}
		const nextStep = new Object();
		nextStep.type = "attack";
		nextStep.cost = actor.activeAttack.cost();
		nextStep.target = target;
		actor.addToPath(nextStep);
	};
	actor.planToss = function (target) {
		if (actor.path[actor.path.length - 1] && actor.path[actor.path.length - 1].type == "move") {
			actor.path.pop();
		}
		const nextStep = new Object();
		nextStep.type = "toss";
		nextStep.cost = 3;
		nextStep.target = target;
		actor.addToPath(nextStep);
	};
	actor.planShove = function (target) {
		if (actor.path[actor.path.length - 1] && actor.path[actor.path.length - 1].type == "move") {
			actor.path.pop();
		}
		const nextStep = new Object();
		nextStep.type = "shove";
		nextStep.cost = 3;
		nextStep.target = target;
		actor.addToPath(nextStep);
	};
	actor.skipTurn = function (turns = 1) {
		actor.skip = limit(actor.skip + turns, 2, 5);
	};
	actor.closestEmpty = function (mapX = actor.pos.x, mapY = actor.pos.y) {
		let dijkstraMap = makeDijkstraMap(mapX, mapY);
		let flatDijkstra = new Array();
		for (let [x, item] of Object.entries(dijkstraMap)) {
			for (let [y, val] of Object.entries(item)) {
				flatDijkstra.push({ x: x, y: y, val: val });
			}
		}
		function compareByVal(a, b) {
			return a.val - b.val;
		}
		flatDijkstra.sort(compareByVal);

		return flatDijkstra[0];
	};
	actors[actor.id] = actor;
	map.writeMap(actor.pos.x, actor.pos.y, { occupant: actor });
	return actor;
}
