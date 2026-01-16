"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { ArrowRight, Spade } from "lucide-react";
import { Input } from "./ui/input";
import { useAuth } from "@/lib/providers/AuthContext";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { Game } from "@/lib/types/game";
import { firestoreDB, realtimeDB } from "@/lib/firebase";
import { GamesModal } from "./GamesModal";
import Loader from "./ui/loader";
import { toast } from "react-toastify";
import { ref, set } from "firebase/database";
import { useRouter } from "next/navigation";
import { Player } from "@/lib/types/player";
import { getRandomColor } from "@/lib/utils/getRandomColor";

const JoinPage = () => {
  const router = useRouter();
  const { signInWithGoogle, user, logout, loading } = useAuth();
  const [gameId, setGameId] = useState("");
  const [name, setName] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [loadingGames, setLoadingGames] = useState(false);
  const [showGames, setShowGames] = useState(false);
  const [toEdit, setToEdit] = useState(false);

  const onJoin = () => {
    if (!name) {
      toast.error("Your name cannot be empty!");
      return;
    }

    if (!gameId) {
      toast.error("Game ID cannot be empty!");
      return;
    }

    const playerData: Player = {
      name: name,
      score: 0,
      answer: "",
      isCorrect: null,
      color: getRandomColor(),
    };

    set(
      ref(realtimeDB, `sessions/${gameId.toUpperCase()}/players/${name}`),
      playerData
    )
      .then(() => {
        router.push(`/session/${gameId.toUpperCase()}?username=${name}`);
      })
      .catch((e) => {
        toast.error("Failed: " + e);
      });
  };

  const onHost = () => {
    setShowGames(true);
    setToEdit(false);
    if (!games.length) handleFetch();
  };

  const onEditGames = () => {
    setShowGames(true);
    setToEdit(true);
    if (!games.length) handleFetch();
  };

  const handleFetch = async () => {
    setLoadingGames(true);
    try {
      const q = query(
        collection(firestoreDB, "games"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);

      // 2. Map through the documents
      const items: Game[] = querySnapshot.docs.map(
        (doc) =>
          ({
            uid: doc.id,
            ...doc.data(),
          } as Game)
      );

      setGames(items);
    } catch (error) {
      console.error("Error fetching documents: ", error);
    } finally {
      setLoadingGames(false);
    }
  };

  const handleCloseModal = () => {
    setShowGames(false);
  };

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center">
      {/* Subtle gradient orbs */}
      <div className="absolute top-0 right-0 w-[500] h-[500] bg-blue-500/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[600] h-[600] bg-violet-500/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/4" />

      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]" />

      <div className="relative w-16 h-16 mb-1">
        <img src="/JJ.png" alt="Logo" className="w-full h-auto object-cover" />
      </div>
      <div className="text-3xl font-bold mb-6">JeoJeo</div>
      <div className="relative flex flex-col lg:flex-row items-center gap-4 w-full justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="p-4 flex flex-col gap-4 items-center w-full lg:w-64"
        >
          <p className="text-neutral-400">Join an already hosted game</p>

          <div className="relative w-full">
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setFocusedField("name")}
              onBlur={() => setFocusedField(null)}
              className="h-12 bg-neutral-900/50 border-neutral-800 text-white placeholder:text-neutral-600 focus:bg-neutral-900 focus:border-neutral-700 transition-all duration-200"
              required
            />
            <motion.div
              className="absolute inset-0 rounded-lg pointer-events-none z-10"
              initial={false}
              animate={{
                boxShadow:
                  focusedField === "name"
                    ? "0 0 0 2px rgba(139, 92, 246, 0.3)"
                    : "0 0 0 0px rgba(139, 92, 246, 0)",
              }}
              transition={{ duration: 0.2 }}
            />
          </div>

          <div className="relative w-full">
            <Input
              id="gameId"
              type="text"
              placeholder="Enter game ID"
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
              onFocus={() => setFocusedField("gameId")}
              onBlur={() => setFocusedField(null)}
              className="h-12 bg-neutral-900/50 border-neutral-800 text-white placeholder:text-neutral-600 focus:bg-neutral-900 focus:border-neutral-700 transition-all duration-200"
              required
            />
            <motion.div
              className="absolute inset-0 rounded-lg pointer-events-none"
              initial={false}
              animate={{
                boxShadow:
                  focusedField === "gameId"
                    ? "0 0 0 1px rgba(139, 92, 246, 0.3)"
                    : "0 0 0 0px rgba(139, 92, 246, 0)",
              }}
              transition={{ duration: 0.2 }}
            />
          </div>
          <Button
            type="submit"
            onClick={onJoin}
            className="w-full h-12 bg-white hover:bg-neutral-100 text-neutral-950 group relative overflow-hidden transition-colors duration-200"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Join
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform duration-200" />
            </span>
          </Button>
        </motion.div>

        <div className="h-[.2] lg:h-24 w-32 lg:w-[.1] bg-slate-400"></div>

        {loading ? (
          <div className="p-4 flex flex-col gap-4 items-center w-full lg:w-64 justify-center h-full">
            <div className="w-8 h-8">
              <Loader />
            </div>
          </div>
        ) : user ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="p-4 flex flex-col gap-4 items-center w-full lg:w-64 justify-between h-full"
          >
            <p className="text-neutral-400">Host a game</p>

            <Button
              type="submit"
              onClick={onHost}
              className="w-full h-12 bg-white hover:bg-neutral-100 text-neutral-950 group relative overflow-hidden transition-colors duration-200"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Host
                <Spade className="size-4 group-hover:translate-x-1 transition-transform duration-200" />
              </span>
            </Button>
            <div className="text-center text-sm">
              You are signed as{" "}
              <span className="text-blue-400">{user.email}</span>
            </div>
            <div className="flex flex-row gap-2">
              <div
                onClick={onEditGames}
                className="border rounded-lg px-4 py-1 border-slate-400 text-sm cursor-pointer hover:bg-neutral-900"
              >
                Edit my games
              </div>
              <div
                onClick={logout}
                className="text-rose-700 border rounded-lg px-4 py-1 border-slate-400 text-sm cursor-pointer hover:bg-neutral-900"
              >
                Sign out
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="p-4 flex flex-col gap-4 items-center w-full lg:w-64 justify-between h-full"
          >
            <p className="text-neutral-400 text-center">
              To host a game you need to login to your account
            </p>

            <Button
              type="button"
              variant="outline"
              onClick={signInWithGoogle}
              className="w-full h-11 bg-transparent border-neutral-800 text-neutral-400 hover:bg-neutral-900 hover:text-neutral-300 hover:border-neutral-700 transition-all duration-200"
            >
              <svg className="size-5 mr-2" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>
            <div></div>
          </motion.div>
        )}
      </div>

      <GamesModal
        games={games}
        onClose={handleCloseModal}
        loading={loadingGames}
        toEdit={toEdit}
        handleFetch={handleFetch}
        isOpen={showGames}
      />
    </div>
  );
};

export default JoinPage;
