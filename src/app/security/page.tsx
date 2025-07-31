export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            安全声明 / Security Statement
          </h1>
          
          <div className="space-y-6 text-gray-700 dark:text-gray-300">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                关于本网站 / About This Website
              </h2>
              <p>
                CryptoTrack 是一个合法的加密货币价格追踪工具，仅用于教育和信息目的。
                我们不提供投资建议，不进行任何金融交易，也不存储用户的敏感信息。
              </p>
              <p className="mt-2">
                CryptoTrack is a legitimate cryptocurrency price tracking tool for educational 
                and informational purposes only. We do not provide investment advice, conduct 
                financial transactions, or store sensitive user information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                数据来源 / Data Sources
              </h2>
              <ul className="list-disc list-inside space-y-1">
                <li>CoinGecko API - 主流加密货币价格数据</li>
                <li>DexScreener API - 去中心化交易所数据</li>
                <li>所有数据仅供参考，不构成投资建议</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                隐私保护 / Privacy Protection
              </h2>
              <ul className="list-disc list-inside space-y-1">
                <li>我们不收集个人身份信息</li>
                <li>不存储用户的交易数据</li>
                <li>使用安全的HTTPS连接</li>
                <li>遵循最佳安全实践</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                免责声明 / Disclaimer
              </h2>
              <p className="text-sm">
                本网站提供的信息仅供参考，不构成投资建议。加密货币投资存在风险，
                请在投资前进行充分的研究和风险评估。我们不对因使用本网站信息而造成的任何损失承担责任。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                联系我们 / Contact Us
              </h2>
              <p>
                如果您对网站安全有任何疑问，请通过 GitHub Issues 联系我们：
                <a 
                  href="https://github.com/SUNSIR007/cryptoTrack/issues" 
                  className="text-blue-600 dark:text-blue-400 hover:underline ml-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub Issues
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
