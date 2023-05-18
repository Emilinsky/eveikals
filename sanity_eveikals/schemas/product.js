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
			name: "additionalImages",
			title: "Additional Images",
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
			name: "printifyImageUrl",
			title: "Printify Img URL",
			type: "string",
		},
		{
			name: "imageUploadedToSanity",
			title: "Image Uploaded To Sanity",
			type: "boolean",
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
			type: "string",
		},
		{
			name: "sizes",
			title: "Sizes",
			type: "array",
			of: [{ type: "string" }],
		},
		{
			name: "colors",
			title: "Colors",
			type: "array",
			of: [{ type: "string" }],
		},

		{
			name: "description",
			title: "Description",
			type: "text", // Use "text" instead of "string" for multiline text
		},
		{
			name: "details",
			title: "Details",
			type: "text",
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
