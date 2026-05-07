'use client';

import { useState } from 'react';

import { createPortal } from 'react-dom';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function IntegrityModal({ open, onClose, onConfirm }: Props) {
  const [pledged, setPledged] = useState(false);

  if (!open) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-200 flex items-center justify-center bg-black/75 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-w-[65%] w-full mx-4 rounded-3xl overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.8)]"
        style={{
          background: 'linear-gradient(145deg, #0f1c33 0%, #172240 100%)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderTop: '1px solid rgba(255,255,255,0.22)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top accent line */}
        <div className="h-0.5 w-full bg-linear-to-r from-primary via-primary/60 to-transparent" />

        <div className="p-8 md:p-10">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-[0_0_30px_rgba(106,215,222,0.12)]">
              <span
                className="material-symbols-outlined text-primary text-4xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                menu_book
              </span>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white text-center mb-2">Play with Integrity</h2>
          <p className="text-primary/60 text-center text-sm font-medium mb-6 tracking-widest">
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </p>

          <p className="text-on-surface-variant text-center leading-relaxed mb-8">
            This is a test of what lives in your heart. Answer from memory only — do not open the
            Quran, consult a translation, or use any external aid. Let your score reflect your true
            connection with the Book of Allah.
          </p>

          {/* Pledge checkbox */}
          <label className="flex items-start gap-3 cursor-pointer mb-8 group select-none">
            <div className="relative mt-0.5 shrink-0">
              <input
                type="checkbox"
                className="sr-only"
                checked={pledged}
                onChange={(e) => setPledged(e.target.checked)}
              />
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                  pledged
                    ? 'bg-primary border-primary shadow-[0_0_8px_rgba(106,215,222,0.4)]'
                    : 'border-outline-variant group-hover:border-primary/50'
                }`}
              >
                {pledged && (
                  <span
                    className="material-symbols-outlined text-on-primary-container"
                    style={{ fontSize: 14, fontVariationSettings: "'wght' 700" }}
                  >
                    check
                  </span>
                )}
              </div>
            </div>
            <span className="text-sm text-on-surface-variant group-hover:text-white transition-colors leading-relaxed">
              I commit to answering from memory only, without peeking at the Quran or any other
              resource.
            </span>
          </label>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-outline-variant text-on-surface-variant hover:border-outline hover:text-white transition-all duration-200 font-medium text-sm"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={!pledged}
              className="flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-300 bg-primary text-on-primary-container disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_0_24px_rgba(106,215,222,0.35)] hover:scale-[1.02] active:scale-100"
            >
              Begin Game
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
