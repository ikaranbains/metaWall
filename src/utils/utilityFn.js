export function stringToNumberSeed(str) {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = (hash << 5) - hash + str.charCodeAt(i);
		hash |= 0;
	}
	return Math.abs(hash);
}

export function getCoordinatesForPercent(percent) {
	const x = 50 + 50 * Math.cos(2 * Math.PI * percent - Math.PI / 2);
	const y = 50 + 50 * Math.sin(2 * Math.PI * percent - Math.PI / 2);
	return [x, y];
}

