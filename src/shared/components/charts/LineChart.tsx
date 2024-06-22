import React, {useEffect, useRef} from 'react';
import * as echarts from 'echarts';

const LineChart: React.FC = ({chartTitle, footerType, seriesData}) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  let footerData: string[];
  switch (footerType) {
    case 'yearly':
      footerData = [
        'Jan',
        'Fev',
        'Mar',
        'Abr',
        'Mai',
        'Jun',
        'Jul',
        'Ago',
        'Set',
        'Out',
        'Nov',
        'Dez',
      ];
      break;
    case 'monthly':
      if (seriesData[0].data.length === 4) { 
        footerData = [
          '1ª sem',
          '2ª sem',
          '3ª sem',
          '4ª sem'
        ];
      }else { 
        footerData = [
          '1ª sem',
          '2ª sem',
          '3ª sem',
          '4ª sem',
          '5ª sem'
        ];        
      }
      break;
    case 'weekly':
      const today = new Date();
      const last7Days = [];
      
      for (let i = 0; i < 7; i++) {
        let day = new Date(today);
        day.setDate(today.getDate() - i);
        last7Days.push(day);
      }
      
      const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      
      footerData = last7Days.reverse().map(date => {
        const dayOfWeek = date.getDay();
        return dayNames[dayOfWeek];
      });
      
      break;
    case 'all':
      break;
  }
  const legendData: string[] = seriesData.map(obj => obj.name);
  
  useEffect(() => {
    if (chartRef.current) {
      const myChart = echarts.init(chartRef.current, null, {
        renderer: 'canvas',
        useDirtyRect: false,
      });

      const option = {
        title: {
          text: chartTitle,
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: legendData,
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: footerData,
        },
        yAxis: {
          type: 'value',
        },
        series: seriesData,
      };

      myChart.setOption(option);

      const handleResize = () => {
        myChart.resize();
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        myChart.dispose();
      };
    }
  }, []);

  return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />;
};

export default LineChart;