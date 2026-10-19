import React from 'react';
import type { CaseStudyCustomTable } from '../../types/caseStudy';

interface CustomDataTableProps {
  table: CaseStudyCustomTable;
}

export const CustomDataTable: React.FC<CustomDataTableProps> = ({ table }) => {
  if (!table || !table.visible || !table.columns || table.columns.length === 0) return null;

  return (
    <div style={{ margin: '28px 0' }}>
      {table.title && (
        <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#FFFFFF', marginBottom: '12px' }}>
          {table.title}
        </h4>
      )}

      <div
        style={{
          overflowX: 'auto',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px'
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
            fontSize: '13px'
          }}
        >
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(255, 255, 255, 0.04)' }}>
              {table.columns.map((col, idx) => (
                <th
                  key={idx}
                  style={{
                    padding: '12px 16px',
                    fontWeight: 600,
                    color: 'rgba(255, 255, 255, 0.75)',
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, rIdx) => (
              <tr
                key={rIdx}
                style={{
                  borderBottom: rIdx === table.rows.length - 1 ? 'none' : '1px solid rgba(255, 255, 255, 0.05)',
                  background: rIdx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.01)'
                }}
              >
                {row.map((cell, cIdx) => (
                  <td
                    key={cIdx}
                    style={{
                      padding: '12px 16px',
                      color: cIdx === 0 ? '#FFFFFF' : 'rgba(255, 255, 255, 0.8)',
                      fontWeight: cIdx === 0 ? 500 : 400
                    }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {table.notes && (
        <p style={{ fontSize: '11px', opacity: 0.5, marginTop: '8px', fontStyle: 'italic' }}>
          Note: {table.notes}
        </p>
      )}
    </div>
  );
};

export default CustomDataTable;
