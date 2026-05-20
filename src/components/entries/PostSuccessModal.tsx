"use client";

import { motion } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";

export function PostSuccessModal({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-3 backdrop-blur-sm sm:items-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        className="w-full max-w-md rounded-[2rem] bg-white p-5 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <CheckCircle2 size={26} />
            </div>
            <div>
              <div className="text-sm font-bold uppercase tracking-wide text-slate-400">
                Success
              </div>
              <h2 className="text-2xl font-black text-slate-950">Memory posted</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <p className="mt-4 text-sm leading-6 text-slate-600">
          Your post was saved successfully. Please wait about a minute for it to
          appear in the feed — new posts can take a little time to sync.
        </p>

        <button
          onClick={onClose}
          className="mt-5 w-full rounded-2xl bg-slate-950 px-4 py-4 font-black text-white"
        >
          Go to feed
        </button>
      </motion.div>
    </div>
  );
}
