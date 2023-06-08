import React, { useState, useEffect } from "react";
import { ProductsBanner, Product, Slider } from "../components";
import { client } from "../lib/client";
import styles from "../styles/Product.module.css";

const Products = ({ products, bannerData, tags, colors }) => {
	const [priceFilter, setPriceFilter] = useState([1, 50]); // adjust range as per your product pricing
	const [debouncedPriceFilter, setDebouncedPriceFilter] = useState(priceFilter);
	const [selectedTags, setSelectedTags] = useState([]);
	const [isOpen, setIsOpen] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

	useEffect(() => {
		const timerId = setTimeout(() => {
			setDebouncedPriceFilter(priceFilter);
			setDebouncedSearchTerm(searchTerm);
		}, 500);

		return () => {
			clearTimeout(timerId);
		};
	}, [priceFilter, selectedTags, searchTerm]);

	// Then use debouncedPriceFilter and debouncedSearchTerm for the filtering:
	const filteredProducts = products.sanity.filter((product) => {
		const nameLower = product.name.toLowerCase();
		const searchTermLower = debouncedSearchTerm.toLowerCase();
		const searchTermLowerMinusLast = searchTermLower.slice(0, -1);

		return (
			parseFloat(product.price) >= debouncedPriceFilter[0] &&
			parseFloat(product.price) <= debouncedPriceFilter[1] &&
			(selectedTags.length === 0 || product.tags.some((tag) => selectedTags.includes(tag))) &&
			(nameLower.includes(searchTermLower) || nameLower.includes(searchTermLowerMinusLast))
		);
	});

	const totalProducts = products.sanity.length;
	const displayedProducts = filteredProducts.length;

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

	const resetSearch = () => {
		setSearchTerm("");
	};

	const resetAll = () => {
		setSelectedTags([]);
		setPriceFilter([1, 50]);
		setDebouncedPriceFilter([1, 50]);
		setSearchTerm("");
	};

	return (
		<>
			<ProductsBanner ProductsBanner={bannerData.length && bannerData[0]} colors={colors} />
			<div className='products-heading'>
				<h1 className='header'>All Products</h1>
			</div>

			<Slider onPriceChange={setPriceFilter} value={priceFilter} />
			<button onClick={resetTags}>Reset Tags</button>
			<button onClick={resetSearch}>Reset Search</button>
			<button onClick={resetAll}>Reset All</button>
			<input type='text' placeholder='Search...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
			<p>
				Showing {displayedProducts} of {totalProducts} results
			</p>

			<div>
				<div onClick={() => setIsOpen(!isOpen)}>
					<h3>Products</h3>
				</div>
				{isOpen && (
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
				)}
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

	const colorQuery = '*[_type == "productsBanner"]{colors}'; // add the color data to the query
	const colorData = await client.fetch(colorQuery);

	// const allTags = [...new Set(sanityProducts.flatMap((product) => product.tags))];
	// console.log(allTags);

	const desiredTags = ["Mugs", "Bottles & Tumblers", "Animals", "Glass"]; // Add more tags as desired

	const tags = [...new Set(sanityProducts.flatMap((product) => product.tags))].filter((tag) =>
		desiredTags.includes(tag)
	);

	return {
		props: {
			products: { sanity: sanityProducts },
			bannerData,
			tags,
			colors: colorData.length ? colorData[0].colors : [],
		},
	};
};

export default Products;
