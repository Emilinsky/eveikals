export default {
	name: "productsBanner",
	title: "Products Banner",
	type: "document",
	fields: [
		{
			name: "imageTop",
			title: "Image of TOP product",
			type: "image",
			options: {
				hotspot: true,
			},
		},
		{
			name: "imageNew",
			title: "Image of NEW product",
			type: "image",
			options: {
				hotspot: true,
			},
		},
		{
			name: "moreInfo",
			title: "Redirect to more info btn",
			type: "string",
		},
		{
			name: "btnBuy",
			title: "btnBuy",
			type: "string",
		},
		{
			name: "backToTopProBtn",
			title: "Back to TOP product btn",
			type: "string",
		},
		{
			name: "backToNewProBtn",
			title: "Back to NEW product btn",
			type: "string",
		},
		{
			name: "productTop",
			title: "Product ID TOP",
			type: "string",
		},
		{
			name: "productNew",
			title: "Product ID NEW",
			type: "string",
		},
		{
			name: "descTop",
			title: "Description for TOP product",
			type: "string",
		},
		{
			name: "colors",
			title: "Colors",
			type: "array",
			of: [
				{
					type: "object",
					fields: [
						{ name: "colorName", title: "Color Name", type: "string" },
						{ name: "colorCode", title: "Color Code", type: "string" },
					],
				},
			],
		},

		{
			name: "descNew",
			title: "Description for NEW product",
			type: "string",
		},
		{
			name: "descHeading",
			title: "Descritpion heading",
			type: "string",
		},
		{
			name: "headingLeft",
			title: "Left Header",
			type: "string",
		},
		{
			name: "headingRight",
			title: "Right Header",
			type: "string",
		},
		{
			name: "salesCount",
			title: "Number of sales this week",
			type: "string",
		},

		{
			name: "discount",
			title: "Discount",
			type: "string",
		},
		{
			name: "saleTime",
			title: "SaleTime",
			type: "string",
		},
	],
};
