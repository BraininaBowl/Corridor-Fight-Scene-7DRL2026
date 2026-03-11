// Health icon
const healthIconSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
healthIconSvg.classList.add("healthIconSvg");
healthIconSvg.setAttribute("width", options.cellSize);
healthIconSvg.setAttribute("height", options.cellSize);
healthIconSvg.setAttribute("viewBox", "0 0 " + options.cellSize + " " + options.cellSize);
healthIconSvg.setAttribute("fill", "currentColor");
const healthIconPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
healthIconPath.setAttribute(
	"d",
	"M6.979 3.074a6 6 0 0 1 4.988 1.425l.037 .033l.034 -.03a6 6 0 0 1 4.733 -1.44l.246 .036a6 6 0 0 1 3.364 10.008l-.18 .185l-.048 .041l-7.45 7.379a1 1 0 0 1 -1.313 .082l-.094 -.082l-7.493 -7.422a6 6 0 0 1 3.176 -10.215z",
);
healthIconSvg.appendChild(healthIconPath);

// Energy icon
const energyIconSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
energyIconSvg.classList.add("energyIconSvg");
energyIconSvg.setAttribute("width", options.cellSize);
energyIconSvg.setAttribute("height", options.cellSize);
energyIconSvg.setAttribute("viewBox", "0 0 " + options.cellSize + " " + options.cellSize);
energyIconSvg.setAttribute("fill", "currentColor");
const energyIconPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
energyIconPath.setAttribute(
	"d",
	"M13 2l.018 .001l.016 .001l.083 .005l.011 .002h.011l.038 .009l.052 .008l.016 .006l.011 .001l.029 .011l.052 .014l.019 .009l.015 .004l.028 .014l.04 .017l.021 .012l.022 .01l.023 .015l.031 .017l.034 .024l.018 .011l.013 .012l.024 .017l.038 .034l.022 .017l.008 .01l.014 .012l.036 .041l.026 .027l.006 .009c.12 .147 .196 .322 .218 .513l.001 .012l.002 .041l.004 .064v6h5a1 1 0 0 1 .868 1.497l-.06 .091l-8 11c-.568 .783 -1.808 .38 -1.808 -.588v-6h-5a1 1 0 0 1 -.868 -1.497l.06 -.091l8 -11l.01 -.013l.018 -.024l.033 -.038l.018 -.022l.009 -.008l.013 -.014l.04 -.036l.028 -.026l.008 -.006a1 1 0 0 1 .402 -.199l.011 -.001l.027 -.005l.074 -.013l.011 -.001l.041 -.002z",
);
energyIconSvg.appendChild(energyIconPath);

// End turn icon
const endTurnIconSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
endTurnIconSvg.setAttribute("width", options.cellSize);
endTurnIconSvg.setAttribute("height", options.cellSize);
endTurnIconSvg.setAttribute("viewBox", "0 0 " + options.cellSize + " " + options.cellSize);
endTurnIconSvg.setAttribute("fill", "none");
endTurnIconSvg.setAttribute("stroke", "currentColor");
endTurnIconSvg.setAttribute("stroke-width", "2px");
endTurnIconSvg.setAttribute("stroke-linecap", "round");
const endTurnIconPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
endTurnIconPath.setAttribute("d", "M9 11l-4 4l4 4m-4 -4h11a4 4 0 0 0 0 -8h-1");
endTurnIconSvg.appendChild(endTurnIconPath);

// View label icon
const viewModeLabelIconSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
viewModeLabelIconSvg.setAttribute("width", options.cellSize);
viewModeLabelIconSvg.setAttribute("height", options.cellSize);
viewModeLabelIconSvg.setAttribute("viewBox", "0 0 " + options.cellSize + " " + options.cellSize);
viewModeLabelIconSvg.setAttribute("fill", "none");
viewModeLabelIconSvg.setAttribute("stroke", "currentColor");
viewModeLabelIconSvg.setAttribute("stroke-width", "2px");
viewModeLabelIconSvg.setAttribute("stroke-linecap", "round");
const viewModeLabelIconPath1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
viewModeLabelIconPath1.setAttribute("d", "M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0");
viewModeLabelIconSvg.appendChild(viewModeLabelIconPath1);
const viewModeLabelIconPath2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
viewModeLabelIconPath2.setAttribute(
	"d",
	"M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6",
);
viewModeLabelIconSvg.appendChild(viewModeLabelIconPath2);

