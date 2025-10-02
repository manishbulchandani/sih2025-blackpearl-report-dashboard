import React from 'react';
import { DataTable } from '../../../shared/DataTable';
import type { TableColumn } from '../../../shared/DataTable';
import { Badge } from '../../../shared/Badge';

interface TaxonomicAssignment {
  asv_id: string;
  best_reference: string;
  similarity_score: number;
  confidence: string;
  taxonomic_assignment: string;
  novelty_candidate: boolean;
}

interface TaxonomicTableProps {
  taxonomicData: TaxonomicAssignment[];
}

const TaxonomicTable: React.FC<TaxonomicTableProps> = ({ taxonomicData }) => {
  const columns: TableColumn[] = [
    {
      key: 'asv_id',
      header: 'ASV ID',
      sortable: true,
      filterable: true,
      width: 'w-28'
    },
    {
      key: 'best_reference',
      header: 'Best Reference',
      sortable: true,
      filterable: true,
      render: (value: string) => (
        <span className="text-sm text-gray-900 font-mono">{value}</span>
      )
    },
    {
      key: 'similarity_score',
      header: 'Similarity Score',
      sortable: true,
      render: (value: number) => {
        const percentage = (value * 100).toFixed(1);
        const color = value >= 0.8 ? 'text-green-600' : value >= 0.5 ? 'text-yellow-600' : 'text-red-600';
        const bgColor = value >= 0.8 ? 'bg-green-50' : value >= 0.5 ? 'bg-yellow-50' : 'bg-red-50';
        
        return (
          <div className="flex items-center space-x-2">
            <span className={`${color} font-medium`}>{percentage}%</span>
            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${bgColor} ${color.replace('text-', 'bg-').replace('-600', '-400')}`}
                style={{ width: `${value * 100}%` }}
              />
            </div>
          </div>
        );
      }
    },
    {
      key: 'confidence',
      header: 'Confidence',
      sortable: true,
      filterable: true,
      render: (value: string) => {
        const variant = value === 'high' ? 'success' : value === 'medium' ? 'warning' : 'error';
        return (
          <Badge variant={variant as any}>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </Badge>
        );
      }
    },
    {
      key: 'taxonomic_assignment',
      header: 'Assignment Status',
      sortable: true,
      filterable: true,
      render: (value: string) => {
        const isAssigned = value === 'assigned';
        return (
          <Badge variant={isAssigned ? 'success' : 'default'}>
            {isAssigned ? 'Assigned' : 'Unassigned'}
          </Badge>
        );
      }
    },
    {
      key: 'novelty_candidate',
      header: 'Novelty',
      sortable: true,
      render: (value: boolean) => (
        <Badge variant={value ? 'error' : 'default'}>
          {value ? 'Novel' : 'Known'}
        </Badge>
      )
    }
  ];

  return (
    <DataTable
      title="ASV Taxonomic Assignments"
      data={taxonomicData}
      columns={columns}
      searchPlaceholder="Search ASV ID, reference, or assignment..."
      downloadFilename="taxonomic_assignments.csv"
      itemsPerPage={15}
      highlightRow={(row) => row.novelty_candidate}
      highlightClass="bg-red-50 border-red-200"
      className="bg-white rounded-lg border border-gray-200"
    />
  );
};

export default TaxonomicTable;