import { Chart as ChartJS } from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import { useFetchChartData } from './chartData';

const BarChart = () => {
    const { data, isLoading, error } = useFetchChartData();

    if (isLoading) return <p>Loading chart data...</p>;
    if (error) return <p>Failed to load chart data 😢</p>;
    if (!data) return null;

    // ✅ Use API response directly
    const chartData = {
        labels: data.labels, // From backend (January–December)
        datasets: [
            {
                label: "Total Jobseekers",
                data: data.totalJobseekers,
                backgroundColor: "rgba(0, 52, 121, 1)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
                barPercentage: 0.7,
                categoryPercentage: 0.8,
            },
            {
                label: "Total Employers",
                data: data.totalEmployers,
                backgroundColor: "rgba(0, 194, 203, 1)",
                borderColor: "rgba(0, 90, 110, 1)",
                borderWidth: 1,
                barPercentage: 0.7,
                categoryPercentage: 0.8,
            },
            {
                label: "Total Agencies",
                data: data.totalAgencies,
                backgroundColor: "rgba(189, 195, 199, 1)",
                borderColor: "rgba(120, 125, 130, 1)",
                borderWidth: 1,
                barPercentage: 0.7,
                categoryPercentage: 0.8,
            },
            {
                label: "Hired Jobseekers",
                data: data.totalHired,
                backgroundColor: "rgba(153, 102, 255, 0.6)",
                borderColor: "rgba(153, 102, 255, 1)",
                borderWidth: 1,
                barPercentage: 0.7,
                categoryPercentage: 0.8,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    color: "#333",
                    font: { size: 14 },
                },
            },
            title: {
                display: true,
                text: "Users Overview",
                font: { size: 18 },
                color: "#111",
            },
        },
        scales: {
            x: {
                ticks: {
                    color: "#555",
                },
                grid: {
                    color: "rgba(0,0,0,0.1)",
                },
            },
            y: {
                beginAtZero: true,
                ticks: {
                    color: "#555",
                },
                grid: {
                    color: "rgba(0,0,0,0.1)",
                },
            },
        },
    };

    return <Bar data={chartData} options={options} />;
};

export default BarChart;
