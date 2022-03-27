import React, { useState, useEffect } from "react";
import axios from "./axios";
import "./Row.css";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

const base_url = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, isLargeRow }) {
	const [movies, setMovies] = useState([]);
	const [trailerUrl, setTrailerUrl] = useState("");

	useEffect(() => {
		async function fetchData() {
			//expend url to base url and return api result
			const request = await axios.get(fetchUrl);
			// console.log(request);
			setMovies(request.data.results);
			return request;
		}
		fetchData();
	}, [fetchUrl]);

	const opts = {
		height: "390",
		width: "100%",
		playerVars: {
			// https://developers.google.com/youtube/player_parameters
			autoplay: 1,
		},
	};

	function videoFindByTitle(url) {
		let VID_REGEX =
			/(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
		let down = url.match(VID_REGEX)[1];
		return down;
	}

	const handleClick = (movie) => {
		console.log(movie);
		if (trailerUrl) {
			setTrailerUrl("");
		} else {
			// movie?.name || movie.id ||
			movieTrailer(movie.original_name || movie.name || movie.title || "").then(
				(url) => {
					console.log(url);
					setTrailerUrl(videoFindByTitle(url));
					// const urlParams = new URLSearchParams(new URL(url).search);
					// setTrailerUrl(urlParams.get("v"));
					// console.log(urlParams.get("v"));
				}
			);
		}
	};

	return (
		<div className='row'>
			<h2 className='row_title'>{title}</h2>
			<div className='row_posters'>
				{console.log(movies)}
				{movies.map((movie) => {
					// return <p>{movie.name}</p>;
					return (
						<img
							onClick={() => handleClick(movie)}
							key={movie.id}
							className={`row_poster ${isLargeRow && " row_posterLarge"}`}
							src={`${base_url}${
								isLargeRow ? movie.poster_path : movie.backdrop_path
							}`}
							alt={movie.name}
						/>
					);
				})}
			</div>
			{trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
		</div>
	);
}

export default Row;
