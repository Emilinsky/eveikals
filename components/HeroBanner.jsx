import React from "react";
import Link from "next/link";
import { urlFor } from "../lib/client";
import BackgroundBlur from "./BackgroundBlur";

import styles from "../styles/HeroBanner.module.css";

const HeroBanner = ({ HeroBanner }) => {
	return (
		<div className={styles.hero_banner_container}>
			<BackgroundBlur numOrbs={12} />
			<div className={styles.hero_banner_inner}>
				<div className={styles.hero_banner_inner_cont_text}>
					<h1>
						<span className={styles.first_line}>Stay </span>
						<span className={styles.heading_bg}>{HeroBanner.largeTextLine1}</span>
						<br />
						<span className={styles.second_line}>Stay </span>
						<span className={styles.heading_bg}>{HeroBanner.largeTextLine2}</span>
					</h1>
					<div className={styles.inner_overlay}>
						<div className={styles.overlay_text}>
							<p className={styles.cream_solo}>
								<span className={styles.first_letter}>F</span>ind your perfect summer companions at our store. Explore a{" "}
								<span className={styles.word_bg}>diverse selection</span> of customizable drinkware. Enjoy{" "}
								<span className={styles.word_bg}>worldwide shipping</span> for our{" "}
								<span className={styles.word_bg}>high quality</span> items.
							</p>

							<div className={styles.btn_cont}>
								<div className={styles.hero_banner_btn}>
									<Link href={`/product/${HeroBanner.product}`}>
										<button className={styles.btn_empty} type='button'>
											{HeroBanner.buttonText}
										</button>
									</Link>
								</div>
								<div className={styles.hero_banner_btn_full}>
									<Link href={`/product/${HeroBanner.product}`}>
										<button type='button'>{HeroBanner.buttonText}</button>
									</Link>
								</div>
							</div>
						</div>
						<div className={styles.overlay_img}>
							<img src={urlFor(HeroBanner.image)} alt='drinks' className={styles.hero_banner_image} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HeroBanner;
