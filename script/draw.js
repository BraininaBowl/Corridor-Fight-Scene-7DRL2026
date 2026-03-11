function updateFov() {
	function markLineToPoint(x, y) {
		const points = bresenham([player.pos.x, player.pos.y], [x, y]);
		if (points.length) {
			for (const point of points) {
				const cellData = map.readMap(point[0], point[1]);
				if (cellData == undefined || cellData.blocked) {
					break;
				} else {
					const cell = document.getElementById(point[0] + "_" + point[1]);
					if (cell) {
						cell.classList.add("visible");
						cell.classList.add("seen");
					}
				}
			}
		}
	}

	screenMapLayer.querySelectorAll(".visible").forEach((cell) => {
		cell.classList.remove("visible");
	});
	for (
		let x = limit(player.pos.x - player.vision, 1, map.width);
		x <= limit(player.pos.x + player.vision, 1, map.width);
		x++
	) {
		markLineToPoint(x, 0);
		markLineToPoint(x, map.height);
	}
	for (let y = 0; y <= map.height; y++) {
		markLineToPoint(limit(player.pos.x - player.vision, 1, map.width), y);
		markLineToPoint(limit(player.pos.x + player.vision, 1, map.width), y);
	}

	actors.forEach((actor) => {
		actor.visibility();
	});
}

function setViewMode(mode) {
	view.mode = mode;
	let newClass = "viewMode" + capitalize(mode) + "Button";
	document.querySelectorAll(".viewModeToggleButtonGroup .active").forEach((item) => {
		item.classList.remove("active");
	});

	document.querySelectorAll(".viewModeToggleButtonGroup ." + newClass).forEach((item) => {
		item.classList.add("active");
	});

	if (mode == "cinematic") {
		view.angle = getRandomInt(12) + 5;
	} else if (mode == "dynamic") {
		view.angle = 0;
	} else {
		view.angle = 0;
	}
	updateView();
}

function updateInterfaceBars() {
	document.querySelectorAll(".healthBar").forEach((healthBar) => {
		healthBar.textContent = "";
		for (let i = 1; i <= player.maxHp; i++) {
			const barItem = document.createElement("div");
			barItem.classList.add("barItem");
			if (i <= player.hp) {
				barItem.classList.add("filled");
			} else {
				barItem.classList.add("empty");
			}
			barItem.appendChild(barSvg.cloneNode(true));
			healthBar.appendChild(barItem);
		}
	});

	document.querySelectorAll(".energyBar").forEach((energyBar) => {
		energyBar.textContent = "";
		for (let i = 1; i <= player.maxEnergy; i++) {
			const barItem = document.createElement("div");
			barItem.classList.add("barItem");
			if (i <= player.energy) {
				if (i > player.energy - player.pendingCost()) {
					barItem.classList.add("pending");
				}
				barItem.classList.add("filled");
			} else {
				barItem.classList.add("empty");
			}
			barItem.appendChild(barSvg.cloneNode(true));
			energyBar.appendChild(barItem);
		}
	});
}

function drawMovementPath() {
	let index = 0;
	player.path.forEach((point) => {
		if (point.type == "move") {
			const cell = document.getElementById(point.x + "_" + point.y);
			if (cell) {
				index++;
				cell.classList.add("movementPath");
				if (index > player.energy) {
					cell.classList.add("blocked");
				}
			}
		}
	});
}

function updateMovementPath(targetX, targetY) {
	// Clean up old path
	player.path = new Array();
	//Get new path
	player.addMovementToPath(targetX, targetY);
	drawMovementPath();
	updateInterfaceBars();
}

