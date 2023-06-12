import React from "react";
import Link from "next/link";
import { urlFor } from "../lib/client";
// import { BackgroundBlur } from "./";
import BackgroundBlur from "./BackgroundBlur";

const HeroBanner = ({ HeroBanner }) => {
	return (
		<div className='hero-banner-container'>
			<BackgroundBlur numOrbs={15} />
			{/* <BackgroundBlur numOrbs={10} /> */}
			<div className='hero-banner-inner-cont'>
				<div className='inner_overlay'>
					<div className='overlay_text'>
						<p className='cream-solo'>
							<span className='first-letter'>F</span>ind your perfect summer companions at our Shopify store. Explore a{" "}
							<span className='word-bg'>diverse selection</span> of customizable drinkware crafted with meticulous
							attention to detail. Enjoy <span className='word-bg'>worldwide shipping</span> for our{" "}
							<span className='word-bg'>high quality</span> items. Experience style, durability, and functionality as
							you quench your thirst with our premium collection.
						</p>
						<h1>{HeroBanner.largeText1}</h1>
						{/* <h3>{HeroBanner.midText}</h3> */}
						{/* <img src={urlFor(HeroBanner.image)} alt='shirts' className='hero-banner-image' /> */}

						<div className='hero-banner-btn'>
							<Link href={`/product/${HeroBanner.product}`}>
								<button type='button'>{HeroBanner.buttonText}</button>
							</Link>
						</div>

						{/* <div className='desc'>
						<h5>Description</h5>
						<p> {HeroBanner.desc}</p>
					</div> */}
					</div>
					<div className='overlay_img'>
						<img src={urlFor(HeroBanner.image)} alt='drinks' className='hero-banner-image' />
					</div>
				</div>
			</div>
		</div>
	);
};

export default HeroBanner;
