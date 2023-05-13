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
				const formattedProduct = {
					name: product.title,
					slug: { current: product.id },
					printifyId: product.id,
					price: (product.variants[0].price / 100).toFixed(2),
					description: product.description,
				};

				const existingProduct = await axios.get(`http://localhost:3000/api/getProductBySlug?slug=${product.id}`);

				if (
					!existingProduct.data ||
					!existingProduct.data.imageUploadedToSanity ||
					(existingProduct.data.imageUploadedToSanity &&
						existingProduct.data.printifyImageUrl !== product.images[0].src)
				) {
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
					const res = await axios.post("http://localhost:3000/api/saveProduct", formattedProduct);
					return res.data;
				} else {
					await axios.put(`http://localhost:3000/api/updateProduct/${existingProduct.data._id}`, formattedProduct);
					return formattedProduct;
				}
			})
		);

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
		const products = await getShopProducts(shopId);
		res.status(200).json(products);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "An error occurred" });
	}
}