function renderMap(map) {
	function addWall(source_cell, source_x, source_y, check_x, check_y) {
		if (map.readMap(check_x, check_y) == undefined) {
			// no neighbor on this side, add wall
			const wall = document.createElement("div");
			wall.classList.add("wall");
			if (source_x > check_x) {
				// left wall
				wall.classList.add("wall_left");
				source_cell.classList.add("has_wall_left");
			} else if (source_x < check_x) {
				// right wall
				wall.classList.add("wall_right");
				source_cell.classList.add("has_wall_right");
			} else if (source_y < check_y) {
				// bottom wall
				wall.classList.add("wall_bottom");
				source_cell.classList.add("has_wall_bottom");
			} else if (source_y > check_y) {
				// top wall
				wall.classList.add("wall_top");
				source_cell.classList.add("has_wall_top");
			}
			source_cell.appendChild(wall);
		}
	}
	function drawCell(cellData) {
		// create cell
		const cell = document.createElement("div");
		cell.style.left = cellData.x * options.cellSize + "px";
		cell.style.top = cellData.y * options.cellSize + "px";
		if (cellData.classList) {
			cell.classList = cellData.classList;
		}
		cell.id = "" + cellData.x + "_" + cellData.y + "";
		cell.classList.add("cell");

		// add walls
		addWall(cell, cellData.x, cellData.y, cellData.x - 1, cellData.y);
		addWall(cell, cellData.x, cellData.y, cellData.x + 1, cellData.y);
		addWall(cell, cellData.x, cellData.y, cellData.x, cellData.y - 1);
		addWall(cell, cellData.x, cellData.y, cellData.x, cellData.y + 1);

		// add to world
		screenMapLayer.appendChild(cell);
		cellData.cellElement = cell;

		function addMenuToCell(cellData, cell) {
			if (state.menu) {
				clearPendingPath();
				updateMovementPath(cellData.x, cellData.y);
			}
			const delta = Math.abs(player.pos.x - cellData.x) + Math.abs(player.pos.y - cellData.y);
			if (delta > 0 && playerTurn == true && state.moving == false) {
				const menu = new Object();
				menu.buttons = new Array();
				if (cellData.contents.occupant && player.sees(cellData.x, cellData.y)) {
					menu.header = cellData.contents.occupant.name;
					if (["sword", "knife", "hammer"].includes(cellData.contents.occupant.type)) {
						const getButton = new Object();
						getButton.label = "Pick up";
						getButton.cost = player.pendingCost() + 1;
						getButton.clickAction = function () {
							player.planGetItem(cellData.contents.occupant);
							movePlayer();
						};
						menu.buttons.push(getButton);
					} else {
						if (cellData.contents.occupant.hp && cellData.contents.occupant.ai) {
							menu.hp = cellData.contents.occupant.hp;
							menu.maxHp = cellData.contents.occupant.maxHp;
						}
						if (player.equipment.length > 0) {
							const throwItemButton = new Object();
							throwItemButton.label = "Throw " + player.equipment[0].id;
							throwItemButton.cost = 2;
							throwItemButton.clickAction = function () {
								player.path.length = 0;
								player.planThrow(cellData.contents.occupant);
								movePlayer();
							};
							menu.buttons.push(throwItemButton);
						}

						const punchButton = new Object();
						punchButton.label = "Punch";
						if (player.equipment.length > 0) {
							if (player.equipment[0].id == "sword") {
								punchButton.label = "Slash";
							} else if (player.equipment[0].id == "knife") {
								punchButton.label = "Stab";
							} else if (player.equipment[0].id == "hammer") {
								punchButton.label = "Clobber";
							}
						}
						punchButton.cost = player.pendingCost() + player.activeAttack.cost() - 1;
						punchButton.clickAction = function () {
							player.planAttack(cellData.contents.occupant);
							movePlayer();
						};
						menu.buttons.push(punchButton);
					}

					const shoveButton = new Object();
					shoveButton.label = "Shove";
					shoveButton.cost = player.pendingCost() + 3 - 1;
					shoveButton.clickAction = function () {
						player.planShove(cellData.contents.occupant);
						movePlayer();
					};
					menu.buttons.push(shoveButton);

					const tossButton = new Object();
					tossButton.label = "Toss";
					tossButton.cost = player.pendingCost() + 3 - 1;
					tossButton.clickAction = function () {
						player.planToss(cellData.contents.occupant);
						movePlayer();
					};
					menu.buttons.push(tossButton);
				} else {
					menu.header = capitalize(cellData.contents.type);
					if ((player.path.length == 1 && delta > 1) == false) {
						const moveButton = new Object();
						moveButton.label = "Move here";
						moveButton.cost = player.pendingCost();
						moveButton.clickAction = function () {
							movePlayer();
						};
						menu.buttons.push(moveButton);
					}
				}
				drawInteractionMenu(menu, cell);
			}
		}

		cell.addEventListener("mouseover", () => {
			if (playerTurn == true && state.moving == false && state.menu == false) {
				updateMovementPath(cellData.x, cellData.y);
			}
		});
		cell.addEventListener("mouseout", () => {
			if (state.menu == false) {
				clearPendingPath();
			}
		});
		cell.addEventListener("click", () => {
			addMenuToCell(cellData, cell);
		});
	}

	//cycle through cells and render them
	map.reference.forEach((cellData) => {
		drawCell(cellData);
	});

	document.getElementById(map.entrance.x + "_" + map.entrance.y).appendChild(document.createTextNode("⍈"));
	document.getElementById(map.exit.x + "_" + map.exit.y).appendChild(document.createTextNode("⍈"));
}

