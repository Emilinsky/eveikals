import React from "react";

import { Product } from "../components";
import styles from "../styles/slug.module.css";

function SimilarProducts({ products }) {
	return (
		<div className={styles.similar_products_wrapper}>
			<h2>Similar products:</h2>
			<div className={styles.marquee}>
				<div className={`${styles.similar_products_container} ${styles.track}`}>
					{products.map((item) => (
						<Product key={item._id} product={item} />
					))}
				</div>
			</div>
		</div>
	);
}

export default SimilarProducts;
