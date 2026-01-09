import { NextRequest } from 'next/server';
import { unauthorizedResponse } from './api-response';

const ADMIN_API_TOKEN = process.env.ADMIN_API_TOKEN;

export function ensureAdminRequest(req: NextRequest) {
  if (!ADMIN_API_TOKEN) {
    console.warn('ADMIN_API_TOKEN is not configured. Allowing admin requests by default.');
    return { authorized: true as const };
  }

  const authHeader = req.headers.get('authorization') || '';
  const expected = `Bearer ${ADMIN_API_TOKEN}`;

  if (authHeader === expected) {
    return { authorized: true as const };
  }

  return { authorized: false as const, response: unauthorizedResponse('Invalid admin credentials') };
}

