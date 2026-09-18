// src/lib/activityLogger.ts
import { prisma } from "./prisma";

export type ActivityAction =
  | "QUOTE_SUBMITTED"
  | "EMAIL_DISPATCHED"
  | "STATUS_UPDATED"
  | "BOOKING_CREATED"
  | "BOOKING_CANCELLED"
  | "MANUAL_LEAD"
  | "NOTE_UPDATED"
  | "QUOTE_DELETED"
  | "ADMIN_EMAIL_SENT"
  | "SYSTEM";

export type ActivityCategory = "QUOTE" | "EMAIL" | "STATUS" | "BOOKING" | "DISPATCH" | "SYSTEM";
export type ActivityActor = "Client" | "Admin" | "System";
export type ActivityStatus = "SUCCESS" | "WARNING" | "FAILED" | "INFO";

export type LogActivityParams = {
  action: ActivityAction | string;
  category?: ActivityCategory;
  quoteNumber?: string | null;
  quoteRequestId?: string | null;
  actor?: ActivityActor;
  title: string;
  details?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any> | null;
  status?: ActivityStatus;
};

/**
 * Persists an audit event to the ActivityLog table.
 * Designed to never throw errors that disrupt primary quote/admin workflows.
 */
export async function logActivity(params: LogActivityParams): Promise<void> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (prisma as any).activityLog.create({
      data: {
        action: params.action,
        category: params.category || "QUOTE",
        quoteNumber: params.quoteNumber || null,
        quoteRequestId: params.quoteRequestId || null,
        actor: params.actor || "System",
        title: params.title,
        details: params.details || null,
        metadata: params.metadata ? JSON.stringify(params.metadata) : undefined,
        status: params.status || "SUCCESS",
      },
    });
  } catch (err) {
    console.error("Failed to record activity log:", err);
  }
}

/**
 * Retrieves the most recent activity logs for admin dashboard audit trail.
 */
export async function getRecentActivityLogs(limit = 150) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const logs = await (prisma as any).activityLog.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        quoteRequest: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            pickupAddress: true,
            dropoffAddress: true,
            status: true,
          },
        },
      },
    });
    return logs;
  } catch (err) {
    console.error("Failed to fetch activity logs:", err);
    return [];
  }
}
