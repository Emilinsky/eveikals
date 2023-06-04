import React from "react";
import { ProductsBanner, Product } from "../components";
import { client } from "../lib/client";
import styles from "../styles/Product.module.css";

const Products = ({ products, bannerData }) => {
	return (
		<>
			<ProductsBanner ProductsBanner={bannerData.length && bannerData[0]} />
			<div className='products-heading'>
				<h1 className='header'>All Products</h1>
			</div>
			<div className={styles.products_container}>
				{products.sanity.map((pro) => (
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
