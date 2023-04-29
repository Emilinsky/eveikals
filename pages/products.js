import React from "react";

import { client } from "../lib/client";
import { Product, ProductsBanner } from "../components";

const Products = ({ products, bannerData }) => {
	return (
		<>
			<ProductsBanner ProductsBanner={bannerData.length && bannerData[0]} />
			<div className='products-heading'>
				<h1 className='header'>All Products</h1>
			</div>
			<div className='products-container'>
				{products?.map((pro) => (
					<Product key={pro._id} product={pro} />
				))}
			</div>
		</>
	);
};

export const getServerSideProps = async () => {
	const query = '*[_type == "product"]';
	const products = await client.fetch(query);
	const bannerQuery = '*[_type == "productsBanner"]';
	const bannerData = await client.fetch(bannerQuery);

	return {
		props: { products, bannerData },
	};
};

export default Products;
