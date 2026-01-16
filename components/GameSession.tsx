"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import {
  Clock,
  Trophy,
  CheckCircle2,
  XCircle,
  Circle,
  KeyRound,
  Copy,
  Play,
  HeartCrack,
  CircleCheck,
  CircleQuestionMark,
  UserRoundPen,
} from "lucide-react";
import { Leaderboard } from "./Leaderboard";
import { Round } from "@/lib/types/round";
import { useRouter, useSearchParams } from "next/navigation";
import { onChildAdded, onValue, ref, set } from "firebase/database";
import { realtimeDB } from "@/lib/firebase";
import { toast } from "react-toastify";
import { Player } from "@/lib/types/player";
import { Question } from "@/lib/types/question";

interface PlayersState {
  [key: string]: Player;
}

export function GameSession({
  rounds,
  pageId,
  gameTitle,
}: {
  rounds: Round[] | undefined;
  pageId: string;
  gameTitle: string | undefined;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sessionId] = useState(searchParams.get("sessionId"));
  const [timeForQuestion, setTimeForQuestion] = useState(60);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [isAfoot, setIsAfoot] = useState(false);
  const [roundIndex, setRoundIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [players, setPlayers] = useState<PlayersState>();

  useEffect(() => {
    console.log("players", players);
  }, [players]);

  const getFontSize = (text = "") => {
    const wordCount = text.split(/\s+/).length;

    if (wordCount > 40) return "text-xl md:text-2xl"; // Long paragraph
    if (wordCount > 20) return "text-2xl md:text-3xl"; // Multiple sentences
    if (wordCount > 10) return "text-3xl md:text-4xl"; // One long sentence
    return "text-4xl md:text-5xl"; // Default short question
  };

  useEffect(() => {
    if (!sessionId) return;

    const playersRef = ref(realtimeDB, `sessions/${sessionId}/players`);

    const unsubscribe = onChildAdded(playersRef, (snapshot) => {
      // setPlayers((prev) => {
      //   if (prev.has(snapshot.key)) return prev;

      //   const next = new Map(prev);
      //   next.set(snapshot.key!, snapshot.val());
      //   return next;
      // });
      setPlayers(snapshot.val());
    });

    return () => unsubscribe();
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) return;

    const playersRef = ref(realtimeDB, `sessions/${sessionId}/players`);

    const unsubscribe = onValue(playersRef, (snapshot) => {
      if (snapshot.val()) setPlayers(snapshot.val());
    });

    return () => unsubscribe();
  }, [sessionId]);

  useEffect(() => {
    if (!isTimerRunning || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerRunning, timeLeft]);

  const toggleTeamAnswer = (name: string, correct: boolean) => {
    if (players) {
      const playerData = players[name];

      if (playerData.isCorrect === true) {
        if (correct) {
          return;
        } else {
          playerData.score--;
        }
      } else if (playerData.isCorrect === false) {
        if (!correct) return;
      }

      playerData.isCorrect = correct;
      playerData.score += correct ? 1 : 0;

      const editedObject = { ...players, [name]: playerData };
      setPlayers(editedObject);
      sendPlayers(editedObject);
    }
  };

  const timerPercentage = (timeLeft / 30) * 100;
  const timerColor =
    timeLeft > 20 ? "#10b981" : timeLeft > 10 ? "#f59e0b" : "#ef4444";

  const onCopy = () => {
    navigator.clipboard.writeText(sessionId!);
    toast("Session ID was copied", { position: "top-center", autoClose: 2000 });
  };

  const onStartRound = () => {
    sendRoundTitle();
    sendTimeForQuestion();
    sendQuestion(questionIndex);
    sendQuestionImage(questionIndex);

    setTimeLeft(timeForQuestion);
    setIsTimerRunning(true);
    setIsAfoot(true);
  };

  const onNextQuestion = () => {
    sendQuestion(questionIndex + 1);
    sendQuestionImage(questionIndex + 1);

    setQuestionIndex(questionIndex + 1);
    reset();
    setIsTimerRunning(true);
  };

  const onFinishRound = () => {
    setIsAfoot(false);
    setRoundIndex(roundIndex + 1);
    setQuestionIndex(0);
    reset();
  };

  const sendTimeForQuestion = () => {
    set(
      ref(realtimeDB, `sessions/${sessionId}/timeForQuestion`),
      timeForQuestion
    );
  };

  const sendPlayers = (playersObj: any) => {
    set(ref(realtimeDB, `sessions/${sessionId}/players`), playersObj);
  };

  const sendRoundTitle = () => {
    set(
      ref(realtimeDB, `sessions/${sessionId}/roundTitle`),
      rounds?.[roundIndex]?.title
    );
  };

  const sendQuestion = (qIndex: number) => {
    set(
      ref(realtimeDB, `sessions/${sessionId}/question`),
      rounds?.[roundIndex]?.questions?.[qIndex]?.question
    );

    set(ref(realtimeDB, `sessions/${sessionId}/answer`), "");

    set(ref(realtimeDB, `sessions/${sessionId}/answerImage`), "");
  };

  const sendQuestionImage = (qIndex: number) => {
    set(
      ref(realtimeDB, `sessions/${sessionId}/questionImage`),
      rounds?.[roundIndex]?.questions?.[qIndex]?.questionImage || ""
    );
  };

  const reset = () => {
    setShowAnswer(false);
    setTimeLeft(timeForQuestion);
    setIsTimerRunning(false);

    const updatedPlayers: PlayersState = Object.fromEntries(
      Object.entries(players ?? {}).map(([key, player]) => [
        key,
        { ...player, answer: "", isCorrect: null },
      ])
    );

    // 2. Update the React state for the UI
    setPlayers(updatedPlayers);

    // 3. Pass the temporary variable directly to your sync function
    sendPlayers(updatedPlayers);
  };

  const onReveal = () => {
    if (showAnswer) {
      setShowAnswer(false);
      return;
    }

    setShowAnswer(true);

    set(
      ref(realtimeDB, `sessions/${sessionId}/answer`),
      rounds?.[roundIndex]?.questions?.[questionIndex]?.answer || ""
    );

    set(
      ref(realtimeDB, `sessions/${sessionId}/answerImage`),
      rounds?.[roundIndex]?.questions?.[questionIndex]?.answerImage || ""
    );
  };

  const onTest = () => {};

  return (
    <>
      <div className="min-h-screen bg-neutral-950 text-white flex">
        {/* Main Content */}
        <div className="flex-1 flex flex-col p-8 relative overflow-hidden">
          {/* Static Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Large Gradient Orbs - Static */}
            <div
              className="absolute -top-40 -left-40 w-[600] h-[600] rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 40%, transparent 70%)",
              }}
            />
            <div
              className="absolute top-1/4 -right-60 w-[700] h-[700] rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.05) 40%, transparent 70%)",
              }}
            />
            <div
              className="absolute bottom-0 left-1/3 w-[500] h-[500] rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(236, 72, 153, 0.12) 0%, rgba(236, 72, 153, 0.04) 40%, transparent 70%)",
              }}
            />

            {/* Static Lines */}
            <svg className="absolute inset-0 w-full h-full opacity-20">
              <line
                x1="0%"
                y1="20%"
                x2="100%"
                y2="20%"
                stroke="url(#gradient1)"
                strokeWidth="2"
                opacity="0.3"
              />
              <line
                x1="0%"
                y1="60%"
                x2="100%"
                y2="60%"
                stroke="url(#gradient2)"
                strokeWidth="2"
                opacity="0.3"
              />
              <line
                x1="0%"
                y1="80%"
                x2="100%"
                y2="80%"
                stroke="url(#gradient3)"
                strokeWidth="2"
                opacity="0.3"
              />
              <defs>
                <linearGradient
                  id="gradient1"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                  <stop offset="50%" stopColor="#3b82f6" stopOpacity="1" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
                <linearGradient
                  id="gradient2"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0" />
                  <stop offset="50%" stopColor="#8b5cf6" stopOpacity="1" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                </linearGradient>
                <linearGradient
                  id="gradient3"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#ec4899" stopOpacity="0" />
                  <stop offset="50%" stopColor="#ec4899" stopOpacity="1" />
                  <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>

            {/* Floating Particles/Dots - Static */}
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-blue-400/40 rounded-full"
                style={{
                  left: `${(i * 8 + 10) % 90}%`,
                  top: `${(i * 13 + 15) % 80}%`,
                }}
              />
            ))}

            {/* Large Geometric Shapes - Static */}
            {/* <div
              className="absolute top-1/3 right-1/4 w-64 h-64 border-2 border-blue-500/20 rounded-3xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(59, 130, 246, 0.03) 0%, transparent 100%)",
              }}
            />
            <div
              className="absolute bottom-1/4 left-1/4 w-48 h-48 border-2 border-violet-500/20 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(139, 92, 246, 0.05) 0%, transparent 70%)",
              }}
            />
            <div
              className="absolute top-1/2 left-1/2 w-56 h-56 border-2 border-pink-500/20"
              style={{
                borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
                background:
                  "linear-gradient(45deg, rgba(236, 72, 153, 0.03) 0%, transparent 100%)",
              }}
            /> */}

            {/* Grid pattern overlay - More visible */}
            <div
              className="absolute inset-0 opacity-[0.15]"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)
                `,
                backgroundSize: "80px 80px",
              }}
            />

            {/* Diagonal Accent Lines - Static */}
            <div className="absolute inset-0">
              <div
                className="absolute h-px w-1/3 bg-linear-to-r from-transparent via-blue-500/30 to-transparent"
                style={{ top: "25%", left: "10%", transform: "rotate(-15deg)" }}
              />
              <div
                className="absolute h-px w-1/3 bg-linear-to-r from-transparent via-violet-500/30 to-transparent"
                style={{ top: "65%", right: "10%", transform: "rotate(15deg)" }}
              />
            </div>

            {/* Radial gradient vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)]" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="flex items-center gap-3">
              {/* <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-violet-600 rounded-xl" /> */}
              <div className="relative w-10 h-10">
                <img
                  src="/JJ.png"
                  alt="Logo"
                  className="w-full h-auto object-cover"
                />
              </div>
              <div>
                <h1 className="text-xl tracking-tight">{gameTitle}</h1>
                <p className="text-sm text-neutral-500">{`${
                  rounds?.length || "0"
                } rounds`}</p>
              </div>
            </div>

            <Button
              disabled={!players}
              onClick={() => setShowLeaderboard(true)}
              className="bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800 gap-2"
            >
              <Trophy className="size-4" />
              Leaderboard
            </Button>

            {/* <Button
              onClick={onTest}
              className="bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800 gap-2"
            >
              Test
            </Button> */}
          </div>

          {/* Question Card */}
          {isAfoot ? (
            <div className="flex-1 flex flex-col justify-center max-w-4xl mx-auto w-full relative z-10">
              <AnimatePresence mode="wait">
                {!showAnswer ? (
                  <motion.div
                    key="question"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="relative"
                  >
                    {/* Category Badge */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="inline-block mb-6"
                    >
                      <span className="px-4 py-1.5 bg-neutral-900 border border-neutral-800 rounded-full text-sm text-neutral-400">
                        {`${rounds?.[roundIndex]?.title}: Question ${
                          questionIndex + 1
                        }`}
                      </span>
                    </motion.div>

                    {/* Question */}
                    <motion.h2
                      className={`${getFontSize(
                        rounds?.[roundIndex]?.questions?.[questionIndex]
                          ?.question
                      )} tracking-tight mb-12 leading-tight`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      key={roundIndex + "-" + questionIndex}
                    >
                      {
                        rounds?.[roundIndex]?.questions?.[questionIndex]
                          ?.question
                      }
                    </motion.h2>

                    {/* Question Image */}
                    {rounds?.[roundIndex]?.questions?.[questionIndex]
                      ?.questionImage && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mb-12 rounded-2xl overflow-hidden border border-neutral-800"
                      >
                        <img
                          src={
                            rounds?.[roundIndex]?.questions?.[questionIndex]
                              ?.questionImage
                          }
                          alt="Question"
                          className="w-full max-h-[600] object-cover"
                        />
                      </motion.div>
                    )}

                    {/* Timer */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-neutral-400">
                          <Clock className="size-4" />
                          <span>Time remaining</span>
                        </div>
                        <span
                          className="text-2xl font-mono tabular-nums"
                          style={{ color: timerColor }}
                        >
                          {timeLeft}s
                        </span>
                      </div>

                      <div className="h-2 bg-neutral-900 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: timerColor }}
                          initial={{ width: "100%" }}
                          animate={{ width: `${timerPercentage}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="answer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="relative"
                  >
                    {/* Answer Card */}
                    <div className="p-8 md:p-12 bg-linear-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl">
                      <div className="flex items-start gap-4 mb-8">
                        <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center shrink-0">
                          <CheckCircle2 className="size-6 text-green-400" />
                        </div>
                        <div>
                          <p className="text-sm text-green-400 mb-2">
                            Correct Answer
                          </p>
                          <p
                            className={`${getFontSize(
                              rounds?.[roundIndex]?.questions?.[questionIndex]
                                ?.answer
                            )} tracking-tight leading-tight`}
                            key={roundIndex + "~" + questionIndex}
                          >
                            {
                              rounds?.[roundIndex]?.questions?.[questionIndex]
                                ?.answer
                            }
                          </p>
                        </div>
                      </div>

                      {/* Answer Image */}
                      {rounds?.[roundIndex]?.questions?.[questionIndex]
                        ?.answerImage && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 }}
                          className="rounded-xl overflow-hidden border border-green-500/20"
                        >
                          <img
                            src={
                              rounds?.[roundIndex]?.questions?.[questionIndex]
                                .answerImage
                            }
                            alt="Answer"
                            className="w-full max-h-[400] object-cover"
                          />
                        </motion.div>
                      )}
                    </div>

                    {/* Timer (shown even when answer is revealed) */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="space-y-4 mt-8"
                    >
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-neutral-400">
                          <Clock className="size-4" />
                          <span>Time remaining</span>
                        </div>
                        <span
                          className="text-2xl font-mono tabular-nums"
                          style={{ color: timerColor }}
                        >
                          {timeLeft}s
                        </span>
                      </div>

                      <div className="h-2 bg-neutral-900 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: timerColor }}
                          initial={{ width: "100%" }}
                          animate={{ width: `${timerPercentage}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Controls */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex gap-3 mt-12 relative z-10"
              >
                <Button
                  onClick={onReveal}
                  className="bg-white hover:bg-neutral-100 text-neutral-950"
                >
                  {showAnswer ? "Hide Answer" : "Reveal Answer"}
                </Button>
                {questionIndex + 1 ===
                rounds?.[roundIndex]?.questions?.length ? (
                  roundIndex + 1 === rounds?.length ? (
                    <Button
                      onClick={() => {
                        setIsAfoot(false);
                        setShowLeaderboard(true);
                      }}
                      variant="outline"
                      className="bg-fuchsia-800 border-fuchsia-800 text-white hover:bg-fuchsia-900"
                    >
                      Finish Game
                    </Button>
                  ) : (
                    <Button
                      onClick={onFinishRound}
                      variant="outline"
                      className="bg-transparent border-neutral-800 text-neutral-400 hover:bg-neutral-900 hover:text-neutral-300"
                    >
                      Finish round
                    </Button>
                  )
                ) : (
                  <Button
                    onClick={onNextQuestion}
                    variant="outline"
                    className="bg-transparent border-neutral-800 text-neutral-400 hover:bg-neutral-900 hover:text-neutral-300"
                  >
                    Next Question
                  </Button>
                )}
              </motion.div>
            </div>
          ) : rounds?.length ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="w-full h-full flex flex-col justify-center items-center"
            >
              <div className="p-12 flex flex-col gap-4 border rounded-2xl border-fuchsia-500 shadow-[inset_0_0_15px_2px_#e12afb]">
                <div className="text-2xl text-neutral-400">{`Round ${
                  roundIndex + 1
                }`}</div>
                <div className="text-6xl">{rounds[roundIndex].title}</div>
                <Button
                  onClick={onStartRound}
                  className="bg-white hover:bg-neutral-100 text-neutral-950 mt-8 group"
                >
                  {"Start round"}
                  <Play className="size-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="group w-full h-full flex flex-col justify-center items-center text-2xl text-neutral-400"
            >
              <div className="flex flex-col gap-4 justify-center items-center border p-8 rounded-2xl shadow-[inset_0_0_5px_2px_#a1a1a1]">
                <HeartCrack className="size-8" />
                This game has no questions
              </div>
            </motion.div>
          )}
        </div>

        {/* Teams Sidebar */}
        <div className="w-96 bg-neutral-900/50 border-l border-neutral-800 p-6 overflow-y-auto">
          <div className="">
            {sessionId && (
              <div className="flex justify-end items-center -mt-1">
                <div className="text-neutral-200">
                  Session ID:{" "}
                  <span className="text-white font-bold">{sessionId}</span>
                </div>
                <Copy onClick={onCopy} className="h-4 ml-1 cursor-pointer" />
              </div>
            )}
            <div className="mx-auto h-0.5 bg-neutral-600 w-full mt-2"></div>
          </div>

          <div className="my-4">
            <h3 className="text-lg mb-1">Players</h3>
            <p className="text-sm text-neutral-500">
              Track answers in real-time
            </p>
          </div>

          <div className="space-y-3">
            {players && Object.keys(players).length > 0 ? (
              Object.entries(players).map(([key, team], index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className="group"
                >
                  <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl hover:border-neutral-700 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: team.color }}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate">{team.name}</p>
                          <p className="text-sm text-neutral-500">
                            {team.score} pts
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        {showAnswer ? (
                          team?.answer ? (
                            <div className="flex flex-row items-center gap-2 text-fuchsia-400">
                              <UserRoundPen className="size-4" />
                              {team?.answer}
                            </div>
                          ) : (
                            <div className="flex flex-row items-center gap-1 text-neutral-600">
                              No answer{" "}
                              <CircleQuestionMark className="size-4" />
                            </div>
                          )
                        ) : team?.answer ? (
                          <div className="flex flex-row items-center gap-1 text-green-400">
                            Submitted <CircleCheck className="size-4" />
                          </div>
                        ) : (
                          <div className="flex flex-row items-center gap-1 text-neutral-600">
                            No answer <CircleQuestionMark className="size-4" />
                          </div>
                        )}
                        {/* {team.isCorrect === null && (
                          <Circle className="size-5 text-neutral-600" />
                        )}
                        {team.isCorrect === true && (
                          <CheckCircle2 className="size-5 text-green-400" />
                        )}
                        {team.isCorrect === false && (
                          <XCircle className="size-5 text-red-400" />
                        )} */}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleTeamAnswer(team.name, true)}
                        className={`flex-1 h-8 rounded-lg text-sm transition-all ${
                          team.isCorrect === true
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : "bg-neutral-800 text-neutral-500 hover:bg-neutral-750 hover:text-neutral-300"
                        }`}
                      >
                        Correct
                      </button>
                      <button
                        onClick={() => toggleTeamAnswer(team.name, false)}
                        className={`flex-1 h-8 rounded-lg text-sm transition-all ${
                          team.isCorrect === false
                            ? "bg-red-500/20 text-red-400 border border-red-500/30"
                            : "bg-neutral-800 text-neutral-500 hover:bg-neutral-750 hover:text-neutral-300"
                        }`}
                      >
                        Wrong
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="flex justify-center text-neutral-500 italic text-sm mt-8">
                No players joined this game yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Leaderboard Modal */}
      {players && (
        <Leaderboard
          players={players}
          isOpen={showLeaderboard}
          onClose={() => setShowLeaderboard(false)}
        />
      )}
    </>
  );
}
