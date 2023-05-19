import React, { useState } from "react";
import { AiOutlineMinus, AiOutlinePlus, AiFillStar, AiOutlineStar } from "react-icons/ai";
import parse from "html-react-parser";

import { client, urlFor } from "../../lib/client";
import { Product } from "../../components";
import { useStateContext } from "../../context/StateContext";

const findVariant = (selectedOptions, productOptions, variants) => {
	return variants.find((variant) => {
		// For each variant, first map the option IDs to their corresponding options
		const variantOptions = variant.options.map((optionId) => {
			// Find the option with the matching ID
			return productOptions.find((option) => option.values.some((value) => value.id === optionId));
		});

		// Then check if all of the variant's options match the selected options
		return variantOptions.every((option) => selectedOptions[option.name] === option.title);
	});
};

const ProductDetails = ({ product, products }) => {
	if (!product) {
		return <div>Product not found</div>;
	}
	const { image, name, description, price, options, variants } = product;
	// console.log(description);
	const [selectedOptions, setSelectedOptions] = useState({});

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
						<img src={urlFor(image && image[index])} className='product-detail-image' />
					</div>
					<div className='small-images-container'>
						{image?.map((item, i) => (
							<img
								key={i}
								src={urlFor(item)}
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
								<select onChange={(e) => setSelectedOptions({ ...selectedOptions, [option.name]: e.target.value })}>
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