function drawActors() {
	actors.forEach((actor) => {
		drawActor(actor);
	});
}

function drawActor(actor) {
	const actorElement = document.createElement("div");
	actorElement.classList.add("mapcell_actor");
	actorElement.classList.add("mapcell_actor_" + actor.id);
	actorElement.style.left = actor.pos.x * options.cellSize + 1 + "px";
	actorElement.style.top = actor.pos.y * options.cellSize + 1 + "px";
	actorElement.style.color = actor.color;
	const actorIcon = document.createElement("div");
	actorIcon.classList.add("icon");
	actorIcon.textContent = actor.symbol;
	actorElement.appendChild(actorIcon);
	screenActorLayer.appendChild(actorElement);
	actor.actorElement = actorElement;
	actor.visibility();
}

function renderInterface() {
	// Bars
	const interfaceBarsContainer = document.createElement("div");
	interfaceBarsContainer.classList.add("interfaceBarsContainer");

	const healthContainer = document.createElement("div");
	healthContainer.classList.add("healthContainer", "container");
	const healthIcon = document.createElement("div");
	healthIcon.classList.add("icon");
	healthIcon.appendChild(healthIconSvg.cloneNode(true));
	const healthBar = document.createElement("div");
	healthBar.classList.add("bar", "healthBar");
	healthContainer.appendChild(healthIcon);
	healthContainer.appendChild(healthBar);

	const energyContainer = document.createElement("div");
	energyContainer.classList.add("energyContainer", "container");
	const energyIcon = document.createElement("div");
	healthIcon.classList.add("icon");
	energyIcon.appendChild(energyIconSvg.cloneNode(true));
	const energyBar = document.createElement("div");
	energyBar.classList.add("bar", "energyBar");
	energyContainer.appendChild(energyIcon);
	energyContainer.appendChild(energyBar);

	interfaceBarsContainer.appendChild(healthContainer);
	interfaceBarsContainer.appendChild(energyContainer);
	screenInterfaceLayer.appendChild(interfaceBarsContainer);

	// Buttons
	const interfaceButtonsContainer = document.createElement("div");
	interfaceButtonsContainer.classList.add("interfaceButtonsContainer");

	// End turn button
	const endTurnButtonGroup = document.createElement("div");
	endTurnButtonGroup.classList.add("buttonGroup", "endTurnButtonGroup");

	const endTurnButtonLabel = document.createElement("div");
	endTurnButtonLabel.classList.add("label", "endTurnButtonLabel");
	endTurnButtonLabel.textContent = "End turn";
	endTurnButtonGroup.appendChild(endTurnButtonLabel);

	const endTurnButton = document.createElement("div");
	endTurnButton.classList.add("button", "endTurnButton");
	endTurnButton.appendChild(endTurnIconSvg.cloneNode(true));
	endTurnButton.addEventListener("click", () => {
		endplayerTurn();
	});
	endTurnButtonGroup.appendChild(endTurnButton);
	screenInterfaceLayer.appendChild(endTurnButtonGroup);

	// View mode buttons
	const viewModeButtonGroup = document.createElement("div");
	viewModeButtonGroup.classList.add("buttonGroup", "viewModeButtonGroup");

	const viewModeButtonLabel = document.createElement("div");
	viewModeButtonLabel.classList.add("label", "viewModeButtonLabel");
	viewModeButtonLabel.textContent = "View mode";
	viewModeButtonGroup.appendChild(viewModeButtonLabel);

	const viewModeToggleButtonGroup = document.createElement("div");
	viewModeToggleButtonGroup.classList.add("toggleButtonGroup", "viewModeToggleButtonGroup");
	viewModeButtonGroup.appendChild(viewModeToggleButtonGroup);

	const viewModeTacticalButton = document.createElement("div");
	viewModeTacticalButton.classList.add("button", "viewModeTacticalButton");
	viewModeTacticalButton.appendChild(viewModeTacticalIconSvg.cloneNode(true));
	viewModeTacticalButton.addEventListener("click", () => {
		setViewMode("tactical");
	});
	viewModeToggleButtonGroup.appendChild(viewModeTacticalButton);

	const viewModeDynamicButton = document.createElement("div");
	viewModeDynamicButton.classList.add("button", "viewModeDynamicButton", "active");
	viewModeDynamicButton.appendChild(viewModeDynamicIconSvg.cloneNode(true));
	viewModeDynamicButton.addEventListener("click", () => {
		setViewMode("dynamic");
	});
	viewModeToggleButtonGroup.appendChild(viewModeDynamicButton);

	const viewModeCinematicButton = document.createElement("div");
	viewModeCinematicButton.classList.add("button", "viewModeCinematicButton");
	viewModeCinematicButton.appendChild(viewModeCinematicIconSvg.cloneNode(true));
	viewModeCinematicButton.addEventListener("click", () => {
		setViewMode("cinematic");
	});
	viewModeToggleButtonGroup.appendChild(viewModeCinematicButton);

	interfaceButtonsContainer.appendChild(viewModeButtonGroup);

	// Toggle music
	const toggleMusicButtonGroup = document.createElement("div");
	toggleMusicButtonGroup.classList.add("buttonGroup", "toggleMusicButtonGroup");

	const musicOnButton = document.createElement("div");
	musicOnButton.classList.add("button", "musicOnButton", "hideButton");
	musicOnButton.appendChild(musicOnSvg.cloneNode(true));
	musicOnButton.addEventListener("click", () => {
		playMusic();
		document.querySelectorAll(".musicOnButton").forEach((item) => {
			item.classList.add("hideButton");
		});
		document.querySelectorAll(".musicOffButton").forEach((item) => {
			item.classList.remove("hideButton");
		});
	});
	toggleMusicButtonGroup.appendChild(musicOnButton);

	const musicOffButton = document.createElement("div");
	musicOffButton.classList.add("button", "musicOffButton");
	musicOffButton.appendChild(musicOffSvg.cloneNode(true));
	musicOffButton.addEventListener("click", () => {
		stopMusic();
		document.querySelectorAll(".musicOffButton").forEach((item) => {
			item.classList.add("hideButton");
		});
		document.querySelectorAll(".musicOnButton").forEach((item) => {
			item.classList.remove("hideButton");
		});
	});
	toggleMusicButtonGroup.appendChild(musicOffButton);
	interfaceButtonsContainer.appendChild(toggleMusicButtonGroup);

	screenInterfaceLayer.appendChild(interfaceButtonsContainer);
}

