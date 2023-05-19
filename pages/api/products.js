import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const PRINTIFY_ACCESS_TOKEN = process.env.PRINTIFY_ACCESS_TOKEN;
const SHOP_ID = "8832572"; // replace with your shop id

async function uploadImageToSanity(imageUrl) {
	console.time(`uploadImageToSanity for ${imageUrl}`);
	try {
		// console.time(`uploadImageToSanity for ${imageUrl}`);
		const response = await axios.post("http://localhost:3000/api/uploadImage", {
			url: imageUrl,
		});
		console.timeEnd(`uploadImageToSanity for ${imageUrl}`);
		return response.data.assetId;
	} catch (error) {
		console.error(`Error uploading image to Sanity: ${error.message}`);
		throw error; // Rethrow the error to propagate it up the call stack
	}
}

const setProductPublishStatus = async (shopId, productId, productUrl) => {
	try {
		const response = await axios.post(
			`https://api.printify.com/v1/shops/${shopId}/products/${productId}/publishing_succeeded.json`,
			{
				external: {
					id: productId,
					handle: productUrl,
				},
			},
			{
				headers: { Authorization: `Bearer ${PRINTIFY_ACCESS_TOKEN}` },
			}
		);

		return response.data;
	} catch (error) {
		console.error(`Failed to set publish status for productId: ${productId}. Error: ${error.message}`);
	}
};

const getShopProducts = async (shopId) => {
	console.time("getShopProducts");

	try {
		const response = await axios.get(`https://api.printify.com/v1/shops/${shopId}/products.json`, {
			headers: { Authorization: `Bearer ${PRINTIFY_ACCESS_TOKEN}` },
		});

		if (!response.data.data.length) {
			return [];
		}

		const products = response.data.data;

		const savedProducts = await Promise.all(
			products.map(async (product) => {
				const formattedProduct = {
					name: product.title,
					slug: { current: product.id },
					printifyId: product.id,
					price: (product.variants[0].price / 100).toFixed(2),
					description: product.description,
					createdAt: new Date().toISOString(),
					tags: product.tags || [],
					options: product.options.map((option) => ({
						_key: uuidv4(),
						name: option.name,
						type: option.type,
						values: option.values.map((value) => ({
							_key: uuidv4(),
							id: value.id,
							title: value.title,
							colors: value.colors,
						})),
					})),
					variants: product.variants.map((variant) => ({
						_key: uuidv4(),
						id: variant.id,
						price: (variant.price / 100).toFixed(2),
						title: variant.title,
						sku: variant.sku,
						grams: variant.grams,
						options: variant.options,
					})),
					images: product.images.map((image) => ({
						src: image.src,
						variant_ids: image.variant_ids,
						position: image.position,
						is_default: image.is_default,
					})),
				};

				const existingProduct = await axios.get(`http://localhost:3000/api/getProductBySlug?slug=${product.id}`);

				if (!existingProduct.data) {
					// Product not found in Sanity, proceed with image upload
					const imageAssetId = await uploadImageToSanity(product.images[0].src);

					formattedProduct.image = [
						{
							_key: uuidv4(),
							asset: {
								_type: "reference",
								_ref: imageAssetId,
							},
						},
					];
					formattedProduct.printifyImageUrl = product.images[0].src;
					formattedProduct.imageUploadedToSanity = true;
				} else {
					// Product already exists in Sanity, skip image upload
					formattedProduct.image = existingProduct.data.image;
					formattedProduct.printifyImageUrl = existingProduct.data.printifyImageUrl;
					formattedProduct.imageUploadedToSanity = existingProduct.data.imageUploadedToSanity;
				}

				if (!existingProduct.data) {
					const res = await axios.post("http://localhost:3000/api/saveProduct", formattedProduct);
					const productUrl = `https://printify.com/app/store/products/${formattedProduct.slug.current}`; // replace with your actual product URL pattern
					// New code to set product publish status
					await setProductPublishStatus(shopId, product.id, productUrl);
					return res.data;
				} else {
					const productUrl = `https://printify.com/app/store/products/${formattedProduct.slug.current}`; // replace with your actual product URL pattern
					// New code to set product publish status
					await setProductPublishStatus(shopId, product.id, productUrl);
					return formattedProduct;
				}
			})
		);
		console.timeEnd("getShopProducts");

		return savedProducts;
	} catch (error) {
		if (error.response && error.response.status === 404) {
			console.log(`No products found for shopId: ${shopId}`);
		} else {
			console.error(`Failed to fetch products for shopId: ${shopId}. Error: ${error.message}`);
		}
		return [];
	}
};

export default async function handler(req, res) {
	console.time("handler");

	try {
		const shopId = SHOP_ID;
		const products = await getShopProducts(shopId);
		res.status(200).json(products);
	} catch (error) {
		console.error("Error in /api/products handler:", error);
		res.status(500).json({ message: "An error occurred" });
	}
	console.timeEnd("handler");
}