// Cinematic view Icon
const viewModeCinematicIconSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
viewModeCinematicIconSvg.setAttribute("width", options.cellSize);
viewModeCinematicIconSvg.setAttribute("height", options.cellSize);
viewModeCinematicIconSvg.setAttribute("viewBox", "0 0 " + options.cellSize + " " + options.cellSize);
viewModeCinematicIconSvg.setAttribute("fill", "none");
viewModeCinematicIconSvg.setAttribute("stroke", "currentColor");
viewModeCinematicIconSvg.setAttribute("stroke-width", "2px");
viewModeCinematicIconSvg.setAttribute("stroke-linecap", "round");
const viewModeCinematicIconPath1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
viewModeCinematicIconPath1.setAttribute(
	"d",
	"M21 16.008v-8.018a1.98 1.98 0 0 0 -1 -1.717l-7 -4.008a2.016 2.016 0 0 0 -2 0l-7 4.008c-.619 .355 -1 1.01 -1 1.718v8.018c0 .709 .381 1.363 1 1.717l7 4.008a2.016 2.016 0 0 0 2 0l7 -4.008c.619 -.355 1 -1.01 1 -1.718",
);
viewModeCinematicIconSvg.appendChild(viewModeCinematicIconPath1);
const viewModeCinematicIconPath2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
viewModeCinematicIconPath2.setAttribute("d", "M12 22v-10");
viewModeCinematicIconSvg.appendChild(viewModeCinematicIconPath2);
const viewModeCinematicIconPath3 = document.createElementNS("http://www.w3.org/2000/svg", "path");
viewModeCinematicIconPath1.setAttribute("d", "M12 12l8.73 -5.04");
viewModeCinematicIconSvg.appendChild(viewModeCinematicIconPath3);
const viewModeCinematicIconPath4 = document.createElementNS("http://www.w3.org/2000/svg", "path");
viewModeCinematicIconPath4.setAttribute("d", "M3.27 6.96l8.73 5.04");
viewModeCinematicIconSvg.appendChild(viewModeCinematicIconPath4);

// Dynamic view Icon
const viewModeDynamicIconSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
viewModeDynamicIconSvg.setAttribute("width", options.cellSize);
viewModeDynamicIconSvg.setAttribute("height", options.cellSize);
viewModeDynamicIconSvg.setAttribute("viewBox", "0 0 " + options.cellSize + " " + options.cellSize);
viewModeDynamicIconSvg.setAttribute("fill", "none");
viewModeDynamicIconSvg.setAttribute("stroke", "currentColor");
viewModeDynamicIconSvg.setAttribute("stroke-width", "2px");
viewModeDynamicIconSvg.setAttribute("stroke-linecap", "round");
const viewModeDynamicIconPath1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
viewModeDynamicIconPath1.setAttribute("d", "M6 17.6l-2 -1.1v-2.5");
viewModeDynamicIconSvg.appendChild(viewModeDynamicIconPath1);
const viewModeDynamicIconPath2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
viewModeDynamicIconPath2.setAttribute("d", "M4 10v-2.5l2 -1.1");
viewModeDynamicIconSvg.appendChild(viewModeDynamicIconPath2);
const viewModeDynamicIconPath3 = document.createElementNS("http://www.w3.org/2000/svg", "path");
viewModeDynamicIconPath3.setAttribute("d", "M10 4.1l2 -1.1l2 1.1");
viewModeDynamicIconSvg.appendChild(viewModeDynamicIconPath3);
const viewModeDynamicIconPath4 = document.createElementNS("http://www.w3.org/2000/svg", "path");
viewModeDynamicIconPath4.setAttribute("d", "M18 6.4l2 1.1v2.5");
viewModeDynamicIconSvg.appendChild(viewModeDynamicIconPath4);
const viewModeDynamicIconPath5 = document.createElementNS("http://www.w3.org/2000/svg", "path");
viewModeDynamicIconPath5.setAttribute("d", "M20 14v2.5l-2 1.12");
viewModeDynamicIconSvg.appendChild(viewModeDynamicIconPath5);
const viewModeDynamicIconPath6 = document.createElementNS("http://www.w3.org/2000/svg", "path");
viewModeDynamicIconPath6.setAttribute("d", "M14 19.9l-2 1.1l-2 -1.1");
viewModeDynamicIconSvg.appendChild(viewModeDynamicIconPath6);
const viewModeDynamicIconPath7 = document.createElementNS("http://www.w3.org/2000/svg", "path");
viewModeDynamicIconPath7.setAttribute("d", "M12 12l2 -1.1");
viewModeDynamicIconSvg.appendChild(viewModeDynamicIconPath7);
const viewModeDynamicIconPath8 = document.createElementNS("http://www.w3.org/2000/svg", "path");
viewModeDynamicIconPath8.setAttribute("d", "M18 8.6l2 -1.1");
viewModeDynamicIconSvg.appendChild(viewModeDynamicIconPath8);
const viewModeDynamicIconPath9 = document.createElementNS("http://www.w3.org/2000/svg", "path");
viewModeDynamicIconPath9.setAttribute("d", "M12 12l0 2.5");
viewModeDynamicIconSvg.appendChild(viewModeDynamicIconPath9);
const viewModeDynamicIconPath10 = document.createElementNS("http://www.w3.org/2000/svg", "path");
viewModeDynamicIconPath10.setAttribute("d", "M12 18.5l0 2.5");
viewModeDynamicIconSvg.appendChild(viewModeDynamicIconPath10);
const viewModeDynamicIconPath11 = document.createElementNS("http://www.w3.org/2000/svg", "path");
viewModeDynamicIconPath11.setAttribute("d", "M12 12l-2 -1.12");
viewModeDynamicIconSvg.appendChild(viewModeDynamicIconPath11);
const viewModeDynamicIconPath12 = document.createElementNS("http://www.w3.org/2000/svg", "path");
viewModeDynamicIconPath12.setAttribute("d", "M6 8.6l-2 -1.1");
viewModeDynamicIconSvg.appendChild(viewModeDynamicIconPath12);

