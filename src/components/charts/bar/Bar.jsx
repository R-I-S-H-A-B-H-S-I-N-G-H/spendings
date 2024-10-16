import Chart from "chart.js/auto";
import { Bar as BarWrapper } from "react-chartjs-2";

export default function Bar(props) {
	const { labels = [], data = [] } = props;

	// Calculate the mean of the data
	const meanValue = data.reduce((acc, value) => acc + value, 0) / data.length;

	return (
		<BarWrapper
			data={{
				labels,
				datasets: [
					{
						label: "Spending",
						data,
						backgroundColor: data.map(
							(value) => (value > meanValue ? "#045736" : "#045736"), // Red for values above mean
						),
						borderRadius: 3,
					},
				],
			}}
			options={{
				scales: {
					y: {
						beginAtZero: true,
						display: false,
					},
					x: {
						display: false,
					},
				},
				plugins: {
					legend: {
						display: false, // Hide the legend
					},
					tooltip: {
						callbacks: {
							label: function (context) {
								return context.raw === 0 ? "" : context.raw;
							},
						},
					},
				},
			}}
		/>
	);
}
