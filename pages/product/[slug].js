import React, { useState, useEffect } from "react";
import { AiOutlineMinus, AiOutlinePlus, AiFillStar, AiOutlineStar } from "react-icons/ai";
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
	// console.log("Rendering ProductDetails...");
	if (!product) {
		return <div>Product not found</div>;
	}
	const { image, name, description, price, options, variants, images } = product;

	const defaultVariant = product.variants.find((variant) => variant.is_default);

	const [selectedVariant, setSelectedVariant] = useState(defaultVariant || product.variants[0]);

	useEffect(() => {
		const defaultVariant = product.variants.find((variant) => variant.is_default);
		setSelectedVariant(defaultVariant || product.variants[0]);
	}, [product]);

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

	const [index, setIndex] = useState(0);
	const { decQty, incQty, qty, onAdd, setShowCart } = useStateContext();

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
					<div>
						{options.map((option) => (
							<div key={option._key}>
								<label>{option.name}:</label>
								<select
									value={selectedOptions[option.name] || ""} // This line is modified
									onChange={(e) => handleOptionChange(option.name, e.target.value)}
								>
									{option.values.map((value) => (
										<option key={value._key} value={value.title}>
											{value.title}
										</option>
									))}
								</select>
							</div>
						))}
					</div>
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
