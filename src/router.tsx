import { createRouter } from "@tanstack/react-router";
import { homeRoute } from "./routes/homeRoute";
import { rootRoute } from "./routes/rootRoute";
import { signInRoute } from "./routes/signInRoute";
import { signUpRoute } from "./routes/signUpRoute";

const routeTree = rootRoute.addChildren([homeRoute, signInRoute, signUpRoute]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

