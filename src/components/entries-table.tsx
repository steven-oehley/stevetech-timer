import { deleteTimeEntry } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

export function EntriesTable({ entries }: { entries: Entry[] }) {
  if (entries.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No entries yet. Start the timer to record one.
      </p>
    );
  }

  return (
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
                <Button
                  aria-label={`Delete "${entry.task}"`}
                  size="sm"
                  type="submit"
                  variant="destructive"
                >
                  Delete
                </Button>
              </form>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
