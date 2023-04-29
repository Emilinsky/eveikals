import React from "react";

import { client } from "../lib/client";
import { Product, HeroBanner } from "../components";

const Products = ({ products, bannerData }) => {
	return (
		<>
			<HeroBanner HeroBanner={bannerData.length && bannerData[0]} />
			<div className='products-container'>
				<h1>All Products</h1>
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
	const bannerQuery = '*[_type == "banner"]';
	const bannerData = await client.fetch(bannerQuery);

	return {
		props: { products, bannerData },
	};
};

export default Products;
