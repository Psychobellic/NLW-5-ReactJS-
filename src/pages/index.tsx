import { GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { api } from "../services/api";
import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { convertDurationToTimeString } from "../utils/convertDurationToString";
import { useContext } from "react";
import { PlayerContext } from "../contexts/PlayerContext";

import styles from "./home.module.scss";

type Episode = {
	id: number;
	title: string;
	thumbnail: string;
	members: string;
	duration: number;
	durationString: string;
	url: string;
	publishedAt: string;
};

type HomeProps = {
	allEpisodes;
	latestEpisodes: Episode[];
};

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
	const { play } = useContext(PlayerContext);
	return (
		<div className={styles.homepage}>
			<section className={styles.latestEpisodes}>
				<h2>Últimos Lançamentos</h2>

				<ul>
					{latestEpisodes.map((episode) => {
						var membersXS = episode.members.split(",").join("\n");
						return (
							<li key={episode.id}>
								<Image
									src={episode.thumbnail}
									alt={episode.title}
									width={192}
									height={192}
									objectFit="cover"
								/>
								<div className={styles.episodeDetails}>
									<Link href={`/episode/${episode.id}`}>
										<a>{episode.title}</a>
									</Link>
									<p className={styles.pBig}>{episode.members}</p>
									<p className={styles.pSmall}>{membersXS}</p>
									<span>{episode.publishedAt}</span>
									<span>{episode.durationString}</span>
								</div>

								<button type="button" onClick={() => play(episode)}>
									<img src="/play-green.svg" alt="play episode" />
								</button>
							</li>
						);
					})}
				</ul>
			</section>
			<section className="styles.allEpisodes">
				<h2>Todos os episódios</h2>
				<table cellSpacing={0}>
					<thead>
						<th></th>
						<th>Podcast</th>
						<th>Integrantes</th>
						<th>Data</th>
						<th>Duração</th>
						<th></th>
					</thead>
					<tbody>
						{allEpisodes.map((episode) => {
							return (
								<tr key={episode.id}>
									<td className={styles.imageAllEp}>
										<Image
											width={120}
											height={120}
											src={episode.thumbnail}
											alt={episode.title}
											objectFit="cover"
										/>
									</td>
									<td>
										<Link href={`/episode/${episode.id}`}>
											<a className={styles.title}>{episode.title}</a>
										</Link>
									</td>
									<td>{episode.members}</td>
									<td className={styles.publishedAt}>{episode.publishedAt}</td>
									<td>{episode.durationString}</td>
									<td>
										<button className={styles.playAllEpBtn} type="button">
											<img src="/play-green.svg" alt="Rodar Episódio" />
										</button>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</section>
		</div>
	);
}

export const getStaticProps: GetStaticProps = async () => {
	const { data } = await api.get("episodes", {
		params: {
			_limit: 12,
			_order: "desc",
			_sort: "published_at",
		},
	});

	const episodes = data.map((episode) => {
		return {
			id: episode.id,
			title: episode.title,
			thumbnail: episode.thumbnail,
			members: episode.members,
			publishedAt: format(parseISO(episode.published_at), "d MMM yy", {
				locale: ptBR,
			}),
			duration: Number(episode.file.duration),
			durationString: convertDurationToTimeString(
				Number(episode.file.duration)
			),
			description: episode.description,
			url: episode.file.url,
		};
	});

	const latestEpisodes = episodes.slice(0, 2);
	const allEpisodes = episodes.slice(2, episodes.length);

	return {
		props: {
			allEpisodes,
			latestEpisodes,
		},
		revalidate: 60 * 60 * 8,
	};
};
