import React, { useRef, useEffect } from "react";
import * as PIXI from "pixi.js";
import { KawaseBlurFilter } from "@pixi/filter-kawase-blur";
import { createNoise2D } from "simplex-noise";
import debounce from "debounce";

// return a random number within a range
function random(min, max) {
	return Math.random() * (max - min) + min;
}

// map a number from 1 range to another
function map(n, start1, end1, start2, end2) {
	return ((n - start1) / (end1 - start1)) * (end2 - start2) + start2;
}

// Orb Class
class Orb {
	constructor(fill = 0x000000) {
		// Set a margin to keep blobs from the edges of the container
		this.margin = window.innerWidth * 0.1; // e.g., 10% of the window width

		// bounds = the area an orb is "allowed" to move within
		this.bounds = this.setBounds();
		// initialise the orb's { x, y } values to a random point within its bounds
		this.x = random(this.bounds["x"].min, this.bounds["x"].max);
		this.y = random(this.bounds["y"].min, this.bounds["y"].max);

		// how large the orb is vs its original radius (this will modulate over time)
		this.scale = 1;

		// what color is the orb?
		this.fill = fill;

		// the original radius of the orb, set relative to window height
		this.radius = random(window.innerHeight / 6, window.innerHeight / 3);

		// starting points in "time" for the noise/self similar random values
		this.xOff = random(0, 1000);
		this.yOff = random(0, 1000);
		// how quickly the noise/self similar random values step through time
		this.inc = 0.01;

		// PIXI.Graphics is used to draw 2d primitives (in this case a circle) to the canvas
		this.graphics = new PIXI.Graphics();
		this.graphics.alpha = 0.825;

		// 250ms after the last window resize event, recalculate orb positions.
		window.addEventListener(
			"resize",
			debounce(() => {
				this.bounds = this.setBounds();
			}, 250)
		);
	}

	setBounds() {
		// how far from the { x, y } origin can each orb move
		const maxDist = window.innerWidth < 1000 ? window.innerWidth / 3 : window.innerWidth / 5;

		// the { x, y } origin for each orb (the bottom right of the screen)
		const originX = window.innerWidth / 5;
		const originY = window.innerWidth < 1000 ? window.innerHeight : window.innerHeight / 2.375;

		// use the margin to restrict the bounds
		return {
			x: { min: originX - maxDist + this.margin, max: originX + maxDist - this.margin },
			y: { min: originY - maxDist + this.margin, max: originY + maxDist - this.margin },
		};
	}

	update() {
		// Define how the orb’s position and size should change over time.
		// We'll use SimplexNoise here.
		const noise2D = createNoise2D();
		this.xOff += this.inc;
		this.yOff += this.inc;
		this.x = map(noise2D(this.xOff, 0), -1, 1, this.x - 40, this.x + 40);
		this.y = map(noise2D(0, this.yOff), -1, 1, this.y - 30, this.y + 30);

		this.scale = map(Math.sin(this.xOff), -1, 1, 0.45, 0.65);
	}

	render() {
		this.graphics.x = this.x;
		this.graphics.y = this.y;
		this.graphics.scale.set(this.scale);

		this.graphics.clear();
		this.graphics.beginFill(this.fill);
		this.graphics.drawCircle(0, 0, this.radius);
		this.graphics.endFill();
	}
}

class ColorPalette {
	constructor() {
		this.setColors();
		this.setCustomProperties();
	}

	setColors() {
		// Define your specific colors here
		this.baseColor = "#366bc0ec"; // red
		this.complimentaryColor1 = "#306eff"; // green
		this.complimentaryColor2 = "#128999"; // blue
		this.complimentaryColor3 = "#ffd900"; // blue

		this.colorChoices = [this.baseColor, this.complimentaryColor1, this.complimentaryColor2];
	}

	randomColor() {
		return this.colorChoices[~~random(0, this.colorChoices.length)].replace("#", "0x");
	}

	setCustomProperties() {
		document.documentElement.style.setProperty("--hue", this.hue);
		document.documentElement.style.setProperty("--hue-complimentary1", this.complimentaryHue1);
		document.documentElement.style.setProperty("--hue-complimentary2", this.complimentaryHue2);
	}
}

const BackgroundBlur = ({ numOrbs = 10 }) => {
	const pixiContainer = useRef();

	useEffect(() => {
		if (typeof window !== "undefined") {
			const app = new PIXI.Application({
				width: window.innerWidth,
				height: "700",
				antialias: true,
				transparent: true,
				resolution: 1,
			});

			let background = new PIXI.Graphics();
			background.beginFill(0xffffff);
			background.drawRect(0, 0, window.innerWidth, window.innerHeight);
			background.endFill();
			app.stage.addChild(background);

			pixiContainer.current.appendChild(app.view);
			app.stage.filters = [new KawaseBlurFilter(0, 0, true)];

			const colorPalette = new ColorPalette();
			const orbs = [];

			for (let i = 0; i < numOrbs; i++) {
				const orb = new Orb(colorPalette.randomColor());
				app.stage.addChild(orb.graphics);
				orbs.push(orb);
			}

			if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
				app.ticker.add(() => {
					orbs.forEach((orb) => {
						orb.update();
						orb.render();
					});
				});
			} else {
				orbs.forEach((orb) => {
					orb.update();
					orb.render();
				});
			}

			return () => {
				app.destroy(true, { children: true, texture: true, baseTexture: true });
			};
		}
	}, [numOrbs]);

	return (
		<div
			ref={pixiContainer}
			style={{ position: "absolute", top: 0, left: 0, bottom: 0 }}
			className='pixi-container'
		></div>
	);
};

export default BackgroundBlur;
