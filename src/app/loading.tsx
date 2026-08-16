import { Skeleton } from "@/components/skeletons";

/**
 * Reaching this page can involve a full OAuth round trip through the host, so
 * the gap this covers is longer here than anywhere on the host itself.
 */
export default function TimerLoading() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-10">
      <div>
        <Skeleton className="h-7 w-44" />
        <Skeleton className="mt-2 h-4 w-72 max-w-full" />
      </div>

      <div className="rounded-xl border p-6">
        <Skeleton className="h-10 w-full" />
        <div className="mt-5 flex items-center justify-between">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>

      <div className="space-y-3">
        <Skeleton className="h-5 w-24" />
        <div className="space-y-px rounded-xl border p-4">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton className="h-10 w-full" key={index} />
          ))}
        </div>
      </div>
    </main>
  );
}