function closeInteractionMenu() {
	state.menu = false;
	document.querySelectorAll(".interactionMenuContainer").forEach((menu) => {
		menu.remove();
	});
}

function drawInteractionMenu(
	menu,
	source,
	closeButton = true,
	exitOnButtonClick = true,
	x = false,
	y = false,
	dontCloseOthers = false,
) {
	if (dontCloseOthers == false) {
		closeInteractionMenu();
	}
	state.menu = true;
	if (closeButton) {
		const button = new Object();
		button.label = "Cancel";
		button.clickAction = function () {
			closeInteractionMenu();
		};
		menu.buttons.push(button);
	}

	const interactionMenuContainer = document.createElement("div");
	interactionMenuContainer.classList.add("interactionMenuContainer");

	if (menu.header) {
		const interactionMenuHeader = document.createElement("div");
		interactionMenuHeader.classList.add("interactionMenuHeader");
		interactionMenuHeader.innerText = menu.header;
		interactionMenuContainer.appendChild(interactionMenuHeader);
	}

	if (menu.hp && menu.maxHp) {
		const interactionMenuHealth = document.createElement("div");
		interactionMenuHealth.classList.add("interactionMenuHealth");
		interactionMenuHealth.appendChild(healthIconSvg.cloneNode(true));
		for (let i = 1; i <= menu.maxHp; i++) {
			const barItem = document.createElement("div");
			barItem.classList.add("barItem");
			if (i <= menu.hp) {
				barItem.classList.add("filled");
			} else {
				barItem.classList.add("empty");
			}
			barItem.appendChild(barSvg.cloneNode(true));
			interactionMenuHealth.appendChild(barItem);
		}
		interactionMenuContainer.appendChild(interactionMenuHealth);
	}

	if (menu.description) {
		const interactionMenuDescription = document.createElement("div");
		interactionMenuDescription.classList.add("interactionMenuDescription");
		interactionMenuDescription.innerText = menu.description;
		interactionMenuContainer.appendChild(interactionMenuDescription);
	}

	menu.buttons.forEach((button) => {
		let interActionMenuButton = document.createElement("div");
		interActionMenuButton.classList.add("interActionMenuButton");
		interActionMenuButton.appendChild(document.createTextNode(button.label));
		if (button.cost) {
			interActionMenuButton.appendChild(document.createTextNode(" ("));
			interActionMenuButton.appendChild(energyIconSvg.cloneNode(true));
			interActionMenuButton.appendChild(document.createTextNode("-" + button.cost + ")"));
		}
		interActionMenuButton.addEventListener("click", () => {
			button.clickAction();
			if (exitOnButtonClick) {
				closeInteractionMenu();
			}
		});
		interactionMenuContainer.appendChild(interActionMenuButton);
	});

	screenInterfaceLayer.appendChild(interactionMenuContainer);

	//determine position

	if (source) {
		const menuCoords = interactionMenuContainer.getBoundingClientRect();
		const sourceCoords = source.getBoundingClientRect();
		const containerCoords = screenInterfaceLayer.getBoundingClientRect();

		if (menuCoords.width + sourceCoords.right < containerCoords.right) {
			interactionMenuContainer.style.left = sourceCoords.right - containerCoords.left + "px";
		} else {
			interactionMenuContainer.style.left = sourceCoords.left - menuCoords.width - containerCoords.left + "px";
		}
		if (menuCoords.height + sourceCoords.top < containerCoords.bottom) {
			interactionMenuContainer.style.top = sourceCoords.top - containerCoords.top + "px";
		} else {
			interactionMenuContainer.style.top = sourceCoords.bottom - menuCoords.height - containerCoords.top + "px";
		}
	} else if (x && y) {
		interactionMenuContainer.style.left = x;
		interactionMenuContainer.style.top = y;
	}
}

