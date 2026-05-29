import { useState } from "react";

import { AppShell } from "./components/AppShell";
import { ExitConfirmationDialog } from "./components/ExitConfirmationDialog";
import { ExitProvider } from "./context/ExitContext";

import { buildPlaylist } from "./lib/buildPlaylist";

import { findNextTaskIndex } from "./lib/findNextTaskIndex";

import type {

  BioBreakChecks,

  DayState,

  PlaylistItem,

  Screen,

  TaskId,

  TaskQuantities,

} from "./types";

import { initialBioBreakChecks, initialTaskQuantities } from "./types";

import { AgendaCompleteScreen } from "./screens/AgendaCompleteScreen";

import { BeginNextTaskScreen } from "./screens/BeginNextTaskScreen";

import { BioBreakScreen } from "./screens/BioBreakScreen";

import { AgendaIntroScreen } from "./screens/AgendaIntroScreen";

import { EnergyCheckInScreen } from "./screens/EnergyCheckInScreen";

import { MoodCheckInScreen } from "./screens/MoodCheckInScreen";

import { PainCheckInScreen } from "./screens/PainCheckInScreen";

import { PlaylistScreen } from "./screens/PlaylistScreen";

import { ReviewScreen } from "./screens/ReviewScreen";

import { TaskScreen } from "./screens/TaskScreen";

import { TaskSelectionScreen } from "./screens/TaskSelectionScreen";

import { WelcomeScreen } from "./screens/WelcomeScreen";



const DEFAULT_SCALE = 5;



const initialDayState: DayState = {

  pain: DEFAULT_SCALE,

  mood: DEFAULT_SCALE,

  energy: DEFAULT_SCALE,

};



export default function App() {

  const [screen, setScreen] = useState<Screen>("welcome");

  const [day, setDay] = useState<DayState>(initialDayState);

  const [tasks, setTasks] = useState<TaskQuantities>(initialTaskQuantities);

  const [playlist, setPlaylist] = useState<PlaylistItem[]>([]);

  const [taskIndex, setTaskIndex] = useState(0);

  const [completedTasks, setCompletedTasks] = useState<Set<number>>(

    () => new Set(),

  );

  const [skippedTasks, setSkippedTasks] = useState<Set<number>>(() => new Set());

  const [bioBreakChecks, setBioBreakChecks] =

    useState<BioBreakChecks>(initialBioBreakChecks);

  const [checkInAfterBreak, setCheckInAfterBreak] = useState(false);

  const [exitDialogOpen, setExitDialogOpen] = useState(false);



  function goTo(next: Screen) {

    setScreen(next);

  }



  function openBioBreak() {

    setBioBreakChecks(initialBioBreakChecks());

    goTo("bioBreak");

  }



  function resetSession() {

    setDay(initialDayState);

    setTasks(initialTaskQuantities);

    setPlaylist([]);

    setTaskIndex(0);

    setCompletedTasks(new Set());

    setSkippedTasks(new Set());

    setBioBreakChecks(initialBioBreakChecks());

    setCheckInAfterBreak(false);

    goTo("welcome");

  }



  function setTaskQuantity(id: TaskId, quantity: number) {

    setTasks((t) => ({ ...t, [id]: quantity }));

  }



  let content;

  switch (screen) {

    case "welcome":

      content = <WelcomeScreen onStart={() => goTo("pain")} />;

      break;

    case "pain":

      content = (

        <PainCheckInScreen

          value={day.pain}

          onChange={(pain) => setDay((d) => ({ ...d, pain }))}

          onNext={() => goTo("mood")}

        />

      );

      break;

    case "mood":

      content = (

        <MoodCheckInScreen

          value={day.mood}

          onChange={(mood) => setDay((d) => ({ ...d, mood }))}

          onNext={() => goTo("energy")}

        />

      );

      break;

    case "energy":

      content = (

        <EnergyCheckInScreen

          value={day.energy}

          onChange={(energy) => setDay((d) => ({ ...d, energy }))}

          onNext={() => {

            if (checkInAfterBreak) {

              setCheckInAfterBreak(false);

              const next = findNextTaskIndex(

                playlist.length,

                completedTasks,

                skippedTasks,

              );

              goTo(next === null ? "agendaComplete" : "beginNext");

            } else {

              goTo("agenda");

            }

          }}

        />

      );

      break;

    case "beginNext":

      content = (

        <BeginNextTaskScreen

          onStart={() => {

            const next = findNextTaskIndex(

              playlist.length,

              completedTasks,

              skippedTasks,

            );

            if (next !== null) {

              setTaskIndex(next);

              goTo("task");

            }

          }}

        />

      );

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

    case "agenda":

      content = (

        <AgendaIntroScreen onChooseTasks={() => goTo("tasks")} />

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

          onComplete={openBioBreak}

        />

      );

      break;

    case "bioBreak":

      content = (

        <BioBreakScreen

          checks={bioBreakChecks}

          onToggle={(option) =>

            setBioBreakChecks((c) => ({ ...c, [option]: !c[option] }))

          }

          onNext={() => {

            setCheckInAfterBreak(true);

            goTo("pain");

          }}

        />

      );

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


