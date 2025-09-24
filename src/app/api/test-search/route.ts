import { NextRequest, NextResponse } from 'next/server';
import { searchAndGetTokenPrice } from '@/lib/api';

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();
    
    if (!query || typeof query !== 'string') {
      return NextResponse.json({
        success: false,
        error: '无效的查询参数'
      }, { status: 400 });
    }

    console.log(`🧪 测试搜索: ${query}`);
    
    // 调用搜索函数
    const result = await searchAndGetTokenPrice(query.trim());
    
    if (result) {
      console.log('✅ 搜索成功:', result);
      return NextResponse.json({
        success: true,
        data: result
      });
    } else {
      console.log('❌ 搜索失败: 未找到代币');
      return NextResponse.json({
        success: false,
        error: '未找到代币信息'
      });
    }
  } catch (error) {
    console.error('❌ API错误:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 });
  }
}
