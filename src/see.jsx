import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { Wordmark } from "@/components/wordmark";
import "./index.css";

function See() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-10 px-6 text-center">
      <Wordmark tone="gold" className="w-40" />
      <p className="max-w-2xl text-3xl leading-snug font-medium tracking-tight text-foreground sm:text-5xl">
        mala unblock tine instagram mahinya bhara purvi
      </p>
    </main>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <See />
  </StrictMode>,
);
