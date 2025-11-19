import { SignIn } from "@clerk/clerk-react";
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./rootRoute";

function SignInPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-8">
      <SignIn routing="path" path="/sign-in" />
    </div>
  );
}

export const signInRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sign-in",
  component: SignInPage,
});

