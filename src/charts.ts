// main.ts
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DatasetComponent,
  ToolboxComponent,
  DataZoomComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { EChartsOption } from 'echarts';
import type { DataSet } from './data';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DatasetComponent,
  DataZoomComponent,
  ToolboxComponent,
  LineChart,
  CanvasRenderer
]);

export type ChartSession = {
  chart: echarts.ECharts,
}

function resize(session: ChartSession, dimentions: { height: number, width: number }) {
  const width = dimentions.width ;
  const height = dimentions.height - dimentions.height * .2;
  session.chart.resize({
    width,
    height,
      animation: {
        delay: 0.4,
      }
    })
}

export function createChartSession(element: HTMLCanvasElement) {
  const chart = echarts.init(element)
  const session = {
    chart,
  }
  window.addEventListener('resize', (ev: UIEvent) => {
    const target = ev.target as Window;
    const { innerHeight: height, innerWidth: width } = target;
    resize(session, {height, width})
  });

  resize(session, { height: window.innerHeight, width: window.innerWidth });
  return session;
}

export function render(session: ChartSession, title: string, dataSets: Array<DataSet>) {
  const option: EChartsOption = {
    title: {
      text: title,
      top:'0'
    },
    tooltip: { trigger: 'axis' },
    legend: {
      orient: 'vertical',
      left: '0',
      top:'5%',
      data: dataSets.map(d => d.exchange)
    },
    toolbox: {
      feature: {
        saveAsImage: {},
        dataView: {},
      }
    },
    dataZoom: {
      type: 'slider',
      show: true,
      xAxisIndex: [0],
      start: 80,
      end: 100,
      bottom: '3',
    },
    outerBounds :{ },
    grid: { outerBounds: { left: '3%', right: '4%', bottom: '3%' } },
    xAxis: {
      type: 'category',
      data: dataSets[0].dataSet.map(d => d.date.toISOString().split('T')[0])
    },
    yAxis: { type: 'value' },
    series:
      dataSets.map(ds => {
        return {
          name: ds.exchange,
          type: 'line',
          smooth: true,
          data: ds.dataSet.map(d => d.value),
          showSymbol: false, 
        emphasis: { focus: 'series' }
      }
    })
  };
  session.chart.setOption(option);
}