// Tactical view icon
const viewModeTacticalIconSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
viewModeTacticalIconSvg.setAttribute("width", options.cellSize - 4);
viewModeTacticalIconSvg.setAttribute("height", options.cellSize - 4);
viewModeTacticalIconSvg.setAttribute("viewBox", "0 0 " + options.cellSize + " " + options.cellSize);
viewModeTacticalIconSvg.setAttribute("fill", "none");
viewModeTacticalIconSvg.setAttribute("stroke", "currentColor");
viewModeTacticalIconSvg.setAttribute("stroke-width", "2px");
viewModeTacticalIconSvg.setAttribute("stroke-linecap", "round");
const viewModeTacticalIconPath1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
viewModeTacticalIconPath1.setAttribute("d", "M3 8h18");
viewModeTacticalIconSvg.appendChild(viewModeTacticalIconPath1);
const viewModeTacticalIconPath2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
viewModeTacticalIconPath2.setAttribute("d", "M3 16h18");
viewModeTacticalIconSvg.appendChild(viewModeTacticalIconPath2);
const viewModeTacticalIconPath3 = document.createElementNS("http://www.w3.org/2000/svg", "path");
viewModeTacticalIconPath3.setAttribute("d", "M8 3v18");
viewModeTacticalIconSvg.appendChild(viewModeTacticalIconPath3);
const viewModeTacticalIconPath4 = document.createElementNS("http://www.w3.org/2000/svg", "path");
viewModeTacticalIconPath4.setAttribute("d", "M16 3v18");
viewModeTacticalIconSvg.appendChild(viewModeTacticalIconPath4);

