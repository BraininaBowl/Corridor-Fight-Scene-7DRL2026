function startGame() {
	createScreen();
	map = makeMap();
	player = addActor(map.entrance.x, map.entrance.y, "player");

	renderInterface();
	playerTurn = false;
	nextLevel();
	updateInterfaceBars();
}

function nextLevel() {
	level.number++;

	document.querySelectorAll(".actionContainer").forEach((item) => {
		item.remove();
	});

	document.querySelectorAll(".hideInterface").forEach((item) => {
		item.classList.remove("hideInterface");
	});

	closeInteractionMenu();
	let dummy = playerDummy("create");
	actors = new Array();
	screenMapLayer.textContent = "";
	screenActorLayer.textContent = "";
	map = makeMap();

	player = addActor(map.entrance.x, map.entrance.y, "player");
	playerDummy("restore", dummy);
	player.hp = player.maxHp;
	player.energy = player.maxEnergy;
	view.tracking = player;

	for (let i = 0; i < level.number + 2 + getRandomInt(2); i++) {
		let spot = map.getEmptySpot();
		if (spot) {
			addActor(spot.x, spot.y, "mook");
		}
	}

	if (level.number == 2) {
		let spot = map.getEmptySpot();
		if (spot) {
			addActor(spot.x, spot.y, "trooper");
		}
	}
	if (level.number > 2) {
		for (let i = 0; i < level.number - 2 + getRandomInt(2); i++) {
			let spot = map.getEmptySpot();
			if (spot) {
				addActor(spot.x, spot.y, "trooper");
			}
		}
	}
	if (level.number > 3) {
		let spot = map.getEmptySpot();
		if (spot) {
			addActor(spot.x, spot.y, "brute");
		}
	}
	if (level.number > 8) {
		let spot = map.getEmptySpot();
		if (spot) {
			addActor(spot.x, spot.y, "brute");
		}
	}

	if (level.number > 12) {
		let spot = map.getEmptySpot();
		if (spot) {
			addActor(spot.x, spot.y, "brute");
		}
	}

	renderMap(map);
	drawActors();
	updateFov();
	updateView();
	draw();
	updateInterfaceBars();
	setTimeout(() => {
		const actionContainer = document.createElement("div");
		actionContainer.classList.add("actionContainer");
		actionContainer.innerText = "Take " + level.number + " - And action!";
		screenInterfaceLayer.appendChild(actionContainer);
	}, 200);
	setTimeout(() => {
		player.move(map.entrance.x + 1, map.entrance.y);
		playerTurn = true;
	}, 250);
	player.dijkstraMap = makeDijkstraMap(player.pos.x + 1, player.pos.y);

	stopMusic();
	currentSong = getRandomInt(1) + 1;
	playMusic();
}

function stopMusic() {
	document.querySelectorAll(".musicPlayer").forEach((song) => {
		song.pause();
	});
}

function playMusic() {
	let song = document.getElementById("song_drums0" + currentSong);
	song.loop = true;
	song.play();
}

