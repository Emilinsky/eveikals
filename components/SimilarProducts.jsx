import React from "react";

import { Product } from "../components";
import styles from "../styles/slug.module.css";

function SimilarProducts({ products, currentTag }) {
	// Filter products based on tags
	const filteredProducts = products.filter((product) => {
		if (!product.tags) {
			return false;
		}
		// Check if at least one tag is in common
		return product.tags.some((tag) => currentTag.includes(tag));
	});

	return (
		<div className={styles.similar_products_wrapper}>
			<h2>Similar products:</h2>
			<div className={styles.marquee}>
				<div className={`${styles.similar_products_container} ${styles.track}`}>
					{filteredProducts.map((item) => (
						<Product key={item._id} product={item} />
					))}
				</div>
			</div>
		</div>
	);
}

export default SimilarProducts;
