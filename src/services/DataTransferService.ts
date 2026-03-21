import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import DocumentPicker, { types } from 'react-native-document-picker';
import { GlucoseStorage, MeasurementType } from './GlucoseStorage';
import { WaterStorage } from './WaterStorage';
import { WeightStorage } from './WeightStorage';

export type TransferDataType = 'weight' | 'glucose' | 'water';

export interface ImportResult {
  imported: number;
  skipped: number;
  fileName: string;
}

const CSV_MIME_TYPE = 'text/csv';

const normalizeFilePath = (uri: string) => {
  const decodedUri = decodeURIComponent(uri);
  return decodedUri.startsWith('file://') ? decodedUri.replace('file://', '') : decodedUri;
};

const detectDelimiter = (text: string) => {
  const firstLine = text
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .find(line => line.trim().length > 0) ?? '';

  const commaCount = (firstLine.match(/,/g) ?? []).length;
  const semicolonCount = (firstLine.match(/;/g) ?? []).length;

  return semicolonCount > commaCount ? ';' : ',';
};

const parseCsvRows = (text: string, delimiter: string) => {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;

  const normalizedText = text.replace(/^\uFEFF/, '');

  for (let index = 0; index < normalizedText.length; index += 1) {
    const char = normalizedText[index];
    const nextChar = normalizedText[index + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === delimiter && !inQuotes) {
      currentRow.push(currentField);
      currentField = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        index += 1;
      }

      currentRow.push(currentField);
      if (currentRow.some(field => field.trim().length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentField = '';
      continue;
    }

    currentField += char;
  }

  currentRow.push(currentField);
  if (currentRow.some(field => field.trim().length > 0)) {
    rows.push(currentRow);
  }

  return rows;
};

const escapeCsvField = (value: string | number) => {
  const raw = String(value ?? '');
  if (/[",\n;]/.test(raw)) {
    return `"${raw.replace(/"/g, '""')}"`;
  }
  return raw;
};

const toCsv = (headers: string[], rows: Array<Array<string | number>>) =>
  [headers, ...rows]
    .map(row => row.map(escapeCsvField).join(','))
    .join('\n');

const writeAndShareCsv = async (fileName: string, csv: string) => {
  const directory = `${RNFS.DocumentDirectoryPath}/exports`;
  await RNFS.mkdir(directory);
  const path = `${directory}/${fileName}`;
  await RNFS.writeFile(path, `\uFEFF${csv}`, 'utf8');

  await Share.open({
    url: `file://${path}`,
    type: CSV_MIME_TYPE,
    failOnCancel: false,
    saveToFiles: true,
  });

  return path;
};

const pickCsvContent = async () => {
  try {
    const file = await DocumentPicker.pickSingle({
      type: [types.csv, types.plainText],
      copyTo: 'cachesDirectory',
    });

    const readableUri = file.fileCopyUri ?? file.uri;
    if (!readableUri) {
      throw new Error('file_unavailable');
    }

    const filePath = normalizeFilePath(readableUri);
    const content = await RNFS.readFile(filePath, 'utf8');

    return {
      fileName: file.name ?? 'import.csv',
      content,
    };
  } catch (error) {
    if (DocumentPicker.isCancel(error)) {
      throw new Error('cancelled');
    }

    throw error;
  }
};

const buildHeaderMap = (headerRow: string[]) =>
  new Map(
    headerRow.map((header, index) => [
      header.trim().replace(/^\uFEFF/, '').toLowerCase(),
      index,
    ])
  );

const getColumnValue = (row: string[], headerMap: Map<string, number>, name: string) => {
  const index = headerMap.get(name);
  if (index == null) {
    return '';
  }

  return (row[index] ?? '').trim();
};

const parseDateValue = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toISOString();
};

const parseMeasurementType = (value: string): MeasurementType | null => {
  const normalized = value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\s_-]+/g, '');

  switch (normalized) {
    case 'fasting':
    case 'jejum':
    case 'ayunas':
      return 'fasting';
    case 'premeal':
    case 'prerefeicao':
    case 'antesdecomer':
      return 'preMeal';
    case 'postmeal':
    case 'pos-refeicao':
    case 'posrefeicao':
    case 'despuesdecomer':
      return 'postMeal';
    case 'random':
    case 'aleatorio':
    case 'aleatório':
    case 'azar':
      return 'random';
    default:
      return null;
  }
};

const importWeightRows = async (rows: string[][], fileName: string): Promise<ImportResult> => {
  if (rows.length < 2) {
    throw new Error('empty_file');
  }

  const headerMap = buildHeaderMap(rows[0]);
  if (!headerMap.has('date') || !headerMap.has('weight')) {
    throw new Error('invalid_template');
  }

  let skipped = 0;
  const validRows = rows.slice(1).flatMap(row => {
    const date = parseDateValue(getColumnValue(row, headerMap, 'date'));
    const weight = Number.parseFloat(getColumnValue(row, headerMap, 'weight').replace(',', '.'));

    if (!date || Number.isNaN(weight) || weight <= 0) {
      skipped += 1;
      return [];
    }

    return [{ date, weight }];
  });

  if (validRows.length === 0) {
    throw new Error('no_valid_rows');
  }

  const imported = await WeightStorage.importRecords(validRows);
  return { imported, skipped, fileName };
};

