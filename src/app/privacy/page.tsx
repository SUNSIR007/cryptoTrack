import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            隐私政策
          </h1>

          <div className="prose dark:prose-invert max-w-none">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              最后更新时间：2024年1月1日
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                1. 概述
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                CryptoTrack（"我们"、"本网站"）是一个开源的教育项目，致力于保护用户的隐私。
                本隐私政策说明了我们如何收集、使用和保护您的信息。
              </p>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-green-800 dark:text-green-200 font-semibold">
                  🔒 重要声明：我们不收集、存储或处理任何用户个人信息。
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                2. 信息收集
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    2.1 我们不收集的信息
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                    <li>个人身份信息（姓名、邮箱、电话等）</li>
                    <li>财务信息（银行账户、信用卡等）</li>
                    <li>登录凭据（用户名、密码等）</li>
                    <li>位置信息</li>
                    <li>设备唯一标识符</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    2.2 技术信息
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    我们可能会收集一些基本的技术信息以确保网站正常运行：
                  </p>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 mt-2">
                    <li>浏览器类型和版本（用于兼容性）</li>
                    <li>访问时间（用于性能监控）</li>
                    <li>页面访问统计（用于改进用户体验）</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                3. 本地存储
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                为了提供更好的用户体验，我们使用浏览器的本地存储功能：
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                <li>用户选择的加密货币列表（存储在您的设备上）</li>
                <li>主题偏好设置（明暗模式）</li>
                <li>货币单位偏好</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 mt-4">
                这些信息完全存储在您的设备上，我们无法访问或收集这些数据。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                4. 第三方服务
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                我们使用以下第三方服务来提供功能：
              </p>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white">CoinGecko API</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    用于获取加密货币价格数据。请查看其
                    <a href="https://www.coingecko.com/en/privacy" target="_blank" rel="noopener noreferrer" 
                       className="text-blue-600 dark:text-blue-400 hover:underline ml-1">隐私政策</a>
                  </p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white">DexScreener API</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    用于获取去中心化交易所数据。请查看其
                    <a href="https://dexscreener.com/privacy" target="_blank" rel="noopener noreferrer" 
                       className="text-blue-600 dark:text-blue-400 hover:underline ml-1">隐私政策</a>
                  </p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Vercel 托管</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    网站托管服务。请查看其
                    <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" 
                       className="text-blue-600 dark:text-blue-400 hover:underline ml-1">隐私政策</a>
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                5. 数据安全
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                我们采取以下措施保护网站安全：
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                <li>HTTPS 加密传输</li>
                <li>安全头部配置</li>
                <li>内容安全策略（CSP）</li>
                <li>定期安全审查</li>
                <li>开源代码透明</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                6. 用户权利
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                由于我们不收集个人信息，您无需担心数据删除或修改问题。您可以：
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                <li>随时清除浏览器本地存储</li>
                <li>停止使用本网站</li>
                <li>查看我们的开源代码</li>
                <li>联系我们询问任何问题</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                7. 政策更新
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                我们可能会不定期更新本隐私政策。任何重大变更都会在网站上显著位置公布。
                建议您定期查看本政策以了解最新信息。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                8. 联系我们
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                如果您对本隐私政策有任何疑问，请通过以下方式联系我们：
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                <li>GitHub Issues: <a href="https://github.com/SUNSIR007/cryptoTrack/issues" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">提交问题</a></li>
                <li>项目主页: <a href="https://github.com/SUNSIR007/cryptoTrack" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">GitHub 仓库</a></li>
              </ul>
            </section>
          </div>

          {/* 返回按钮 */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              ← 返回首页
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
