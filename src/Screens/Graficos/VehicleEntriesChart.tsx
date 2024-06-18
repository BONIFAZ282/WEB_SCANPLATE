import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import { iDailyData, iMonthlyData, iYearlyData } from '../../iType';
import { URL_API } from '../../config';


// Registrar las escalas y otros componentes
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const VehicleEntriesChart: React.FC = () => {
    const [dailyData, setDailyData] = useState<iDailyData[]>([]);
    const [monthlyData, setMonthlyData] = useState<iMonthlyData[]>([]);
    const [yearlyData, setYearlyData] = useState<iYearlyData[]>([]);

    useEffect(() => {
        const fetchDailyData = async () => {
            try {
                const response = await axios.get<iDailyData[]>(`${URL_API}/placa/dia`);
                setDailyData(response.data);
            } catch (error) {
                console.error('Error fetching daily data', error);
            }
        };

        const fetchMonthlyData = async () => {
            try {
                const response = await axios.get<iMonthlyData[]>(`${URL_API}/placa/mes`);
                setMonthlyData(response.data);
            } catch (error) {
                console.error('Error fetching monthly data', error);
            }
        };

        const fetchYearlyData = async () => {
            try {
                const response = await axios.get<iYearlyData[]>(`${URL_API}/placa/anio`);
                setYearlyData(response.data);
            } catch (error) {
                console.error('Error fetching yearly data', error);
            }
        };

        fetchDailyData();
        fetchMonthlyData();
        fetchYearlyData();
    }, []);

    const dailyChartData = {
        labels: dailyData.map(entry => entry.dia),
        datasets: [
            {
                label: 'Cantidad de Vehículos por Día',
                data: dailyData.map(entry => entry.cantidad_vehiculos),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const monthlyChartData = {
        labels: monthlyData.map(entry => `${entry.anio}-${entry.mes}`),
        datasets: [
            {
                label: 'Cantidad de Vehículos por Mes',
                data: monthlyData.map(entry => entry.cantidad_vehiculos),
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
            },
        ],
    };

    const yearlyChartData = {
        labels: yearlyData.map(entry => entry.anio),
        datasets: [
            {
                label: 'Cantidad de Vehículos por Año',
                data: yearlyData.map(entry => entry.cantidad_vehiculos),
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="chart-container">
            <div className="chart-section">
                <h2>Entradas de Vehículos por Día</h2>
                <Bar data={dailyChartData} />
            </div>
            <div className="chart-section">
                <h2>Entradas de Vehículos por Mes</h2>
                <Bar data={monthlyChartData} />
            </div>
            <div className="chart-section">
                <h2>Entradas de Vehículos por Año</h2>
                <Bar data={yearlyChartData} />
            </div>
        </div>
    );
};

export default VehicleEntriesChart;
