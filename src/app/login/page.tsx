import LoginForm from '@/components/auth/LoginForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-12">
      <div className="w-full max-w-md p-8 space-y-8 bg-card shadow-xl rounded-lg border">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Welcome Back!</h1>
          <p className="mt-2 text-muted-foreground">
            Log in to access your account and explore the marketplace.
          </p>
        </div>
        <LoginForm />
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
