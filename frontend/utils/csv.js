import { get, isObject, isArray } from 'lodash/fp'

const processValueForCSV = value => {
  let finalValue = value !== undefined ? value.toString() : ''

  if (value instanceof Date) {
    finalValue = value.toLocaleString()
  }

  if (isObject(value) || isArray(value)) {
    finalValue = JSON.stringify(value)
  }

  // Escape quotes with double quote
  finalValue = finalValue.replace(/"/g, '""')

  // If string contains any quotes, newlines, or commas, enclose in quotes.
  if (finalValue.search(/("|,|\n)/g) >= 0) {
    finalValue = `"${finalValue}"`
  }

  return finalValue
}

const makeCsvContents = (data, columns) => {
  const header = columns.map(column => column.header).join(',')

  const rows = data.map(datum =>
    columns.map(columns =>
      processValueForCSV(get(columns.key, datum))
    ).join(',')
  ).join('\n')

  return header + '\n' + rows
}

export const exportCsvFile = (filename, data, columns) => {
  const fileContents = makeCsvContents(data, columns)

  var blob = new Blob([fileContents], { type: 'text/csv;charset=utf-8;' });

  var link = document.createElement("a");
  if (link.download !== undefined) { // feature detection
      // Browsers that support HTML5 download attribute
      var url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style = "visibility:hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  }
}
