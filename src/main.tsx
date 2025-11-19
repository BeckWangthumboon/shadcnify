import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/plus-jakarta-sans/400.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/600.css";
import "@fontsource/work-sans/400.css";
import "@fontsource/work-sans/600.css";
import "@fontsource/nunito/400.css";
import "@fontsource/nunito/600.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/600.css";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/600.css";
import "@fontsource/source-sans-pro/400.css";
import "@fontsource/source-sans-pro/600.css";
import "@fontsource/mulish/400.css";
import "@fontsource/mulish/600.css";
import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/lora/400.css";
import "@fontsource/lora/600.css";
import "@fontsource/libre-baskerville/400.css";
import "@fontsource/bitter/400.css";
import "@fontsource/crimson-text/400.css";
import "@fontsource/pt-serif/400.css";
import "@fontsource/source-serif-4/400.css";
import "@fontsource/source-serif-4/600.css";
import "@fontsource/spectral/400.css";
import "@fontsource/playfair-display/500.css";
import "@fontsource/merriweather/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/eb-garamond/400.css";
import "@fontsource/dm-serif-display/400.css";
import "@fontsource/vollkorn/400.css";
import "@fontsource/literata/400.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/fira-code/400.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/space-mono/400.css";
import "@fontsource/source-code-pro/400.css";
import "@fontsource/inconsolata/400.css";
import "@fontsource/courier-prime/400.css";
import "@fontsource/ubuntu-mono/400.css";
import "@fontsource/cascadia-code/400.css";
import "@fontsource/roboto-mono/400.css";
import "@fontsource/pt-mono/400.css";
import "@fontsource/noto-mono/400.css";
import "./styles/general-sans.css";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "@/providers/themeProvider";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  </StrictMode>,
);
