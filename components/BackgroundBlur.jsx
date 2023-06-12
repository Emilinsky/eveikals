import React, { useRef, useEffect } from "react";
import * as PIXI from "pixi.js";
import { KawaseBlurFilter } from "@pixi/filter-kawase-blur";
import alea from "alea";
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
		this.noise2D = createNoise2D(alea("seed"));
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
		this.radius = random(window.innerHeight / 8, window.innerHeight / 4);

		// starting points in "time" for the noise/self similar random values
		this.xOff = random(0, 1500);
		this.yOff = random(0, 8000);
		// how quickly the noise/self similar random values step through time
		// VALUE: speed
		this.inc = 0.0009;

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
		// the { x, y } origin for each orb (the top left of the screen)
		// VALUE: Position x/y + movement
		const originX = -250;
		const originY = 100;

		// maxDist now determines the size of the area within which orbs can move
		const maxDist = 2500; // Orbs will be able to move within a 200px square area

		return {
			x: { min: originX, max: originX + maxDist },
			y: { min: originY, max: originY + maxDist / 6 },
		};
	}

	update() {
		// Define how the orb’s position and size should change over time.
		// We'll use SimplexNoise here.
		const noise2D = createNoise2D(alea("seed"));
		this.xOff += this.inc;
		this.yOff += this.inc;
		this.x = map(this.noise2D(this.xOff, 0), -1, 1, this.bounds["x"].min, this.bounds["x"].max);
		this.y = map(this.noise2D(0, this.yOff), -1, 1, this.bounds["y"].min, this.bounds["y"].max);

		//  VALUE: blobs diameter
		this.scale = map(Math.sin(this.xOff), -1, 1, 0.9, 1.1);
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
		// VALUE: setting colors
		this.complimentaryColor3 = "#72efdc76"; // blue
		this.baseColor = "#4ca3f046"; // red
		this.complimentaryColor2 = "#4e7cde50"; // blue
		this.complimentaryColor1 = "#4ccaf070"; // blue
		// this.complimentaryColor4 = "#00b4d8"; // green

		this.colorChoices = [
			this.baseColor,
			this.complimentaryColor1,
			this.complimentaryColor2,
			this.complimentaryColor3,
			// this.complimentaryColor4,
		];
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
				height: window.innerHeight,
				antialias: true,
				transparent: true,
				resolution: 1,
			});

			// Create a new canvas and draw the gradient on it
			const canvas = document.createElement("canvas");
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;

			const ctx = canvas.getContext("2d");

			// Create a linear gradient
			// Change the direction of the gradient to go from bottom to top
			let gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
			//  VALUE: linear-gradient colors
			gradient.addColorStop(0, "#ffffff");
			gradient.addColorStop(1, "#ffffff");

			ctx.fillStyle = gradient;
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			// Create a new texture from the canvas
			const backgroundTexture = PIXI.Texture.from(canvas);

			// Create a new sprite from the texture
			const background = new PIXI.Sprite(backgroundTexture);

			app.stage.addChild(background);
			pixiContainer.current.appendChild(app.view);

			app.stage.addChild(background);
			pixiContainer.current.appendChild(app.view);

			pixiContainer.current.appendChild(app.view);

			// VALUE: Changing blobl BLURS
			app.stage.filters = [new KawaseBlurFilter(25, 5, true)];

			const colorPalette = new ColorPalette();
			const orbs = [];

			for (let i = 0; i < numOrbs; i++) {
				const orb = new Orb(colorPalette.randomColor());
				app.stage.addChild(orb.graphics);
				orbs.push(orb);
			}

			if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
				app.ticker.add((deltaTime) => {
					orbs.forEach((orb) => {
						orb.update(deltaTime);
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
			style={{ position: "absolute", top: 0, left: 0, bottom: 0, right: 0 }}
			className='pixi-container'
		></div>
	);
};

export default BackgroundBlur;
