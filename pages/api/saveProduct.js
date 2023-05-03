// api/saveProduct.js
import { client } from "../../lib/client";

export default async function handler(req, res) {
	if (req.method === "POST") {
		try {
			const product = req.body;
			const response = await client.create({
				_type: "product",
				...product,
			});
			res.status(200).json({ id: response._id });
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	} else {
		res.status(405).end(); // Method Not Allowed
	}
}
