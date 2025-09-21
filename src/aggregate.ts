// helper: parse YYYYMMDD into Date
export function parseYYYYMMDD(s: string): Date | null {
  if (!s || s.length !== 8) return null;
  const year = Number(s.slice(0,4));
  const month = Number(s.slice(4,6)) - 1;
  const day = Number(s.slice(6,8));
  const date = new Date(year, month, day);
  return isNaN(date.getTime()) ? null : date;
}

// aggregate CSV data by day/week/month/year
export function aggregateData(
  data: string[][],
  colIndexes: number[],
  method: 'day' | 'week' | 'month' | 'year'
) {
  const grouped: Record<string, number[][]> = {};

  data.forEach(row => {
    const date = parseYYYYMMDD(row[0]);
    if (!date) return;

    let key = '';
    switch (method) {
      case 'day':
        key = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,'0')}-${date.getDate().toString().padStart(2,'0')}`;
        break;
      case 'week': {
        const start = new Date(date.getFullYear(),0,1);
        const week = Math.ceil(((date.getTime() - start.getTime())/(1000*60*60*24) + 1)/7);
        key = `${date.getFullYear()}-W${week}`;
        break;
      }
      case 'month':
        key = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,'0')}`;
        break;
      case 'year':
        key = `${date.getFullYear()}`;
        break;
    }

    if (!grouped[key]) grouped[key] = colIndexes.map(() => []);
    colIndexes.forEach((colIdx, i) => {
      const value = row[colIdx];
      if (value !== undefined && value !== '') grouped[key][i].push(Number(value));
    });
  });

  // compute averages
  const labels: string[] = [];
  const series: number[][] = colIndexes.map(() => []);

  Object.entries(grouped).forEach(([key, values]) => {
    labels.push(key);
    values.forEach((vals, i) => {
      const avg = vals.length ? vals.reduce((a,b)=>a+b,0)/vals.length : 0;
      series[i].push(avg);
    });
  });

  return { labels, series };
}
