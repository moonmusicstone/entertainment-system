import React, { useState, useEffect } from 'react';
import { api } from '../../config/api';

interface ConnectionTestProps {
  className?: string;
}

export const ConnectionTest: React.FC<ConnectionTestProps> = ({ className = '' }) => {
  const [status, setStatus] = useState<'testing' | 'connected' | 'error'>('testing');
  const [message, setMessage] = useState('正在测试连接...');

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setStatus('testing');
      setMessage('正在测试连接...');
      
      const response = await api.get('/health');
      
      if (response.status === 200) {
        setStatus('connected');
        setMessage('前后端连接正常！');
      } else {
        setStatus('error');
        setMessage('连接异常');
      }
    } catch (error: any) {
      setStatus('error');
      setMessage(`连接失败: ${error.message || '未知错误'}`);
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'testing':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'connected':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'testing':
        return (
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        );
      case 'connected':
        return (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium ${getStatusColor()} ${className}`}>
      {getStatusIcon()}
      <span>{message}</span>
      {status === 'error' && (
        <button
          onClick={testConnection}
          className="ml-2 text-xs underline hover:no-underline"
        >
          重试
        </button>
      )}
    </div>
  );
};

export default ConnectionTest;