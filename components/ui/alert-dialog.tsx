import { Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "./button";

interface AlertDialogProps {
  onClose: () => void;
  proceed: () => void;
  isOpen: boolean;
}

export function AlertDialog({ onClose, proceed, isOpen }: AlertDialogProps) {
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
              <div className="relative p-3 border-b border-neutral-800">
                <div className="flex items-center justify-end">
                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="bg-transparent border-neutral-800 hover:bg-neutral-800 text-neutral-400 w-10 h-10 p-0"
                  >
                    <X className="size-5" />
                  </Button>
                </div>

                {/* Decorative gradient */}
                {/* <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-blue-500 via-violet-500 to-pink-500" /> */}
              </div>
              <div className="px-6 py-8">Are you sure you want to delete?</div>
              <motion.div
                className={`transition-all p-4 border-t border-neutral-800 bg-neutral-950/50
                      flex flex-row gap-2 items-center justify-end`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="bg-transparent border-neutral-800 text-neutral-400 hover:bg-neutral-900 hover:text-neutral-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={proceed}
                  className="bg-white text-rose-800 hover:bg-neutral-100 "
                >
                  <Trash2 className="h-4" />
                  Delete
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
