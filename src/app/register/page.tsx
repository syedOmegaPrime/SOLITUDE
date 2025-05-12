import RegisterForm from '@/components/auth/RegisterForm';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-12">
      <div className="w-full max-w-md p-8 space-y-8 bg-card shadow-xl rounded-lg border">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Create an Account</h1>
          <p className="mt-2 text-muted-foreground">
            Join our community and start exploring or sharing 2D assets.
          </p>
        </div>
        <RegisterForm />
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}
