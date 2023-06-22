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
						{/* <img src='https://picsum.photos/id/25/500/500' alt='small trees' />
						<img src='https://picsum.photos/id/454/500/500' alt='a girl with a camera' />
						<img src='https://picsum.photos/id/222/600/600' alt='the sky' />
						<img src='https://picsum.photos/id/152/500/500' alt='some purple flowers' />
						<img src='https://picsum.photos/id/564/800/400' alt='a canyon' /> */}
					</div>
				</div>
				<div className={styles.lower_img_cont}>
					<div className={styles.example_gallery}>
						<img
							src='https://images-api.printify.com/mockup/646c834d961af3e795060d65/80730/49026/ringneck-tumbler-20oz.jpg?camera_label=context-2'
							alt='Ringneck Tumbler'
						/>
						<img
							src='https://images-api.printify.com/mockup/6480e0cdfafc27f9ba0e6fe4/80015/44604/frosted-glass-mug.jpg?camera_label=context-20'
							alt='Frosted Glass Mug'
						/>
						<img
							src='https://images-api.printify.com/mockup/64707cb32b8a44735f010239/71935/17375/metallic-mug-silvergold.jpg?camera_label=context-2'
							alt='Metallic Mug'
						/>
						<img
							src='https://images-api.printify.com/mockup/646888a9990f9e21c50ca68f/88210/59709/stainless-steel-travel-mug-with-handle-14oz.jpg?camera_label=context-3'
							alt='Stainless Steel Travel Mug'
						/>
						<img
							src='https://images-api.printify.com/mockup/648c47efe8dbb048ae0455af/74419/19090/mason-jar.jpg?camera_label=context-2'
							alt='Mason Jar'
						/>
						<img
							src='https://images-api.printify.com/mockup/646c825e1f2353efcd0b3467/65216/71738/ceramic-mug-11oz.jpg?camera_label=context-5'
							alt='Ceramic Mug'
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Artwork;
