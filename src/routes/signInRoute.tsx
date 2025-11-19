import { SignIn } from "@clerk/clerk-react";
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./rootRoute";

const SignInPage = () => (
  <section className="flex min-h-screen items-center justify-center px-4 py-12">
    <SignIn routing="path" path="/sign-in" />
  </section>
);

export const signInRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sign-in",
  component: SignInPage,
});
