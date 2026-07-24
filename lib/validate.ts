// lib/validate.ts
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

/**
 * Valida el body de una solicitud con un esquema Zod
 * @param req - NextRequest
 * @param schema - Esquema Zod
 * @returns Promise con el body validado o un Response de error
 */
export async function validateBody<T>(req: NextRequest, schema: z.ZodSchema<T>): Promise<T | NextResponse> {
  try {
    const body = await req.json();
    return schema.parse(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      }));

      return NextResponse.json(
        { success: false, errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Error al procesar los datos" },
      { status: 400 }
    );
  }
}