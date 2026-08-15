"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireLicensedUser } from "@/lib/session";

/**
 * Server actions are public HTTP endpoints, so each one re-verifies the
 * session AND the "timer" entitlement before touching the database — the
 * proxy's cookie check does not carry over to them.
 */

const MAX_TASK_LENGTH = 200;

export async function createTimeEntry(formData: FormData) {
  const user = await requireLicensedUser();

  const task = String(formData.get("task") ?? "").trim();
  const startedAtRaw = String(formData.get("startedAt") ?? "");
  const endedAtRaw = String(formData.get("endedAt") ?? "");

  const startedAt = new Date(startedAtRaw);
  const endedAt = new Date(endedAtRaw);

  if (
    !task ||
    Number.isNaN(startedAt.getTime()) ||
    Number.isNaN(endedAt.getTime()) ||
    endedAt <= startedAt
  ) {
    return;
  }

  // Derived on the server so the stored duration always matches the stored
  // timestamps, whatever the client sent.
  const seconds = Math.round((endedAt.getTime() - startedAt.getTime()) / 1000);

  await prisma.timeEntry.create({
    data: {
      userId: user.id,
      task: task.slice(0, MAX_TASK_LENGTH),
      startedAt,
      endedAt,
      seconds,
    },
  });

  revalidatePath("/");
}

export async function deleteTimeEntry(formData: FormData) {
  const user = await requireLicensedUser();

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  // Scoped by userId as well as id: a guessed id from another user matches
  // nothing rather than deleting their row.
  await prisma.timeEntry.deleteMany({ where: { id, userId: user.id } });

  revalidatePath("/");
}