// function drawTitleScreen() {
// 	let titlebg = document.createElement("div");
// 	titlebg.classList = "titlebg";
// 	let title_visual = document.createElement("div");
// 	title_visual.classList = "title_visual";
// 	title_visual.innerHTML =
// 		"&nbsp;______&nbsp;__&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;__&nbsp;<br />|&nbsp;&nbsp;&nbsp;__&nbsp;\\__|.-----.-----.&nbsp;&nbsp;&nbsp;&nbsp;.---.-.-----.--|&nbsp;&nbsp;|<br />|&nbsp;&nbsp;&nbsp;&nbsp;__/&nbsp;&nbsp;||__&nbsp;--|__&nbsp;--|&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;_&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;_&nbsp;&nbsp;|<br />|___|&nbsp;&nbsp;|__||_____|_____|&nbsp;&nbsp;&nbsp;&nbsp;|___._|__|__|_____|<br />&nbsp;___&nbsp;___&nbsp;__<br />|&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;|__|.-----.-----.-----.---.-.----.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br />|&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;||&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;-__|&nbsp;&nbsp;_&nbsp;&nbsp;|&nbsp;&nbsp;_&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;_|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br />&nbsp;\\_____/|__||__|__|_____|___&nbsp;&nbsp;|___._|__|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|_____|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
// 	interactionMenu = drawMainMenu(false, false);
// 	let title_menu = document.querySelectorAll(".interactionmenu")[0];
// 	titlebg.appendChild(title_visual);
// 	titlebg.appendChild(title_menu);
// 	document.querySelector("#cylinder").appendChild(titlebg);
// }

