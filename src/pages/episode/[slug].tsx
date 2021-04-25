import { GetStaticProps, GetStaticPaths } from "next";
import { api } from "../../services/api";
import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import Link from "next/link";
import { useRouter } from "next/router";
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
	const router = useRouter();
	if (router.isFallback) {
		return <p>Carregando...</p>;
	}
	return (
		<div className={styles.episode}>
			<div className={styles.thumbnailContainer}>
				<Link href="/">
					<button className={styles.playBtn} type="button">
						<img src="/play.svg" alt="Tocar Episódio" />
					</button>
				</Link>

				<Image
					width={700}
					height={160}
					src={episode.thumbnail}
					objectFit="cover"
				/>

				<Link href="/">
					<button className={styles.returnBtn} type="button">
						<img src="/arrow-left.svg" alt="Voltar" />
					</button>
				</Link>
			</div>
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
	);
}

export const getStaticPaths: GetStaticPaths = async () => {
	const { data } = await api.get("episodes", {
		params: {
			_limit: 2,
			_order: "desc",
			_sort: "published_at",
		},
	});

	const paths = data.map((episode) => {
		return {
			params: {
				slug: episode.id,
			},
		};
	});

	return {
		paths: [
			{
				params: {
					slug: "a-importancia-da-contribuicao-em-open-source",
				},
			},
		],
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
