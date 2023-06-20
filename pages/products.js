import React, { useState, useEffect } from "react";
import { ProductsBanner, Product, Slider } from "../components";
import { client } from "../lib/client";
import styles from "../styles/Product.module.css";
import { BsFilterSquare } from "react-icons/bs";

const Products = ({ products, bannerData, tags, colors, sizes }) => {
	const [priceFilter, setPriceFilter] = useState([1, 40]); // adjust range as per your product pricing
	const [debouncedPriceFilter, setDebouncedPriceFilter] = useState(priceFilter);
	const [selectedTags, setSelectedTags] = useState([]);
	// const [isOpen, setIsOpen] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
	const [filtersVisible, setFiltersVisible] = useState(true);

	useEffect(() => {
		const timerId = setTimeout(() => {
			setDebouncedPriceFilter(priceFilter);
			setDebouncedSearchTerm(searchTerm);
		}, 500);

		return () => {
			clearTimeout(timerId);
		};
	}, [priceFilter, selectedTags, searchTerm]);

	const handleFilterButtonClick = () => {
		// Toggle filtersVisible state
		setFiltersVisible((prev) => !prev);
	};

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
		setPriceFilter([1, 40]);
		setDebouncedPriceFilter([1, 40]);
		setSearchTerm("");
	};

	return (
		<>
			<ProductsBanner ProductsBanner={bannerData.length && bannerData[0]} colors={colors} sizes={sizes} />
			<div className='products-heading'>
				<h1 className='header'>All Products</h1>
			</div>
			<button onClick={handleFilterButtonClick} className={`${styles.filterBtn} ${styles.topFilterBtn}`}>
				Product filters <BsFilterSquare />
			</button>

			<div className={`${styles.products_container} ${filtersVisible ? "" : styles.adjustedMargin}`}>
				<div className={`${styles.filter_cont} ${filtersVisible ? "" : styles.hidden}`}>
					<div className={`${styles.filter_inner_cont}`}>
						<button onClick={resetAll} className={styles.resetAll}>
							Reset all filters
						</button>
						<div className={styles.slider_cont}>
							<Slider onPriceChange={setPriceFilter} value={priceFilter} />
						</div>
						<div className={styles.search_cont}>
							<input
								type='text'
								placeholder='Search...'
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
							<p className={styles.search_output}>
								Showing {displayedProducts} of {totalProducts} results
							</p>
							<button onClick={resetSearch}>Reset Search</button>
						</div>

						<div className={styles.tags_cont}>
							<div>
								<h3 className={styles.tags_heading}>Categories:</h3>
							</div>

							<div className={styles.radio_cont}>
								{tags.map((tag) => (
									<div key={tag}>
										<label htmlFor={tag}>
											<input
												type='checkbox'
												id={tag}
												value={tag}
												checked={selectedTags.includes(tag)}
												onChange={() => handleTagChange(tag)}
												className={`${styles.option_input} ${styles.radio}`}
											/>
											{tag}
										</label>
									</div>
								))}
							</div>

							<button onClick={resetTags}>Reset Tags</button>
						</div>
					</div>
				</div>

				<button
					onClick={resetAll}
					className={`${styles.resetMobile} ${styles.filterBtn} ${filtersVisible ? "" : styles.hidden}`}
				>
					Reset all filters
				</button>

				{filteredProducts.length > 0 ? (
					filteredProducts.map((pro) => <Product key={pro._id} product={pro} />)
				) : (
					<p>
						No matching products found for keyphrase: <span className={styles.searchTerm}>{`"${searchTerm}"`}</span>
					</p>
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

	const sizeQuery = '*[_type == "productsBanner"]{sizes}'; // add the sizes data to the query
	const sizeData = await client.fetch(sizeQuery);

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
			sizes: sizeData.length ? sizeData[0].sizes : [],
		},
	};
};

export default Products;
