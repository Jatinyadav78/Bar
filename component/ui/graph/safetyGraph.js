"use client";
import dynamic from 'next/dynamic';
import './graph.css';
import React, { useEffect, useState, useMemo } from 'react';

const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function SafetyGraph({ xdata, workerData, staffData, darkMode = false, legendLabels = ['Workers', 'Staff'] }) {
    const [mounted, setMounted] = useState(false);

    // Calculate total cases for each category
    const totalCases = useMemo(() => ({
        USC: (workerData[0] || 0) + (staffData[0] || 0),
        USA: (workerData[1] || 0) + (staffData[1] || 0)
    }), [workerData, staffData]);

    // Memoize the options object
    const options = useMemo(() => ({
        chart: {
            type: 'bar',
            height: 400,
            stacked: true,
            toolbar: {
                show: true,
                tools: {
                    download: true,
                    selection: false,
                    zoom: false,
                    zoomin: false,
                    zoomout: false,
                    pan: false,
                    reset: false
                }
            },
            zoom: {
                enabled: false
            },
            foreColor: darkMode ? '#fff' : '#373d3f',
            background: darkMode ? '#1a2234' : '#fff',
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800,
                animateGradually: {
                    enabled: true,
                    delay: 150
                },
                dynamicAnimation: {
                    enabled: true,
                    speed: 350
                }
            }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '45%',
                endingShape: 'rounded',
                borderRadius: 8,
                distributed: false,
                rangeBarOverlap: true,
                rangeBarGroupRows: false,
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function (val) {
                return val || '';
            },
            style: {
                colors: [darkMode ? '#fff' : '#000'],
                fontSize: '12px',
                fontFamily: 'Arial, sans-serif',
                fontWeight: 600
            },
            offsetY: -20
        },
        legend: {
            position: 'top',
            horizontalAlign: 'left',
            offsetX: 40,
            fontSize: '14px',
            markers: {
                width: 12,
                height: 12,
                radius: 6
            },
            itemMargin: {
                horizontal: 10,
                vertical: 0
            },
            labels: {
                colors: darkMode ? '#fff' : '#000'
            }
        },
        stroke: {
            width: 2,
            colors: [darkMode ? '#2a3547' : '#fff'],
            lineCap: 'round'
        },
        grid: {
            borderColor: darkMode ? '#2a3547' : '#e7e7e7',
            padding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            },
            row: {
                colors: [darkMode ? '#1a2234' : '#f8f9fa', 'transparent'],
                opacity: 0.5
            }
        },
        xaxis: {
            categories: xdata || [''],
            labels: {
                rotate: -45,
                trim: true,
                style: {
                    fontSize: '13px',
                    fontFamily: 'Arial, sans-serif',
                    fontWeight: 600,
                    colors: darkMode ? '#fff' : '#000'
                }
            },
            axisBorder: {
                show: true,
                color: darkMode ? '#2a3547' : '#e7e7e7',
                height: 1,
                width: '100%',
                offsetX: 0,
                offsetY: 0
            },
            axisTicks: {
                show: true,
                borderType: 'solid',
                color: darkMode ? '#2a3547' : '#e7e7e7',
                height: 6,
                offsetX: 0,
                offsetY: 0
            }
        },
        yaxis: {
            title: {
                text: 'Number of Reports',
                style: {
                    color: darkMode ? '#fff' : '#000',
                    fontSize: '14px',
                    fontFamily: 'Arial, sans-serif',
                    fontWeight: 600
                }
            },
            min: 0,
            forceNiceScale: true,
            labels: {
                formatter: function (val) {
                    return Math.round(val);
                },
                style: {
                    colors: darkMode ? '#fff' : '#000',
                    fontSize: '12px',
                    fontFamily: 'Arial, sans-serif',
                    fontWeight: 500
                }
            }
        },
        colors: ['#4361ee', '#48cae4'],
        tooltip: {
            theme: darkMode ? 'dark' : 'light',
            shared: true,
            intersect: false,
            custom: function({ series, seriesIndex, dataPointIndex, w }) {
                const category = w.globals.labels[dataPointIndex];
                const total = totalCases[category];
                return `<div class="apexcharts-tooltip-title" style="font-family: Arial, sans-serif; font-size: 14px; font-weight: 600; margin-bottom: 8px; padding: 8px;">
                    <span>${category}</span>
                    <div style="margin-top: 8px; font-size: 13px; color: #64748b;">
                        Total Cases: <span style="font-weight: 600; color: #4361ee">${total}</span>
                    </div>
                    <div style="margin-top: 4px; font-size: 13px; color: #64748b;">
                        ${legendLabels[0]}: <span style="font-weight: 600; color: #4361ee">${series[0][dataPointIndex]}</span>
                    </div>
                    <div style="font-size: 13px; color: #64748b;">
                        ${legendLabels[1]}: <span style="font-weight: 600; color: #48cae4">${series[1][dataPointIndex]}</span>
                    </div>
                </div>`;
            },
            style: {
                fontSize: '12px',
                fontFamily: 'Arial, sans-serif'
            }
        },
        responsive: [{
            breakpoint: 480,
            options: {
                legend: {
                    position: 'bottom',
                    offsetX: -10,
                    offsetY: 0
                },
                plotOptions: {
                    bar: {
                        columnWidth: '70%'
                    }
                }
            }
        }]
    }), [xdata, darkMode, totalCases, legendLabels]);

    // Memoize the series data
    const series = useMemo(() => [
        {
            name: legendLabels[0],
            data: workerData || [0]
        },
        {
            name: legendLabels[1],
            data: staffData || [0]
        }
    ], [workerData, staffData, legendLabels]);

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