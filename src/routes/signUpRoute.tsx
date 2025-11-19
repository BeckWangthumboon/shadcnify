import { SignUp } from "@clerk/clerk-react";
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./rootRoute";

const SignUpPage = () => (
  <section className="flex min-h-screen items-center justify-center px-4 py-12">
    <SignUp routing="path" path="/sign-up" />
  </section>
);

export const signUpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sign-up",
  component: SignUpPage,
});
