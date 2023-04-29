export default {
	name: "productsBanner",
	title: "Products Banner",
	type: "document",
	fields: [
		//...rest of the fields similar to HeroBanner
      {
			name: "image",
			title: "Image",
			type: "image",
			options: {
				hotspot: true,
			},
		},
		{
			name: "textBtn",
			title: "textBtn",
			type: "string",
		},
		{
			name: "product",
			title: "Product",
			type: "string",
		},
		{
			name: "desc",
			title: "Desc",
			type: "string",
		},
		{
			name: "smallText",
			title: "SmallText",
			type: "string",
		},
		{
			name: "midText",
			title: "MidText",
			type: "string",
		},
		{
			name: "largeText1",
			title: "LargeText1",
			type: "string",
		},
		{
			name: "largeText2",
			title: "LargeText2",
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