import axios from "axios";

const PRINTIFY_ACCESS_TOKEN = process.env.PRINTIFY_ACCESS_TOKEN;
const SHOP_ID = "8832572"; // replace with your shop id

async function publishProduct(shopId, productId) {
	const response = await axios.post(
		`https://api.printify.com/v1/shops/${shopId}/products/644ed6c8e5e950398b044f07/publish.json`,
		{
			title: true,
			description: true,
			images: true,
			variants: true,
			tags: true,
			keyFeatures: true,
			shipping_template: true,
		},
		{
			headers: { Authorization: `Bearer ${PRINTIFY_ACCESS_TOKEN}` },
		}
	);

	console.log(response.data);
}

// publishProduct(SHOP_ID, PRODUCT_ID);

async function uploadImageToSanity(imageUrl) {
	const response = await axios.post("http://localhost:3000/api/uploadImage", {
		url: imageUrl,
	});
	return response.data.assetId;
}

async function setProductPublishStatusToSucceeded(shopId, productId) {
	const response = await axios.post(
		`https://api.printify.com/v1/shops/${shopId}/products/${productId}/publishing_succeeded.json`,
		{
			external: {
				id: productId, // use productId parameter here
				handle: "https://printify.com/app/product-details/644ecf755fce1fd5190e1376?fromProductsPage=1", // replace with your product URL
			},
		},
		{
			headers: { Authorization: `Bearer ${PRINTIFY_ACCESS_TOKEN}` },
		}
	);

	console.log(response.data);
}

// setProductPublishStatusToSucceeded(SHOP_ID, PRODUCT_ID);

// async function getShops() {
// 	const response = await axios.get("https://api.printify.com/v1/shops.json", {
// 		headers: { Authorization: `Bearer ${PRINTIFY_ACCESS_TOKEN}` },
// 	});
// 	console.log(response.data);

// 	return response.data.data;
// }

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
			const imageAssetId = await uploadImageToSanity(product.images[0].src);
			const formattedProduct = {
				name: product.title,
				image: [
					{
						asset: {
							_type: "reference",
							_ref: imageAssetId,
						},
					},
				],
				slug: { current: product.id },
				printifyId: product.id, // Add printifyId field to your Sanity schema
			};

			// Check if the product already exists in Sanity
			const existingProduct = await axios.get(
				`http://localhost:3000/api/getProductByPrintifyId?printifyId=${product.id}`
			);
			console.log(existingProduct.data);

			if (!existingProduct.data) {
				// If the product doesn't exist, create a new one in Sanity
				const res = await axios.post("http://localhost:3000/api/saveProduct", formattedProduct);
				const savedProduct = res.data; // Replace res.json() with res.data
				savedProducts.push(savedProduct);
			} else {
				// If the product exists, add it to the savedProducts array
				savedProducts.push(existingProduct.data);
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
		const products = await getShopProducts(shopId);
		// Publish all products
		for (let product of products) {
			await publishProduct(shopId, product.id);
			await setProductPublishStatusToSucceeded(shopId, product.id);
		}
		// Return the products as JSON
		res.status(200).json(products);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "An error occurred" });
	}
}
