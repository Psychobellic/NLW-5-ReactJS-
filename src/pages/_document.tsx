/* coisas que precisam carregar uma unica vez, já que _app roda todas as vezes que uma pagina é carregada */
import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
	render() {
		return (
			<Html>
				<Head>
					<title>Podcastr</title>
					<link rel="preconnect" href="https://fonts.gstatic.com" />
					<link
						href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Lexend:wght@500;600&display=swap"
						rel="stylesheet"
					/>
					<link rel="shortcut icon" href="/favicon.png" type="image/png" />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
