import Link from "next/link";
export default function NotFound() { return <div className="mx-auto max-w-2xl px-5 py-32 text-center"><p className="text-6xl font-semibold text-[var(--accent)]">404</p><h1 className="mt-5 text-2xl font-semibold">这页还没有被写下。</h1><Link className="focus-ring mt-6 inline-block rounded-full bg-[var(--accent)] px-4 py-2 text-sm text-white" href="/">回到首页</Link></div>; }
