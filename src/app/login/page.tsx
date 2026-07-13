import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";
import { LoginForm } from "@/components/auth/LoginForm";
import { Alert } from "@/components/ui";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to view and create your personalization projects."
      footer={
        <>
          Don&rsquo;t have an account?{" "}
          <Link href="/register" className="font-medium text-primary">
            Sign up
          </Link>
        </>
      }
    >
      {error === "confirmation_failed" && (
        <div className="mb-4">
          <Alert variant="error">
            That confirmation link is invalid or expired. Please try
            registering again.
          </Alert>
        </div>
      )}
      <LoginForm />
    </AuthCard>
  );
}
