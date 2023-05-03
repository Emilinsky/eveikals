import axios from "axios";

const PRINTIFY_ACCESS_TOKEN = process.env.PRINTIFY_ACCESS_TOKEN;

const SHOP_ID = "8832572"; // replace with your shop id
const PRODUCT_ID = "6450dcf983037c10d600af27"; // replace with your product id

async function publishProduct(shopId, productId) {
	const response = await axios.post(
		`https://api.printify.com/v1/shops/${shopId}/products/${productId}/publish.json`,
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

publishProduct(SHOP_ID, PRODUCT_ID);

async function setProductPublishStatusToSucceeded(shopId, productId) {
	const response = await axios.post(
		`https://api.printify.com/v1/shops/${shopId}/products/${productId}/publishing_succeeded.json`,
		{
			external: {
				id: "6450dcf983037c10d600af27", // replace with your external product id
				handle: "https://printify.com/app/product-details/644ecf755fce1fd5190e1376?fromProductsPage=1", // replace with your product URL
			},
		},
		{
			headers: { Authorization: `Bearer ${PRINTIFY_ACCESS_TOKEN}` },
		}
	);

	console.log(response.data);
}

setProductPublishStatusToSucceeded(SHOP_ID, PRODUCT_ID);

async function getShops() {
	const response = await axios.get("https://api.printify.com/v1/shops.json", {
		headers: { Authorization: `Bearer ${PRINTIFY_ACCESS_TOKEN}` },
	});
	console.log(response.data);

	return response.data.data;
}

async function getShopProducts(shopId) {
	try {
		const response = await axios.get(`https://api.printify.com/v1/shops/${shopId}/products.json`, {
			headers: { Authorization: `Bearer ${PRINTIFY_ACCESS_TOKEN}` },
		});

		// Check if the products array is empty
		if (!response.data.data.length) {
			console.log("No products found in shop");
			return [];
		}

		const products = response.data.data;

		// Save each product in Sanity
		const savedProducts = [];
		for (let product of products) {
			const formattedProduct = {
				// format the product data as needed for your Sanity schema
				name: product.title,
				image: product.images[0].src, // modify as needed based on your product schema
				slug: {
					current: product.id, // modify as needed
				},
				// add other fields as necessary
			};

			const res = await axios.post("http://localhost:3000/api/saveProduct", formattedProduct);
			const savedProduct = await res.json();
			savedProducts.push(savedProduct);
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
