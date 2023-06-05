import React, { useState, useEffect } from "react";
import { ProductsBanner, Product, Slider } from "../components";
import { client } from "../lib/client";
import styles from "../styles/Product.module.css";

const Products = ({ products, bannerData }) => {
	const [priceFilter, setPriceFilter] = useState([0, 40]); // adjust range as per your product pricing

	const [debouncedPriceFilter, setDebouncedPriceFilter] = useState(priceFilter);

	useEffect(() => {
		const timerId = setTimeout(() => {
			setDebouncedPriceFilter(priceFilter);
		}, 500);

		return () => {
			clearTimeout(timerId);
		};
	}, [priceFilter]);

	// Then use debouncedPriceFilter for the filtering:
	const filteredProducts = products.sanity.filter(
		(product) =>
			parseFloat(product.price) >= debouncedPriceFilter[0] && parseFloat(product.price) <= debouncedPriceFilter[1]
	);

	return (
		<>
			<ProductsBanner ProductsBanner={bannerData.length && bannerData[0]} />
			<div className='products-heading'>
				<h1 className='header'>All Products</h1>
			</div>

			<Slider onPriceChange={setPriceFilter} />

			<div className={styles.products_container}>
				{/* {products.sanity.map((pro) => (
					<Product key={pro._id} product={pro} />
				))} */}
				{filteredProducts.map((pro) => (
					<Product key={pro._id} product={pro} />
				))}
			</div>
		</>
	);
};

export const getServerSideProps = async () => {
	const query = '*[_type == "product"]';
	const sanityProducts = await client.fetch(query);
	const bannerQuery = '*[_type == "productsBanner"]';
	const bannerData = await client.fetch(bannerQuery);

	return {
		props: { products: { sanity: sanityProducts }, bannerData },
	};
};

export default Products;
