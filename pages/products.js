import React, { useState } from "react";

import { client } from "../lib/client";
import { Product, ProductsBanner } from "../components";

const Products = ({ products, bannerData, categories }) => {
	const [selectedCategories, setSelectedCategories] = useState([]);

	const handleCategorySelect = (category) => {
		if (selectedCategories.find((c) => c._id === category._id)) {
			setSelectedCategories(selectedCategories.filter((c) => c._id !== category._id));
		} else {
			setSelectedCategories([...selectedCategories, category]);
		}
	};

	const filteredProducts =
		selectedCategories.length > 0
			? products.filter((product) => selectedCategories.find((category) => category._id === product.category._ref))
			: products;

	return (
		<>
			<ProductsBanner ProductsBanner={bannerData.length && bannerData[0]} />
			<div className='products-heading'>
				<h1 className='header'>All Products</h1>
				<div className='categories'>
					{categories.map((category) => (
						<button onClick={() => handleCategorySelect(category)}>
							{selectedCategories.find((c) => c._id === category._id) && "✓"} {category.title}
						</button>
					))}
				</div>
			</div>
			<div className='products-container'>
				{filteredProducts?.map((pro) => (
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
	const categoryQuery = '*[_type == "category"]';
	const categories = await client.fetch(categoryQuery);

	return {
		props: { products, bannerData, categories },
	};
};

export default Products;
