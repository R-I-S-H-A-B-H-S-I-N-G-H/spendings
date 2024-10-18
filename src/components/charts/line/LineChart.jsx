import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";

export default function LineChart(props) {
	const { labels = [], data = [] } = props;

	return (
		<Line
			data={{
				labels,
				datasets: [
					{
						label: "",
						data, // Zero entries will appear as points on the x-axis
						fill: true,
						borderColor: "#045736",
						backgroundColor: "rgba(4, 87, 54, 0.1)",
						pointBackgroundColor: data.map((value) => (value === 0 ? "red" : "#045736")), // Highlight zero points in red
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
								return context.raw === 0 ? "No spending" : context.raw;
							},
						},
					},
				},
			}}
		/>
	);
}
