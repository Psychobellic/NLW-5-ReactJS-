import { GetStaticProps, GetStaticPaths } from "next";
import { api } from "../../services/api";
import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import Link from "next/link";
import { convertDurationToTimeString } from "../../utils/convertDurationToString";
import Image from "next/image";

import styles from "./episode.module.scss";

type Episode = {
	id: number;
	title: string;
	thumbnail: string;
	members: string;
	description: string;
	duration: number;
	durationString: string;
	url: string;
	publishedAt: string;
};

type EpisodeProps = {
	episode: Episode;
};

export default function Episode({ episode }: EpisodeProps) {
	return (
		<div className={styles.episode}>
			<div className={styles.thumbnailContainer}>
				<Image
					width={700}
					height={160}
					src={episode.thumbnail}
					objectFit="cover"
				/>

				<button className={styles.playBtn} type="button">
					<img src="/play.svg" alt="Tocar Episódio" />
				</button>

				<header>
					<h1>{episode.title}</h1>
					<span>{episode.members}</span>
					<span>{episode.publishedAt}</span>
					<span>{episode.durationString}</span>
				</header>
				<div
					className={styles.description}
					dangerouslySetInnerHTML={{ __html: episode.description }}
				/>
			</div>
			<Link href="http://localhost:3000">
				<button className={styles.returnBtn} type="button">
					<img src="/arrow-left.svg" alt="Voltar" />
				</button>
			</Link>
		</div>
	);
}

export const getStaticPaths: GetStaticPaths = async () => {
	return {
		paths: [],
		fallback: "blocking",
	};
};

export const getStaticProps: GetStaticProps = async (ctx) => {
	const { slug } = ctx.params;
	const { data } = await api.get(`/episodes/${slug}`);

	const episode = {
		id: data.id,
		title: data.title,
		thumbnail: data.thumbnail,
		members: data.members,
		publishedAt: format(parseISO(data.published_at), "d MMM yy", {
			locale: ptBR,
		}),
		duration: Number(data.file.duration),
		durationString: convertDurationToTimeString(Number(data.file.duration)),
		description: data.description,
		url: data.file.url,
	};

	return {
		props: { episode },
		revalidate: 60 * 60 * 8,
	};
};