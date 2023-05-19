import React, { useState, useEffect } from "react";
import { AiOutlineMinus, AiOutlinePlus, AiFillStar, AiOutlineStar } from "react-icons/ai";
import parse from "html-react-parser";

import { client, urlFor } from "../../lib/client";
import { Product } from "../../components";
import { useStateContext } from "../../context/StateContext";

const getOptionId = (allOptions, name, value) => {
	const option = allOptions.find((option) => option.name === name);
	return option ? option.values.find((val) => val.title === value).id : null;
};
const getOptionName = (allOptions, optionId) => {
	for (let option of allOptions) {
		const value = option.values.find((val) => val.id === optionId);
		if (value) return option.name;
	}
	return null;
};

const getOptionValue = (allOptions, optionId) => {
	for (let option of allOptions) {
		const value = option.values.find((val) => val.id === optionId);
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
	if (!product) {
		return <div>Product not found</div>;
	}
	const { image, name, description, price, options, variants, images } = product;

	const [selectedImages, setSelectedImages] = useState([]);

	const defaultVariant = product.variants.find((variant) => variant.is_default);
	console.log(defaultVariant); // Add this line

	// This is where you initialize your state for the selected options and variant.
	const [selectedVariant, setSelectedVariant] = useState(defaultVariant || product.variants[0]);
	const [selectedOptions, setSelectedOptions] = useState(
		defaultVariant
			? defaultVariant.options.reduce((acc, optionId) => {
					const optionName = getOptionName(product.options, optionId);
					const optionValue = getOptionValue(product.options, optionId);
					return { ...acc, [optionName]: optionValue };
			  }, {})
			: {}
	);

	useEffect(() => {
		if (selectedVariant) {
			// If a selected variant exists, filter the images based on it
			const variantImages = images.filter((image) => image.variant_ids.includes(selectedVariant.id));

			console.log("Variant Images:", variantImages);

			setSelectedImages(variantImages);
		} else {
			// If no selected variant exists, clear the selected images
			setSelectedImages([]);
		}
	}, [selectedVariant, images]);

	const handleOptionChange = (optionName, optionValue) => {
		// First update the selected options
		setSelectedOptions((prevSelectedOptions) => ({
			...prevSelectedOptions,
			[optionName]: optionValue,
		}));

		// Then find the new selected variant
		const newSelectedVariant = findVariant({ ...selectedOptions, [optionName]: optionValue }, options, variants);

		console.log("New Selected Variant:", newSelectedVariant);

		if (newSelectedVariant) {
			// If a new selected variant was found, filter the images based on it
			const variantImages = images.filter((image) => image.variant_ids.includes(newSelectedVariant.id));

			console.log("Variant Images:", variantImages);

			setSelectedImages(variantImages);
		} else {
			// If no new selected variant was found, clear the selected images
			setSelectedImages([]);
		}
	};

	// console.log(description);

	const currentVariant = findVariant(selectedOptions, options, variants);

	const [index, setIndex] = useState(0);
	const { decQty, incQty, qty, onAdd, setShowCart } = useStateContext();

	const handleBuyNow = () => {
		onAdd(product, qty);
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
								<select onChange={(e) => handleOptionChange(option.name, e.target.value)}>
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

					<p className='price'>€{price}</p>
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
						<button type='button' className='add-to-cart' onClick={() => onAdd(product, qty)}>
							Add to cart{" "}
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
