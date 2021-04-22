import Header from "../components/Header/index";
import Player from "../components/Player/index";

import "../styles/global.scss";

import styles from "../styles/app.module.scss";

function MyApp({ Component, pageProps }) {
	return (
		<div className={styles.wrapper}>
			<main>
				<Header />
				<Component {...pageProps} />
			</main>
			<div className={styles.playerDiv}>
				<Player />
			</div>
		</div>
	);
}

export default MyApp;
