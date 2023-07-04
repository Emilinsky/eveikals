import React from "react";
import { AnimatedText } from "../components";
import { urlFor } from "../lib/client";

import styles from "../styles/Artwork.module.css";

const Artwork = ({ images }) => {
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
						{images &&
							images.map((item, index) => (
								<img
									key={index}
									src={urlFor(item.image.file).url()}
									srcSet={item.image.sizes
										.map((size) => `${urlFor(item.image.file).width(size.replace("w", "")).url()} ${size}`)
										.join(", ")}
									alt={item.image.altText}
									loading='lazy'
									className={`${styles.image_class} ${index >= images.length - 2 ? styles.hide_below_1400 : ""}`}
								/>
							))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Artwork;
