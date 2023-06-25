import React, { useState, useEffect } from "react";
import { Product } from "../components";
import styles from "../styles/slug.module.css";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

function SimilarProducts({ products, currentTag, currentProductId }) {
	// Filter products based on tags
	const filteredProducts = products.filter((product) => {
		if (!product.tags || product._id === currentProductId) {
			return false;
		}
		// Check if at least one tag is in common
		return product.tags.some((tag) => currentTag.includes(tag));
	});

	// resetting carousel on every product selected
	useEffect(() => {
		setStartIndex(0);
	}, [currentTag]);

	// State to keep track of the index of the first product currently being displayed
	const [startIndex, setStartIndex] = useState(0);

	// Number of products to display at a time
	const displayCount = 5;

	// Function to handle the "Next" button click
	const handleNextClick = () => {
		setStartIndex((prevIndex) => Math.min(prevIndex + displayCount, filteredProducts.length - displayCount));
	};

	// Function to handle the "Previous" button click
	const handlePrevClick = () => {
		setStartIndex((prevIndex) => Math.max(prevIndex - displayCount, 0));
	};

	// Slice the filteredProducts array to only include the products that should be currently visible
	const visibleProducts = filteredProducts.slice(startIndex, startIndex + displayCount);

	return (
		<div className={styles.similar_products_wrapper}>
			<h2>Similar products:</h2>
			<div className={styles.marquee}>
				<div className={`${styles.similar_products_container} ${styles.track}`}>
					<button
						onClick={handlePrevClick}
						disabled={startIndex === 0}
						className={`${styles.button} ${styles.prev_btn}`}
					>
						<FaArrowLeft size={25} />
					</button>
					{visibleProducts.map((item) => (
						<Product key={item._id} product={item} />
					))}
					<button
						onClick={handleNextClick}
						disabled={startIndex + displayCount >= filteredProducts.length}
						className={`${styles.button} ${styles.next_btn}`}
					>
						<FaArrowRight size={25} />
					</button>
				</div>
			</div>
		</div>
	);
}

export default SimilarProducts;
