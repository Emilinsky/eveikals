import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const PRINTIFY_ACCESS_TOKEN = process.env.PRINTIFY_ACCESS_TOKEN;
const SHOP_ID = "8832572"; // replace with your shop id

async function uploadImageToSanity(imageUrl) {
	const response = await axios.post("http://localhost:3000/api/uploadImage", {
		url: imageUrl,
	});
	return response.data.assetId;
}

async function getShopProducts(shopId) {
	try {
		// Fetch products from Printify
		const response = await axios.get(`https://api.printify.com/v1/shops/${shopId}/products.json`, {
			headers: { Authorization: `Bearer ${PRINTIFY_ACCESS_TOKEN}` },
		});

		if (!response.data.data.length) {
			console.log("No products found in shop");
			return [];
		}

		const products = response.data.data;

		// Save each product in Sanity
		const savedProducts = [];
		for (let product of products) {
			const formattedProduct = {
				name: product.title,
				slug: { current: product.id },
				printifyId: product.id,
				price: (product.variants[0].price / 100).toFixed(2),
				description: product.description,
			};

			// Check if the product already exists in Sanity
			const existingProduct = await axios.get(`http://localhost:3000/api/getProductBySlug?slug=${product.id}`);

			if (!existingProduct.data || !existingProduct.data.imageUploadedToSanity) {
				console.time(`Uploading image for product ${product.id}`);
				const imageAssetId = await uploadImageToSanity(product.images[0].src);
				console.timeEnd(`Uploading image for product ${product.id}`);

				// Update the product data to include the new image and set the imageUploadedToSanity flag
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
				// Use the existing product data
				formattedProduct.image = existingProduct.data.image;
				formattedProduct.imageUploadedToSanity = existingProduct.data.imageUploadedToSanity;
			}

			// Save or update the product in Sanity
			if (!existingProduct.data) {
				// If the product doesn't exist, create a new one in Sanity
				const res = await axios.post("http://localhost:3000/api/saveProduct", formattedProduct);
				const savedProduct = res.data;
				savedProducts.push(savedProduct);
			} else {
				// If the product exists, update it in Sanity
				await axios.put(`http://localhost:3000/api/updateProduct/${existingProduct.data._id}`, formattedProduct);
				savedProducts.push(formattedProduct);
			}
		}

		return savedProducts;
	} catch (error) {
		if (error.response && error.response.status === 404) {
			console.log(`No products found for shopId: ${shopId}`);
		} else {
			console.error(`Failed to fetch products for shopId: ${shopId}. Error: ${error.message}`);
		}
		return [];
	}
}

export default async function handler(req, res) {
	try {
		const shopId = SHOP_ID;

		console.time("Fetching and saving products");
		const products = await getShopProducts(shopId);
		console.timeEnd("Fetching and saving products");

		res.status(200).json(products);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "An error occurred" });
	}
}
