"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Entry = {
  id: string;
  employee: string;
  clockIn: string;   // ISO string
  clockOut?: string; // ISO string | undefined
  note?: string;
};

const STORAGE_KEY = "payroll_clock_entries_v1";

function loadEntries(): Entry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Entry[]) : [];
  } catch {
    return [];
  }
}

function saveEntries(list: Entry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function hoursBetween(a: string, b: string) {
  const ms = new Date(b).getTime() - new Date(a).getTime();
  return Math.max(ms / 36e5, 0);
}

export default function Page() {
  const [employee, setEmployee] = React.useState("");
  const [note, setNote] = React.useState("");
  const [entries, setEntries] = React.useState<Entry[]>([]);
  const [activeEntry, setActiveEntry] = React.useState<Entry | null>(null);
  const [now, setNow] = React.useState<Date>(new Date());

  // tick for "current session" timer
  React.useEffect(() => {
    setEntries(loadEntries());
    const i = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  // detect if this user already has an open shift
  React.useEffect(() => {
    const open = entries.find((e) => !e.clockOut && e.employee === employee);
    setActiveEntry(open ?? null);
  }, [entries, employee]);

  function handleClockIn() {
    if (!employee.trim()) {
      alert("Enter employee name first.");
      return;
    }
    if (activeEntry) {
      alert("You’re already clocked in.");
      return;
    }
    const entry: Entry = {
      id: crypto.randomUUID(),
      employee: employee.trim(),
      clockIn: new Date().toISOString(),
      note: note.trim() || undefined,
    };
    const next = [entry, ...entries];
    setEntries(next);
    saveEntries(next);
    setNote("");
  }

  function handleClockOut() {
    if (!activeEntry) {
      alert("You’re not clocked in.");
      return;
    }
    const next = entries.map((e) =>
      e.id === activeEntry.id ? { ...e, clockOut: new Date().toISOString() } : e
    );
    setEntries(next);
    saveEntries(next);
  }

  function clearAll() {
    if (!confirm("Delete ALL local entries?")) return;
    setEntries([]);
    saveEntries([]);
  }

  const totalHours = entries
    .filter((e) => e.employee.toLowerCase().includes(employee.toLowerCase()))
    .reduce((sum, e) => {
      const end = e.clockOut ?? now.toISOString();
      return sum + hoursBetween(e.clockIn, end);
    }, 0);

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Payroll – Clock In/Out</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Clock</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="employee">Employee Name</Label>
              <Input
                id="employee"
                placeholder="e.g., Jane Doe"
                value={employee}
                onChange={(e) => setEmployee(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="note">Note (optional)</Label>
              <Input
                id="note"
                placeholder="Shift note…"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={handleClockIn} disabled={!employee || !!activeEntry}>
                Clock In
              </Button>
              <Button
                variant="secondary"
                onClick={handleClockOut}
                disabled={!activeEntry}
              >
                Clock Out
              </Button>
              <Button variant="destructive" onClick={clearAll}>
                Clear All (local)
              </Button>
            </div>

            <div className="rounded-md bg-yellow-50 p-3 text-sm">
              <div>
                <span className="font-semibold">Status:</span>{" "}
                {activeEntry ? (
                  <>
                    Clocked in since{" "}
                    {new Date(activeEntry.clockIn).toLocaleString()}.
                  </>
                ) : (
                  "Not clocked in."
                )}
              </div>
              <div>
                <span className="font-semibold">Filtered Total Hours:</span>{" "}
                {totalHours.toFixed(2)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Entries (local device)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2">Employee</th>
                    <th className="p-2">Clock In</th>
                    <th className="p-2">Clock Out</th>
                    <th className="p-2">Hours</th>
                    <th className="p-2">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.length === 0 ? (
                    <tr>
                      <td className="p-2" colSpan={5}>
                        No entries yet.
                      </td>
                    </tr>
                  ) : (
                    entries.map((e) => {
                      const end = e.clockOut ?? now.toISOString();
                      const hrs = hoursBetween(e.clockIn, end).toFixed(2);
                      return (
                        <tr key={e.id} className="border-t">
                          <td className="p-2">{e.employee}</td>
                          <td className="p-2">
                            {new Date(e.clockIn).toLocaleString()}
                          </td>
                          <td className="p-2">
                            {e.clockOut ? new Date(e.clockOut).toLocaleString() : "—"}
                          </td>
                          <td className="p-2">{hrs}</td>
                          <td className="p-2">{e.note ?? "—"}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Stored in browser <code>localStorage</code>. Hook up an API/DB when
              you’re ready.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
