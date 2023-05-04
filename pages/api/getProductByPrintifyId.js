// api/getProductByPrintifyId.js
import { client } from "../../lib/client";

export default async function handler(req, res) {
	if (req.method === "GET") {
		try {
			const printifyId = req.query.printifyId;
			const response = await client.fetch('*[_type == "product" && printifyId == $printifyId][0]', { printifyId });
			res.status(200).json(response);
			console.log(response);
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	} else {
		res.status(405).end(); // Method Not Allowed
	}
}
