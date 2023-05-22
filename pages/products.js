import React, { useState } from "react";
import axios from "axios";

import { client } from "../lib/client";
import { Product, ProductsBanner } from "../components";

const Products = ({ products, bannerData }) => {
	const [selectedCategories, setSelectedCategories] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const productsPerPage = 5;

	const combinedProducts = [...products.sanity];



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
	// Fetch Sanity products
	const query = '*[_type == "product"]';
	const sanityProducts = await client.fetch(query);

	// Fetch Printify products
	const res = await fetch("http://localhost:3000/api/products");
	const printifyProducts = await res.json();

	// console.log("Printify Products:", printifyProducts); // Add this line to log the received products

	// Check if printifyProducts is an array, if not, set it to an empty array
	const printifyProductsArray = Array.isArray(printifyProducts) ? printifyProducts : [];

	// Return them as separate properties
	const products = {
		sanity: sanityProducts,
		printify: printifyProductsArray,
	};

	const bannerQuery = '*[_type == "productsBanner"]';
	const bannerData = await client.fetch(bannerQuery);
	const categoryQuery = '*[_type == "category"]';
	const categories = await client.fetch(categoryQuery);

	return {
		props: { products, bannerData, categories },
		// revalidate: 60 * 60 * 6, // Regenerate the page every 6 hours
	};
};

export default Products;
