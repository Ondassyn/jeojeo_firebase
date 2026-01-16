import { motion, AnimatePresence } from "motion/react";
import { X, Trophy, Medal, Award } from "lucide-react";
import { Button } from "./ui/button";
import { Player } from "@/lib/types/player";

interface PlayersState {
  [key: string]: Player;
}
interface LeaderboardProps {
  players: PlayersState;
  isOpen: boolean;
  onClose: () => void;
}

export function Leaderboard({ players, isOpen, onClose }: LeaderboardProps) {
  const playersArray = Object.values(players);
  const sortedPlayers = playersArray.sort((a, b) => b.score - a.score);
  // const sortedTeams = [...players].sort((a, b) => b.score - a.score);

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 0:
        return <Trophy className="size-6 text-yellow-400" />;
      case 1:
        return <Medal className="size-6 text-neutral-400" />;
      case 2:
        return <Award className="size-6 text-amber-600" />;
      default:
        return null;
    }
  };

  const getPositionStyles = (position: number) => {
    switch (position) {
      case 0:
        return "bg-linear-to-br from-yellow-500/10 to-amber-500/10 border-yellow-500/20";
      case 1:
        return "bg-linear-to-br from-neutral-400/10 to-neutral-500/10 border-neutral-400/20";
      case 2:
        return "bg-linear-to-br from-amber-600/10 to-orange-600/10 border-amber-600/20";
      default:
        return "bg-neutral-900 border-neutral-800";
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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl"
            >
              {/* Header */}
              <div className="relative p-8 pb-6 border-b border-neutral-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl tracking-tight text-white mb-1">
                      Leaderboard
                    </h2>
                    <p className="text-neutral-400">Current standings</p>
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
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                <div className="space-y-3">
                  {sortedPlayers.map((team, index) => (
                    <motion.div
                      key={team.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * index }}
                      className={`p-5 border rounded-xl transition-all ${getPositionStyles(
                        index
                      )}`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Position */}
                        <div className="flex items-center justify-center w-12 h-12 shrink-0">
                          {index < 3 ? (
                            getPositionIcon(index)
                          ) : (
                            <span className="text-2xl text-neutral-600">
                              {index + 1}
                            </span>
                          )}
                        </div>

                        {/* Team Color */}
                        <div
                          className="w-1 h-12 rounded-full shrink-0"
                          style={{ backgroundColor: team.color }}
                        />

                        {/* Team Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg text-white truncate mb-1">
                            {team.name}
                          </h3>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-neutral-400">
                              Rank #{index + 1}
                            </span>
                          </div>
                        </div>

                        {/* Score */}
                        <div className="text-right shrink-0">
                          <div className="text-2xl text-white tabular-nums">
                            {team.score}
                          </div>
                          <div className="text-sm text-neutral-500">points</div>
                        </div>
                      </div>

                      {/* Score bar */}
                      {index === 0 && (
                        <div className="mt-4 pt-4 border-t border-neutral-800/50">
                          <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-linear-to-r from-yellow-400 to-amber-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: "100%" }}
                              transition={{ delay: 0.3, duration: 0.8 }}
                            />
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 pt-4 border-t border-neutral-800 bg-neutral-950/50">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500">
                    {Object.keys(players).length} teams competing
                  </span>
                  <Button
                    onClick={onClose}
                    className="bg-white hover:bg-neutral-100 text-neutral-950"
                  >
                    Back to Quiz
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
