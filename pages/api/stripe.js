const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
	if (req.method === "POST") {
		console.log(req.body.cartItems);
		try {
			const params = {
				submit_type: "pay",
				mode: "payment",
				payment_method_types: ["card"],
				billing_adress_collection: "auto",
				shipping_options: [
					{
						shipping_rate: "shr_1LsmMjGSMAjLVvVPsEw5DPB2",
					},
					{
						shipping_rate: "shr_1LsmSKGSMAjLVvVP2mZpng5c",
					},
				],
				line_items: req.body.cartItems.map((item) => {
					const img = item.image[0].asset._ref;
					const newImage = img
						.replace("image-", "https://cdn.sanity.io/images/1kdn8ha8/production/")
						.replace("-webp", ".webp", "-jpeg", ".jpeg", "-png", ".png");
					// console.log("IMAGE", newImage);
					return {
						price: {
							currency: "eur",
							producy_data: {
								name: item.name,
								images: [newImage],
							},
							unit_amount: item.price * 100,
						},
						ajustable_quantity: {
							enabled: true,
							minimum: 1,
						},
						quantity: item.quantity,
					};
				}),
				success_url: `${req.headers.origin}/?success=true`,
				cancel_url: `${req.headers.origin}/?canceled=true`,
			};
			// Create Checkout Sessions from body params.
			const session = await stripe.checkout.sessions.create(params);
			res.status(200).json(session);
		} catch (err) {
			res.status(err.statusCode || 500).json(err.message);
		}
	} else {
		res.setHeader("Allow", "POST");
		res.status(405).end("Method Not Allowed");
	}
}
