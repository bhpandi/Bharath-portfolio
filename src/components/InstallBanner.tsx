"use client";

import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed (standalone mode)
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in window.navigator && (window.navigator as { standalone?: boolean }).standalone === true);
    setIsStandalone(standalone);

    // iOS detection
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    setIsIos(ios);

    // Android/Desktop install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // Check if user previously dismissed
    setDismissed(!!localStorage.getItem("pwa-banner-dismissed"));

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem("pwa-banner-dismissed", "1");
  };

  // Don't show if already installed, dismissed, or no prompt
  if (isStandalone || dismissed) return null;
  if (!deferredPrompt && !isIos) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-50 animate-in slide-in-from-bottom-4 duration-500">
      <div className="glass-card rounded-2xl p-4 border border-blue-500/20 shadow-2xl shadow-black/40">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
            <Download size={20} className="text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm leading-snug">
              Add to Home Screen
            </p>
            <p className="text-slate-400 text-xs mt-0.5 leading-snug">
              {isIos
                ? "Tap the share icon, then \"Add to Home Screen\""
                : "Install this portfolio as an app for quick access"}
            </p>

            {!isIos && (
              <button
                onClick={handleInstall}
                className="mt-2.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold hover:from-blue-500 hover:to-purple-500 transition-all"
              >
                Install App
              </button>
            )}
          </div>

          <button
            onClick={handleDismiss}
            className="text-slate-600 hover:text-slate-300 transition-colors flex-shrink-0 p-1"
            aria-label="Dismiss"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
