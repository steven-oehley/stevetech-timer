"use client";

import { useEffect, useState, useTransition } from "react";

import { createTimeEntry } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDuration } from "@/lib/format";

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
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <Input
        aria-label="What are you working on?"
        className="sm:flex-1"
        disabled={running}
        onChange={(event) => setTask(event.target.value)}
        placeholder="What are you working on?"
        value={task}
      />

      <div className="flex items-center gap-4">
        <span
          aria-live="polite"
          className="font-mono text-2xl tabular-nums"
          role="timer"
        >
          {formatDuration(elapsed)}
        </span>

        <Button
          disabled={(!running && task.trim() === "") || saving}
          onClick={running ? stop : start}
          variant={running ? "destructive" : "default"}
        >
          {running ? "Stop" : saving ? "Saving…" : "Start"}
        </Button>
      </div>
    </div>
  );
}
