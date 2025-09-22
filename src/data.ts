import * as Utils from './utils';
export type DataRecord = { date: Date, value: number };

export type DataSet = {
  type: DataSetType,
  exchange: string,
  dataSet: Array<DataRecord>
};

export type DataSetType =  "etp_cancel_to_trade" | "etp_hidden_rate" | "etp_hidden_volume" | "etp_oddlot_rate" | "etp_oddlot_volume" | "etp_trade_volume" | "stock_cancel_to_trade" | "stock_hidden_rate" | "stock_hidden_volume" | "stock_oddlot_rate" | "stock_oddlot_volume" | "stock_trade_volume";

export async function createDataSets(dataSetType: DataSetType): Promise<Array<DataSet>>{
  const filePath = dataSetFilePath(dataSetType);
  const csvText = await fetchCSV(filePath);
  const { headers: exchanges, data } = parseCSV(csvText);

  const dataSets: Array<DataSet> = exchanges.slice(1, exchanges.length).map((exchange, index) => ({
    type: dataSetType,
    exchange,
    dataSet: data.map(row => ({ date: parseYYYYMMDD(row[0]), value: +row[index +1] }))
  }));
  return dataSets;
}

const dataSetFilePath = (type: DataSetType) =>
  Utils.IsProduction() ?
    `${window.location.href}data/${type}.csv`
    :`/data/${type}.csv`;



async function fetchCSV(path: string): Promise<string> {
  const res = await fetch(path);
  return await res.text();
}

function parseCSV(csvText: string) {
  const rows = csvText.trim().split('\n');
  const headers = rows.shift()!.split(',');
  const data = rows.map(row => row.split(','));
  return { headers, data };
}

export function parseYYYYMMDD(s: string): Date {
  const year = Number(s.slice(0,4));
  const month = Number(s.slice(4,6)) - 1;
  const day = Number(s.slice(6,8));
  return  new Date(year, month, day);
}
