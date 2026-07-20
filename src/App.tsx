import { useRef, useState } from "react";
import { useWakeLock } from "./hooks/useWakeLock";
import { AppShell } from "./components/AppShell";
import { ConfirmationDialog } from "./components/ConfirmationDialog";
import { ExitProvider } from "./context/ExitContext";
import { ProgressProvider } from "./context/ProgressContext";
import { AGENDA_COMPLETE_TRANSITION_MS } from "./lib/transition";
import { TransitionScreen } from "./components/TransitionScreen";
import { buildPlaylist } from "./lib/buildPlaylist";
import { findNextTaskIndex } from "./lib/findNextTaskIndex";
import {
  ROUTINE_COMPLETE_MESSAGES,
  ROUTINE_LABELS,
  ROUTINE_TASKS,
} from "./data/routines";
import type {
  AgendaScreen,
  PlaylistItem,
  RoutineId,
  RoutineTask,
  Screen,
  SelectableTaskId,
  TaskQuantities,
} from "./types";
import { initialTaskQuantities } from "./types";
import { AgendaPromptScreen } from "./screens/AgendaPromptScreen";
import { CheckInScreen } from "./screens/CheckInScreen";
import { MainMenuScreen } from "./screens/MainMenuScreen";
import { PlaylistScreen } from "./screens/PlaylistScreen";
import { ReviewScreen } from "./screens/ReviewScreen";
import { RoutineScreen } from "./screens/RoutineScreen";
import { TaskScreen } from "./screens/TaskScreen";
import { TaskSelectionScreen } from "./screens/TaskSelectionScreen";

type Dialog =
  | "returnMenu"
  | "newDay"
  | "discardAgenda"
  | "restartRoutine"
  | null;

type RoutineState = {
  id: RoutineId;
  tasks: RoutineTask[];
  index: number;
};

function freshRoutine(id: RoutineId): RoutineState {
  return {
    id,
    tasks: [...ROUTINE_TASKS[id]],
    index: 0,
  };
}

