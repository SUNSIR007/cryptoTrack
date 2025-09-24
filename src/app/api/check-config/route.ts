import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY || process.env.COINGECKO_API_KEY || '';
  
  return NextResponse.json({
    hasApiKey: !!apiKey,
    apiKeyLength: apiKey.length,
    apiKeyPrefix: apiKey ? apiKey.substring(0, 8) + '...' : 'N/A',
    env: {
      NEXT_PUBLIC_COINGECKO_API_KEY: !!process.env.NEXT_PUBLIC_COINGECKO_API_KEY,
      COINGECKO_API_KEY: !!process.env.COINGECKO_API_KEY,
    }
  });
}