const importGlucoseRows = async (rows: string[][], fileName: string): Promise<ImportResult> => {
  if (rows.length < 2) {
    throw new Error('empty_file');
  }

  const headerMap = buildHeaderMap(rows[0]);
  if (!headerMap.has('date') || !headerMap.has('glucose') || !headerMap.has('measurementtype')) {
    throw new Error('invalid_template');
  }

  let skipped = 0;
  const validRows = rows.slice(1).flatMap(row => {
    const date = parseDateValue(getColumnValue(row, headerMap, 'date'));
    const glucose = Number.parseFloat(getColumnValue(row, headerMap, 'glucose').replace(',', '.'));
    const measurementType = parseMeasurementType(getColumnValue(row, headerMap, 'measurementtype'));
    const observations = getColumnValue(row, headerMap, 'observations');

    if (!date || Number.isNaN(glucose) || glucose <= 0 || !measurementType) {
      skipped += 1;
      return [];
    }

    return [{ date, glucose, measurementType, observations }];
  });

  if (validRows.length === 0) {
    throw new Error('no_valid_rows');
  }

  const imported = await GlucoseStorage.importRecords(validRows);
  return { imported, skipped, fileName };
};

const importWaterRows = async (rows: string[][], fileName: string): Promise<ImportResult> => {
  if (rows.length < 2) {
    throw new Error('empty_file');
  }

  const headerMap = buildHeaderMap(rows[0]);
  if (!headerMap.has('date') || !headerMap.has('amount')) {
    throw new Error('invalid_template');
  }

  let skipped = 0;
  const validRows = rows.slice(1).flatMap(row => {
    const date = parseDateValue(getColumnValue(row, headerMap, 'date'));
    const amount = Number.parseInt(getColumnValue(row, headerMap, 'amount'), 10);

    if (!date || Number.isNaN(amount) || amount <= 0) {
      skipped += 1;
      return [];
    }

    return [{ date, amount }];
  });

  if (validRows.length === 0) {
    throw new Error('no_valid_rows');
  }

  const imported = await WaterStorage.importRecords(validRows);
  return { imported, skipped, fileName };
};

const importCsv = async (type: TransferDataType): Promise<ImportResult> => {
  const { content, fileName } = await pickCsvContent();
  const delimiter = detectDelimiter(content);
  const rows = parseCsvRows(content, delimiter);

  switch (type) {
    case 'weight':
      return importWeightRows(rows, fileName);
    case 'glucose':
      return importGlucoseRows(rows, fileName);
    case 'water':
      return importWaterRows(rows, fileName);
  }
};

const exportWeightCsv = async () => {
  const records = await WeightStorage.getRecords();
  const csv = toCsv(
    ['date', 'weight'],
    records.map(record => [record.date, record.weight])
  );

  await writeAndShareCsv(`peso_${Date.now()}.csv`, csv);
  return records.length;
};

const exportGlucoseCsv = async () => {
  const records = await GlucoseStorage.getRecords();
  const csv = toCsv(
    ['date', 'glucose', 'measurementType', 'observations'],
    records.map(record => [record.date, record.glucose, record.measurementType, record.observations])
  );

  await writeAndShareCsv(`glicose_${Date.now()}.csv`, csv);
  return records.length;
};

const exportWaterCsv = async () => {
  const records = await WaterStorage.getRecords();
  const csv = toCsv(
    ['date', 'amount'],
    records.map(record => [record.date, record.amount])
  );

  await writeAndShareCsv(`agua_${Date.now()}.csv`, csv);
  return records.length;
};

const exportTemplateCsv = async (type: TransferDataType) => {
  const templates: Record<TransferDataType, { name: string; headers: string[]; rows: Array<Array<string | number>> }> = {
    weight: {
      name: 'modelo_peso.csv',
      headers: ['date', 'weight'],
      rows: [['2026-03-21T08:00:00.000Z', 72.4]],
    },
    glucose: {
      name: 'modelo_glicose.csv',
      headers: ['date', 'glucose', 'measurementType', 'observations'],
      rows: [['2026-03-21T07:30:00.000Z', 96, 'fasting', 'Exemplo de observacao']],
    },
    water: {
      name: 'modelo_agua.csv',
      headers: ['date', 'amount'],
      rows: [['2026-03-21T10:00:00.000Z', 300]],
    },
  };

  const template = templates[type];
  const csv = toCsv(template.headers, template.rows);
  await writeAndShareCsv(template.name, csv);
};

export const DataTransferService = {
  async importSpreadsheet(type: TransferDataType) {
    return importCsv(type);
  },

  async exportSpreadsheet(type: TransferDataType) {
    switch (type) {
      case 'weight':
        return exportWeightCsv();
      case 'glucose':
        return exportGlucoseCsv();
      case 'water':
        return exportWaterCsv();
    }
  },

  async downloadTemplate(type: TransferDataType) {
    return exportTemplateCsv(type);
  },
};
