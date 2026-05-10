import { AuthShell } from "@/features/auth/components/AuthShell";
import { SignupForm } from "@/features/auth/components/SignupForm";

export default function SignupPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Generate your first interview prep report in minutes."
      footer={{
        prompt: "Already have an account?",
        href: "/login",
        cta: "Sign in",
      }}
    >
      <SignupForm />
    </AuthShell>
  );
}
