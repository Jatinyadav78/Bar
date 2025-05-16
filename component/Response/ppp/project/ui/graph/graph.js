"use client";
import dynamic from 'next/dynamic';
import './graph.css';
import React, { useEffect, useState } from 'react';

// Dynamically import ApexCharts with SSR disabled
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function Graph({ xdata, activeYData, closedYData }) {
    const [options, setOptions] = useState({});
    const [series, setSeries] = useState([]);
    const [mounted, setMounted] = useState(false); 

    useEffect(() => {
        setMounted(true);
        setOptions({
            chart: {
                type: 'bar',
                height: 400,
                events: {
                    click: function (chart, w, e) {
                        // console.log(chart, w, e)
                    }
                }
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    endingShape: 'rounded',
                }
            },
            dataLabels: {
                enabled: false
            },
            legend: {
                show: true 
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent']
            },

            // xaxis: {
            //     categories: xdata ? xdata.map(permit => permit.toLowerCase().replace(" work permit", "").toUpperCase()) : ['permit'],
            //     labels: {
            //         rotate: -40,
            //         style: {
            //             fontSize: '12px',
            //         }
            //     }
            // },
            // tooltip: {
            //     x: {
            //         formatter: function (val) {
            //             return val.toUpperCase() + " WORK PERMIT";
            //         }
            //     }
            // },



            xaxis: {
                categories: xdata
                    ? xdata.map(permit => permit.toLowerCase().replace(" work permit", "").toUpperCase())
                    : ['permit'],
                labels: {
                    rotate: -40, // Rotates the labels to prevent overlap
                    style: {
                        fontSize: '12px',
                        fontFamily: 'Arial, sans-serif',
                        whiteSpace: 'normal', // Allows text wrapping
                    },
                    maxHeight: 60, // Limits the height of the labels to prevent overflow
                    formatter: function (val) {
                        return val.length > 15 ? val.substring(0, 12) + '...' : val; // Truncates long names
                    }
                }
            },
            colors: ['#0073FF33', '#1cff0033']
        });

        setSeries([
            { name: 'Active', data: activeYData ? activeYData : [0] },
            { name: 'Closed', data: closedYData ? closedYData : [0] }
        ]);
    }, [xdata, activeYData, closedYData]);

    if (!mounted) {
        return <div style={{ height: '400px' }}>Loading chart...</div>; 
    }

    return (
        <div id="chart" style={{ height: '400px' }}>
            <ApexCharts options={options} series={series} type="bar" height={400} />
        </div>
    );
}


