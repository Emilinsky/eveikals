import React, { useState, useEffect } from "react";
import { AiOutlineMinus, AiOutlinePlus, AiFillStar, AiOutlineStar, AiOutlineCheck } from "react-icons/ai";
import { FaCheck } from "react-icons/fa";
import parse from "html-react-parser";
import { Tooltip } from "react-tooltip";
import styles from "../../styles/slug.module.css";

import { client, urlFor } from "../../lib/client";
import { Product, SimilarProducts } from "../../components";
import { useStateContext } from "../../context/StateContext";

const getOptionId = (allOptions, name, value) => {
	// console.log("getOptionId - allOptions:", allOptions);
	// console.log("getOptionId - name:", name);
	// console.log("getOptionId - value:", value);

	const option = allOptions.find((option) => option.name === name);
	// console.log("getOptionId - option:", option);

	return option ? option.values.find((val) => val.title === value).id : null;
};

const getOptionName = (allOptions, optionId) => {
	// console.log("getOptionName - allOptions:", allOptions);
	// console.log("getOptionName - optionId:", optionId);

	for (let option of allOptions) {
		const value = option.values ? option.values.find((val) => val.id === optionId) : null;
		// console.log("getOptionName - value:", value);

		if (value) return option.name;
	}

	return null;
};

const getOptionValue = (allOptions, optionId) => {
	// console.log("getOptionValue - allOptions:", allOptions);
	// console.log("getOptionValue - optionId:", optionId);

	for (let option of allOptions) {
		const value = option.values ? option.values.find((val) => val.id === optionId) : null;
		// console.log("getOptionValue - value:", value);

		if (value) return value.title;
	}

	return null;
};

const findVariant = (selectedOptions, allOptions, allVariants) => {
	return allVariants.find((variant) => {
		const variantOptions = variant.options.map((optionId) => {
			const option = allOptions.find((option) => option.values.some((value) => value.id === optionId));
			return option ? option.name : null;
		});

		// Check if all options match
		const allOptionsMatch = Object.entries(selectedOptions).every(([name, value]) => {
			const optionIndex = variantOptions.indexOf(name);
			return optionIndex !== -1 && variant.options[optionIndex] === getOptionId(allOptions, name, value);
		});

		return allOptionsMatch;
	});
};

function getPerceivedBrightness(color) {
	if (!color) {
		return 0;
	}

	// Assuming color is in hex format
	const rgb = color.slice(1); // remove #

	if (rgb.length !== 6) {
		return 0;
	}

	const r = parseInt(rgb.slice(0, 2), 16);
	const g = parseInt(rgb.slice(2, 4), 16);
	const b = parseInt(rgb.slice(4, 6), 16);

	const brightness = (r * 299 + g * 587 + b * 114) / 1000;

	return brightness;
}

