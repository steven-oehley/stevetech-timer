"use client";

import { PlayIcon, SquareIcon } from "lucide-react";
import { useEffect, useState, useTransition } from "react";

import { createTimeEntry } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { formatDuration } from "@/lib/format";
import { cn } from "@/lib/utils";

export function TimerPanel() {
  const [task, setTask] = useState("");
  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [saving, startSaving] = useTransition();

  // Tick from the start timestamp rather than by incrementing a counter, so a
  // throttled background tab doesn't drift.
  useEffect(() => {
    if (!startedAt) return;

    const update = () =>
      setElapsed(Math.floor((Date.now() - startedAt.getTime()) / 1000));

    update();
    const interval = setInterval(update, 250);
    return () => clearInterval(interval);
  }, [startedAt]);

  const running = startedAt !== null;

  function start() {
    setElapsed(0);
    setStartedAt(new Date());
  }

  function stop() {
    if (!startedAt) return;

    const endedAt = new Date();
    setStartedAt(null);
    setElapsed(0);

    const formData = new FormData();
    formData.set("task", task);
    formData.set("startedAt", startedAt.toISOString());
    formData.set("endedAt", endedAt.toISOString());

    startSaving(async () => {
      await createTimeEntry(formData);
      setTask("");
    });
  }

  return (
    <Card
      className={cn(
        "transition-colors",
        running && "border-primary/40 bg-accent/20",
      )}
    >
      <CardContent className="flex flex-col gap-5 p-6">
        <Input
          aria-label="What are you working on?"
          className="h-10 text-base"
          disabled={running || saving}
          onChange={(event) => setTask(event.target.value)}
          placeholder="What are you working on?"
          value={task}
        />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/*
              A live pulse while running. The clock digits change every second,
              which proves it is ticking, but only if you happen to be watching
              the moment they roll over — this says "running" continuously.
            */}
            <span
              aria-hidden
              className={cn(
                "size-2.5 shrink-0 rounded-full transition-colors",
                running ? "bg-primary animate-pulse" : "bg-muted-foreground/25",
              )}
            />

            <span
              aria-live="off"
              className={cn(
                "font-mono text-4xl tabular-nums transition-colors",
                running ? "text-foreground" : "text-muted-foreground",
              )}
              role="timer"
            >
              {formatDuration(elapsed)}
            </span>
          </div>

          {/*
            Saving is its own visible state rather than a silent gap after Stop.
            Writing the entry revalidates the whole page, so the table below
            redraws a beat later — without this the click looks like it did
            nothing until that happens.
          */}
          <Button
            disabled={(!running && task.trim() === "") || saving}
            onClick={running ? stop : start}
            size="lg"
            variant={running ? "destructive" : "default"}
          >
            {saving ? (
              <>
                <Spinner />
                Saving…
              </>
            ) : running ? (
              <>
                <SquareIcon />
                Stop
              </>
            ) : (
              <>
                <PlayIcon />
                Start
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