function greenRoom() {
	// hide game screen
	screenWorldLayer.classList.add("hideInterface");
	document.querySelectorAll(".buttonGroup").forEach((item) => {
		item.classList.add("hideInterface");
	});

	document.querySelectorAll(".musicPlayer").forEach((song) => {
		song.pause();
	});
	let song = document.getElementById("song_safe");
	song.loop = true;
	song.play();

	// define options
	const menu = new Object();
	menu.header = "The green room";
	menu.description = "Take a break. Relax.";
	menu.buttons = new Array();

	const healButton = new Object();
	healButton.label = "Have a snack and heal.";
	healButton.clickAction = function () {
		player.hp = player.maxHp;
		player.energy = player.maxEnergy;
		updateInterfaceBars();
		setTimeout(
			drawInteractionMenu.bind(null, upgradeMenu, false, false, true, options.cellSize * 4, options.cellSize * 4),
			250,
			true,
		);
	};
	menu.buttons.push(healButton);

	const upgradeMenu = new Object();
	upgradeMenu.header = "Props department";
	upgradeMenu.description = "Choose one of these:";
	upgradeMenu.buttons = new Array();

	let weaponPreString = "Grab";
	if (player.equipment.length > 0) {
		weaponPreString = "Swap weapon for";
	}

	if (player.equipment.length == 0 || player.equipment[0].id != "knife") {
		const swapKnife = new Object();
		swapKnife.label = weaponPreString + " a knife";
		swapKnife.clickAction = function () {
			player.addItem("knife");
			setTimeout(
				drawInteractionMenu.bind(null, setMenu, false, false, true, options.cellSize * 4, options.cellSize * 4),
				150,
				true,
			);
		};
		upgradeMenu.buttons.push(swapKnife);
	}

	if (player.equipment.length == 0 || player.equipment[0].id != "sword") {
		const swapSword = new Object();
		swapSword.label = weaponPreString + " a sword";
		swapSword.clickAction = function () {
			player.addItem("sword");
			setTimeout(
				drawInteractionMenu.bind(null, setMenu, false, false, true, options.cellSize * 4, options.cellSize * 4),
				150,
				true,
			);
		};
		upgradeMenu.buttons.push(swapSword);
	}

	if (player.equipment.length == 0 || player.equipment[0].id != "hammer") {
		const swapHammer = new Object();
		swapHammer.label = weaponPreString + " a hammer";
		swapHammer.clickAction = function () {
			player.addItem("hammer");
			setTimeout(
				drawInteractionMenu.bind(null, setMenu, false, false, true, options.cellSize * 4, options.cellSize * 4),
				150,
				true,
			);
		};
		upgradeMenu.buttons.push(swapHammer);
	}

	const upgradeHealth = new Object();
	upgradeHealth.label = "Max health +1";
	upgradeHealth.clickAction = function () {
		player.maxHp++;
		player.hp = player.maxHp;
		updateInterfaceBars();
		setTimeout(
			drawInteractionMenu.bind(null, setMenu, false, false, true, options.cellSize * 4, options.cellSize * 4),
			150,
			true,
		);
	};
	upgradeMenu.buttons.push(upgradeHealth);

	const upgradeEnergy = new Object();
	upgradeEnergy.label = "Max energy +1";
	upgradeEnergy.clickAction = function () {
		player.maxEnergy++;
		player.energy = player.maxEnergy;
		updateInterfaceBars();
		setTimeout(
			drawInteractionMenu.bind(null, setMenu, false, false, true, options.cellSize * 4, options.cellSize * 4),
			150,
			true,
		);
	};
	upgradeMenu.buttons.push(upgradeEnergy);

	const setMenu = new Object();
	setMenu.header = "Back to set";
	setMenu.description = "Ready for the next scene?";
	setMenu.buttons = new Array();

	const nextLevelButton = new Object();
	nextLevelButton.label = "Next take!";
	nextLevelButton.clickAction = function () {
		nextLevel();
	};
	setMenu.buttons.push(nextLevelButton);

	// draw menu
	setTimeout(
		drawInteractionMenu.bind(null, menu, false, false, true, options.cellSize * 4, options.cellSize * 4),
		250,
	);

	// drawInteractionMenu(menu, false, false, false, options.cellSize * 5, options.cellSize * 5);
}

function deathScreen() {
	stopMusic();
	level.number = 0;
	// define options
	const menu = new Object();
	menu.header = "You died.";
	menu.buttons = new Array();

	const nextLevelButton = new Object();
	nextLevelButton.label = "Try again.";
	nextLevelButton.clickAction = function () {
		actor = new Object();
		actor.hp = actor.maxHp;
		actor.energy = actor.maxEnergy;
		actor.equipment.length = 0;
		actor = addActor(map.entrance.x, map.entrance.y, "player");
		nextLevel();
	};
	menu.buttons.push(nextLevelButton);

	// hide game screen
	screenWorldLayer.classList.add("hideInterface");
	document.querySelectorAll(".buttonGroup").forEach((item) => {
		item.classList.add("hideInterface");
	});

	// draw menu
	drawInteractionMenu(menu, false, false, false, options.cellSize * 5, options.cellSize * 5);
}

function startplayerTurn() {
	if (view.mode == "cinematic") {
		view.angle = getRandomInt(20) + 10;
	} else if (view.mode == "dynamic") {
		view.angle = 0;
	} else {
		view.angle = 0;
	}
	updateView();

	playerTurn = true;
	player.energy = player.maxEnergy;
	updateInterfaceBars();
	player.dijkstraMap = makeDijkstraMap(player.pos.x, player.pos.y);
}

function endplayerTurn() {
	playerTurn = false;
	updateInterfaceBars();
	if (cachedActions.length > 0) {
		runCachedActions();
		setTimeout(clearAllCachedAttacks, 350);
		setTimeout(enemyTurn, 400);
	} else {
		clearAllCachedAttacks();
		setTimeout(enemyTurn, 50);
	}
}

