import Chart from "chart.js/auto";
import { Bar as BarWrapper } from "react-chartjs-2";

export default function Bar(props) {
	// just want to show bars
	const { labels = [], data = [] } = props;

	return (
		<BarWrapper
			data={{
				labels,
				datasets: [
					{
						label: "",
						data,
						backgroundColor: "#045736",
						borderRadius: 3,
					},
				],
			}}
			options={{
				scales: {
					y: {
						display: false, // Hides the y-axis
					},
					x: {
						display: false, // Hides the x-axis
						offset: false, // Ensures the line stretches fully on x-axis
					},
				},
				plugins: {
					legend: {
						display: false, // Hides the legend
					},
				},
			}}
		/>
	);
}
