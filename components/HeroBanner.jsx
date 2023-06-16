import React from "react";
import Link from "next/link";
import { urlFor } from "../lib/client";
// import { BackgroundBlur } from "./";
import BackgroundBlur from "./BackgroundBlur";

const HeroBanner = ({ HeroBanner }) => {
	return (
		<div className='hero-banner-container'>
			{/* <BackgroundBlur numOrbs={20} /> */}
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
							<span className='first-letter'>F</span>ind your perfect summer companions at our Shopify store. Explore a{" "}
							<span className='word-bg'>diverse selection</span> of customizable drinkware. Enjoy{" "}
							<span className='word-bg'>worldwide shipping</span> for our <span className='word-bg'>high quality</span>{" "}
							items.
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
			<div className='hero-banner-inner-cont-img'>
				<svg viewBox='0 100 600 900' xmlns='http://www.w3.org/2000/svg'>
					<defs>
						<clipPath id='user-space' clipPathUnits='userSpaceOnUse'>
							<path
								fill='#FF0066'
								d='M279.6 -335C347 -276.6 375.9 -174 360.8 -88.9C345.6 -3.8 286.5 63.7 243.5 143C200.6 222.2 173.8 313.1 113.6 352.6C53.4 392.2 -40.4 380.3 -140.6 356.7C-240.9 333.1 -347.8 297.8 -369.4 228.6C-391.1 159.5 -327.5 56.5 -293.4 -36.9C-259.3 -130.4 -254.7 -214.2 -210.7 -276.8C-166.7 -339.3 -83.3 -380.7 11.4 -394.2C106.1 -407.7 212.1 -393.5 279.6 -335'
								transform='translate(400 450)'
							/>
						</clipPath>
					</defs>

					<image
						width='100%'
						height='100%'
						preserveAspectRatio='xMinYMin slice'
						xlinkHref={urlFor(HeroBanner.BGimage)}
						clipPath='url(#user-space)'
					/>
				</svg>

				{/* <img src={urlFor(HeroBanner.BGimage)} alt='drinks' className='hero-banner-img' /> */}
			</div>
		</div>
	);
};

export default HeroBanner;
