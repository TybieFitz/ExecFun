import { useState } from "react";
import { AppShell } from "./components/AppShell";
import { ExitConfirmationDialog } from "./components/ExitConfirmationDialog";
import { ExitProvider } from "./context/ExitContext";
import { buildPlaylist } from "./lib/buildPlaylist";
import { findNextTaskIndex } from "./lib/findNextTaskIndex";
import type { PlaylistItem, Screen, TaskId, TaskQuantities } from "./types";
import { initialTaskQuantities } from "./types";
import { AgendaCompleteScreen } from "./screens/AgendaCompleteScreen";
import { CheckInScreen } from "./screens/CheckInScreen";
import { PlaylistScreen } from "./screens/PlaylistScreen";
import { ReviewScreen } from "./screens/ReviewScreen";
import { TaskScreen } from "./screens/TaskScreen";
import { TaskSelectionScreen } from "./screens/TaskSelectionScreen";
import { WelcomeScreen } from "./screens/WelcomeScreen";

export default function App() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [tasks, setTasks] = useState<TaskQuantities>(initialTaskQuantities);
  const [playlist, setPlaylist] = useState<PlaylistItem[]>([]);
  const [taskIndex, setTaskIndex] = useState(0);
  const [completedTasks, setCompletedTasks] = useState<Set<number>>(
    () => new Set(),
  );
  const [skippedTasks, setSkippedTasks] = useState<Set<number>>(() => new Set());
  const [exitDialogOpen, setExitDialogOpen] = useState(false);

  function goTo(next: Screen) {
    setScreen(next);
  }

  function startNextTask() {
    const next = findNextTaskIndex(
      playlist.length,
      completedTasks,
      skippedTasks,
    );
    if (next === null) {
      goTo("agendaComplete");
    } else {
      setTaskIndex(next);
      goTo("task");
    }
  }

  function resetSession() {
    setTasks(initialTaskQuantities);
    setPlaylist([]);
    setTaskIndex(0);
    setCompletedTasks(new Set());
    setSkippedTasks(new Set());
    goTo("welcome");
  }

  function setTaskQuantity(id: TaskId, quantity: number) {
    setTasks((t) => ({ ...t, [id]: quantity }));
  }

  let content;
  switch (screen) {
    case "welcome":
      content = <WelcomeScreen onStart={() => goTo("tasks")} />;
      break;
    case "agendaComplete":
      content = (
        <AgendaCompleteScreen onReview={() => goTo("review")} />
      );
      break;
    case "review":
      content = (
        <ReviewScreen
          items={playlist}
          completedTasks={completedTasks}
          skippedTasks={skippedTasks}
          onReturnToMainMenu={resetSession}
        />
      );
      break;
    case "tasks":
      content = (
        <TaskSelectionScreen
          quantities={tasks}
          onChange={setTaskQuantity}
          onNext={() => {
            setPlaylist(buildPlaylist(tasks));
            goTo("playlist");
          }}
        />
      );
      break;
    case "playlist":
      content = (
        <PlaylistScreen
          items={playlist}
          onBack={() => goTo("tasks")}
          onStart={() => {
            setTaskIndex(0);
            goTo("task");
          }}
        />
      );
      break;
    case "task":
      content = (
        <TaskScreen
          key={taskIndex}
          title={playlist[taskIndex]?.label ?? ""}
          taskId={playlist[taskIndex]?.taskId ?? "laundry"}
          onDone={() =>
            setCompletedTasks((prev) => new Set(prev).add(taskIndex))
          }
          onSkip={() =>
            setSkippedTasks((prev) => new Set(prev).add(taskIndex))
          }
          onComplete={() => goTo("checkIn")}
        />
      );
      break;
    case "checkIn":
      content = <CheckInScreen onStartNextTask={startNextTask} />;
      break;
  }

  return (
    <ExitProvider onRequestExit={() => setExitDialogOpen(true)}>
      <AppShell>{content}</AppShell>
      {exitDialogOpen && (
        <ExitConfirmationDialog
          onCancel={() => setExitDialogOpen(false)}
          onReset={() => {
            setExitDialogOpen(false);
            resetSession();
          }}
        />
      )}
    </ExitProvider>
  );
}
