// "use client";
// import dynamic from 'next/dynamic';
// import './graph.css';
// import React, { useEffect, useState } from 'react';

// // Dynamically import ApexCharts with SSR disabled
// const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

// export default function Graph({ xdata, activeYData, closedYData }) {
//     const [options, setOptions] = useState({});
//     const [series, setSeries] = useState([]);
//     const [mounted, setMounted] = useState(false); 

//     useEffect(() => {
//         setMounted(true);
//         setOptions({
//             chart: {
//                 type: 'bar',
//                 height: 400,
//                 events: {
//                     click: function (chart, w, e) {
//                         // console.log(chart, w, e)
//                     }
//                 }
//             },
//             plotOptions: {
//                 bar: {
//                     horizontal: false,
//                     columnWidth: '55%',
//                     endingShape: 'rounded',
//                 }
//             },
//             dataLabels: {
//                 enabled: false
//             },
//             legend: {
//                 show: true 
//             },
//             stroke: {
//                 show: true,
//                 width: 2,
//                 colors: ['transparent']
//             },
//             xaxis: {
//                 categories: xdata ? xdata.map(permit => permit.toLowerCase().replace(" work permit", "").toUpperCase()) : ['permit'],
//                 labels: {
//                     rotate: -40,
//                     style: {
//                         fontSize: '12px',
//                     }
//                 }
//             },     
//             tooltip: {
//                 x: {
//                     formatter: function (val) {
//                         return val.toUpperCase() + " WORK PERMIT";
//                     }
//                 }
//             },
//             colors: ['#0073FF33', '#1cff0033']
//         });

//         setSeries([
//             { name: 'Active', data: activeYData ? activeYData : [0] },
//             { name: 'Closed', data: closedYData ? closedYData : [0] }
//         ]);
//     }, [xdata, activeYData, closedYData]);

//     if (!mounted) {
//         return <div style={{ height: '400px' }}>Loading chart...</div>; 
//     }

//     return (
//         <div id="chart" style={{ height: '400px' }}>
//             <ApexCharts options={options} series={series} type="bar" height={400} />
//         </div>
//     );
// }





