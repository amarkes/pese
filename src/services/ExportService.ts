import { generatePDF } from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';

export interface ExportStats {
  startDate: string;
  endDate: string;
  totalRecords: number;
  weightAvg: number;
  weightGoal: number;
  glucoseAvg: number;
  waterAvg: number;
  waterGoal: number;
}

export interface ExportOptions {
  stats: ExportStats;
  dataIncluded: { weight: boolean; glucose: boolean; water: boolean };
}

// ─── HTML template ──────────────────────────────────────────────────────────

const buildHTML = ({ stats, dataIncluded }: ExportOptions): string => {
  const row = (label: string, value: string, note?: string) => `
    <tr>
      <td class="label">${label}</td>
      <td class="value">${value}</td>
      <td class="note">${note ?? ''}</td>
    </tr>`;

  const weightRows = dataIncluded.weight
    ? row('Média de Peso', `${stats.weightAvg.toFixed(1)} kg`, `Meta: ${stats.weightGoal} kg`)
    : '';

  const glucoseRows = dataIncluded.glucose
    ? row('Glicemia Média', `${stats.glucoseAvg.toFixed(0)} mg/dL`, 'Normal: 70–92 mg/dL')
    : '';

  const waterRows = dataIncluded.water
    ? row(
        'Ingestão Hídrica Diária',
        `${stats.waterAvg.toFixed(0)} ml`,
        `Meta: ${stats.waterGoal} ml`,
      )
    : '';

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Arial, sans-serif; color: #0F172A; padding: 40px; }
  .header { background: #1E3A5F; color: #fff; border-radius: 12px; padding: 28px 32px; margin-bottom: 32px; }
  .header h1 { font-size: 22px; margin-bottom: 4px; }
  .header p { font-size: 13px; color: #94A3B8; }
  .badge { display: inline-block; background: #3B82F6; color: #fff; border-radius: 20px; padding: 4px 12px; font-size: 12px; margin-top: 10px; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; }
  th { background: #F1F5F9; text-align: left; padding: 10px 14px; font-size: 11px; color: #64748B; text-transform: uppercase; letter-spacing: 0.08em; }
  td { padding: 12px 14px; border-bottom: 1px solid #E2E8F0; vertical-align: middle; }
  td.label { font-weight: 600; font-size: 14px; color: #334155; width: 40%; }
  td.value { font-size: 15px; font-weight: 700; color: #0F172A; width: 30%; }
  td.note { font-size: 12px; color: #94A3B8; width: 30%; }
  .section-title { font-size: 11px; color: #64748B; text-transform: uppercase; letter-spacing: 0.1em; margin: 24px 0 8px; font-weight: 700; }
  .footer { margin-top: 40px; font-size: 11px; color: #94A3B8; text-align: center; }
</style>
</head>
<body>
  <div class="header">
    <h1>Relatório Médico de Saúde</h1>
    <p>Período: ${stats.startDate} — ${stats.endDate}</p>
    <span class="badge">${stats.totalRecords} registros</span>
  </div>

  <p class="section-title">Resumo de Indicadores</p>
  <table>
    <thead>
      <tr>
        <th>Indicador</th>
        <th>Resultado</th>
        <th>Referência</th>
      </tr>
    </thead>
    <tbody>
      ${weightRows}
      ${glucoseRows}
      ${waterRows}
    </tbody>
  </table>

  <div class="footer">
    Gerado em ${new Date().toLocaleDateString('pt-BR')} • Pese App
  </div>
</body>
</html>`;
};

// ─── CSV builder ──────────────────────────────────────────────────────────────

const buildCSV = ({ stats, dataIncluded }: ExportOptions): string => {
  const lines: string[] = [
    'Indicador,Valor,Referência',
    `Período,"${stats.startDate} – ${stats.endDate}",`,
    `Total de Registros,${stats.totalRecords},`,
  ];

  if (dataIncluded.weight) {
    lines.push(`Média de Peso (kg),${stats.weightAvg.toFixed(1)},Meta: ${stats.weightGoal} kg`);
  }
  if (dataIncluded.glucose) {
    lines.push(`Glicemia Média (mg/dL),${stats.glucoseAvg.toFixed(0)},Normal: 70–92 mg/dL`);
  }
  if (dataIncluded.water) {
    lines.push(
      `Ingestão Hídrica Diária (ml),${stats.waterAvg.toFixed(0)},Meta: ${stats.waterGoal} ml`,
    );
  }

  lines.push(`Gerado em,${new Date().toLocaleDateString('pt-BR')},`);
  return lines.join('\n');
};

// ─── Public API ───────────────────────────────────────────────────────────────

export const exportPDF = async (options: ExportOptions): Promise<void> => {
  const html = buildHTML(options);
  const fileName = `relatorio_saude_${Date.now()}`;

  const result = await generatePDF({
    html,
    fileName,
    base64: false,
  });

  if (!result.filePath) throw new Error('PDF generation failed');

  await Share.open({
    url: `file://${result.filePath}`,
    type: 'application/pdf',
    title: 'Relatório Médico',
    subject: 'Relatório de Saúde – Pese App',
  });
};

export const exportCSV = async (options: ExportOptions): Promise<void> => {
  const csv = buildCSV(options);
  const fileName = `relatorio_saude_${Date.now()}.csv`;
  const path = `${RNFS.DocumentDirectoryPath}/${fileName}`;

  await RNFS.writeFile(path, csv, 'utf8');

  await Share.open({
    url: `file://${path}`,
    type: 'text/csv',
    title: 'Relatório CSV',
    subject: 'Relatório de Saúde – Pese App',
  });
};
