import { useEffect, useState } from "react";
import "./session-loading-screen.css";

const SESSION_LOADING_KEY = "scotgold-session-loading-shown";
const SESSION_LOADING_DURATION_MS = 1800;

function readShouldShowSessionLoading() {
  try {
    return window.sessionStorage.getItem(SESSION_LOADING_KEY) !== "shown";
  } catch {
    return true;
  }
}

export default function SessionLoadingScreen() {
  const [visible, setVisible] = useState(readShouldShowSessionLoading);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!visible) return;

    try {
      window.sessionStorage.setItem(SESSION_LOADING_KEY, "pending");
    } catch {
      // Keep the loading screen usable if browser storage is unavailable.
    }

    const startedAt = performance.now();
    let frameId = 0;

    const updateProgress = (now: number) => {
      const nextProgress = Math.min(
        100,
        Math.floor(((now - startedAt) / SESSION_LOADING_DURATION_MS) * 100),
      );
      setProgress(nextProgress);

      if (nextProgress >= 100) {
        try {
          window.sessionStorage.setItem(SESSION_LOADING_KEY, "shown");
        } catch {
          // The screen still closes normally when storage is unavailable.
        }
        setVisible(false);
        return;
      }

      frameId = window.requestAnimationFrame(updateProgress);
    };

    frameId = window.requestAnimationFrame(updateProgress);
    return () => window.cancelAnimationFrame(frameId);
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="session-loading-screen" role="status" aria-label="Chargement de Scotgold">
      <div className="session-loading-content">
        <div className="session-loading-logo-frame" aria-hidden="true">
          <div className="session-loading-logo-ring" />
          <img src="/scotgold-logo.png" alt="" className="session-loading-logo" />
        </div>
        <div className="session-loading-progress">
          <div
            className="session-loading-progress-track"
            role="progressbar"
            aria-label="Chargement"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          >
            <div
              className="session-loading-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="session-loading-percentage">{progress}%</span>
        </div>
      </div>
    </div>
  );
}