// function drawInteractionMenu(target, actions = [], x = false, y = false) {
// 	const menu = document.createElement("div");
// 	menu.classList = "interactionmenu";
// 	if (target.portrait) {
// 		const portrait = document.createElement("div");
// 		portrait.classList = "portrait";
// 		menu.appendChild(portrait);
// 		for (pi = 0; pi < target.portrait.length; pi++) {
// 			let line = document.createElement("div");
// 			line.classList = "line";
// 			for (pj = 0; pj < target.portrait[pi][0].length; pj++) {
// 				let cell = document.createElement("div");
// 				cell.classList = "cell";
// 				cell.innerText = target.portrait[pi][0][pj];
// 				line.appendChild(cell);
// 			}
// 			portrait.appendChild(line);
// 		}
// 	}
// 	const title = document.createElement("div");
// 	title.classList = "title";
// 	title.innerHTML = target.name;
// 	menu.appendChild(title);
// 	const desc = document.createElement("div");
// 	desc.classList = "desc";
// 	desc.innerHTML = capitalize(target.status.join(", "));
// 	menu.appendChild(desc);
// 	menu.style.width = 9 * options.cellSize + "px";
// 	let posx, posy;
// 	if (x == false && y == false) {
// 		posx = target.pos.x;
// 		posy = target.pos.y;
// 	} else {
// 		posx = x;
// 		posy = y;
// 	}
// 	if (posx < player.pos.x) {
// 		menu.style.left = (posx - 9) * options.cellSize + "px";
// 	} /*if (target.pos.x > player.pos.x)*/ else {
// 		menu.style.left = (posx + 1) * options.cellSize + "px";
// 	}
// 	if (posy < player.pos.y) {
// 		menu.style.top = posy * options.cellSize + "px";
// 		menu.style.left = (posx - 9) * options.cellSize + "px";
// 	} else if (posy > player.pos.y) {
// 		menu.style.left = posx * options.cellSize + "px";
// 		menu.style.top = (posy + 1) * options.cellSize + "px";
// 	} else {
// 		menu.style.top = posy * options.cellSize + "px";
// 		menu.style.transform = "translateY(-50%)";
// 	}
// 	let buttons = document.createElement("div");
// 	buttons.classList = "buttons";
// 	menu.appendChild(buttons);
// 	if (actions && actions.length > 0) {
// 		actions.forEach((action, index) => {
// 			let newbutton = document.createElement("div");
// 			newbutton.classList = "button";
// 			if (index == 0) {
// 				newbutton.classList.add("active");
// 			}
// 			if (action.disabled) {
// 				newbutton.classList.add("disabled");
// 			}
// 			let newbutton_inner = document.createElement("div");
// 			newbutton_inner.classList = "button_inner";
// 			newbutton_inner.innerHTML =
// 				"<span>" + capitalize(action.label) + "</span><span>[" + (index + 1) + "]</span>";
// 			newbutton.appendChild(newbutton_inner);

// 			buttons.appendChild(newbutton);
// 			if (action.desc) {
// 				let desc = document.createElement("div");
// 				desc.classList = "button_desc";
// 				desc.innerHTML = action.desc;
// 				desc.style.width = "100%";
// 				newbutton.appendChild(desc);
// 			}
// 		});
// 	}

// 	const closebutton = document.createElement("div");
// 	closebutton.classList = "button close";
// 	let newbutton_inner = document.createElement("div");
// 	newbutton_inner.classList = "button_inner";
// 	newbutton_inner.innerHTML = "<span>Cancel</span><span>[esc]</span>";
// 	closebutton.appendChild(newbutton_inner);

// 	closebutton.setAttribute("data-action", "closeinteractionmenu");
// 	buttons.appendChild(closebutton);

// 	let mapcontainer = document.querySelectorAll(".mapcontainer .interfacelayer");
// 	mapcontainer.forEach((item) => {
// 		item.appendChild(menu.cloneNode(true));
// 	});

// 	this.selected = 0;
// 	this.numitems = actions.length;
// 	this.actions = actions;
// 	this.actions.push({ label: "Cancel", action: "interactionMenu.close();" });

// 	this.close = function () {
// 		document.querySelectorAll(".interactionmenu").forEach((item) => {
// 			item.remove();
// 		});
// 		mode = 0;
// 	};

// 	this.prev = function () {
// 		this.selected--;
// 		if (this.selected < 0) {
// 			this.selected = this.numitems;
// 		}
// 		document.querySelectorAll(".interactionmenu .button.active").forEach((item) => {
// 			item.classList.remove("active");
// 		});
// 		document.querySelectorAll(".interactionmenu .button:nth-child(" + (this.selected + 1) + ")").forEach((item) => {
// 			item.classList.add("active");
// 		});
// 	};

// 	this.next = function () {
// 		this.selected++;
// 		if (this.selected > this.numitems) {
// 			this.selected = 0;
// 		}
// 		document.querySelectorAll(".interactionmenu .button.active").forEach((item) => {
// 			item.classList.remove("active");
// 		});
// 		document.querySelectorAll(".interactionmenu .button:nth-child(" + (this.selected + 1) + ")").forEach((item) => {
// 			item.classList.add("active");
// 		});
// 	};

// 	this.confirm = function (index = this.selected) {
// 		if (index <= this.numitems) {
// 			if (!actions[index].disabled) {
// 				execute(actions[index].action);
// 				if (actions[index].action != "interactionMenu.close();") {
// 					updatePlayer(true);
// 				}
// 			}
// 		}
// 	};

// 	return this;
// }

// function drawMainMenu(exit = false, free = true, titletext = "Menu") {
// 	this.selected = 0;

// 	this.close = function () {
// 		document.querySelectorAll(".interactionmenu").forEach((item) => {
// 			item.remove();
// 		});
// 		mode = 0;
// 	};

