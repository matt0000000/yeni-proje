import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <div className="text-6xl mb-4">⚽</div>
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Page Not Found</h1>
      <p className="text-slate-400 mb-8">The player, club, or league you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/" className="bg-brand-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-brand-700 transition-colors">
        Back to Home
      </Link>
    </div>
  );
}
