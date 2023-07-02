import React from "react";
import { AnimatedText } from "../components";

import styles from "../styles/Artwork.module.css";

const Artwork = () => {
	return (
		<div className={styles.artwork_cont}>
			<div className={styles.artwork_inner_cont}>
				<div className={styles.upper_img_cont}>
					<div className={styles.upper_text_bg}>
						<p className={styles.text}>LIQUID LUXURY</p>
					</div>
					{/* <AnimatedText /> */}
					<div className={styles.lower_text_bg}>
						<p className={styles.text}>SUMMER &nbsp;&nbsp; TASTE</p>
					</div>
					<div className={styles.art_gallery}>
						<AnimatedText />
					</div>
				</div>
				<div className={styles.lower_img_cont}>
					<div className={styles.example_gallery}>
						<img
							src='https://images-api.printify.com/mockup/646c834d961af3e795060d65/80730/49026/ringneck-tumbler-20oz.jpg?camera_label=context-2'
							loading='lazy'
							alt='Ringneck Tumbler'
						/>
						<img
							src='https://images-api.printify.com/mockup/6480e0cdfafc27f9ba0e6fe4/80015/44604/frosted-glass-mug.jpg?camera_label=context-20'
							loading='lazy'
							alt='Frosted Glass Mug'
						/>
						<img
							className={styles.hide_below_1400}
							src='https://images-api.printify.com/mockup/64707cb32b8a44735f010239/71935/17375/metallic-mug-silvergold.jpg?camera_label=context-2'
							loading='lazy'
							alt='Metallic Mug'
						/>
						<img
							src='https://images-api.printify.com/mockup/646888a9990f9e21c50ca68f/88210/59709/stainless-steel-travel-mug-with-handle-14oz.jpg?camera_label=context-3'
							loading='lazy'
							alt='Stainless Steel Travel Mug'
						/>
						<img
							className={styles.hide_below_1100}
							src='https://images-api.printify.com/mockup/646c825e1f2353efcd0b3467/65216/71738/ceramic-mug-11oz.jpg?camera_label=context-5'
							alt='Ceramic Mug'
							loading='lazy'
						/>
						<img
							src='https://images-api.printify.com/mockup/648c47efe8dbb048ae0455af/74419/19090/mason-jar.jpg?camera_label=context-2'
							loading='lazy'
							alt='Mason Jar'
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Artwork;
