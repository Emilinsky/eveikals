import React from "react";
import Link from "next/link";
import { urlFor } from "../lib/client";
import BackgroundBlur from "./BackgroundBlur";

const HeroBanner = ({ HeroBanner }) => {
	return (
		<div className='hero-banner-container'>
			<BackgroundBlur numOrbs={4} />
			<div className='hero-banner-inner'>
				<div className='hero-banner-inner-cont-text'>
					<h1>
						<span className='first_line'>Stay </span>
						<span className='heading-bg'>{HeroBanner.largeTextLine1}</span>
						<br />
						<span className='second_line'>Stay </span>
						<span className='heading-bg'>{HeroBanner.largeTextLine2}</span>
					</h1>
					<div className='inner_overlay'>
						<div className='overlay_text'>
							<p className='cream-solo'>
								<span className='first-letter'>F</span>ind your perfect summer companions at our Shopify store. Explore
								a <span className='word-bg'>diverse selection</span> of customizable drinkware. Enjoy{" "}
								<span className='word-bg'>worldwide shipping</span> for our{" "}
								<span className='word-bg'>high quality</span> items.
							</p>

							<div className='btn-cont'>
								<div className='hero-banner-btn'>
									<Link href={`/product/${HeroBanner.product}`}>
										<button className='btn-empty' type='button'>
											{HeroBanner.buttonText}
										</button>
									</Link>
								</div>
								<div className='hero-banner-btn-full'>
									<Link href={`/product/${HeroBanner.product}`}>
										<button type='button'>{HeroBanner.buttonText}</button>
									</Link>
								</div>
							</div>
						</div>
						<div className='overlay_img'>
							<img src={urlFor(HeroBanner.image)} alt='drinks' className='hero-banner-image' />
						</div>
					</div>
				</div>
				{/* <div className='hero-banner-inner-cont-img'>
					<img src={urlFor(HeroBanner.BGimage)} alt='drinks' className='hero-banner-img' />
				</div> */}
			</div>
		</div>
	);
};

export default HeroBanner;
