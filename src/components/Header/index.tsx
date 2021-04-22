import styles from "./styles.module.scss";
import format from "date-fns/format";
import ptBR from "date-fns/locale/pt-BR";

export default function Header() {
	const currentDate = format(new Date(), "EEEEEE, d MMMM", { locale: ptBR });
	return (
		<header className={styles.headerContainer}>
			<a href="http://localhost:3000/">
				<img src="/logo.svg" alt="Podcastr" />
			</a>
			<p>O melhor para você ouvir sempre</p>
			<span>{currentDate}</span>
		</header>
	);
}
