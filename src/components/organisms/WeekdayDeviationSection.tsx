import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@/components/atoms/Typography';
import { Card } from '@/components/molecules/Card';
import { DeviationBar } from '@/components/molecules/DeviationBar';
import {
  computeWeekdayDeviations,
  WeekdayAggregation,
  WeekdayDeviation,
} from '@/utils/weekdayStats';

/**
 * Seção "Dia da semana" — renderiza os 7 dias com desvio percentual
 * em relação à média do período. Sempre mostra os 7 dias; dias sem dado
 * aparecem com "—" e a barra vazia.
 *
 * Agnóstico de domínio: usado em estatísticas de pressão, peso,
 * glicemia e água. Consome `records` + `getValue` + `getDate`, ou pode
 * receber `deviations` já computados para cenários avançados.
 */

const WEEKDAY_KEYS = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
] as const;

interface BaseProps {
  /** Cores opcionais das barras (positivo = acima da média, negativo = abaixo). */
  colorPositive?: string;
  colorNegative?: string;
  /** Chave i18n do título. Default: 'bpStats.dayOfWeek'. */
  titleKey?: string;
  /** Título explícito, se preferir não usar i18n. */
  title?: string;
  className?: string;
}

interface RecordsProps<T> extends BaseProps {
  records: T[];
  getValue: (record: T) => number;
  getDate: (record: T) => string | Date;
  aggregation?: WeekdayAggregation;
  deviations?: never;
}

interface DeviationsProps extends BaseProps {
  deviations: WeekdayDeviation[];
  records?: never;
  getValue?: never;
  getDate?: never;
  aggregation?: never;
}

export type WeekdayDeviationSectionProps<T> = RecordsProps<T> | DeviationsProps;

export function WeekdayDeviationSection<T>(
  props: WeekdayDeviationSectionProps<T>,
): React.ReactElement {
  const { t } = useTranslation();
  const {
    titleKey = 'bpStats.dayOfWeek',
    title,
    colorPositive,
    colorNegative,
    className = '',
  } = props;

  const deviations = useMemo<WeekdayDeviation[]>(() => {
    if ('deviations' in props && props.deviations) return props.deviations;
    if ('records' in props && props.records) {
      return computeWeekdayDeviations(
        props.records,
        props.getValue,
        props.getDate,
        { aggregation: props.aggregation },
      );
    }
    return [];
  }, [props]);

  const maxAbs = useMemo(
    () => Math.max(...deviations.map(d => Math.abs(d.pct)), 0.01),
    [deviations],
  );

  const resolvedTitle = title ?? t(titleKey);

  return (
    <Card className={`mb-6 ${className}`}>
      <Typography className="text-xs font-outfit-bold text-slate-400 uppercase mb-4">
        {resolvedTitle}
      </Typography>
      {deviations.map(dev => (
        <DeviationBar
          key={dev.dayOfWeek}
          label={t(`common.weekdays.${WEEKDAY_KEYS[dev.dayOfWeek]}`)}
          pct={dev.pct}
          maxAbs={maxAbs}
          hasData={dev.hasData}
          layout="stacked"
          colorPositive={colorPositive}
          colorNegative={colorNegative}
        />
      ))}
    </Card>
  );
}
