import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { getReferralCodeFromHash, PENDING_REFERRAL_STORAGE_KEY } from "./lib/referral-link";

try {
  const referralCode = getReferralCodeFromHash(window.location.hash);
  if (referralCode) {
    window.sessionStorage.setItem(PENDING_REFERRAL_STORAGE_KEY, referralCode);
  }
} catch {
  // Registration can still use an invite directly from the current URL.
}

document.addEventListener("contextmenu", (e) => {
  if ((e.target as HTMLElement).tagName === "IMG") {
    e.preventDefault();
  }
});

document.addEventListener("dragstart", (e) => {
  if ((e.target as HTMLElement).tagName === "IMG") {
    e.preventDefault();
  }
});

createRoot(document.getElementById("root")!).render(<App />);
