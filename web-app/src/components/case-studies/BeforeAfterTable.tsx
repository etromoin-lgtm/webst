import React from 'react';
import { ShieldCheck, ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import type { CaseStudyBeforeAfterMetric } from '../../types/caseStudy';
import { calculateMetricChange } from '../../utils/metricCalculator';

interface BeforeAfterTableProps {
  metrics: CaseStudyBeforeAfterMetric[];
  title?: string;
  subtitle?: string;
}

export const BeforeAfterTable: React.FC<BeforeAfterTableProps> = ({
  metrics,
  title = 'Before-and-After Verified Benchmarks',
  subtitle = 'Measured outcomes derived from verified audit logs and production metrics.'
}) => {
  const visibleMetrics = metrics.filter(m => m.show_public !== false);

  if (!visibleMetrics || visibleMetrics.length === 0) return null;

  return (
    <div className="case-study-table-container" style={{ margin: '32px 0' }}>
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ fontSize: '18px', fontWeight: 600, color: '#FFFFFF', marginBottom: '6px' }}>{title}</h4>
        {subtitle && <p style={{ fontSize: '13px', opacity: 0.6, margin: 0 }}>{subtitle}</p>}
      </div>

      <div
        style={{
          overflowX: 'auto',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
            fontSize: '13px',
            fontFamily: 'var(--sans, system-ui)'
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                background: 'rgba(255, 255, 255, 0.03)'
              }}
            >
              <th style={{ padding: '16px 20px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '11px' }}>
                Operational Metric
              </th>
              <th style={{ padding: '16px 20px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '11px', textAlign: 'right' }}>
                Baseline (Before)
              </th>
              <th style={{ padding: '16px 20px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '11px', textAlign: 'right' }}>
                Result (After)
              </th>
              <th style={{ padding: '16px 20px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '11px', textAlign: 'right' }}>
                Measured Change
              </th>
              <th style={{ padding: '16px 20px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '11px' }}>
                Measurement Window & Evidence
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleMetrics.map((m, idx) => {
              const calc = calculateMetricChange(m.before, m.after, m.type, m.direction, m.unit);
              const isEven = idx % 2 === 0;

              return (
                <tr
                  key={m.id || idx}
                  style={{
                    borderBottom: idx === visibleMetrics.length - 1 ? 'none' : '1px solid rgba(255, 255, 255, 0.05)',
                    background: isEven ? 'transparent' : 'rgba(255, 255, 255, 0.01)'
                  }}
                >
                  <td style={{ padding: '16px 20px', fontWeight: 500, color: '#FFFFFF' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>{m.name}</span>
                      {m.verified && (
                        <span title="Independently verified outcome" style={{ display: 'inline-flex', alignItems: 'center', color: '#10B981' }}>
                          <ShieldCheck size={14} />
                        </span>
                      )}
                    </div>
                    {m.notes && <p style={{ fontSize: '11px', opacity: 0.5, margin: '4px 0 0' }}>{m.notes}</p>}
                  </td>

                  <td style={{ padding: '16px 20px', textAlign: 'right', color: 'rgba(255, 255, 255, 0.75)', fontFamily: 'var(--mono, monospace)' }}>
                    {m.before} {m.unit}
                  </td>

                  <td style={{ padding: '16px 20px', textAlign: 'right', color: '#FFFFFF', fontWeight: 600, fontFamily: 'var(--mono, monospace)' }}>
                    {m.after} {m.unit}
                  </td>

                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 10px',
                        borderRadius: '999px',
                        fontSize: '12px',
                        fontWeight: 600,
                        fontFamily: 'var(--mono, monospace)',
                        background: calc.isImprovement
                          ? 'rgba(16, 185, 129, 0.12)'
                          : 'rgba(239, 68, 68, 0.12)',
                        color: calc.isImprovement ? '#34D399' : '#F87171',
                        border: calc.isImprovement
                          ? '1px solid rgba(16, 185, 129, 0.25)'
                          : '1px solid rgba(239, 68, 68, 0.25)'
                      }}
                    >
                      {calc.isImprovement ? (
                        m.direction === 'lower_is_better' ? <ArrowDownRight size={13} /> : <ArrowUpRight size={13} />
                      ) : (
                        <Minus size={13} />
                      )}
                      {m.change_display || calc.displayFormatted}
                    </span>
                  </td>

                  <td style={{ padding: '16px 20px', color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px' }}>
                    <div>{m.period || 'Continuous Monitoring'}</div>
                    {m.evidence && (
                      <div style={{ fontSize: '11px', opacity: 0.75, color: 'var(--sky, #8FC1FF)', marginTop: '2px' }}>
                        Source: {m.evidence}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BeforeAfterTable;
