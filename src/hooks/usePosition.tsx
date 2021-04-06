import { useEffect, useState } from "react";
import axios from "axios";

interface CurrentPosition {
  latitude: number,
  longitude: number,
}

function usePosition() {
	const [isLoading, setIsLoading] = useState(true);
	const [currentPosition, setCurrentPosition] = useState<CurrentPosition>({latitude:0, longitude: 0})

	useEffect( () => {
		navigator.geolocation.getCurrentPosition(
			function (position) {
				const { latitude, longitude } = position.coords;

				setCurrentPosition({ latitude, longitude });
				setIsLoading(false);
			},
			async function(error) {
				try {
					const response = await axios.get("http://ip-api.com/json");
					const { lat, lon } = response.data;

					setCurrentPosition({ latitude: lat, longitude: lon });
				} catch (err) {
					console.error(err);
				}

				setIsLoading(false);
			},
			{
				enableHighAccuracy: true,
			}
		);
	}, []);

	return { currentPosition, isLoading };
}

export default usePosition;