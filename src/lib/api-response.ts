import { NextResponse } from "next/server";

export function jsonOk<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function jsonError(message: string, status = 500, details?: unknown) {
  return NextResponse.json(
    {
      error: message,
      ...(details === undefined ? {} : { details }),
    },
    { status },
  );
}

export function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}
