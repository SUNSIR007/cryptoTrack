import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            关于 CryptoTrack
          </h1>

          {/* 项目介绍 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              📚 项目简介
            </h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                CryptoTrack 是一个完全开源的教育项目，旨在帮助用户学习和了解加密货币价格信息。
                本项目仅用于教育和信息展示目的，不提供任何投资建议或金融服务。
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                我们的目标是创建一个透明、安全、易用的加密货币价格追踪工具，
                让用户能够实时了解主流加密货币的价格变化。
              </p>
            </div>
          </section>

          {/* 功能特性 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              ✨ 功能特性
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  📊 实时价格监测
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  通过CoinGecko API获取实时加密货币价格数据
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  🔍 代币搜索
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  支持搜索和添加自定义加密货币代币
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  📈 价格图表
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  显示历史价格趋势和变化图表
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  🌙 深色模式
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  支持明暗主题切换，保护用户视力
                </p>
              </div>
            </div>
          </section>

          {/* 技术栈 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              🛠️ 技术栈
            </h2>
            <div className="flex flex-wrap gap-2">
              {[
                'Next.js 14', 'React 18', 'TypeScript', 'Tailwind CSS',
                'CoinGecko API', 'DexScreener API', 'Recharts', 'Vercel'
              ].map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>

          {/* 免责声明 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              ⚠️ 重要声明
            </h2>
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <ul className="space-y-2 text-sm text-yellow-800 dark:text-yellow-200">
                <li>• 本网站仅用于教育和信息展示目的</li>
                <li>• 我们不提供任何投资建议或金融咨询服务</li>
                <li>• 我们不进行任何形式的金融交易</li>
                <li>• 我们不收集用户的个人信息或资金</li>
                <li>• 所有价格数据来源于第三方公开API</li>
                <li>• 投资有风险，请用户自行判断和决策</li>
                <li>• 我们对任何投资损失不承担责任</li>
              </ul>
            </div>
          </section>

          {/* 开源信息 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              🔓 开源信息
            </h2>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-green-800 dark:text-green-200 mb-3">
                CryptoTrack 是一个完全开源的项目，所有代码都可以在 GitHub 上查看和审核。
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://github.com/SUNSIR007/cryptoTrack"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  🔗 查看源代码
                </a>
                <a
                  href="https://github.com/SUNSIR007/cryptoTrack/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  🐛 报告问题
                </a>
              </div>
            </div>
          </section>

          {/* 联系信息 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              📞 联系我们
            </h2>
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <p>如果您有任何问题或建议，欢迎通过以下方式联系我们：</p>
              <ul className="space-y-1 ml-4">
                <li>• GitHub Issues: <a href="https://github.com/SUNSIR007/cryptoTrack/issues" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">提交问题</a></li>
                <li>• 项目主页: <a href="https://github.com/SUNSIR007/cryptoTrack" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">GitHub 仓库</a></li>
              </ul>
            </div>
          </section>

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
