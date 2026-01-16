import { motion, AnimatePresence } from "motion/react";
import { X, Trophy, Medal, Award, Trash2, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Game } from "@/lib/types/game";
import { useAuth } from "@/lib/providers/AuthContext";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { firestoreDB, realtimeDB } from "@/lib/firebase";
import { Input } from "./ui/input";
import Loader from "./ui/loader";
import { AlertDialog } from "./ui/alert-dialog";
import { useRouter } from "next/navigation";
import random from "random-string-generator";
import { ref, set } from "firebase/database";

interface GamesModalProps {
  games: Game[];
  onClose: () => void;
  loading: boolean;
  toEdit: boolean;
  handleFetch: () => {};
  isOpen: boolean;
}

export function GamesModal({
  games,
  onClose,
  loading,
  toEdit,
  handleFetch,
  isOpen,
}: GamesModalProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [gameTitle, setGameTitle] = useState("");
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [deleteUid, setDeleteUid] = useState("");

  const onAdd = async () => {
    if (!gameTitle) {
      toast.error("Game title cannot be empty!");
      return;
    }
    const docRef = await addDoc(collection(firestoreDB, "games"), {
      title: gameTitle,
      author: user?.uid,
      createdAt: Timestamp.fromMillis(Date.now()),
      rounds: [],
    });

    handleFetch();

    setGameTitle("");
  };

  const deleteGame = async () => {
    await deleteDoc(doc(firestoreDB, "games", deleteUid));

    handleFetch();

    setDeleteUid("");
    setShowAlertDialog(false);
  };

  const closeAlertDialog = () => {
    setDeleteUid("");
    setShowAlertDialog(false);
  };

  const onSelect = (gameUid: string) => {
    if (toEdit) {
      router.push(`/game/edit/${gameUid}`);
    } else {
      const generatedId = random(4, "upper");

      const sessionData = {
        uid: generatedId,
        question: "",
        questionImage: "",
        answer: "",
        answerImage: "",
        timeForQuestion: 30,
        roundTitle: "",
        players: [],
      };

      set(ref(realtimeDB, `sessions/${generatedId}`), sessionData)
        .then(() => {
          router.push(`/game/play/${gameUid}?sessionId=${generatedId}`);
        })
        .catch((e) => {
          toast.error("Failed: " + e);
        });
    }
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-10"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-20 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl"
            >
              {/* Header */}
              <div className="relative p-6 pb-6 border-b border-neutral-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl tracking-tight text-white mb-1">
                      Games
                    </h2>
                    {toEdit ? (
                      <p className="text-neutral-400">Select one to edit</p>
                    ) : (
                      <p className="text-neutral-400">Select one to play</p>
                    )}
                  </div>
                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="bg-transparent border-neutral-800 hover:bg-neutral-800 text-neutral-400 w-10 h-10 p-0"
                  >
                    <X className="size-5" />
                  </Button>
                </div>

                {/* Decorative gradient */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-blue-500 via-violet-500 to-pink-500" />
              </div>

              {/* Teams List */}
              {loading ? (
                <div className="w-full h-full flex justify-center py-12">
                  <div className="w-6 h-6">
                    <Loader />
                  </div>
                </div>
              ) : (
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                  <div className="space-y-3">
                    {games.map((game, index) => (
                      <motion.div
                        key={game.uid}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * index }}
                        className={`p-5 border rounded-xl transition-all bg-neutral-900 border-neutral-800
                          hover:bg-neutral-800 group`}
                      >
                        <div
                          className="flex items-center gap-4"
                          onClick={() => onSelect(game.uid)}
                        >
                          {/* Team Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg text-white truncate mb-1">
                              {game.title}
                            </h3>
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-neutral-400">
                                {game.createdAt.toDate().toLocaleString()}
                              </span>
                            </div>
                          </div>

                          {toEdit && (
                            <div className="overflow-hidden flex items-center">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowAlertDialog(true);
                                  setDeleteUid(game.uid);
                                }}
                                className="
                                  px-3 py-1 text-rose-600 hover:text-rose-400 rounded-md
                                  transition-all duration-300 ease-out
                                  max-w-[100] opacity-100 translate-x-0 pointer-events-auto
                                  lg:max-w-0 lg:opacity-0 lg:translate-x-4 lg:pointer-events-none
                                  lg:group-hover:max-w-[100] lg:group-hover:opacity-100 lg:group-hover:translate-x-0 lg:group-hover:pointer-events-auto
                                "
                              >
                                <Trash2 className="h-5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {toEdit ? (
                <motion.div
                  className={`transition-all p-6 pt-4 border-t border-neutral-800 bg-neutral-950/50
                      flex flex-row gap-8 items-center justify-between`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Input
                    id="gameTitle"
                    type="text"
                    placeholder="Enter game title..."
                    value={gameTitle}
                    onChange={(e) => setGameTitle(e.target.value)}
                    className="h-12 bg-neutral-900/50 border-neutral-800 text-white placeholder:text-neutral-600 focus:bg-neutral-900 focus:border-neutral-700 transition-all duration-200"
                    required
                  />
                  <Button
                    onClick={onAdd}
                    className="bg-white hover:bg-neutral-100 text-neutral-950"
                  >
                    <Plus className="h-5" />
                    Add new game
                  </Button>
                </motion.div>
              ) : (
                <div className="p-6 pt-4 border-t border-neutral-800 bg-neutral-950/50">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">
                      {games.length} teams competing
                    </span>
                    <Button
                      onClick={onClose}
                      className="bg-white hover:bg-neutral-100 text-neutral-950"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>

            <AlertDialog
              proceed={deleteGame}
              onClose={closeAlertDialog}
              isOpen={showAlertDialog}
            />
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
