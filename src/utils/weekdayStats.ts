/**
 * Weekday statistics utilities.
 *
 * Responsável por agregar séries de medições em desvios percentuais por
 * dia da semana (Domingo = 0, ... , Sábado = 6) em relação à média global.
 *
 * Mantido agnóstico do domínio: recebe `records`, `getValue` e `getDate`,
 * devolve um array fixo de 7 posições — permitindo reuso entre pressão,
 * peso, glicemia, água, etc.
 */

export type WeekdayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface WeekdayDeviation {
  /** 0 = Domingo ... 6 = Sábado (compatível com Date.getDay()) */
  dayOfWeek: WeekdayIndex;
  /** Desvio percentual em relação à média global. 0 quando não houver dados. */
  pct: number;
  /** Média do dia (útil para tooltips futuros). null quando não houver dados. */
  avg: number | null;
  /** Indica se o dia tem ao menos uma medição no período. */
  hasData: boolean;
}

export type WeekdayAggregation = 'mean' | 'sumByDay';

interface ComputeOptions {
  /**
   * - 'mean': média simples de todas as medições do dia da semana.
   *   Ideal para métricas pontuais (peso, pressão, glicemia).
   * - 'sumByDay': soma diária, e depois média dessas somas por dia da semana.
   *   Ideal para métricas acumulativas (água ingerida, passos, calorias).
   */
  aggregation?: WeekdayAggregation;
}

const EMPTY_DEVIATIONS: WeekdayDeviation[] = Array.from({ length: 7 }, (_, i) => ({
  dayOfWeek: i as WeekdayIndex,
  pct: 0,
  avg: null,
  hasData: false,
}));

function toDate(value: string | Date): Date {
  return value instanceof Date ? value : new Date(value);
}

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export function computeWeekdayDeviations<T>(
  records: T[],
  getValue: (record: T) => number,
  getDate: (record: T) => string | Date,
  options: ComputeOptions = {},
): WeekdayDeviation[] {
  const { aggregation = 'mean' } = options;

  if (!records.length) {
    return EMPTY_DEVIATIONS;
  }

  // Agrupamento primário por dia da semana
  const byWeekday: Record<number, number[]> = {};
  for (let i = 0; i < 7; i++) byWeekday[i] = [];

  if (aggregation === 'mean') {
    for (const record of records) {
      const d = toDate(getDate(record));
      byWeekday[d.getDay()].push(getValue(record));
    }
  } else {
    // 'sumByDay': primeiro soma por dia calendário,
    // depois agrupa essas somas por dia da semana.
    const dailyTotals: Record<string, { weekday: number; total: number }> = {};
    for (const record of records) {
      const d = toDate(getDate(record));
      const key = dateKey(d);
      if (!dailyTotals[key]) {
        dailyTotals[key] = { weekday: d.getDay(), total: 0 };
      }
      dailyTotals[key].total += getValue(record);
    }
    for (const { weekday, total } of Object.values(dailyTotals)) {
      byWeekday[weekday].push(total);
    }
  }

  // Média por dia da semana
  const avgs = Array.from({ length: 7 }, (_, i) => {
    const values = byWeekday[i];
    return values.length
      ? values.reduce((sum, v) => sum + v, 0) / values.length
      : null;
  });

  // Baseline: média das médias dos dias com dados (evita viés de volume)
  const present = avgs.filter((v): v is number => v !== null);
  const baseline =
    present.length > 0
      ? present.reduce((sum, v) => sum + v, 0) / present.length
      : 0;

  return avgs.map((avg, idx) => {
    const hasData = avg !== null;
    const pct = hasData && baseline > 0 ? ((avg - baseline) / baseline) * 100 : 0;
    return {
      dayOfWeek: idx as WeekdayIndex,
      pct,
      avg,
      hasData,
    };
  });
}
