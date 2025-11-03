import { NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/dynamodb-client';

export async function GET() {
  try {
    const products = await getAllProducts();
    
    return NextResponse.json({ 
      success: true, 
      products,
      count: products.length 
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch products' 
      },
      { status: 500 }
    );
  }
}