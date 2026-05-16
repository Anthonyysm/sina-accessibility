"use client";

import { useState } from "react";
import { useAuth } from "@/lib/useAuth";
import { Activity, Filter } from "@/types/activity";
import { initialActivities } from "@/data/activities";
import Topbar from "@/components/StudentDashboard/Topbar/Topbar";
import ProgressBar from "@/components/StudentDashboard/ProgressBar/ProgressBar";
import Feed from "@/components/StudentDashboard/Feed/Feed";

export default function StudentDashboard() {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [filter, setFilter] = useState<Filter>("todos");
  const { logout } = useAuth();

  const filtered = activities.filter((a) => {
    if (filter === "pendentes") return !a.done;
    if (filter === "concluídas") return a.done;
    return true;
  });

  const doneCount = activities.filter((a) => a.done).length;

  function toggleDone(id: number) {
    setActivities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, done: !a.done } : a))
    );
  }

  function addComment(id: number, text: string) {
    setActivities((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              comments: [
                ...a.comments,
                {
                  id: Date.now(),
                  author: "Você",
                  initials: "EU",
                  color: "#3b5fa0",
                  text,
                  time: "agora",
                },
              ],
            }
          : a
      )
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f4f9] montserrat">
      <Topbar
        filter={filter}
        onFilterChange={setFilter}
        onLogout={logout}
      />

      <div className="max-w-[640px] mx-auto">
        <ProgressBar done={doneCount} total={activities.length} />
        <Feed
          activities={filtered}
          onToggleDone={toggleDone}
          onComment={addComment}
        />
      </div>
    </div>
  );
}
