window.addEventListener(
	"keydown",
	function (event) {
		if (event.defaultPrevented) {
			return; // Do nothing if the event was already processed
		}
		if (playerTurn == true) {
			switch (event.code) {
				case "ArrowDown":
				case "Numpad2":
					// code for "down arrow" key press.
					handleInput("down");
					break;
				case "ArrowUp":
				case "Numpad8":
					// code for "up arrow" key press.
					handleInput("up");
					break;
				case "ArrowLeft":
				case "Numpad4":
					// code for "left arrow" key press.
					handleInput("left");
					break;
				case "ArrowRight":
				case "Numpad6":
					// code for "right arrow" key press.
					handleInput("right");
					break;
				case "Enter":
				case "Space":
				case "Numpad5":
					// code for "right arrow" key press.
					handleInput("confirm");
					break;
				case "Escape":
					handleInput("escape");
					break;
				case "Digit1":
					handleInput(1);
					break;
				case "Digit2":
					handleInput(2);
					break;
				case "Digit3":
					handleInput(3);
					break;
				case "Digit4":
					handleInput(4);
					break;
				case "Digit5":
					handleInput(5);
					break;
				case "Digit6":
					handleInput(6);
					break;
				case "Digit7":
					handleInput(7);
					break;
				case "Digit8":
					handleInput(8);
					break;
				case "Digit9":
					handleInput(9);
					break;
				case "Digit0":
					handleInput(0);
					break;
				default:
					return; // Quit when this doesn't handle the key event.
			}
		}
		// Cancel the default action to avoid it being handled twice
		event.preventDefault();
	},
	true
);
// the last option dispatches the event to the listener first,
// then dispatches event to window


window.addEventListener("resize", (event) => {
	// handle window resize
});