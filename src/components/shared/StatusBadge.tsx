import React from 'react';

interface StatusBadgeProps {
  status: 'ready' | 'warning' | 'error' | 'processing';
  message: string;
  description?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, message, description }) => {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'ready':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          border: 'border-green-200',
          icon: '✅'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          border: 'border-yellow-200',
          icon: '⚠️'
        };
      case 'error':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          border: 'border-red-200',
          icon: '❌'
        };
      case 'processing':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          border: 'border-blue-200',
          icon: '🔄'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          border: 'border-gray-200',
          icon: 'ℹ️'
        };
    }
  };

  const styles = getStatusStyles(status);

  return (
    <div className={`${styles.bg} ${styles.border} border rounded-lg p-4`}>
      <div className="flex items-center space-x-3">
        <span className="text-xl">{styles.icon}</span>
        <div>
          <p className={`font-medium ${styles.text}`}>{message}</p>
          {description && (
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusBadge;