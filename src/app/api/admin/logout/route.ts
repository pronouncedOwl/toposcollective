import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseRequestClient } from '../../../../lib/supabase-server';

export async function POST(request: NextRequest) {
  const supabase = createSupabaseRequestClient(request);
  await supabase.auth.signOut();
  
  return NextResponse.json({ success: true });
}
