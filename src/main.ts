
import * as Data from './data';
import * as Chart from './charts';

import "picnic/picnic.min.css";


// elements
const dataSetDropdownElement = document.getElementById("dataSets") as HTMLSelectElement;
const graphCanvasElement = document.getElementById("graph") as HTMLCanvasElement;

// attach handlers
dataSetDropdownElement.addEventListener('change', onChangeDataSetHandler)
document.addEventListener('DOMContentLoaded', onDOMContentLoadedHandler)

// global state
let currentDataSets: Array<Data.DataSet> | null = null;
let chartSession: Chart.ChartSession | null = null;

// handlers
async function onChangeDataSetHandler(e: Event) {
  const target = e.target as HTMLSelectElement;
  currentDataSets = await Data.createDataSets(target.value as Data.DataSetType);
  const title = target.options[target.selectedIndex].text;
  Chart.render(chartSession!, title, currentDataSets);
  
}

async function onDOMContentLoadedHandler(_e: Event) {
  chartSession = Chart.createChartSession(graphCanvasElement);
  const title = dataSetDropdownElement.options[dataSetDropdownElement.selectedIndex].text;
  const dataSetType = dataSetDropdownElement.value as Data.DataSetType;
  currentDataSets = await Data.createDataSets(dataSetType);
  Chart.render(chartSession, title, currentDataSets);
}
