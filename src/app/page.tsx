import { AppHeader } from "@/components/app-header";
import { EntriesTable } from "@/components/entries-table";
import { TimerPanel } from "@/components/timer-panel";
import { prisma } from "@/lib/prisma";
import { requireLicensedUser } from "@/lib/session";

export default async function HomePage() {
  const user = await requireLicensedUser();

  const entries = await prisma.timeEntry.findMany({
    where: { userId: user.id },
    orderBy: { startedAt: "desc" },
    select: { id: true, task: true, seconds: true, startedAt: true },
  });

  return (
    <>
      <AppHeader userName={user.name} />

      <main className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-6 py-10">
        <TimerPanel />
        <EntriesTable entries={entries} />
      </main>
    </>
  );
}