export default function App() {
  useWakeLock();

  const [screen, setScreen] = useState<Screen>("menu");
  const [lastAgendaScreen, setLastAgendaScreen] =
    useState<AgendaScreen>("tasks");
  const [tasks, setTasks] = useState<TaskQuantities>(initialTaskQuantities);
  const [playlist, setPlaylist] = useState<PlaylistItem[]>([]);
  const [taskIndex, setTaskIndex] = useState(0);
  const [completedTasks, setCompletedTasks] = useState<Set<number>>(
    () => new Set(),
  );
  const [skippedTasks, setSkippedTasks] = useState<Set<number>>(() => new Set());
  const [nonLaundryProgressCount, setNonLaundryProgressCount] = useState(0);
  const [deferredLaundryUntil, setDeferredLaundryUntil] = useState<
    Record<string, number>
  >({});
  const [houseTaskProgress, setHouseTaskProgress] = useState<
    Record<string, number>
  >({});
  const [agendaReady, setAgendaReady] = useState(false);
  const [agendaComplete, setAgendaComplete] = useState(false);
  const [routine, setRoutine] = useState<RoutineState | null>(null);
  const [completedRoutines, setCompletedRoutines] = useState<Set<RoutineId>>(
    () => new Set(),
  );
  const [routineToRestart, setRoutineToRestart] = useState<RoutineId | null>(
    null,
  );
  const [dialog, setDialog] = useState<Dialog>(null);

  const completedTasksRef = useRef(completedTasks);
  const skippedTasksRef = useRef(skippedTasks);
  const playlistRef = useRef(playlist);
  const nonLaundryProgressCountRef = useRef(nonLaundryProgressCount);
  const deferredLaundryUntilRef = useRef(deferredLaundryUntil);
  completedTasksRef.current = completedTasks;
  skippedTasksRef.current = skippedTasks;
  playlistRef.current = playlist;
  nonLaundryProgressCountRef.current = nonLaundryProgressCount;
  deferredLaundryUntilRef.current = deferredLaundryUntil;

  function goTo(next: Screen) {
    if (isAgendaScreen(next)) setLastAgendaScreen(next);
    setScreen(next);
  }

  function goToMenu() {
    if (isAgendaScreen(screen)) setLastAgendaScreen(screen);
    setScreen("menu");
  }

  function handleRequestExit() {
    if (screen === "playlist" && playlistRef.current.length > 0) {
      setAgenda();
      return;
    }
    goToMenu();
  }

  function hasAgendaState() {
    return (
      playlist.length > 0 ||
      tasks.laundry.length > 0 ||
      tasks.house.length > 0 ||
      tasks.dirties.length > 0 ||
      tasks.dishes > 0 ||
      tasks.declutter > 0 ||
      tasks.adulting.length > 0
    );
  }

  function agendaProgress() {
    if (agendaComplete) return 1;
    if (playlist.length === 0) return 0;
    return (completedTasks.size + skippedTasks.size) / playlist.length;
  }

  function routineProgress(id: RoutineId) {
    if (completedRoutines.has(id)) return 1;
    if (!routine || routine.id !== id) return 0;
    const total = ROUTINE_TASKS[id].length;
    if (total === 0) return 0;
    return (total - routine.tasks.length) / total;
  }

  function activeProgress() {
    if (screen === "routine" && routine) return routineProgress(routine.id);
    if (screen === "agendaPrompt" || isAgendaScreen(screen)) {
      return agendaProgress();
    }
    return null;
  }

  function resetAgenda() {
    setTasks(initialTaskQuantities);
    playlistRef.current = [];
    setPlaylist([]);
    setTaskIndex(0);
    completedTasksRef.current = new Set();
    skippedTasksRef.current = new Set();
    nonLaundryProgressCountRef.current = 0;
    deferredLaundryUntilRef.current = {};
    setCompletedTasks(new Set());
    setSkippedTasks(new Set());
    setNonLaundryProgressCount(0);
    setDeferredLaundryUntil({});
    setHouseTaskProgress({});
    setAgendaReady(false);
    setAgendaComplete(false);
    setLastAgendaScreen("tasks");
  }

  function setAgenda() {
    setAgendaReady(true);
    goToMenu();
  }

  function startFreshAgenda() {
    resetAgenda();
    goTo("tasks");
  }

  function handleAgendaClick() {
    if (agendaReady) {
      goTo("playlist");
      return;
    }

    if (hasAgendaState()) {
      setScreen("agendaPrompt");
    } else {
      startFreshAgenda();
    }
  }

  function handleTaskComplete() {
    const next = findNextTaskIndex(
      playlistRef.current,
      completedTasksRef.current,
      skippedTasksRef.current,
      {
        deferredLaundryUntil: deferredLaundryUntilRef.current,
        nonLaundryProgressCount: nonLaundryProgressCountRef.current,
      },
    );
    if (next === null) {
      setAgendaComplete(true);
      goTo("agendaComplete");
    } else {
      goTo("checkIn");
    }
  }

  function moveTaskToBottom(index: number) {
    const items = playlistRef.current;
    if (index < 0 || index >= items.length) return;

    const next = [...items];
    const [item] = next.splice(index, 1);
    next.push(item);
    playlistRef.current = next;
    setPlaylist(next);

    const moveStatusIndex = (statusIndex: number) =>
      statusIndex > index ? statusIndex - 1 : statusIndex;

    const completed = new Set([...completedTasksRef.current].map(moveStatusIndex));
    const skipped = new Set([...skippedTasksRef.current].map(moveStatusIndex));
    completedTasksRef.current = completed;
    skippedTasksRef.current = skipped;
    setCompletedTasks(completed);
    setSkippedTasks(skipped);
  }

  function deferLaundryUntilNextNonLaundry(index: number) {
    const item = playlistRef.current[index];
    if (!item || !isLaundryTask(item.taskId) || !hasUnresolvedNonLaundry()) {
      return;
    }

    const nextDeferredLaundry = {
      ...deferredLaundryUntilRef.current,
      [item.id]: nonLaundryProgressCountRef.current + 1,
    };
    deferredLaundryUntilRef.current = nextDeferredLaundry;
    setDeferredLaundryUntil(nextDeferredLaundry);
  }

  function hasUnresolvedNonLaundry() {
    return playlistRef.current.some(
      (item, index) =>
        !isLaundryTask(item.taskId) &&
        !completedTasksRef.current.has(index) &&
        !skippedTasksRef.current.has(index),
    );
  }

  function markTaskResolved(index: number, status: "completed" | "skipped") {
    const item = playlistRef.current[index];
    const completed = new Set(completedTasksRef.current);
    const skipped = new Set(skippedTasksRef.current);

    if (status === "completed") completed.add(index);
    else skipped.add(index);

    completedTasksRef.current = completed;
    skippedTasksRef.current = skipped;
    setCompletedTasks(completed);
    setSkippedTasks(skipped);

    if (item && !isLaundryTask(item.taskId)) {
      const nextCount = nonLaundryProgressCountRef.current + 1;
      nonLaundryProgressCountRef.current = nextCount;
      setNonLaundryProgressCount(nextCount);
    }
  }

  function canSnoozeTask(index: number) {
    return getSnoozeDisabledLabel(index) === null;
  }

  function getSnoozeDisabledLabel(index: number) {
    const currentPlaylist = playlistRef.current;
    const item = currentPlaylist[index];
    if (!item) return "Last Task";

    const unresolvedIndexes = currentPlaylist
      .map((_candidate, candidateIndex) => candidateIndex)
      .filter(
        (candidateIndex) =>
          !completedTasks.has(candidateIndex) &&
          !skippedTasks.has(candidateIndex),
      );

    if (unresolvedIndexes.length <= 1) return "Last Task";

    const hasOtherTaskInRound = unresolvedIndexes.some(
      (candidateIndex) =>
        candidateIndex !== index &&
        currentPlaylist[candidateIndex].round === item.round,
    );

    const onlyLaundryRemains = unresolvedIndexes.every((candidateIndex) =>
      isLaundryTask(currentPlaylist[candidateIndex].taskId),
    );

    if (!hasOtherTaskInRound && onlyLaundryRemains) {
      return "(just laundry left)";
    }

    return null;
  }

  function startNextTask() {
    const next = findNextTaskIndex(
      playlistRef.current,
      completedTasksRef.current,
      skippedTasksRef.current,
      {
        deferredLaundryUntil: deferredLaundryUntilRef.current,
        nonLaundryProgressCount: nonLaundryProgressCountRef.current,
      },
    );
    if (next === null) {
      goTo("agendaComplete");
    } else {
      setTaskIndex(next);
      goTo("task");
    }
  }

  function setTaskQuantity<T extends SelectableTaskId>(
    id: T,
    value: TaskQuantities[T],
  ) {
    setTasks((current) => ({ ...current, [id]: value }));
  }

  function startRoutine(id: RoutineId) {
    setRoutine((current) => current && current.id === id ? current : freshRoutine(id));
    setScreen("routine");
  }

  function handleRoutineClick(id: RoutineId) {
    if (completedRoutines.has(id)) {
      setRoutineToRestart(id);
      setDialog("restartRoutine");
    } else {
      startRoutine(id);
    }
  }

  function resetRoutine(id: RoutineId) {
    setCompletedRoutines((completed) => {
      const next = new Set(completed);
      next.delete(id);
      return next;
    });
    setRoutine((current) => current?.id === id ? freshRoutine(id) : current);
    setRoutineToRestart(null);
    setDialog(null);
    setScreen("menu");
  }

  function moveRoutineTaskToBottom() {
    setRoutine((current) => {
      if (!current || current.tasks.length <= 1) return current;
      const tasks = [...current.tasks];
      const [task] = tasks.splice(current.index, 1);
      tasks.push(task);
      return { ...current, tasks, index: 0 };
    });
  }

  function completeRoutineTask() {
    setRoutine((current) => {
      if (!current) return current;
      const nextTasks = current.tasks.filter(
        (_task, index) => index !== current.index,
      );

      if (nextTasks.length === 0) {
        setCompletedRoutines((completed) => new Set(completed).add(current.id));
        window.setTimeout(() => {
          setRoutine(null);
          setScreen("menu");
        }, AGENDA_COMPLETE_TRANSITION_MS);
        return { ...current, tasks: [], index: 0 };
      }

      return { ...current, tasks: nextTasks, index: 0 };
    });
  }

  function resetDay() {
    resetAgenda();
    setRoutine(null);
    setAgendaReady(false);
    setAgendaComplete(false);
    setCompletedRoutines(new Set());
    setDialog(null);
    setScreen("menu");
  }

  let content;
  switch (screen) {
    case "menu":
      content = (
        <MainMenuScreen
          morningComplete={completedRoutines.has("morning")}
          morningProgress={routineProgress("morning")}
          agendaComplete={agendaComplete}
          agendaReady={agendaReady}
          agendaProgress={agendaProgress()}
          eveningComplete={completedRoutines.has("evening")}
          eveningProgress={routineProgress("evening")}
          onMorning={() => handleRoutineClick("morning")}
          onAgenda={handleAgendaClick}
          onEvening={() => handleRoutineClick("evening")}
          onNewDay={() => setDialog("newDay")}
        />
      );
      break;
    case "agendaPrompt":
      content = (
        <AgendaPromptScreen
          onResume={() => goTo(lastAgendaScreen)}
          onNewAgenda={() => setDialog("discardAgenda")}
          onBack={() => setScreen("menu")}
        />
      );
      break;
    case "agendaComplete":
      content = (
        <TransitionScreen
          message="Agenda complete"
          durationMs={AGENDA_COMPLETE_TRANSITION_MS}
          onComplete={() => goTo("review")}
        />
      );
      break;
    case "review":
      content = (
        <ReviewScreen
          items={playlist}
          completedTasks={completedTasks}
          skippedTasks={skippedTasks}
          onReturnToMainMenu={goToMenu}
        />
      );
      break;
    case "tasks":
      content = (
        <TaskSelectionScreen
          quantities={tasks}
          onChange={setTaskQuantity}
          onNext={() => {
            const nextPlaylist = buildPlaylist(tasks);
            playlistRef.current = nextPlaylist;
            setPlaylist(nextPlaylist);
            completedTasksRef.current = new Set();
            skippedTasksRef.current = new Set();
            nonLaundryProgressCountRef.current = 0;
            deferredLaundryUntilRef.current = {};
            setCompletedTasks(new Set());
            setSkippedTasks(new Set());
            setNonLaundryProgressCount(0);
            setDeferredLaundryUntil({});
            setHouseTaskProgress({});
            setAgendaReady(false);
            setAgendaComplete(false);
            setTaskIndex(0);
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
          onSet={setAgenda}
          onStart={() => {
            setAgendaReady(false);
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
          taskId={playlist[taskIndex]?.taskId ?? "laundryWash"}
          onDone={() => markTaskResolved(taskIndex, "completed")}
          onSkip={() => markTaskResolved(taskIndex, "skipped")}
          canSnooze={canSnoozeTask(taskIndex)}
          snoozeDisabledLabel={getSnoozeDisabledLabel(taskIndex) ?? "Last Task"}
          houseProgress={
            houseTaskProgress[playlist[taskIndex]?.id ?? ""] ?? 0
          }
          onHouseProgressChange={(progress) => {
            const id = playlistRef.current[taskIndex]?.id;
            if (!id) return;
            setHouseTaskProgress((current) => ({
              ...current,
              [id]: progress,
            }));
          }}
          onSnooze={() => {
            deferLaundryUntilNextNonLaundry(taskIndex);
            moveTaskToBottom(taskIndex);
          }}
          onComplete={handleTaskComplete}
        />
      );
      break;
    case "checkIn":
      content = <CheckInScreen onStartNextTask={startNextTask} />;
      break;
    case "routine":
      if (!routine || routine.tasks.length === 0) {
        content = (
          <TransitionScreen
            message={
              routine
                ? ROUTINE_COMPLETE_MESSAGES[routine.id]
                : "Routine complete"
            }
            durationMs={AGENDA_COMPLETE_TRANSITION_MS}
            onComplete={goToMenu}
          />
        );
      } else {
        content = (
          <RoutineScreen
            key={`${routine.id}-${routine.tasks[routine.index].id}`}
            title={ROUTINE_LABELS[routine.id]}
            task={routine.tasks[routine.index]}
            canSnooze={routine.tasks.length > 1}
            onDone={completeRoutineTask}
            onSkip={completeRoutineTask}
            onSnooze={moveRoutineTaskToBottom}
          />
        );
      }
      break;
    case "welcome":
      content = null;
      break;
  }

  return (
    <ExitProvider onRequestExit={handleRequestExit}>
      <ProgressProvider value={activeProgress()}>
        <AppShell>{content}</AppShell>
      </ProgressProvider>
      {dialog === "returnMenu" && (
        <ConfirmationDialog
          title="Return to Main Menu?"
          cancelLabel="Stay"
          confirmLabel="Main Menu"
          buttonLayout="row"
          onCancel={() => setDialog(null)}
          onConfirm={() => {
            setDialog(null);
            goToMenu();
          }}
        />
      )}
      {dialog === "newDay" && (
        <ConfirmationDialog
          title="Clear all fields and start a fresh day?"
          confirmLabel="New Day"
          onCancel={() => setDialog(null)}
          onConfirm={resetDay}
        />
      )}
      {dialog === "discardAgenda" && (
        <ConfirmationDialog
          title="Discard current progress?"
          confirmLabel="New Agenda"
          onCancel={() => setDialog(null)}
          onConfirm={() => {
            setDialog(null);
            startFreshAgenda();
          }}
        />
      )}
      {dialog === "restartRoutine" && routineToRestart && (
        <ConfirmationDialog
          title="Already complete. Reset routine?"
          cancelLabel="Back"
          confirmLabel="Reset"
          onCancel={() => {
            setRoutineToRestart(null);
            setDialog(null);
          }}
          onConfirm={() => resetRoutine(routineToRestart)}
        />
      )}
    </ExitProvider>
  );
}

function isAgendaScreen(screen: Screen): screen is AgendaScreen {
  return (
    screen === "tasks" ||
    screen === "playlist" ||
    screen === "task" ||
    screen === "checkIn" ||
    screen === "agendaComplete" ||
    screen === "review"
  );
}

function isLaundryTask(taskId: PlaylistItem["taskId"]) {
  return taskId === "laundryWash" || taskId === "laundryDry";
}