function runCachedActions() {
	cachedActions.forEach((action) => {
		if (action.type == "areaAttack") {
			// loop through cells
			let resume = true;
			action.path.forEach((step) => {
				if (resume) {
					const cell = map.readMap(step.x, step.y);
					const cellElement = document.getElementById(step.x + "_" + step.y);
					if (cell && cellElement && cellElement.classList) {
						cellElement.classList.add("hit");
						clearCachedAttackCell(cellElement, action.id);
						if (cell.contents.occupant && cell.contents.occupant != action.source) {
							cell.contents.occupant.getHit(action.damage);
							if ((action.piercing = false)) {
								resume = false;
							}
						}
					}
				}
			});
		}
		clearCachedAttack(action.id);
	});
}

function enemyTurn() {
	function delayedTurnActivation(actor) {
		actor.energy = actor.maxEnergy;
		actor.dijkstraMap = makeDijkstraMap(actor.pos.x, actor.pos.y);
		let plannedX = actor.pos.x;
		let plannedY = actor.pos.y;
		actor.path = new Array();
		function updatePlannedCoords() {
			actor.path.forEach((step) => {
				if (step.type == "move") {
					plannedX = step.x;
					plannedY = step.y;
				}
			});
		}
		let updatedPos = true;
		function nextEnemyStep() {
			let escape = true;
			if (updatedPos) {
				actor.dijkstraMap = makeDijkstraMap(plannedX, plannedY);
			}
			updatedPos = false;
			if (lineOfSight(plannedX, plannedY, player.pos.x, player.pos.y, actor.vision)) {
				const delta = Math.abs(plannedX - player.pos.x) + Math.abs(plannedY - player.pos.y);
				if (actor.type == "mook") {
					if (delta > 1) {
						actor.addMovementToPath(player.pos.x, player.pos.y);
						updatePlannedCoords();
						updatedPos = true;
						escape = false;
					} else if (actor.energy - actor.pendingCost() >= actor.activeAttack.cost()) {
						actor.planAttack(player);
						updatePlannedCoords();
						escape = false;
					} else {
						escape = true;
					}
				} else if (actor.type == "trooper") {
					if (delta > 4) {
						actor.takeAim(player);
						updatePlannedCoords();
						updatedPos = false;
						escape = true;
					} else if (delta > 1) {
						actor.addMovementToPath(player.pos.x, player.pos.y);
						updatePlannedCoords();
						updatedPos = true;
						escape = false;
					} else if (actor.energy - actor.pendingCost() > actor.activeAttack.cost()) {
						actor.planAttack(player);
						updatePlannedCoords();
						escape = false;
					} else {
						escape = true;
					}
				} else if (actor.type == "brute") {
					if (delta > 1) {
						actor.addMovementToPath(player.pos.x, player.pos.y);
						updatePlannedCoords();
						updatedPos = true;
						escape = false;
					} else if (actor.energy > 3) {
						actor.path.pop();
						updatePlannedCoords();
						actor.bigSwing(player, plannedX, plannedY);
						updatedPos = false;
						escape = true;
					} else {
						escape = true;
					}
				}
			} else if (actor.aware) {
				if (plannedX == actor.awareX && plannedY == actor.awareY) {
					escape = true;
				} else {
					actor.addMovementToPath(actor.awareX, actor.awareX);
					updatePlannedCoords();
					updatedPos = true;
					escape = false;
				}
			}
			if (escape == false && actor.energy > actor.pendingCost()) {
				nextEnemyStep();
			}
		}
		nextEnemyStep();
		actor.followPath();
	}

	let enemyCounter = 0;
	actors.forEach((actor) => {
		if (actor.ai) {
			if (actor.hp <= 0) {
				actor.ai = false;
				map.writeMap(actor.pos.x, actor.pos.y, { occupant: undefined });
				actor.actorElement.classList.add("down");
				if (actor.focusing) {
					clearCachedAttack(actor.focusing);
					actor.focusing = false;
				}
			}
			if (actor.skip > 0) {
				actor.skip -= 1;
			} else {
				if (actor.sees(player.pos.x, player.pos.y)) {
					enemyCounter++;
				}
				setTimeout(delayedTurnActivation.bind(null, actor), enemyCounter * 150);
			}
		}
	});

	if (enemyCounter > 0) {
		if (view.mode == "cinematic") {
			view.angle = limit(getRandomInt((enemyCounter / 10) * 60), 10, 90);
		} else if (view.mode == "dynamic") {
			view.angle = limit(getRandomInt((enemyCounter / 10) * 40), 10, 90);
		} else {
			view.angle = 0;
		}
		updateView();
	}

	setTimeout(startplayerTurn, actors.length * 250);
}

function clearStatus() {
	document.querySelectorAll(".fling").forEach((item) => {
		item.classList.remove("fling");
	});
}

