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

export function createChartSession(element: HTMLCanvasElement) {
  const chart = echarts.init(element)
  const session = {
    chart,
  }
  return session;
}

export const dispose = (session: ChartSession) => session.chart.dispose();
export const resize = (session: ChartSession) => session.chart.resize();
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