// 	this.prev = function () {
// 		this.selected--;
// 		if (this.selected < 0) {
// 			this.selected = this.numitems;
// 		}
// 		document.querySelectorAll(".interactionmenu .button.active").forEach((item) => {
// 			item.classList.remove("active");
// 		});
// 		document.querySelectorAll(".interactionmenu .button:nth-child(" + (this.selected + 1) + ")").forEach((item) => {
// 			item.classList.add("active");
// 		});
// 	};

// 	this.next = function () {
// 		this.selected++;
// 		if (this.selected > this.numitems) {
// 			this.selected = 0;
// 		}
// 		document.querySelectorAll(".interactionmenu .button.active").forEach((item) => {
// 			item.classList.remove("active");
// 		});
// 		document.querySelectorAll(".interactionmenu .button:nth-child(" + (this.selected + 1) + ")").forEach((item) => {
// 			item.classList.add("active");
// 		});
// 	};

// 	this.confirm = function (index = this.selected) {
// 		if (index <= this.numitems) {
// 			execute(actions[index].action);
// 		}
// 	};

// 	playerTurn = true;
// 	mode = 1;
// 	const menu = document.createElement("div");
// 	menu.classList = "interactionmenu";
// 	menu.style.width = 8 * options.cellSize + "px";
// 	if (free) {
// 		menu.style.left = "calc(50vw - " + 4 * options.cellSize + "px)";
// 		menu.style.top = "50vh";
// 		menu.style.transform = "translateY(-50%)";
// 	}
// 	const title = document.createElement("div");
// 	title.classList = "mainmenu title";
// 	title.innerHTML = titletext;
// 	menu.appendChild(title);
// 	actions = [
// 		{
// 			label: "New game",
// 			action: "newLevel(true);interactionMenu.close();",
// 		},
// 		{
// 			label: "Load game",
// 			action: "",
// 			disabled: true,
// 		},
// 		{
// 			label: "Save game",
// 			action: "",
// 			disabled: true,
// 		},
// 	];
// 	this.numitems = actions.length;
// 	this.actions = actions;
// 	let buttons = document.createElement("div");
// 	buttons.classList = "buttons";
// 	menu.appendChild(buttons);
// 	actions.forEach((action, index) => {
// 		let newbutton = document.createElement("div");
// 		newbutton.classList = "button";
// 		if (index == 0) {
// 			newbutton.classList.add("active");
// 		}
// 		if (action.disabled) {
// 			newbutton.classList.add("disabled");
// 		}

// 		let newbutton_inner = document.createElement("div");
// 		newbutton_inner.classList = "button_inner";
// 		newbutton_inner.innerHTML = "<span>" + capitalize(action.label) + "</span><span>[" + (index + 1) + "]</span>";
// 		newbutton.appendChild(newbutton_inner);

// 		buttons.appendChild(newbutton);
// 	});
// 	if (exit) {
// 		const closebutton = document.createElement("div");
// 		closebutton.classList = "button close";
// 		let newbutton_inner = document.createElement("div");
// 		newbutton_inner.classList = "button_inner";
// 		newbutton_inner.innerHTML = "<span>Cancel</span><span>[esc]</span>";
// 		closebutton.appendChild(newbutton_inner);
// 		closebutton.setAttribute("data-action", "closeinteractionmenu");
// 		buttons.appendChild(closebutton);
// 	}

// 	document.querySelector("#cylinder").appendChild(menu.cloneNode(true));

// 	return this;
// }

// function drawStatus() {
// 	// main area
// 	const statuscontainer = document.createElement("div");
// 	statuscontainer.classList = "statuscontainer";

// 	// top area
// 	const top = document.createElement("div");
// 	top.classList = "top column";

// 	const mpbar_container = document.createElement("div");
// 	mpbar_container.classList = "mpbar_container bar_container";
// 	const mpbar_icon = document.createElement("div");
// 	mpbar_icon.classList = "icon";
// 	mpbar_icon.innerHTML = "<img src='./style/hand-fist-solid.svg'>";
// 	const mpbar_label = document.createElement("div");
// 	mpbar_label.classList = "label";
// 	mpbar_label.innerHTML = "PISS";
// 	mpbar_label.setAttribute("data-text", "PISS");
// 	const mpbar = document.createElement("div");
// 	mpbar.classList = "bar mpbar";
// 	const mpbar_inner = document.createElement("div");
// 	mpbar_inner.classList = "bar_inner mpbar_inner";
// 	mpbar_container.appendChild(mpbar_label);
// 	mpbar_container.appendChild(mpbar_icon);
// 	mpbar_container.appendChild(mpbar);
// 	mpbar.appendChild(mpbar_inner);