const ProductDetails = ({ product, products }) => {
	const [index, setIndex] = useState(0);
	const { decQty, incQty, qty, setQty, onAdd, setShowCart } = useStateContext();

	// console.log("Rendering ProductDetails...");
	if (!product) {
		return <div>Product not found</div>;
	}
	const { image, name, description, price, options, variants, images } = product;

	const defaultVariant = product.variants.find((variant) => variant.is_default);

	// fetch colors
	let colors = [];
	const colorOption = options.find(
		(option) => option.name.toLowerCase() === "color" || option.type.toLowerCase() === "color"
	);
	if (colorOption) {
		colors = colorOption.values.map((value) => value.colors).flat();
	}
	// fetch sizes
	let sizes = [];
	const sizeOption = options.find(
		(option) => option.name.toLowerCase() === "size" || option.type.toLowerCase() === "size"
	);
	if (sizeOption) {
		sizes = sizeOption.values.map((value) => value.title).flat();
	}
	// console.log(colors, sizes);

	const [selectedVariant, setSelectedVariant] = useState(defaultVariant || product.variants[0]);

	useEffect(() => {
		const defaultVariant = product.variants.find((variant) => variant.is_default);
		setSelectedVariant(defaultVariant || product.variants[0]);
		setQty(1); // Reset quantity state on new product load
	}, [product, setQty, setSelectedVariant]);

	const selectedOptions = selectedVariant
		? selectedVariant.options.reduce((acc, optionId) => {
				const optionName = getOptionName(product.options, optionId);
				const optionValue = getOptionValue(product.options, optionId);
				return { ...acc, [optionName]: optionValue };
		  }, {})
		: {};

	const selectedImages = selectedVariant
		? images.filter((image) => image.variant_ids.includes(selectedVariant.id))
		: [];

	const handleOptionChange = (optionName, optionValue) => {
		const newSelectedVariant = findVariant({ ...selectedOptions, [optionName]: optionValue }, options, variants);
		setSelectedVariant(newSelectedVariant);
	};

	// console.log(description);

	const currentVariant = findVariant(selectedOptions, options, variants);

	const handleBuyNow = () => {
		onAdd(product, qty, selectedVariant);
		setShowCart(true);
	};

	return (
		<>
			<div className={styles.product_pg_cont}>
				<div className={styles.heading_cont}>
					<h1 className={styles.heading}>
						{name}
						{/* {value.title} */}
					</h1>
					<div className={styles.reviews}>
						<div className={styles.flex}>
							<AiFillStar />
							<AiFillStar />
							<AiFillStar />
							<AiFillStar />
							<AiOutlineStar />
						</div>
						<p className={styles.review_p}>(27)</p>
					</div>
				</div>
				<div className={styles.product_detail_container}>
					<div className={styles.all_img_cont}>
						<div className={styles.image_container}>
							{/* Show main image from selectedImages */}
							<img src={selectedImages[index]?.src} className={styles.product_detail_image} />
						</div>
						<div className={styles.small_images_container}>
							{/* Show only the images associated with the selected variant */}
							{selectedImages.map((item, i) => (
								<img
									key={item.src}
									src={item.src}
									className={i === index ? `${styles.small_image} ${styles.selected_image}` : styles.small_image}
									onMouseEnter={() => setIndex(i)}
								/>
							))}
						</div>
					</div>

					<div className={styles.product_detail_desc}>
						<h2 className={styles.details_heading}>Details:</h2>
						<div>{parse(description)}</div>

						{/* DETAILS OPTIONS */}
						{options.map((option) => (
							<div
								key={option._key}
								className={`div-cont ${option.name.toLowerCase() === "size" ? "size-option" : ""}`}
							>
								<label>{option.name}:</label>
								<div className='input-cont'>
									{option.values.map((value, index) => {
										const isChecked = selectedOptions[option.name] === value.title;
										const isColorOption = option.name.toLowerCase() === "color";

										// Calculate the brightness only for color options
										let checkmarkColor = "#ffffff"; // Default color is white
										if (isColorOption && isChecked) {
											const backgroundColor = value.colors[0];
											const brightness = getPerceivedBrightness(backgroundColor);
											checkmarkColor = brightness > 215 ? "#366bc0ec" : "#ffffff"; // Switch color based on brightness
										}

										return (
											<div key={value._key} className='labels product-color'>
												<input
													type='radio'
													value={value.title}
													id={value.title}
													checked={isChecked}
													onChange={(e) => handleOptionChange(option.name, e.target.value)}
													style={{ display: "none" }} // Hide the actual radio button
												/>
												<label
													data-tooltip-id={isColorOption ? "my-tooltip" : undefined}
													data-tooltip-content={isColorOption ? value.title : undefined}
													htmlFor={value.title}
													style={{
														backgroundColor: isColorOption ? value.colors[0] : null,
														color: isChecked && isColorOption ? checkmarkColor : null,
													}}
												>
													{/* Only display the color name if it's checked */}
													{isChecked && isColorOption && <FaCheck size={15} />}
													{!isColorOption && value.title}
												</label>

												<Tooltip
													id='my-tooltip'
													place='top'
													variant='info'
													style={{
														paddingLeft: 25,
														paddingRight: 25,
														paddingTop: 13,
														paddingBottom: 13,
														backgroundColor: "#366bc0ec",
														borderRadius: 6,
													}}
												/>
											</div>
										);
									})}
								</div>
							</div>
						))}

						{/* END OF DETAILS */}

						<p className={styles.price}>€{selectedVariant ? selectedVariant.price : price}</p>

						<div className={styles.quantity}>
							<h3>Quantity:</h3>
							<p className={styles.quantity_desc}>
								<span className={styles.minus} onClick={decQty}>
									<AiOutlineMinus />
								</span>
								<span className={styles.num}>{qty}</span>
								<span className={styles.plus} onClick={incQty}>
									<AiOutlinePlus />
								</span>
							</p>
						</div>
						<div className={styles.buttons}>
							<button type='button' className={styles.add_to_cart} onClick={() => onAdd(product, qty, selectedVariant)}>
								Add to cart
							</button>
							<button type='button' className={styles.buy_now} onClick={handleBuyNow}>
								Buy now
							</button>
						</div>
					</div>
				</div>
			</div>
			<SimilarProducts products={products} />
		</>
	);
};

export const getStaticPaths = async () => {
	const query = `*[_type == "product"] {
      slug{
         current
      }
   }`;

	const products = await client.fetch(query);
	const paths = products.map((pro) => ({
		params: {
			slug: pro.slug.current,
		},
	}));
	return {
		paths,
		fallback: "blocking",
	};
};

export const getStaticProps = async ({ params: { slug } }) => {
	const query = `*[_type == "product" && slug.current == '${slug}'][0]`;
	const productsQuery = '*[_type == "product"]';

	const product = await client.fetch(query);
	const products = await client.fetch(productsQuery);
	return {
		props: { product, products },
	};
};

export default ProductDetails;
