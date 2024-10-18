import Chart from "chart.js/auto";
import { Line as LineWrapper } from "react-chartjs-2";

export default function Line(props) {
	const { labels = ["data1", "data2"], data = [1, -2] } = props;

	return (
		<LineWrapper
			data={{
				labels,
				datasets: [
					{
						label: "Dataset 1",
						data: data,
						fill: true,
						tension: 0.4, // Adds smoothness to the line
						backgroundColor: "rgba(255, 99, 132, 0.5)", // Adjust the color of the line
						borderColor: "rgba(255, 99, 132, 1)", // Adjust the color of the border
						// borderWidth: 5, // Adjust the width of the border
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
				elements: {
					line: {
						borderWidth: 2, // You can adjust the line thickness
					},
					point: {
						radius: 0, // Hides the points to make the line smooth and continuous
					},
				},
			}}
		/>
	);
}
