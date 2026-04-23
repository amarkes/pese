import React from 'react';
import { View } from 'react-native';
import { Typography } from '@/components/atoms/Typography';

/**
 * Barra de desvio em relação a uma linha central (média/baseline).
 * Valores negativos crescem para a esquerda, positivos para a direita.
 *
 * Duas variantes:
 * - `inline`: label à esquerda, barra centralizada, % à direita.
 *   Uso em listas compactas (ex.: período do dia dentro de um card).
 * - `stacked`: label em cima, barra full-width embaixo, % ao lado.
 *   Uso em listas verticais destacadas (ex.: dia da semana).
 */

export type DeviationBarLayout = 'inline' | 'stacked';

export interface DeviationBarProps {
  label: string;
  sub?: string;
  /** Desvio percentual. Aceita negativo. */
  pct: number;
  /** Maior |pct| do conjunto — usado para normalizar o tamanho da barra. */
  maxAbs: number;
  /** Se false, renderiza "—" no lugar do % e suprime a barra colorida. */
  hasData?: boolean;
  layout?: DeviationBarLayout;
  colorPositive?: string;
  colorNegative?: string;
}

const DEFAULT_POSITIVE = '#F87171';
const DEFAULT_NEGATIVE = '#60A5FA';

const formatPct = (pct: number): string => {
  if (pct === 0) return '0%';
  const sign = pct > 0 ? '+' : '';
  return `${sign}${pct.toFixed(1)}%`;
};

export const DeviationBar: React.FC<DeviationBarProps> = ({
  label,
  sub,
  pct,
  maxAbs,
  hasData = true,
  layout = 'inline',
  colorPositive = DEFAULT_POSITIVE,
  colorNegative = DEFAULT_NEGATIVE,
}) => {
  const isPositive = pct >= 0;
  const ratio = hasData && maxAbs > 0 ? Math.abs(pct) / maxAbs : 0;
  const barColor = isPositive ? colorPositive : colorNegative;
  const valueColorClass = !hasData
    ? 'text-slate-400 dark:text-slate-500'
    : isPositive
    ? 'text-red-400'
    : 'text-blue-400';
  const valueText = hasData ? formatPct(pct) : '—';

  if (layout === 'stacked') {
    const halfWidthPct = ratio * 50; // cada metade do track = 50% da largura

    return (
      <View className="mb-5">
        <Typography className="text-base font-outfit-medium text-text dark:text-text-dark mb-2">
          {label}
        </Typography>
        <View className="flex-row items-center">
          <View className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full relative overflow-hidden">
            {hasData && ratio > 0 && (
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  [isPositive ? 'left' : 'right']: '50%',
                  width: `${halfWidthPct}%`,
                  backgroundColor: barColor,
                  borderRadius: 999,
                }}
              />
            )}
          </View>
          <Typography
            className={`text-xs font-outfit-bold w-14 text-right ml-2 ${valueColorClass}`}
          >
            {valueText}
          </Typography>
        </View>
      </View>
    );
  }

  // Layout inline usa largura percentual também, com trilho subdividido em 2 halves
  return (
    <View className="flex-row items-center mb-3">
      <View style={{ width: 100 }}>
        <Typography className="text-sm font-outfit-medium text-slate-700 dark:text-slate-300">
          {label}
        </Typography>
        {sub ? (
          <Typography className="text-xs font-outfit text-slate-400">{sub}</Typography>
        ) : null}
      </View>

      <View className="flex-1 flex-row items-center h-4">
        {/* Half esquerdo (negativos) */}
        <View className="flex-1 flex-row justify-end">
          {hasData && !isPositive && ratio > 0 && (
            <View
              style={{
                width: `${ratio * 100}%`,
                height: 6,
                backgroundColor: colorNegative,
                borderRadius: 3,
              }}
            />
          )}
        </View>
        <View className="w-px h-3.5 bg-slate-300 dark:bg-slate-600" />
        {/* Half direito (positivos) */}
        <View className="flex-1 flex-row">
          {hasData && isPositive && ratio > 0 && (
            <View
              style={{
                width: `${ratio * 100}%`,
                height: 6,
                backgroundColor: colorPositive,
                borderRadius: 3,
              }}
            />
          )}
        </View>
      </View>

      <Typography className={`text-xs font-outfit-bold w-12 text-right ${valueColorClass}`}>
        {valueText}
      </Typography>
    </View>
  );
};
