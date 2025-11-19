import { createRouter } from "@tanstack/react-router";
import { homeRoute } from "./routes/homeRoute";
import { rootRoute } from "./routes/rootRoute";

const routeTree = rootRoute.addChildren([homeRoute]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
