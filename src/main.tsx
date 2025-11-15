import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/nunito/400.css";
import "@fontsource/nunito/600.css";
import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/source-serif-4/400.css";
import "@fontsource/source-serif-4/600.css";
import "@fontsource/spectral/400.css";
import "@fontsource/playfair-display/500.css";
import "@fontsource/merriweather/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/fira-code/400.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/space-mono/400.css";
import "@fontsource/source-code-pro/400.css";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "@/providers/themeProvider";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConvexAuthProvider client={convex}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ConvexAuthProvider>
  </StrictMode>,
);
