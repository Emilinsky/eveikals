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
	// console.log('Fetching shop products');  // And here

	try {
		const response = await axios.get(`https://api.printify.com/v1/shops/${shopId}/products.json`, {
			headers: { Authorization: `Bearer ${PRINTIFY_ACCESS_TOKEN}` },
		});

		if (!response.data.data.length) {
			return [];
		}

		const products = response.data.data;

		// Process and save each product in Sanity concurrently
		const savedProducts = await Promise.all(
			products.map(async (product) => {
				// console.log(`Fetched product from Printify: ${product.title}`); // Log the fetched product title

				const formattedProduct = {
					name: product.title,
					slug: { current: product.id },
					printifyId: product.id,
					price: (product.variants[0].price / 100).toFixed(2),
					description: product.description,
					createdAt: new Date().toISOString(), // add this line
				};

				const existingProduct = await axios.get(`http://localhost:3000/api/getProductBySlug?slug=${product.id}`);

				// console.log(`Product exists in database: ${existingProduct.data ? "Yes" : "No"}`); // Log if the product exists in the database

				if (
					!existingProduct.data ||
					!existingProduct.data.imageUploadedToSanity ||
					(existingProduct.data.imageUploadedToSanity &&
						existingProduct.data.printifyImageUrl !== product.images[0].src)
				) {
					// console.log(
					// 	`Image uploaded to Sanity: ${
					// 		existingProduct.data && existingProduct.data.imageUploadedToSanity ? "Yes" : "No"
					// 	}`
					// ); // Log if the image is uploaded to Sanity
					// console.log(
					// 	`Product image in Printify has changed: ${
					// 		existingProduct.data && existingProduct.data.printifyImageUrl !== product.images[0].src ? "Yes" : "No"
					// 	}`
					// ); // Log if the product image in Printify has changed

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
					formattedProduct.image = existingProduct.data.image;
					formattedProduct.imageUploadedToSanity = existingProduct.data.imageUploadedToSanity;
				}

				if (!existingProduct.data) {
					// console.log(`Saving new product to database: ${product.title}`); // Log the product title being saved to the database
					const res = await axios.post("http://localhost:3000/api/saveProduct", formattedProduct);
					return res.data;
				} else {
					// console.log(`Updating existing product in database: ${product.title}`); // Log the product title being updated in the database
					await axios.put(`http://localhost:3000/api/updateProduct/${existingProduct.data._id}`, formattedProduct);
					return formattedProduct;
				}
			})
		);

		return savedProducts;
	} catch (error) {
		// console.error('Error fetching shop products:', error);  // And here

		if (error.response && error.response.status === 404) {
			// console.log(`No products found for shopId: ${shopId}`);
		} else {
			// console.error(`Failed to fetch products for shopId: ${shopId}. Error: ${error.message}`);
		}
		return [];
	}
}

export default async function handler(req, res) {
	// console.log('Handling /api/products request');  // New log here

	try {
		const shopId = SHOP_ID;
		const products = await getShopProducts(shopId);
		res.status(200).json(products);
	} catch (error) {
		// console.error('Error in /api/products handler:', error);  // And here
		// console.error(error);
		res.status(500).json({ message: "An error occurred" });
	}
}
