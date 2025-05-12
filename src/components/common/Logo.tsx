import Link from 'next/link';

const Logo = () => {
  return (
    <Link href="/" className="flex items-center space-x-2 group">
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary group-hover:opacity-80 transition-opacity"
        aria-label="SOLITUDE Logo"
        data-ai-hint="abstract geometric logo"
      >
        <circle cx="16" cy="16" r="14" fill="currentColor" />
        <circle cx="16" cy="16" r="15.5" stroke="hsl(var(--foreground))" strokeOpacity="0.1" />
      </svg>
      <span className="font-bold text-xl text-foreground group-hover:text-primary transition-colors">
        SOLITUDE
      </span>
    </Link>
  );
};

export default Logo;
