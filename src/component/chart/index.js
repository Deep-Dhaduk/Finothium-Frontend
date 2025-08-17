import { Card, Grid } from '@mui/material';
import { CategoryScale } from 'chart.js';
import Chart from "chart.js/auto";
import { useContext } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { ReportViewContext } from 'src/pages/_app';

const options = {
    scales: {
        y: {
            beginAtZero: true,
        },
    },
};

const ChartComponant = (props) => {
    const { chartData, title } = props
    Chart.register(CategoryScale);
    const { reportViewSetting, setReportViewSetting } = useContext(ReportViewContext)

    const data = {
        labels: chartData.label,
        datasets: [
            {
                label: 'Received ',
                data: chartData.ReceiveAmount,
                backgroundColor: 'rgba(38, 198, 249, 0.8)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                fill: false
            },
            {
                label: 'Paid',
                data: chartData.PaidAmount,
                backgroundColor: 'rgba(253, 181, 40, 0.8)',
                borderWidth: 1,
                fill: false,
                borderColor: 'rgba(253, 181, 40, 0.8)',
            },
        ],
    };
    const totalBalancedata = {
        labels: chartData.label,
        datasets: [
            {
                label: 'Balance',
                data: chartData.BalanceAmount,
                backgroundColor: 'rgba(100, 198, 35, 0.8)',
                borderWidth: 1,
                fill: false,
                borderColor: 'rgba(100, 198, 35, 0.8)'
                // fill: {
                //     target: "origin", // 3. Set the fill options
                //     above: "rgba(100, 198, 35, 0.8)"
                // }
                // borderColor: 'rgba(54, 162, 235, 1)',
            },
        ],
    };

    return (
        <>
            {reportViewSetting.chart && chartData.label.length > 0 ?
                <Grid container spacing={3} mb={5}>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ p: 5 }}>
                            {/* <Bar data={data} options={options} /> */}
                            {title === 'monthlyStatement' ? <Line data={data} options={options} /> : <Bar data={data} options={options} height={50} width={100} />}
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ p: 5 }}>
                            {title === 'monthlyStatement' ? <Line data={totalBalancedata} options={options} /> : <Bar data={totalBalancedata} options={options} height={50} width={100} />}
                        </Card>

                    </Grid>
                </Grid >
                : null}
        </>
    )
}

export default ChartComponant