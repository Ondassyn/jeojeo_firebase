"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Clock, ZoomIn, X, CheckCircle2, Lock } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { onValue, ref, set } from "firebase/database";
import { realtimeDB } from "@/lib/firebase";
import Loader from "./ui/loader";
import { Player } from "@/lib/types/player";

interface Question {
  id: number;
  question: string;
  category: string;
  questionImage?: string;
  timeLimit: number; // in seconds
}

export function SessionPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [username] = useState(searchParams.get("username") ?? "John Doe");
  const [sessionId] = useState(params.id);
  const [question, setQuestion] = useState("");
  const [questionImage, setQuestionImage] = useState("");
  const [roundTitle, setRoundTitle] = useState("");
  const [answer, setAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [timeForQuestion, setTimeForQuestion] = useState(30);
  const [isLocked, setIsLocked] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [score, setScore] = useState(0);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [answerImage, setAnswerImage] = useState("");
  // const [timeProgress, setTimeProgress] = useState(0);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsLocked(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft, isSubmitted]);

  useEffect(() => {
    if (!sessionId) return;

    const questionRef = ref(realtimeDB, `sessions/${sessionId}/question`);

    const unsubscribe = onValue(questionRef, (snapshot) => {
      const q = snapshot.val();
      setQuestion(q);
      if (q) {
        setTimeLeft(timeForQuestion);
        setIsSubmitted(false);
        setIsLocked(false);
      }
    });

    return () => unsubscribe();
  }, [sessionId, timeForQuestion]);

  useEffect(() => {
    if (!sessionId) return;

    const timeRef = ref(realtimeDB, `sessions/${sessionId}/timeForQuestion`);

    const unsubscribe = onValue(timeRef, (snapshot) => {
      setTimeForQuestion(snapshot.val());
    });

    return () => unsubscribe();
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) return;

    const roundRef = ref(realtimeDB, `sessions/${sessionId}/roundTitle`);

    const unsubscribe = onValue(roundRef, (snapshot) => {
      setRoundTitle(snapshot.val());
    });

    return () => unsubscribe();
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) return;

    const imageRef = ref(realtimeDB, `sessions/${sessionId}/questionImage`);

    const unsubscribe = onValue(imageRef, (snapshot) => {
      const q = snapshot.val();
      setQuestionImage(snapshot.val());
      if (q) {
        setTimeLeft(timeForQuestion);
        setIsSubmitted(false);
        setIsLocked(false);
      }
    });

    return () => unsubscribe();
  }, [sessionId, timeForQuestion]);

  useEffect(() => {
    if (!sessionId) return;

    const imageRef = ref(realtimeDB, `sessions/${sessionId}/answerImage`);

    const unsubscribe = onValue(imageRef, (snapshot) => {
      setAnswerImage(snapshot.val());
    });

    return () => unsubscribe();
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) return;

    const imageRef = ref(realtimeDB, `sessions/${sessionId}/answer`);

    const unsubscribe = onValue(imageRef, (snapshot) => {
      setCorrectAnswer(snapshot.val());
    });

    return () => unsubscribe();
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) return;

    const playerRef = ref(
      realtimeDB,
      `sessions/${sessionId}/players/${username}`
    );

    const unsubscribe = onValue(playerRef, (snapshot) => {
      const playerData = snapshot.val();
      setAnswer(playerData?.answer);
      setScore(playerData?.score);
      if (!playerData?.answer) {
        setIsSubmitted(false);
        setIsLocked(false);
      }
    });

    return () => unsubscribe();
  }, [sessionId]);

  const handleSubmit = () => {
    if (!isLocked && answer.trim()) {
      setIsSubmitted(true);
      // Here you would send the answer to the server
      sendAnswer();
    }
  };

  const sendAnswer = () => {
    if (answer.trim()) {
      set(
        ref(realtimeDB, `sessions/${sessionId}/players/${username}/answer`),
        answer
      );
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimerColor = () => {
    if (timeLeft > 10) return "from-green-500 to-emerald-600";
    if (timeLeft > 5) return "from-yellow-500 to-orange-600";
    return "from-red-500 to-rose-600";
  };

  const timeProgress = (timeLeft / timeForQuestion) * 100;

  return (
    <div className="min-h-screen bg-neutral-950 text-white relative overflow-hidden flex flex-col">
      {/* Background Elements - Same style but optimized for mobile */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -left-40 w-[400] h-[400] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 40%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-[400] h-[400] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.05) 40%, transparent 70%)",
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col p-4 pb-6 max-w-2xl mx-auto w-full">
        {/* Header with Timer */}
        <div className="mb-6">
          <motion.div
            className="flex items-center justify-between mb-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8 mb-1">
                <img
                  src="/JJ.png"
                  alt="Logo"
                  className="w-full h-auto object-cover"
                />
              </div>
              <span className=" text-neutral-100 font-semibold">
                {username}
              </span>
              <span className=" text-neutral-400 ml-4 text-lg">{`${score} points`}</span>
            </div>

            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r ${getTimerColor()}`}
            >
              <Clock className="size-4" />
              <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
            </div>
          </motion.div>

          {/* Progress Bar */}
          <div className="h-1 bg-neutral-900 rounded-full overflow-hidden">
            <motion.div
              className={`h-full bg-linear-to-r ${getTimerColor()}`}
              initial={{ width: "100%" }}
              animate={{ width: `${timeProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {correctAnswer ? (
          <div className="flex flex-col">
            {/* Category Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-4"
            >
              <span className="inline-block px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-sm text-blue-300">
                {roundTitle}
              </span>
            </motion.div>

            {/* Question */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <h2 className="text-2xl leading-tight">
                <span className="font-semibold text-green-500">
                  Correct answer:{" "}
                </span>
                {correctAnswer}
              </h2>
            </motion.div>

            {/* Question Image */}
            {answerImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-6 relative"
              >
                <div
                  className="relative rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 cursor-pointer group"
                  // onClick={() => setIsImageZoomed(true)}
                >
                  {answerImage.includes("output-format=mp4") ? (
                    <video
                      aria-label="GIF: "
                      autoPlay={true}
                      // height="321"
                      loop={true}
                      playsInline={true}
                      // width="600"
                      muted={true}
                      className="w-full h-auto object-cover"
                    >
                      <source type="video/mp4" src={answerImage} />
                    </video>
                  ) : (
                    <img
                      src={answerImage}
                      alt="Question visual"
                      className="w-full h-auto object-cover"
                    />
                  )}
                  {/* <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="bg-black/60 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <ZoomIn className="size-6 text-white" />
                    </div>
                  </div> */}
                </div>
                {/* <p className="text-xs text-neutral-500 mt-2 text-center">
                  Tap to zoom
                </p> */}
              </motion.div>
            )}
          </div>
        ) : question || questionImage ? (
          <div className="flex flex-col">
            {/* Category Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-4"
            >
              <span className="inline-block px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-sm text-blue-300">
                {roundTitle}
              </span>
            </motion.div>

            {/* Question */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <h2 className="text-2xl leading-tight">{question}</h2>
            </motion.div>

            {/* Question Image */}
            {questionImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-6 relative"
              >
                <div
                  className="relative rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 cursor-pointer group"
                  onClick={() => {
                    if (!questionImage.includes("output-format=mp4"))
                      setIsImageZoomed(true);
                  }}
                >
                  {questionImage.includes("output-format=mp4") ? (
                    <video
                      aria-label="GIF: "
                      autoPlay={true}
                      // height="321"
                      loop={true}
                      playsInline={true}
                      // width="600"
                      muted={true}
                      className="w-full h-auto object-cover"
                    >
                      <source type="video/mp4" src={questionImage} />
                    </video>
                  ) : (
                    <img
                      src={questionImage}
                      alt="Question visual"
                      className="w-full h-auto object-cover"
                    />
                  )}
                  {questionImage.includes("output-format=mp4") && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="bg-black/60 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <ZoomIn className="size-6 text-white" />
                      </div>
                    </div>
                  )}
                </div>
                {questionImage.includes("output-format=mp4") && (
                  <p className="text-xs text-neutral-500 mt-2 text-center">
                    Tap to zoom
                  </p>
                )}
              </motion.div>
            )}

            {/* Answer Input */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-auto lg:mt-2 space-y-4"
            >
              {isSubmitted ? (
                <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 text-center">
                  <CheckCircle2 className="size-10 text-green-500 mx-auto mb-3" />
                  <h3 className="text-lg mb-1">Answer Submitted!</h3>
                  <p className="text-sm text-neutral-400">
                    Your answer:{" "}
                    <span className="text-white text-lg">{answer}</span>
                  </p>
                </div>
              ) : isLocked ? (
                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-center">
                  <Lock className="size-10 text-red-500 mx-auto mb-3" />
                  <h3 className="text-lg mb-1">Time's Up!</h3>
                  <p className="text-sm text-neutral-400">
                    You can no longer submit an answer
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    {/* <label
                  htmlFor="answer"
                  className="text-sm text-neutral-400 mb-2 block"
                >
                  Your Answer
                </label> */}
                    <Input
                      id="answer"
                      type="text"
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                      placeholder="Type your answer here..."
                      className="bg-neutral-900 border-neutral-800 text-white h-12 text-lg px-4"
                      disabled={isLocked}
                      autoFocus
                    />
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={!answer.trim() || isLocked}
                    className="w-full h-12 text-lg bg-white hover:bg-neutral-100 text-neutral-950 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit Answer
                  </Button>
                </>
              )}
            </motion.div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div className="h-12 w-12 mt-24">
              <Loader />
            </div>
            <div className="mt-12 text-neutral-500 text-xl">
              Waiting for the question...
            </div>
          </div>
        )}
      </div>

      {/* Image Zoom Modal */}
      <AnimatePresence>
        {isImageZoomed && questionImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setIsImageZoomed(false)}
          >
            <button
              onClick={() => setIsImageZoomed(false)}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="size-6 text-white" />
            </button>

            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={questionImage}
              alt="Question visual - zoomed"
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
