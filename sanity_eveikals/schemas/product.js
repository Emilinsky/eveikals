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
			name: "images",
			title: "Images",
			type: "array",
			of: [
				{
					type: "object",
					fields: [
						{
							name: "src",
							title: "Image Source",
							type: "string",
						},
						{
							name: "variant_ids",
							title: "Variant IDs",
							type: "array",
							of: [{ type: "number" }],
						},
						{
							name: "position",
							title: "Position",
							type: "string",
						},
						{
							name: "is_default",
							title: "Is Default",
							type: "boolean",
						},
						{
							name: "asset",
							type: "reference",
							to: [{ type: "image" }],
							hidden: true, // This field will not be displayed in the Studio
						},
					],
				},
			],
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
			name: "tags",
			title: "Tags",
			type: "array",
			of: [{ type: "string" }],
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
		{
			name: "options",
			title: "Options",
			type: "array",
			of: [
				{
					type: "object",
					fields: [
						{
							name: "name",
							title: "Name",
							type: "string",
						},
						{
							name: "type",
							title: "Type",
							type: "string",
						},
						{
							name: "values",
							title: "Values",
							type: "array",
							of: [
								{
									type: "object",
									fields: [
										{
											name: "id",
											title: "ID",
											type: "number",
										},
										{
											name: "title",
											title: "Title",
											type: "string",
										},
										{
											name: "colors",
											title: "Colors",
											type: "array",
											of: [{ type: "string" }],
										},
									],
								},
							],
						},
					],
				},
			],
		},
		{
			name: "variants",
			title: "Variants",
			type: "array",
			of: [
				{
					type: "object",
					fields: [
						{
							name: "id",
							title: "ID",
							type: "number",
						},
						{
							name: "price",
							title: "Price",
							type: "string",
						},
						{
							name: "title",
							title: "Title",
							type: "string",
						},
						{
							name: "sku",
							title: "SKU",
							type: "string",
						},
						{
							name: "grams",
							title: "Grams",
							type: "number",
						},
						{
							name: "is_enabled",
							title: "Is Enabled",
							type: "boolean",
						},
						{
							name: "is_default",
							title: "Is Default",
							type: "boolean",
						},
						{
							name: "options",
							title: "Options",
							type: "array",
							of: [{ type: "number" }],
						},
						{
							name: "images",
							title: "Images",
							type: "array",
							of: [
								{
									type: "object",
									fields: [
										{
											name: "src",
											title: "Source",
											type: "string",
										},
										{
											name: "variant_ids",
											title: "Variant IDs",
											type: "array",
											of: [{ type: "number" }],
										},
										{
											name: "position",
											title: "Position",
											type: "string",
										},
										{
											name: "is_default",
											title: "Is Default",
											type: "boolean",
										},
									],
								},
							],
						},
					],
				},
			],
		},
	],
};
