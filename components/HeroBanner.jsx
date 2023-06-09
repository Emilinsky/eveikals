import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { urlFor } from "../lib/client";

import * as PIXI from "pixi.js";
import { KawaseBlurFilter } from "@pixi/filter-kawase-blur";
import { createNoise2D } from "simplex-noise";
import hsl from "hsl-to-hex";
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
		this.inc = 0.002;

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
		const originX = window.innerWidth / 1.25;
		const originY = window.innerWidth < 1000 ? window.innerHeight : window.innerHeight / 1.375;

		return {
			x: { min: originX - maxDist, max: originX + maxDist },
			y: { min: originY - maxDist, max: originY + maxDist },
		};
	}

	update() {
		// Define how the orb’s position and size should change over time.
		// We'll use SimplexNoise here.
		const noise2D = createNoise2D();
		this.xOff += this.inc;
		this.yOff += this.inc;
		this.x = map(noise2D(this.xOff, this.xOff), -1, 1, this.bounds.x.min, this.bounds.x.max);
		this.y = map(noise2D(this.yOff, this.yOff), -1, 1, this.bounds.y.min, this.bounds.y.max);
		this.scale = map(Math.sin(this.xOff), -1, 1, 0.75, 1.25);
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

	// ... More methods to be added later ...
}

class ColorPalette {
	constructor() {
		this.setColors();
		this.setCustomProperties();
	}

	setColors() {
		this.hue = ~~random(220, 360);
		this.complimentaryHue1 = this.hue + 30;
		this.complimentaryHue2 = this.hue + 60;
		this.saturation = 95;
		this.lightness = 50;

		this.baseColor = hsl(this.hue, this.saturation, this.lightness);
		this.complimentaryColor1 = hsl(this.complimentaryHue1, this.saturation, this.lightness);
		this.complimentaryColor2 = hsl(this.complimentaryHue2, this.saturation, this.lightness);

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

const HeroBanner = ({ HeroBanner }) => {
	// Create a reference to the div that PIXI will use
	const pixiContainer = useRef();

	useEffect(() => {
		if (typeof window !== "undefined") {
			const app = new PIXI.Application({
				width: window.innerWidth,
				height: '700',
				antialias: true,
				transparent: true,
				resolution: 1,
			});

			// Draw a colored background
			let background = new PIXI.Graphics();
			background.beginFill(0xffffff); // Color it the way you want
			background.drawRect(0, 0, window.innerWidth, window.innerHeight);
			background.endFill();
			app.stage.addChild(background);

			pixiContainer.current.appendChild(app.view);
			app.stage.filters = [new KawaseBlurFilter(30, 10, true)];

			const colorPalette = new ColorPalette();
			const orbs = [];

			for (let i = 0; i < 10; i++) {
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
	}, []);

	return (
		<div className='hero-banner-container'>
			<div ref={pixiContainer} style={{ position: "absolute", top: 0, left: 0 }} className='pixi-container'></div>
			<div className='inner_overlay'>
				<p className='cream-solo'> {HeroBanner.smallText}</p>
				<h1>{HeroBanner.largeText1}</h1>
				<h3>{HeroBanner.midText}</h3>
				{/* <img src={urlFor(HeroBanner.image)} alt='shirts' className='hero-banner-image' /> */}

				<div className=''>
					<Link href={`/product/${HeroBanner.product}`}>
						<button type='button'>{HeroBanner.buttonText}</button>
					</Link>
					<div className='desc'>
						<h5>Description</h5>
						<p> {HeroBanner.desc}</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HeroBanner;
