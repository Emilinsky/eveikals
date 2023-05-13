import React, { useState } from "react";
import axios from "axios";

import { client } from "../lib/client";
import { Product, ProductsBanner } from "../components";

const Products = ({ products, bannerData, categories }) => {
	const [selectedCategories, setSelectedCategories] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const productsPerPage = 3;

	const combinedProducts = [...products.sanity];

	const handleCategorySelect = (category) => {
		if (selectedCategories.find((c) => c._id === category._id)) {
			setSelectedCategories(selectedCategories.filter((c) => c._id !== category._id));
		} else {
			setSelectedCategories([...selectedCategories, category]);
		}
	};

	const filteredProducts =
		selectedCategories.length > 0
			? combinedProducts.filter((product) =>
					selectedCategories.find((category) => category._id === product.category._ref)
			  )
			: combinedProducts;

	const indexOfLastProduct = currentPage * productsPerPage;
	const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
	const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

	const paginate = (pageNumber) => setCurrentPage(pageNumber);

	return (
		<>
			<ProductsBanner ProductsBanner={bannerData.length && bannerData[0]} />
			<div className='products-heading'>
				<h1 className='header'>All Products</h1>
				<div className='categories'>
					{categories.map((category) => (
						<button key={category._id} onClick={() => handleCategorySelect(category)} className='product-filter-btn'>
							{selectedCategories.find((c) => c._id === category._id) && "✓"} {category.title}
						</button>
					))}
				</div>
			</div>
			<div className='products-container'>
				{currentProducts?.map((pro) => (
					<Product key={pro._id} product={pro} />
				))}
			</div>
			<div className='pagination'>
				{Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }, (_, i) => i + 1).map((number) => (
					<button key={number} onClick={() => paginate(number)}>
						{number}
					</button>
				))}
			</div>
		</>
	);
};

export const getServerSideProps = async () => {
	const query = '*[_type == "product"]';
	const sanityProducts = await client.fetch(query);

	const products = {
		sanity: sanityProducts,
	};

	const bannerQuery = '*[_type == "productsBanner"]';
	const bannerData = await client.fetch(bannerQuery);
	const categoryQuery = '*[_type == "category"]';
	const categories = await client.fetch(categoryQuery);

	return {
		props: { products, bannerData, categories },
	};
};

export default Products;
