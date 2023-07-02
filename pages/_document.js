import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
	static async getInitialProps(ctx) {
		const initialProps = await Document.getInitialProps(ctx);
		return {
			...initialProps,
		};
	}

	// 	render() {
	// 		const csp = `
	//     default-src 'self';
	//   script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://js.stripe.com;
	//   script-src-elem 'self' 'unsafe-inline' https://js.stripe.com;
	//   worker-src 'self' blob:;
	//   style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
	//   img-src 'self' data: https: http:;
	//   font-src 'self' data: https://fonts.gstatic.com 'https://fonts.googleapis.com';
	//   connect-src 'self' https: http:;
	//   object-src 'none';
	//   frame-src https://m.youtube.com/ https://js.stripe.com/;
	//   media-src 'self';
	// `;

	// 		return (
	// 			<Html>
	// 				<Head>
	// 					<meta httpEquiv='Content-Security-Policy' content={csp} />{" "}
	// 				</Head>{" "}
	// 				<body>
	// 					<Main />
	// 					<NextScript />
	// 				</body>{" "}
	// 			</Html>
	// 		);
	// 	}
}

export default MyDocument;
