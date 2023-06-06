import React, { useState, useEffect } from "react";
import { ProductsBanner, Product, Slider } from "../components";
import { client } from "../lib/client";
import styles from "../styles/Product.module.css";

const Products = ({ products, bannerData, tags }) => {
	const [priceFilter, setPriceFilter] = useState([1, 50]); // adjust range as per your product pricing
	const [debouncedPriceFilter, setDebouncedPriceFilter] = useState(priceFilter);
	const [selectedTags, setSelectedTags] = useState([]);

	useEffect(() => {
		const timerId = setTimeout(() => {
			setDebouncedPriceFilter(priceFilter);
		}, 500);

		return () => {
			clearTimeout(timerId);
		};
	}, [priceFilter, selectedTags]);

	// Then use debouncedPriceFilter for the filtering:
	const filteredProducts = products.sanity.filter(
		(product) =>
			parseFloat(product.price) >= debouncedPriceFilter[0] &&
			parseFloat(product.price) <= debouncedPriceFilter[1] &&
			(selectedTags.length === 0 || product.tags.some((tag) => selectedTags.includes(tag))) // filters the products if it has any tag that matches the selected tags or if no tags are selected
	);

	const handleTagChange = (tag) => {
		setSelectedTags((prevTags) => {
			if (prevTags.includes(tag)) {
				// remove the tag
				return prevTags.filter((prevTag) => prevTag !== tag);
			} else {
				// add the tag
				return [...prevTags, tag];
			}
		});
	};

	const resetTags = () => {
		setSelectedTags([]);
	};

	const resetAll = () => {
		setSelectedTags([]);
		setPriceFilter([1, 50]);
		setDebouncedPriceFilter([1, 50]);
	};

	return (
		<>
			<ProductsBanner ProductsBanner={bannerData.length && bannerData[0]} />
			<div className='products-heading'>
				<h1 className='header'>All Products</h1>
			</div>

			<Slider onPriceChange={setPriceFilter} value={priceFilter} />
			<button onClick={resetTags}>Reset Tags</button>
			<button onClick={resetAll}>Reset All</button>
			<div>
				{tags.map((tag) => (
					<div key={tag}>
						<input
							type='checkbox'
							id={tag}
							value={tag}
							checked={selectedTags.includes(tag)}
							onChange={() => handleTagChange(tag)}
						/>
						<label htmlFor={tag}>{tag}</label>
					</div>
				))}
			</div>

			<div className={styles.products_container}>
				{filteredProducts.length > 0 ? (
					filteredProducts.map((pro) => <Product key={pro._id} product={pro} />)
				) : (
					<p>No matching Products found</p>
				)}
			</div>
		</>
	);
};

export const getServerSideProps = async () => {
	const query = '*[_type == "product"]';
	const sanityProducts = await client.fetch(query);
	const bannerQuery = '*[_type == "productsBanner"]';
	const bannerData = await client.fetch(bannerQuery);

	const allTags = [...new Set(sanityProducts.flatMap((product) => product.tags))];
	console.log(allTags);

	const desiredTags = ["Mugs", "Bottles & Tumblers", "Animals", 'Glass']; // Add more tags as desired

	const tags = [...new Set(sanityProducts.flatMap((product) => product.tags))].filter((tag) =>
		desiredTags.includes(tag)
	);

	return {
		props: { products: { sanity: sanityProducts }, bannerData, tags },
	};
};

export default Products;
