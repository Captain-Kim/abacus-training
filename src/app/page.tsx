"use client";

import { useState } from "react";
import { AnsweredProblem, Operation, Stage } from "@/lib/types";
import StartScreen from "@/components/StartScreen";
import QuizScreen from "@/components/QuizScreen";
import ResultScreen from "@/components/ResultScreen";

type View = "start" | "quiz" | "result";

export default function Home() {
  const [view, setView] = useState<View>("start");
  const [operation, setOperation] = useState<Operation>("add");
  const [stage, setStage] = useState<Stage>(1);
  const [results, setResults] = useState<AnsweredProblem[]>([]);

  return (
    <div className="h-dvh overflow-hidden bg-white">
      {view === "start" && (
        <StartScreen
          onStart={(op, st) => {
            setOperation(op);
            setStage(st);
            setView("quiz");
          }}
        />
      )}
      {view === "quiz" && (
        <QuizScreen
          operation={operation}
          stage={stage}
          onFinish={(res) => {
            setResults(res);
            setView("result");
          }}
          onQuit={() => setView("start")}
        />
      )}
      {view === "result" && (
        <ResultScreen
          results={results}
          onRetry={() => setView("quiz")}
          onHome={() => setView("start")}
        />
      )}
    </div>
  );
}
