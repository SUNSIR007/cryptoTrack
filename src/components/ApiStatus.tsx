'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';

interface ApiStatusProps {
  className?: string;
}

export default function ApiStatus({ className = '' }: ApiStatusProps) {
  const [apiKeyStatus, setApiKeyStatus] = useState<'checking' | 'valid' | 'invalid' | 'missing'>('checking');
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    checkApiKey();
  }, []);

  const checkApiKey = async () => {
    const apiKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;
    
    if (!apiKey) {
      setApiKeyStatus('missing');
      return;
    }

    try {
      // 测试 API 密钥是否有效
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&x_cg_demo_api_key=${apiKey}`
      );
      
      if (response.ok) {
        setApiKeyStatus('valid');
      } else {
        setApiKeyStatus('invalid');
      }
    } catch (error) {
      setApiKeyStatus('invalid');
    }
  };

  const getStatusInfo = () => {
    switch (apiKeyStatus) {
      case 'checking':
        return {
          icon: <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />,
          text: '检查 API 状态...',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200'
        };
      case 'valid':
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          text: 'API 配置正常',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      case 'invalid':
        return {
          icon: <AlertCircle className="w-4 h-4" />,
          text: 'API 密钥无效',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      case 'missing':
        return {
          icon: <AlertCircle className="w-4 h-4" />,
          text: 'API 密钥未配置',
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200'
        };
    }
  };

  const status = getStatusInfo();

  if (apiKeyStatus === 'valid') {
    return null; // 如果 API 正常，不显示组件
  }

  return (
    <div className={`${className}`}>
      <div className={`p-4 rounded-lg border ${status.bgColor} ${status.borderColor}`}>
        <div className="flex items-center gap-3">
          <div className={status.color}>
            {status.icon}
          </div>
          <div className="flex-1">
            <p className={`font-medium ${status.color}`}>
              {status.text}
            </p>
            {(apiKeyStatus === 'missing' || apiKeyStatus === 'invalid') && (
              <button
                onClick={() => setShowDetails(!showDetails)}
                className={`text-sm ${status.color} hover:underline mt-1`}
              >
                {showDetails ? '隐藏' : '查看'}解决方案
              </button>
            )}
          </div>
        </div>

        {showDetails && (
          <div className="mt-4 space-y-3">
            <div className="text-sm text-gray-700">
              <h4 className="font-medium mb-2">解决步骤：</h4>
              <ol className="list-decimal list-inside space-y-1">
                <li>
                  获取免费 API 密钥：
                  <a
                    href="https://www.coingecko.com/en/api"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 ml-1 text-blue-600 hover:underline"
                  >
                    CoinGecko API
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>配置环境变量 <code className="bg-gray-100 px-1 rounded">NEXT_PUBLIC_COINGECKO_API_KEY</code></li>
                <li>重启开发服务器或重新部署</li>
              </ol>
            </div>

            <div className="text-xs text-gray-600 bg-gray-100 p-2 rounded">
              <strong>本地开发：</strong> 创建 <code>.env.local</code> 文件并添加你的 API 密钥<br />
              <strong>Vercel 部署：</strong> 在项目设置中添加环境变量<br />
              <strong>详细指南：</strong> 查看项目根目录的 <code>API_SETUP_GUIDE.md</code> 文件
            </div>

            <button
              onClick={checkApiKey}
              className={`px-3 py-1 text-sm rounded ${status.color} border ${status.borderColor} hover:bg-opacity-80 transition-colors`}
            >
              重新检查
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
