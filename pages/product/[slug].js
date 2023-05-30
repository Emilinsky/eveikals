import React, { useState, useEffect } from "react";
import { AiOutlineMinus, AiOutlinePlus, AiFillStar, AiOutlineStar, AiOutlineCheck } from "react-icons/ai";
import { FaCheck } from "react-icons/fa";
import parse from "html-react-parser";

import { client, urlFor } from "../../lib/client";
import { Product } from "../../components";
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
	console.log(colors, sizes);

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
		<div>
			<div className='product-detail-container'>
				<div>
					<div className='image-container'>
						{/* Show main image from selectedImages */}
						<img src={selectedImages[index]?.src} className='product-detail-image' />
					</div>
					<div className='small-images-container'>
						{/* Show only the images associated with the selected variant */}
						{selectedImages.map((item, i) => (
							<img
								key={item.src}
								src={item.src}
								className={i === index ? "small-image selected-image" : "small-image"}
								onMouseEnter={() => setIndex(i)}
							/>
						))}
					</div>
				</div>

				<div className='product-detail-desc'>
					<h1>{name}</h1>
					<div className='reviews'>
						<div>
							<AiFillStar />
							<AiFillStar />
							<AiFillStar />
							<AiFillStar />
							<AiOutlineStar />
						</div>
						<p>(20)</p>
					</div>
					<h4>Details:</h4>
					<div>{parse(description)}</div>

					{/* DETAILS OPTIONS */}
					{options.map((option) => (
						<div key={option._key} className={`div-cont ${option.name.toLowerCase() === "size" ? "size-option" : ""}`}>
							<label>{option.name}:</label>
							<div className='input-cont'>
								{option.values.map((value, index) => {
									const isChecked = selectedOptions[option.name] === value.title;
									console.log(option.name);
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
												htmlFor={value.title}
												style={{
													backgroundColor: option.name.toLowerCase() === "color" ? value.colors[0] : null,
												}}
											>
												{/* Only display the color name if it's checked */}
												{isChecked && option.name.toLowerCase() === "color" && <FaCheck size={15} />}
												{option.name.toLowerCase() !== "color" && value.title}
											</label>
										</div>
									);
								})}
							</div>
						</div>
					))}

					{/* END OF DETAILS */}

					<p className='price'>€{selectedVariant ? selectedVariant.price : price}</p>

					<div className='quantity'>
						<h3>Quantity:</h3>
						<p className='quantity-desc'>
							<span className='minus' onClick={decQty}>
								<AiOutlineMinus />
							</span>
							<span className='num'>{qty}</span>
							<span className='plus' onClick={incQty}>
								<AiOutlinePlus />
							</span>
						</p>
					</div>
					<div className='buttons'>
						<button type='button' className='add-to-cart' onClick={() => onAdd(product, qty, selectedVariant)}>
							Add to cart
						</button>
						<button type='button' className='buy-now' onClick={handleBuyNow}>
							Buy now
						</button>
					</div>
				</div>
			</div>
			<div className='similar-products-wrapper'>
				<h2>Similar products:</h2>
				<div className='marquee'>
					<div className='similar-products-container track'>
						{products.map((item) => (
							<Product key={item._id} product={item} />
						))}
					</div>
				</div>
			</div>
		</div>
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
