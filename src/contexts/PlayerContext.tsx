import { createContext, useState, ReactNode, useContext } from "react";
import { Helmet } from "react-helmet";

type Episode = {
	title: string;
	members: string;
	thumbnail: string;
	duration: number;
	url: string;
};

type PlayerContextData = {
	episodeList: Episode[];
	currentEpisodeIndex: number;
	play: (episode: Episode) => void;
	playList: (list: Episode[], index: number) => void;
	isPlaying: boolean;
	isLooping: boolean;
	isShuffling: boolean;
	togglePlay: () => void;
	toggleLoop: () => void;
	toggleShuffle: () => void;
	setPlayingState: (state: boolean) => void;
	playNext: () => void;
	playPrev: () => void;
	resetPlayerState: () => void;
	hasPrev: boolean;
	hasNext: boolean;
};

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
	children: ReactNode;
};

export function PlayerContextProvider({
	children,
}: PlayerContextProviderProps) {
	const [episodeList, setEpisodeList] = useState([]);
	const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const [isLooping, setIsLooping] = useState(false);
	const [isShuffling, setIsShuffling] = useState(false);

	function play(episode) {
		setEpisodeList([episode]);
		setCurrentEpisodeIndex(0);
		setIsPlaying(true);
	}

	function playList(list: Episode[], index: number) {
		setEpisodeList(list);
		setCurrentEpisodeIndex(index);
		setIsPlaying(true);
	}

	function toggleLoop() {
		if (isShuffling === false) {
			setIsLooping(!isLooping);
		}
	}

	function togglePlay() {
		setIsPlaying(!isPlaying);
	}
	function toggleShuffle() {
		if (isLooping === false) {
			setIsShuffling(!isShuffling);
		}
	}

	function setPlayingState(state: boolean) {
		setIsPlaying(state);
	}

	const hasPrev = currentEpisodeIndex > 0;
	const hasNext = isShuffling || currentEpisodeIndex + 1 < episodeList.length;

	function resetPlayerState() {
		setEpisodeList([]);
		setCurrentEpisodeIndex(0);
	}

	function playNext() {
		if (isShuffling) {
			const nextRandomEpisodeIndex = Math.floor(
				Math.random() * episodeList.length
			);
			setCurrentEpisodeIndex(nextRandomEpisodeIndex);
		} else if (hasNext) {
			setCurrentEpisodeIndex(currentEpisodeIndex + 1);
		}
	}
	function playPrev() {
		if (hasPrev) {
			setCurrentEpisodeIndex(currentEpisodeIndex - 1);
		}
	}

	return (
		<PlayerContext.Provider
			value={{
				episodeList,
				currentEpisodeIndex,
				play,
				playList,
				playNext,
				playPrev,
				isPlaying,
				togglePlay,
				setPlayingState,
				hasNext,
				hasPrev,
				isLooping,
				toggleLoop,
				toggleShuffle,
				isShuffling,
				resetPlayerState,
			}}>
			{children}
		</PlayerContext.Provider>
	);
}

export const usePlayer = () => {
	return useContext(PlayerContext);
};
