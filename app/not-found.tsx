import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-col gap-[24px] w-full max-w-[600px] mx-auto p-[24px] mt-[40px] items-center text-center">
      <h1 className="text-3xl">404 – Page Not Found</h1>
      <p className="font-light opacity-70">
        We couldn’t find what you were looking for. It might’ve been removed,
        renamed, or never existed. Don’t worry, you can always start fresh from
        the homepage.
      </p>
      <Link href="/">
        <button className="py-2 px-4 bg-teal-400 text-slate-700 rounded-md cursor-pointer">
          Back to Home
        </button>
      </Link>
    </main>
  );
}
