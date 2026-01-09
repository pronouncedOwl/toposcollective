import { NextResponse } from 'next/server';

type ResponsePayload<T> = {
  success: boolean;
  data?: T;
  error?: string;
  details?: unknown;
};

function jsonResponse<T>(payload: ResponsePayload<T>, status = 200) {
  return NextResponse.json(payload, { status });
}

export const successResponse = <T>(data: T, status = 200) =>
  jsonResponse<T>({ success: true, data }, status);

export const createdResponse = <T>(data: T) => successResponse(data, 201);

export const badRequestResponse = (message: string, details?: unknown) =>
  jsonResponse({ success: false, error: message, details }, 400);

export const unauthorizedResponse = (message = 'Unauthorized') =>
  jsonResponse({ success: false, error: message }, 401);

export const forbiddenResponse = (message = 'Forbidden') =>
  jsonResponse({ success: false, error: message }, 403);

export const notFoundResponse = (message = 'Not found') =>
  jsonResponse({ success: false, error: message }, 404);

export const errorResponse = (message = 'Internal server error', details?: unknown, status = 500) =>
  jsonResponse({ success: false, error: message, details }, status);

