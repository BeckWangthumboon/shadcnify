import App from "@/App";
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./rootRoute";

export const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: App,
});

