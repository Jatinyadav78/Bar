"use client";
import dynamic from 'next/dynamic';
import './graph.css';
import React, { useEffect, useState, useMemo } from 'react';

const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function Graph({ xdata, activeYData, closedYData, darkMode = false }) {
    const [mounted, setMounted] = useState(false);

    // Memoize the options object
    const options = useMemo(() => ({
        chart: {
            type: 'bar',
            height: 400,
            stacked: true,
            toolbar: {
                show: true
            },
            zoom: {
                enabled: true
            },
            foreColor: darkMode ? '#fff' : '#373d3f',
            background: darkMode ? '#1a2234' : '#fff'
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '50%',
                endingShape: 'rounded',
                borderRadius: 4
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function (val) {
                return val || '';
            },
            style: {
                colors: [darkMode ? '#fff' : '#000']
            }
        },
        legend: {
            position: 'top',
            horizontalAlign: 'left',
            offsetX: 40,
            labels: {
                colors: darkMode ? '#fff' : '#000'
            }
        },
        stroke: {
            width: 1,
            colors: [darkMode ? '#2a3547' : '#fff']
        },
        grid: {
            borderColor: darkMode ? '#2a3547' : '#e7e7e7',
            row: {
                colors: [darkMode ? '#1a2234' : '#f3f3f3', 'transparent'],
                opacity: 0.5
            }
        },
        xaxis: {
            categories: xdata || [''],
            labels: {
                rotate: -45,
                trim: true,
                style: {
                    fontSize: '12px',
                    fontFamily: 'Arial, sans-serif',
                    colors: darkMode ? '#fff' : '#000'
                },
                formatter: function (val) {
                    return val.length > 15 ? val.substring(0, 12) + '...' : val;
                }
            }
        },
        yaxis: {
            title: {
                text: 'Number of Reports',
                style: {
                    color: darkMode ? '#fff' : '#000'
                }
            },
            min: 0,
            forceNiceScale: true,
            labels: {
                formatter: function (val) {
                    return Math.round(val);
                },
                style: {
                    colors: darkMode ? '#fff' : '#000'
                }
            }
        },
        colors: ['#0073FF', '#16B961'],
        tooltip: {
            theme: darkMode ? 'dark' : 'light',
            y: {
                formatter: function (val) {
                    return val;
                }
            }
        },
        responsive: [{
            breakpoint: 480,
            options: {
                legend: {
                    position: 'bottom',
                    offsetX: -10,
                    offsetY: 0
                }
            }
        }]
    }), [xdata, darkMode]);

    // Memoize the series data
    const series = useMemo(() => [
        {
            name: 'Active',
            data: activeYData || [0]
        },
        {
            name: 'Closed',
            data: closedYData || [0]
        }
    ], [activeYData, closedYData]);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div style={{ height: '400px' }}>Loading chart...</div>;
    }

    return (
        <div id="chart" style={{ height: '400px' }}>
            <ApexCharts options={options} series={series} type="bar" height={400} />
        </div>
    );
}
