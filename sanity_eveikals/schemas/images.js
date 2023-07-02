export default {
	name: "images",
	title: "Images",
	type: "document",
	fields: [
		{
			name: "image",
			title: "Image",
			type: "object",
			fields: [
				{
					name: "file",
					title: "File",
					type: "image",
					options: {
						hotspot: true,
					},
				},
				{
					name: "altText",
					title: "Alt Text",
					type: "string",
				},
				{
					name: "sizes",
					title: "Sizes",
					type: "array",
					of: [
						{
							type: "string",
						},
					],
					description: "Sizes for responsive images (e.g. 300w, 600w, 1200w)",
				},
			],
		},
	],
};
