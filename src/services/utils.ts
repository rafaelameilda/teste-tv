import { DateTime } from 'luxon';

const formatDateWithUTC = (data: string) => {
  return (
    data &&
    DateTime.fromISO(data, { zone: 'utc' }) // Interpreta como UTC (já com +4 do banco)
      // .minus({ hours: 4 }) // Remove as 4 horas extras
      .setZone('America/Porto_Velho') // Converte para Porto Velho
      .toFormat('dd/MM/yyyy HH:mm') // Formata
  );
};

const formatFileSize = (sizeInBytes) => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let index = 0;
  let size = sizeInBytes;

  while (size >= 1024 && index < units.length - 1) {
    size /= 1024;
    index++;
  }

  return `${size.toFixed(2)} ${units[index]}`;
};

export interface IColumns<T> {
  name: string;
  field: string;
  label: string;
  align: 'left' | 'right';
  format?: (data: T, row: T) => string;
  sort?: (a: T, b: T, rowA: T, rowB: T) => number;
  sortable: boolean;
}

export { formatDateWithUTC, formatFileSize };
