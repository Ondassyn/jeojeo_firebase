"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
} from "lucide-react";
import { Round } from "@/lib/types/round";
import { useRouter } from "next/navigation";
import { Question } from "@/lib/types/question";
import { doc, updateDoc } from "firebase/firestore";
import { firestoreDB } from "@/lib/firebase";
import { toast } from "react-toastify";
import Loader from "./ui/loader";

export function GameManager({
  gameRounds,
  pageId,
  gameTitle,
}: {
  gameRounds: Round[] | undefined;
  pageId: string;
  gameTitle: string | undefined;
}) {
  const router = useRouter();
  const [rounds, setRounds] = useState<Round[]>(
    !gameRounds || gameRounds.length === 0
      ? [
          {
            uid: Date.now().toLocaleString(),
            order: 1,
            title: "New Round",
            questions: [],
            isExpanded: true,
          },
        ]
      : gameRounds
  );
  const [loadingSave, setLoadingSave] = useState(false);

  const addRound = () => {
    const newRound: Round = {
      uid: Date.now().toLocaleString(),
      order: rounds.length + 1,
      title: "New Round",
      questions: [],
      isExpanded: true,
    };
    setRounds([...rounds, newRound]);
  };

  const onSave = async () => {
    setLoadingSave(true);
    const gameRef = doc(firestoreDB, "games", pageId);

    try {
      await updateDoc(gameRef, {
        rounds: rounds,
      });
      toast.success("Questions saved successfully!");
    } catch (error) {
      toast.error("Error saving game: " + error);
    } finally {
      setLoadingSave(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-neutral-950 text-white relative overflow-hidden">
      {/* Background Elements - Same as QuizPlatform */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="1" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0" />
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity="1" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ec4899" stopOpacity="0" />
              <stop offset="50%" stopColor="#ec4899" stopOpacity="1" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

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
        /> */}
        {/* <div
          className="absolute top-1/2 left-1/2 w-56 h-56 border-2 border-pink-500/20"
          style={{
            borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
            background:
              "linear-gradient(45deg, rgba(236, 72, 153, 0.03) 0%, transparent 100%)",
          }}
        /> */}

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

        {/* <div className="absolute inset-0">
          <div
            className="absolute h-px w-1/3 bg-linear-to-r from-transparent via-blue-500/30 to-transparent"
            style={{ top: "25%", left: "10%", transform: "rotate(-15deg)" }}
          />
          <div
            className="absolute h-px w-1/3 bg-linear-to-r from-transparent via-violet-500/30 to-transparent"
            style={{ top: "65%", right: "10%", transform: "rotate(15deg)" }}
          />
        </div> */}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-violet-600 rounded-xl" />
            <div>
              <h1 className="text-2xl tracking-tight">
                {`${gameTitle} - Editing mode` || "Something went wrong"}
              </h1>
              <p className="text-sm text-neutral-500">
                Create and organize quiz questions by rounds
              </p>
            </div>
          </div>
        </div>

        {/* Add Round Button */}
        <div className="mb-6">
          <Button
            onClick={addRound}
            className="bg-white hover:bg-neutral-100 text-neutral-950 gap-2"
          >
            <Plus className="size-4" />
            Add Round
          </Button>
        </div>

        {/* Rounds List */}
        <div className="space-y-4">
          {rounds.map((round, roundIndex) => (
            <motion.div
              key={round.uid}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: roundIndex * 0.05 }}
              className="bg-neutral-900/50 border border-neutral-800 rounded-2xl overflow-hidden"
            >
              {/* Round Header */}
              <div className="p-6 border-b border-neutral-800">
                <div className="flex items-center gap-4">
                  <div className="flex items-center w-20 text-xl text-neutral-300">
                    <div className="">
                      {/* <GripVertical className="size-5" /> */}#
                    </div>
                    <Input
                      type="number"
                      value={round.order}
                      onChange={(e) =>
                        setRounds(
                          rounds.map((r) =>
                            r.uid === round.uid
                              ? { ...r, order: e.target.valueAsNumber }
                              : r
                          )
                        )
                      }
                      className="flex-1 text-lg bg-transparent border-0 focus:bg-neutral-900 px-3 h-10"
                      placeholder="Round title..."
                    />
                  </div>

                  <Input
                    value={round.title}
                    onChange={(e) =>
                      setRounds(
                        rounds.map((r) =>
                          r.uid === round.uid
                            ? { ...r, title: e.target.value }
                            : r
                        )
                      )
                    }
                    className="flex-1 text-lg bg-transparent border-0 focus:bg-neutral-900 px-3 h-10"
                    placeholder="Round title..."
                  />

                  <span className="text-sm text-neutral-500 whitespace-nowrap">
                    {round.questions.length} questions
                  </span>

                  <Button
                    onClick={() =>
                      setRounds(
                        rounds.map((r) =>
                          r.uid === round.uid
                            ? { ...r, isExpanded: !r.isExpanded }
                            : r
                        )
                      )
                    }
                    variant="outline"
                    className="bg-transparent border-neutral-800 hover:bg-neutral-800 text-neutral-400 w-10 h-10 p-0"
                  >
                    {round.isExpanded ? (
                      <ChevronUp className="size-4" />
                    ) : (
                      <ChevronDown className="size-4" />
                    )}
                  </Button>

                  <Button
                    onClick={() =>
                      setRounds(rounds.filter((r) => r.uid !== round.uid))
                    }
                    variant="outline"
                    className="bg-transparent border-neutral-800 hover:bg-red-500/10 hover:border-red-500/30 text-red-400 w-10 h-10 p-0"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>

              {/* Round Content */}
              {round.isExpanded && (
                <div className="p-6 space-y-4">
                  {/* Questions */}
                  {round.questions.map((question, questionIndex) => (
                    <motion.div
                      key={question.uid}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: questionIndex * 0.05 }}
                      className="p-6 bg-neutral-900 border border-neutral-800 rounded-xl"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <button className="text-neutral-600 hover:text-neutral-400 cursor-grab mt-2">
                          <GripVertical className="size-4" />
                        </button>

                        <div className="flex-1 space-y-4">
                          {/* Question */}
                          <div>
                            <Label
                              htmlFor={`question-${question.uid}`}
                              className="text-neutral-400 text-sm mb-2"
                            >
                              Question
                            </Label>
                            <Textarea
                              id={`question-${question.uid}`}
                              value={question.question}
                              onChange={(e) =>
                                setRounds(
                                  rounds.map((r) => {
                                    if (r.uid === round.uid) {
                                      return {
                                        ...r,
                                        questions: r.questions.map((q) =>
                                          q.uid === question.uid
                                            ? { ...q, question: e.target.value }
                                            : q
                                        ),
                                      };
                                    }
                                    return r;
                                  })
                                )
                              }
                              className="bg-neutral-800 border-neutral-700 text-white min-h-[80]"
                              placeholder="Enter your question..."
                            />
                          </div>

                          {/* Answer */}
                          <div>
                            <Label
                              htmlFor={`answer-${question.uid}`}
                              className="text-neutral-400 text-sm mb-2"
                            >
                              Answer
                            </Label>
                            <Input
                              id={`answer-${question.uid}`}
                              value={question.answer}
                              onChange={(e) =>
                                setRounds(
                                  rounds.map((r) => {
                                    if (r.uid === round.uid) {
                                      return {
                                        ...r,
                                        questions: r.questions.map((q) =>
                                          q.uid === question.uid
                                            ? { ...q, answer: e.target.value }
                                            : q
                                        ),
                                      };
                                    }
                                    return r;
                                  })
                                )
                              }
                              className="bg-neutral-800 border-neutral-700 text-white"
                              placeholder="Enter the correct answer..."
                            />
                          </div>

                          {/* Images */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label
                                htmlFor={`questionImage-${question.uid}`}
                                className="text-neutral-400 text-sm mb-2"
                              >
                                Question Image URL (optional)
                              </Label>
                              <Input
                                id={`questionImage-${question.uid}`}
                                value={question.questionImage || ""}
                                onChange={(e) =>
                                  setRounds(
                                    rounds.map((r) => {
                                      if (r.uid === round.uid) {
                                        return {
                                          ...r,
                                          questions: r.questions.map((q) =>
                                            q.uid === question.uid
                                              ? {
                                                  ...q,
                                                  questionImage: e.target.value,
                                                }
                                              : q
                                          ),
                                        };
                                      }
                                      return r;
                                    })
                                  )
                                }
                                className="bg-neutral-800 border-neutral-700 text-white"
                                placeholder="https://..."
                              />
                            </div>
                            <div>
                              <Label
                                htmlFor={`answerImage-${question.uid}`}
                                className="text-neutral-400 text-sm mb-2"
                              >
                                Answer Image URL (optional)
                              </Label>
                              <Input
                                id={`answerImage-${question.uid}`}
                                value={question.answerImage || ""}
                                onChange={(e) =>
                                  setRounds(
                                    rounds.map((r) => {
                                      if (r.uid === round.uid) {
                                        return {
                                          ...r,
                                          questions: r.questions.map((q) =>
                                            q.uid === question.uid
                                              ? {
                                                  ...q,
                                                  answerImage: e.target.value,
                                                }
                                              : q
                                          ),
                                        };
                                      }
                                      return r;
                                    })
                                  )
                                }
                                className="bg-neutral-800 border-neutral-700 text-white"
                                placeholder="https://..."
                              />
                            </div>
                          </div>
                        </div>

                        <Button
                          onClick={() =>
                            setRounds(
                              rounds.map((r) => {
                                if (r.uid === round.uid) {
                                  return {
                                    ...r,
                                    questions: r.questions.filter(
                                      (q) => q.uid !== question.uid
                                    ),
                                  };
                                }
                                return r;
                              })
                            )
                          }
                          variant="outline"
                          className="bg-transparent border-neutral-700 hover:bg-red-500/10 hover:border-red-500/30 text-red-400 w-10 h-10 p-0"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}

                  {/* Add Question Button */}
                  <Button
                    onClick={() =>
                      setRounds(
                        rounds.map((r) => {
                          if (r.uid === round.uid) {
                            const newQuestion: Question = {
                              uid: Date.now().toLocaleString(),
                              question: "",
                              answer: "",
                            };
                            return {
                              ...r,
                              questions: [...r.questions, newQuestion],
                            };
                          }
                          return r;
                        })
                      )
                    }
                    variant="outline"
                    className="w-full bg-transparent border-neutral-800 hover:bg-neutral-800 text-neutral-400 gap-2"
                  >
                    <Plus className="size-4" />
                    Add Question
                  </Button>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="bg-transparent border-neutral-800 text-neutral-400 hover:bg-neutral-900 hover:text-neutral-300"
          >
            <ArrowLeft className="h-5" />
            Back to homepage
          </Button>
          <Button
            onClick={onSave}
            disabled={loadingSave}
            className="bg-white hover:bg-neutral-100 text-neutral-950 w-32"
          >
            {loadingSave ? (
              <div className="h-3">
                <Loader />
              </div>
            ) : (
              "Save Quiz"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
