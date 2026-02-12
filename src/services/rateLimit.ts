import { prisma } from "./prisma";
import { MONTHLY_CONVERSION_LIMIT } from "../utils/config";

export async function canConvert(
  userId: string
): Promise<{ allowed: boolean; remaining: number }> {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const count = await prisma.conversion.count({
    where: {
      userId,
      createdAt: { gte: startOfMonth },
    },
  });

  const remaining = Math.max(0, MONTHLY_CONVERSION_LIMIT - count);
  return { allowed: remaining > 0, remaining };
}