function clearCachedAttackCell(cellElement, id) {
	cellElement.classList.remove(id);
	let removeDanger = true;
	cellElement.classList.forEach((item) => {
		if (item.includes("cachedAction")) {
			removeDanger = false;
		}
	});
	if (removeDanger) {
		cellElement.classList.remove("danger");
	}
}

function clearCachedAttack(id) {
	document.querySelectorAll("." + id).forEach((cell) => {
		clearCachedAttackCell(cell, id);
	});
	cachedActions = cachedActions.reduce((result, action) => {
		if (action.id != id) {
			result.push(action);
		}
		return result;
	}, []);
}

function clearAllCachedAttacks() {
	cachedActions.forEach((action) => {
		document.querySelectorAll("." + action.id).forEach((element) => {
			element.classList.remove(action.id);
		});
	});
	cachedActions = new Array();
	document.querySelectorAll(".danger ").forEach((element) => {
		element.classList.remove("danger");
	});
	document.querySelectorAll(".hit").forEach((element) => {
		element.classList.remove("hit");
	});
}

function movePlayer() {
	player.followPath();
}

function clearPendingPath() {
	player.path = new Array();
	updateInterfaceBars();
	document.querySelectorAll(".movementPath").forEach((cell) => {
		cell.classList.remove("movementPath");
	});
	document.querySelectorAll(".blocked").forEach((cell) => {
		cell.classList.remove("blocked");
	});
}

function setOptions() {
	// set display options
	body.setAttribute(
		"style",
		"--cellSize: " +
			options.cellSize +
			"px; --wallHeight: " +
			options.wallHeight +
			"px; --frontWallOpacity: " +
			(200 - view.angle) / 200 +
			"; --viewAngle: " +
			view.angle +
			"deg;",
	);
}

function updateView() {
	// set camera position to tracked actor
	if (view.tracking == undefined || view.tracking.pos == undefined) {
		view.x = 0;
		view.y = 0;
	} else {
		view.x = view.tracking.pos.x;
		view.y = view.tracking.pos.y;
	}

	// set camera angle
	if (view.angle == undefined) {
		view.angle = 0;
	}
	if (view.angle >= 360) {
		view.angle = view.angle - 360;
	} else if (view.angle < 0) {
		view.angle = view.angle + 360;
	}
	if (view.angle == 0) {
		view.perspective = 999999;
	} else {
		view.perspective = 800;
	}

	// update settings
	setOptions();

	// set layer styles
	screen.style.perspective = view.perspective + "px";
	screenWorldLayer.style.transform =
		"translateX(" +
		(18 - view.x) * options.cellSize +
		"px) translateY(calc(" +
		(7.5 - view.y) * options.cellSize +
		"px + " +
		view.angle * 3 +
		"px)) rotateX(var(--viewAngle))";
}

function draw() {
	updateView();
	updateFov();
}

// function handleInput(key) {
// 	if (mode == 0) {
// 		if (targeting) {
// 			if (key == "up") {
// 				moveTarget(target.x, target.y - 1);
// 			} else if (key == "right") {
// 				moveTarget(target.x + 1, target.y);
// 			} else if (key == "down") {
// 				moveTarget(target.x, target.y + 1);
// 			} else if (key == "left") {
// 				moveTarget(target.x - 1, target.y);
// 			} else if (key == "target" || key == "escape") {
// 				switchModes();
// 			} else if (key == "confirm") {
// 				const actor = map.content(target.x, target.y);
// 				//if (actor && actor != "pass") {
// 				setUpInteractionMenu(actor);
// 				mode = 1;
// 				//}
// 			}
// 		} else {
// 			let dir;
// 			if (key == "up") {
// 				dir = 0;
// 			} else if (key == "right") {
// 				dir = 1;
// 			} else if (key == "down") {
// 				dir = 2;
// 			} else if (key == "left") {
// 				dir = 3;
// 			} else if (key == "target" || key == "confirm") {
// 				switchModes();
// 			} else if ((key = "escape")) {
// 				interactionMenu = drawMainMenu(true);
// 			}
// 			let action = player.followPath(dir);

// 			if (action && action != undefined && action != "player" && action != "bystander") {
// 				setUpInteractionMenu(action, false, dir);
// 				mode = 1;
// 			} else if (action == "bystander") {
// 				player.followPath(dir, true);
// 			} else {
// 			}
// 		}
// 	} else if (mode == 1) {
// 		if (key == "up") {
// 			interactionMenu.prev();
// 		} else if (key == "down") {
// 			interactionMenu.next();
// 		} else if (key == "confirm") {
// 			interactionMenu.confirm();
// 		} else if (typeof key === "number") {
// 			interactionMenu.confirm(key - 1);
// 		} else if ((key = "escape")) {
// 			interactionMenu.close();
// 		}
// 	}
// }
