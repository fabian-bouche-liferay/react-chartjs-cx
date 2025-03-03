import React from "react";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, PointElement, LineElement, LinearScale, BarElement, Filler, Tooltip, Legend } from "chart.js";
import { useLiferayData } from "./hooks/useLiferayData";
import { useChartData } from "./hooks/useChartData.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler, Tooltip, Legend);

function LiferayGraphRenderer(props) {

    const dataPoints = useLiferayData(props.baseURL, props.objectDefinition);

    const { labels, datasets } = useChartData(dataPoints, props.configuration, props.locale);

    if(props.graphType === "Bar") {
        const chartData = { labels, datasets };
        return (<Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />);
    } else if(props.graphType === "Line") {
        const chartData = { labels, datasets };
        return (<Line data={chartData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />);
    } else if(props.graphType === "Area") {
        const updatedDatasets = datasets.map(dataset => ({ ...dataset, fill: true}));
        const chartData = { labels, datasets: updatedDatasets };
        return (<Line data={chartData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />);
    } else {
        return (<p>No graph type selected</p>);
    }

}

export default LiferayGraphRenderer;