// 	const hpbar_container = document.createElement("div");
// 	hpbar_container.classList = "hpbar_container bar_container";
// 	const hpbar_icon = document.createElement("div");
// 	hpbar_icon.classList = "icon";
// 	hpbar_icon.innerHTML = "<img src='./style/heart-solid.svg'>";
// 	const hpbar_label = document.createElement("div");
// 	hpbar_label.classList = "label";
// 	hpbar_label.innerHTML = "VINEGAR";
// 	mpbar_label.setAttribute("data-text", "VINEGAR");
// 	const hpbar = document.createElement("div");
// 	hpbar.classList = "bar hpbar";
// 	const hpbar_inner = document.createElement("div");
// 	hpbar_inner.classList = "bar_inner hpbar_inner";
// 	hpbar_container.appendChild(hpbar_label);
// 	hpbar_container.appendChild(hpbar_icon);
// 	hpbar_container.appendChild(hpbar);
// 	hpbar.appendChild(hpbar_inner);

// 	top.appendChild(mpbar_container);
// 	top.appendChild(hpbar_container);
// 	statuscontainer.appendChild(top);

// 	const info = document.createElement("div");
// 	info.classList = "info column";
// 	top.appendChild(info);

// 	// inventory
// 	const invbar = document.createElement("div");
// 	invbar.classList = "invbar column";
// 	let row = document.createElement("div");
// 	row.innerHTML = "Inventory";
// 	row.classList.add("title");
// 	invbar.appendChild(row);
// 	row = document.createElement("div");
// 	row.classList = "items column";
// 	invbar.appendChild(row);
// 	info.appendChild(invbar);

// 	// help items
// 	const helpbar = document.createElement("div");
// 	helpbar.classList = "helpbar column";
// 	let target = document.createElement("div");
// 	target.classList = "target button";
// 	target.innerHTML = "<span>[T]</span><span>Target mode</span>";
// 	helpbar.appendChild(target);
// 	info.appendChild(helpbar);

// 	return statuscontainer;
// }
// function updateStatus() {
// 	document.querySelectorAll(".mpbar").forEach((item) => {
// 		item.style.width = player.maxmp * options.cellSize + 4;
// 	});

// 	document.querySelectorAll(".mpbar_inner").forEach((item) => {
// 		item.style.width = player.mp * options.cellSize;
// 	});

// 	document.querySelectorAll(".hpbar").forEach((item) => {
// 		item.style.width = player.maxhp * options.cellSize + 4;
// 	});

// 	document.querySelectorAll(".hpbar_inner").forEach((item) => {
// 		item.style.width = player.hp * options.cellSize;
// 	});

// 	document.querySelectorAll(".invbar .title").forEach((item) => {
// 		item.innerHTML = "Inventory " + player.inventory.length + "/" + player.maxinventory;
// 	});

// 	document.querySelectorAll(".invbar .items").forEach((invbar) => {
// 		invbar.innerHTML = "";
// 		if (player.inventory.length > 0 || player.molotov > 0) {
// 			player.inventory.forEach((item) => {
// 				let row = document.createElement("div");
// 				row.innerHTML = "<li>" + item.name + "</li>";
// 				row.classList.add("item");
// 				invbar.appendChild(row);
// 			});
// 			if (player.molotov > 0) {
// 				let row = document.createElement("div");
// 				row.innerHTML = "<li>Molotov " + player.molotov + "/2</li>";
// 				row.classList.add("item");
// 				invbar.appendChild(row);
// 			}
// 		} else {
// 			/*let row = document.createElement("div");
// 			row.innerHTML = "<i>Empty</i>";
// 			row.classList.add("item");
// 			invbar.appendChild(row);*/
// 		}
// 	});
// }

// function buildScreen() {
// 	const screen = document.createElement("div");
// 	screen.classList = "mainscreen";
// 	screen.appendChild(mapdisplay);
// 	screen.appendChild(drawStatus());

// 	return screen;
// }

// function drawToScreen(content) {
// 	const body = document.getElementById("body");
// 	if (options.crt) {
// 		body.classList = "withcrt";
// 		const segments = document.querySelectorAll(".main_segment_container");
// 		segments.forEach((item) => {
// 			item.appendChild(content.cloneNode(true));
// 		});
// 	} else {
// 		//body.classList = "nocrt";
// 		document.getElementById("cylinder").appendChild(content);
// 	}
// }
