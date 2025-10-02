import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/Card';
import { Alert, AlertDescription } from '../../../shared/Alert';
import { Badge } from '../../../shared/Badge';
import { AlertTriangle, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface Phase2Summary {
  asv_count: number;
  total_reads: number;
  retention_rate: number;
  chimera_rate: number;
  quality_flags: string[];
  amplicon_type: string;
  length_stats: {
    mean: number;
    std: number;
    cv: number;
  };
  abundance_stats: {
    singletons: number;
    low_abundance: number;
    medium_abundance: number;
    high_abundance: number;
  };
  ready_for_phase3: boolean;
}

interface QualityPanelProps {
  data: Phase2Summary;
}

export const QualityPanel: React.FC<QualityPanelProps> = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getQualityFlags = () => {
    const flags: Array<{
      type: 'warning' | 'success';
      icon: any;
      message: string;
      description: string;
    }> = [];
    
    // Check retention rate
    if (data.retention_rate < 50) {
      flags.push({
        type: 'warning',
        icon: AlertTriangle,
        message: 'LOW_READ_RETENTION',
        description: `Retention rate is ${data.retention_rate.toFixed(1)}% (< 50%)`
      });
    } else if (data.retention_rate > 80) {
      flags.push({
        type: 'success',
        icon: CheckCircle,
        message: 'EXCELLENT_READ_RETENTION',
        description: `Retention rate is ${data.retention_rate.toFixed(1)}% (> 80%)`
      });
    }

    // Check chimera rate
    if (data.chimera_rate > 20) {
      flags.push({
        type: 'warning',
        icon: AlertTriangle,
        message: 'HIGH_CHIMERA_RATE',
        description: `Chimera rate is ${data.chimera_rate.toFixed(1)}% (> 20%)`
      });
    }

    // Check ASV diversity
    if (data.asv_count < 10) {
      flags.push({
        type: 'warning',
        icon: AlertTriangle,
        message: 'LOW_ASV_DIVERSITY',
        description: `Only ${data.asv_count} ASVs detected (< 10)`
      });
    }

    // Add any quality flags from the data
    data.quality_flags.forEach(flag => {
      if (!flags.some(f => f.message === flag)) {
        flags.push({
          type: 'warning',
          icon: AlertTriangle,
          message: flag,
          description: `Quality flag: ${flag.replace(/_/g, ' ').toLowerCase()}`
        });
      }
    });

    return flags;
  };

  const qualityFlags = getQualityFlags();
  const hasWarnings = qualityFlags.some(flag => flag.type === 'warning');

  if (qualityFlags.length === 0) {
    return (
      <Alert variant="success" className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          No quality issues detected. All metrics are within acceptable ranges.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader 
        className="cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {hasWarnings ? (
              <AlertTriangle className="h-5 w-5 text-orange-600" />
            ) : (
              <CheckCircle className="h-5 w-5 text-green-600" />
            )}
            Quality Assessment
            <Badge variant={hasWarnings ? 'warning' : 'success'}>
              {qualityFlags.length} {qualityFlags.length === 1 ? 'flag' : 'flags'}
            </Badge>
          </CardTitle>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent>
          <div className="space-y-3">
            {qualityFlags.map((flag, index) => {
              const Icon = flag.icon;
              return (
                <Alert 
                  key={index}
                  variant={flag.type === 'warning' ? 'warning' : 'success'}
                  className="flex items-start gap-3"
                >
                  <Icon className={`h-4 w-4 mt-0.5 ${
                    flag.type === 'warning' ? 'text-orange-600' : 'text-green-600'
                  }`} />
                  <div className="flex-1">
                    <div className="font-medium text-sm">
                      {flag.message.replace(/_/g, ' ')}
                    </div>
                    <AlertDescription className={
                      flag.type === 'warning' ? 'text-orange-700' : 'text-green-700'
                    }>
                      {flag.description}
                    </AlertDescription>
                  </div>
                </Alert>
              );
            })}
          </div>
        </CardContent>
      )}
    </Card>
  );
};