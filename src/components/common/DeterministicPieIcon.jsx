import React from "react";
import {
	getCoordinatesForPercent,
	stringToNumberSeed,
} from "../../utils/utilityFn";

const DeterministicPieIcon = ({ address, size = 20 }) => {
	const seed = stringToNumberSeed(address || "seed"); // fallback if empty
	const slices = (seed % 4) + 2;
	let remaining = 100;
	let percents = [];

	for (let i = 0; i < slices; i++) {
		if (i === slices - 1) percents.push(remaining);
		else {
			const rnd =
				Math.abs(
					Math.floor(Math.sin(seed + i) * 10000) % (remaining - (slices - i))
				) + 1;
			percents.push(rnd);
			remaining -= rnd;
		}
	}

	let cumulative = 0;
	const paths = percents.map((percent, i) => {
		const [sx, sy] = getCoordinatesForPercent(cumulative / 100);
		cumulative += percent;
		const [ex, ey] = getCoordinatesForPercent(cumulative / 100);
		const largeArc = percent > 50 ? 1 : 0;
		const path = `M 50 50 L ${sx} ${sy} A 50 50 0 ${largeArc} 1 ${ex} ${ey} Z`;

		return {
			d: path,
			color: `hsl(${(seed * (i + 1) * 47) % 360}, 70%, 60%)`,
		};
	});

	return (
		<svg width={size} height={size} viewBox="0 0 100 100">
			{paths.map((slice, i) => (
				<path
					key={i}
					d={slice.d}
					fill={slice.color}
					stroke="white"
					strokeWidth="0.5"
				/>
			))}
		</svg>
	);
};

export default DeterministicPieIcon;
