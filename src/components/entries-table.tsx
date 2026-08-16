"use client";

import { ClockIcon, Trash2Icon } from "lucide-react";
import { useFormStatus } from "react-dom";

import { deleteTimeEntry } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";
import { formatDuration } from "@/lib/format";

export type Entry = {
  id: string;
  task: string;
  seconds: number;
  startedAt: Date;
};

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
});

/**
 * Reads its own form's status, so deleting one entry doesn't grey out the
 * delete button on every other row.
 */
function DeleteEntryButton({ task }: { task: string }) {
  const { pending } = useFormStatus();

  return (
    <Button
      aria-label={pending ? `Deleting "${task}"` : `Delete "${task}"`}
      className="text-muted-foreground hover:text-destructive"
      disabled={pending}
      size="icon-sm"
      type="submit"
      variant="ghost"
    >
      {pending ? <Spinner className="size-3.5" /> : <Trash2Icon />}
    </Button>
  );
}

export function EntriesTable({ entries }: { entries: Entry[] }) {
  const total = entries.reduce((sum, entry) => sum + entry.seconds, 0);

  if (entries.length === 0) {
    return (
      <Card className="border-dashed shadow-none">
        <CardContent className="flex flex-col items-center gap-3 px-6 py-14 text-center">
          <span className="bg-muted text-muted-foreground flex size-11 items-center justify-center rounded-full">
            <ClockIcon className="size-5" />
          </span>
          <div className="space-y-1">
            <p className="font-medium">No entries yet</p>
            <p className="text-muted-foreground text-sm">
              Name what you&apos;re working on and press Start.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-medium">
          Entries
          <span className="text-muted-foreground ml-2 tabular-nums">
            {entries.length}
          </span>
        </h2>
        <p className="text-muted-foreground text-sm">
          Total{" "}
          <span className="text-foreground font-mono tabular-nums">
            {formatDuration(total)}
          </span>
        </p>
      </div>

      <Card className="overflow-hidden py-0 shadow-none">
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-0" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.task}</TableCell>
                  <TableCell className="font-mono tabular-nums">
                    {formatDuration(entry.seconds)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {dateFormat.format(entry.startedAt)}
                  </TableCell>
                  <TableCell>
                    <form action={deleteTimeEntry}>
                      <input name="id" type="hidden" value={entry.id} />
                      <DeleteEntryButton task={entry.task} />
                    </form>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}