"use client";
import dynamic from 'next/dynamic';
import './graph.css';
import React, { useEffect, useState } from 'react';

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
                stacked: true,
                toolbar: {
                    show: true
                },
                zoom: {
                    enabled: true
                }
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
                }
            },
            legend: {
                position: 'top',
                horizontalAlign: 'left',
                offsetX: 40
            },
            stroke: {
                width: 1,
                colors: ['#fff']
            },
            grid: {
                borderColor: '#e7e7e7',
                row: {
                    colors: ['#f3f3f3', 'transparent'],
                    opacity: 0.5
                }
            },
            xaxis: {
                categories: xdata
                    ? xdata.map(permit => permit.toLowerCase().replace(" work permit", "").toUpperCase())
                    : ['permit'],
                labels: {
                    rotate: -45,
                    trim: true,
                    style: {
                        fontSize: '12px',
                        fontFamily: 'Arial, sans-serif'
                    },
                    formatter: function (val) {
                        return val.length > 15 ? val.substring(0, 12) + '...' : val;
                    }
                }
            },
            yaxis: {
                title: {
                    text: 'Number of Permits'
                },
                min: 0,
                forceNiceScale: true,
                labels: {
                    formatter: function (val) {
                        return Math.round(val);
                    }
                }
            },
            colors: ['#0073FF', '#16B961'],
            tooltip: {
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
        });

        setSeries([
            { 
                name: 'Active',
                data: activeYData ? activeYData : [0]
            },
            {
                name: 'Closed',
                data: closedYData ? closedYData : [0]
            }
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




// "use client";
// import dynamic from 'next/dynamic';
// import './graph.css';
// import React, { useEffect, useState } from 'react';

// const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

// export default function Graph({ xdata, activeYData, closedYData }) {
//     const [options, setOptions] = useState({});
//     const [series, setSeries] = useState([]);
//     const [mounted, setMounted] = useState(false);

//     useEffect(() => {
//         setMounted(true);
//         setOptions({
//             chart: {
//                 type: 'bar',
//                 height: 400,
//                 stacked: false,
//                 toolbar: {
//                     show: true,
//                     tools: {
//                         download: true,
//                         selection: false,
//                         zoom: false,
//                         zoomin: false,
//                         zoomout: false,
//                         pan: false,
//                         reset: false
//                     }
//                 },
//                 animations: {
//                     enabled: true,
//                     easing: 'easeinout',
//                     speed: 800,
//                     animateGradually: {
//                         enabled: true,
//                         delay: 150
//                     },
//                     dynamicAnimation: {
//                         enabled: true,
//                         speed: 350
//                     }
//                 }
//             },
//             plotOptions: {
//                 bar: {
//                     horizontal: false,
//                     columnWidth: '70%',
//                     endingShape: 'rounded',
//                     borderRadius: 4,
//                     distributed: false,
//                     rangeBarOverlap: true,
//                     rangeBarGroupRows: false,
//                 }
//             },
//             dataLabels: {
//                 enabled: true,
//                 formatter: function (val) {
//                     return val || '';
//                 },
//                 style: {
//                     fontSize: '12px',
//                     colors: ['#333']
//                 },
//                 offsetY: -20
//             },
//             legend: {
//                 position: 'top',
//                 horizontalAlign: 'center',
//                 floating: true,
//                 offsetY: -10,
//                 markers: {
//                     width: 12,
//                     height: 12,
//                     strokeWidth: 0,
//                     radius: 12,
//                     offsetX: -3
//                 },
//                 itemMargin: {
//                     horizontal: 20,
//                     vertical: 8
//                 }
//             },
//             stroke: {
//                 show: true,
//                 width: 2,
//                 colors: ['transparent']
//             },
//             grid: {
//                 show: true,
//                 borderColor: '#e0e0e0',
//                 strokeDashArray: 0,
//                 position: 'back',
//                 xaxis: {
//                     lines: {
//                         show: false
//                     }
//                 },
//                 yaxis: {
//                     lines: {
//                         show: true
//                     }
//                 },
//                 padding: {
//                     top: 0,
//                     right: 25,
//                     bottom: 0,
//                     left: 15
//                 }
//             },
//             xaxis: {
//                 categories: xdata
//                     ? xdata.map(permit => permit.toLowerCase().replace(" work permit", "").toUpperCase())
//                     : ['permit'],
//                 labels: {
//                     rotate: -45,
//                     rotateAlways: false,
//                     hideOverlappingLabels: true,
//                     trim: true,
//                     style: {
//                         fontSize: '12px',
//                         fontFamily: 'Arial, sans-serif',
//                         fontWeight: 500
//                     },
//                     formatter: function (val) {
//                         if (val.length > 15) {
//                             return val.substring(0, 12) + '...';
//                         }
//                         return val;
//                     }
//                 },
//                 axisBorder: {
//                     show: true,
//                     color: '#e0e0e0'
//                 },
//                 axisTicks: {
//                     show: true,
//                     color: '#e0e0e0'
//                 }
//             },
//             yaxis: {
//                 title: {
//                     text: 'Number of Permits',
//                     style: {
//                         fontSize: '14px',
//                         fontWeight: 500
//                     }
//                 },
//                 min: 0,
//                 max: undefined,
//                 forceNiceScale: true,
//                 floating: false,
//                 decimalsInFloat: 0,
//                 labels: {
//                     formatter: function (val) {
//                         return Math.round(val);
//                     },
//                     style: {
//                         fontSize: '12px',
//                         fontWeight: 400
//                     }
//                 }
//             },
//             colors: ['#0073FF', '#16B961'],
//             tooltip: {
//                 shared: true,
//                 intersect: false,
//                 y: {
//                     formatter: function (val) {
//                         return val;
//                     }
//                 },
//                 style: {
//                     fontSize: '12px'
//                 }
//             },
//             responsive: [{
//                 breakpoint: 480,
//                 options: {
//                     chart: {
//                         height: 300
//                     },
//                     legend: {
//                         show: true,
//                         position: 'bottom',
//                         offsetX: 0,
//                         offsetY: 8,
//                         floating: false
//                     },
//                     plotOptions: {
//                         bar: {
//                             columnWidth: '85%'
//                         }
//                     },
//                     xaxis: {
//                         labels: {
//                             rotate: -45,
//                             maxHeight: 60
//                         }
//                     }
//                 }
//             }]
//         });

//         setSeries([
//             { 
//                 name: 'Active',
//                 data: activeYData ? activeYData : [0]
//             },
//             {
//                 name: 'Closed',
//                 data: closedYData ? closedYData : [0]
//             }
//         ]);
//     }, [xdata, activeYData, closedYData]);

//     if (!mounted) {
//         return <div style={{ height: '400px' }}>Loading chart...</div>;
//     }

//     return (
//         <div id="chart" style={{ height: '400px', width: '100%', maxWidth: '100%' }}>
//             <ApexCharts options={options} series={series} type="bar" height={400} />
//         </div>
//     );
// }