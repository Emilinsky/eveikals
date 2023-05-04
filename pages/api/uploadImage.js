import axios from "axios";
import { client } from "../../lib/client";

export default async function handler(req, res) {
	if (req.method === "POST") {
		try {
			const imageUrl = req.body.url;

			// Download the image from the URL
			const imageResponse = await axios.get(imageUrl, {
				responseType: "arraybuffer",
			});

			// Upload the image to Sanity
			const sanityResponse = await client.assets.upload("image", imageResponse.data, {
				filename: imageUrl.split("/").pop(),
				contentType: imageResponse.headers["content-type"],
			});

			res.status(200).json({ assetId: sanityResponse._id });
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: "Failed to upload the image" });
		}
	} else {
		res.status(405).end(); // Method Not Allowed
	}
}
