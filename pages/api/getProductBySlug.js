// api/getProductBySlug.js
import { client } from "../../lib/client";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const slug = req.query.slug;
      const response = await client.fetch('*[_type == "product" && slug.current == $slug][0]', { slug });
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
