export default {
	name: "product",
	title: "Produkts",
	type: "document",
	fields: [
		{
			name: "image",
			title: "Bilde",
			type: "array",
			of: [{ type: "image" }],
			options: {
				hotspot: true,
			},
		},
		{
			name: "name",
			title: "Name",
			type: "string",
		},
		{
			name: "slug",
			title: "Slug",
			type: "slug",
			options: {
				source: "name",
				maxLength: 90,
			},
		},
		{
			name: "price",
			title: "Price",
			type: "number",
		},
		{
			name: "description",
			title: "Description",
			type: "text", // Use "text" instead of "string" for multiline text
		},
		{
			name: "details",
			title: "Details",
			type: "string",
		},
		{
			name: "category",
			title: "Category",
			type: "reference",
			to: [{ type: "category" }],
		},
		{
			name: "createdAt",
			title: "Created at",
			type: "datetime",
		},
		{
			name: "printifyId",
			title: "Printify ID",
			type: "string",
			hidden: true, // Optionally, you can hide this field in the Sanity Studio UI
		},
	],
};
