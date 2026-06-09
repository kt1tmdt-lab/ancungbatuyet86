import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

export async function logAudit({
  userId,
  action,
  entityType,
  entityId,
  details,
}: {
  userId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: Record<string, any>;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entityType,
        entityId,
        ...(details === undefined ? {} : { details: details as Prisma.InputJsonValue }),
      },
    });
  } catch (error) {
    console.error("Failed to write audit log:", error);
  }
}