// bar segment
const barSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
barSvg.setAttribute("width", options.cellSize - 2);
barSvg.setAttribute("height", options.cellSize);
barSvg.setAttribute("viewBox", "0 0 " + options.cellSize + " " + options.cellSize / 2);
barSvg.setAttribute("fill", "currentColor");
barSvg.setAttribute("stroke", "currentColor");
barSvg.setAttribute("stroke-width", "1px");
barSvg.setAttribute("stroke-linecap", "round");
const barPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
barPath.setAttribute(
	"d",
	"M1.00098 0L0.888916 0.00598145C0.707764 0.0263672 0.544434 0.0913086 0.398926 0.200806C0.253418 0.310425 0.145752 0.449463 0.0761719 0.61792C0.0065918 0.786255 -0.0153809 0.960693 0.010498 1.14111C0.0361328 1.32153 0.105957 1.48279 0.219971 1.625L3.72095 6L0.220947 10.375C0.10083 10.525 0.0297852 10.6956 0.00805664 10.8865C-0.0136719 11.0774 0.0168457 11.2595 0.100098 11.4327C0.183105 11.606 0.306152 11.7438 0.46875 11.8462C0.631348 11.9486 0.808838 11.9999 1.00098 12L17.001 12C17.1526 11.9999 17.2969 11.967 17.4336 11.9012C17.5703 11.8356 17.686 11.7434 17.781 11.625L21.781 6.625C21.9272 6.44238 22.0002 6.23401 22.0002 6C22.0002 5.76599 21.9272 5.55762 21.781 5.375L17.781 0.375C17.686 0.256592 17.5703 0.164429 17.4336 0.0987549C17.2969 0.032959 17.1526 0.00012207 17.001 0L1.00098 0L1.00098 0Z",
);
barSvg.appendChild(barPath);

// music on
const musicOnSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
musicOnSvg.setAttribute("width", options.cellSize);
musicOnSvg.setAttribute("height", options.cellSize);
musicOnSvg.setAttribute("viewBox", "0 0 " + options.cellSize + " " + options.cellSize);
musicOnSvg.setAttribute("stroke", "currentColor");
musicOnSvg.setAttribute("stroke-width", "1px");
musicOnSvg.setAttribute("stroke-linecap", "round");
const musicOnPath1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
musicOnPath1.setAttribute("d", "M3 17a3 3 0 1 0 6 0a3 3 0 0 0 -6 0");
musicOnSvg.appendChild(musicOnPath1);
const musicOnPath2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
musicOnPath2.setAttribute("d", "M13 17a3 3 0 1 0 6 0a3 3 0 0 0 -6 0");
musicOnSvg.appendChild(musicOnPath2);
const musicOnPath3 = document.createElementNS("http://www.w3.org/2000/svg", "path");
musicOnPath3.setAttribute("d", "M9 17v-13h10v13");
musicOnSvg.appendChild(musicOnPath3);
const musicOnPath4 = document.createElementNS("http://www.w3.org/2000/svg", "path");
musicOnPath4.setAttribute("d", "M9 8h10");
musicOnSvg.appendChild(musicOnPath4);

// music off
const musicOffSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
musicOffSvg.setAttribute("width", options.cellSize);
musicOffSvg.setAttribute("height", options.cellSize);
musicOffSvg.setAttribute("viewBox", "0 0 " + options.cellSize + " " + options.cellSize);
musicOffSvg.setAttribute("stroke", "currentColor");
musicOffSvg.setAttribute("stroke-width", "1px");
musicOffSvg.setAttribute("stroke-linecap", "round");
const musicOffPath1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
musicOffPath1.setAttribute("d", "M3 17a3 3 0 1 0 6 0a3 3 0 1 0 -6 0");
musicOffSvg.appendChild(musicOffPath1);
const musicOffPath2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
musicOffPath2.setAttribute("d", "M14.42 14.45a3 3 0 1 0 4.138 4.119");
musicOffSvg.appendChild(musicOffPath2);
const musicOffPath3 = document.createElementNS("http://www.w3.org/2000/svg", "path");
musicOffPath3.setAttribute("d", "M9 17v-8m0 -4v-1h10v11");
musicOffSvg.appendChild(musicOffPath3);
const musicOffPath4 = document.createElementNS("http://www.w3.org/2000/svg", "path");
musicOffPath4.setAttribute("d", "M12 8h7");
musicOffSvg.appendChild(musicOffPath4);
const musicOffPath5 = document.createElementNS("http://www.w3.org/2000/svg", "path");
musicOffPath5.setAttribute("d", "M3 3l18 18");
musicOffSvg.appendChild(musicOffPath5);

const weapons = new Object();
weapons.knife = { cost: 1, damage: 2, name: "Knife", id: "knife", description: "Twice as fast as fists." };
weapons.hammer = {
	cost: 3,
	damage: 3,
	name: "Hammer",
	id: "hammer",
	description: "Hits hard, with a chance to stun.",
};
weapons.sword = {
	cost: 2,
	damage: 3,
	name: "Sword",
	id: "sword",
	description: "A Hatori Hanzo original.",
};
