import { AuthShell } from "@/features/auth/components/AuthShell";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue prepping for your next interview."
      footer={{
        prompt: "Don't have an account?",
        href: "/signup",
        cta: "Create one",
      }}
    >
      <LoginForm />
    </AuthShell>
  );
}
