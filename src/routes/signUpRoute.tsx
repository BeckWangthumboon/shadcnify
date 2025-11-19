import { SignUp } from "@clerk/clerk-react";
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./rootRoute";

function SignUpPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-8">
      <SignUp routing="path" path="/sign-up" />
    </div>
  );
}

export const signUpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sign-up",
  component: SignUpPage,
});

