"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const links = [
  { href: "/universities", label: "Universities" },
  { href: "/resources", label: "Resources" },
  { href: "/screening", label: "Screening" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const { data: session } = useSession();
  return (
    <header className="border-b border-black/5 bg-white/60 backdrop-blur sticky top-0 z-40">
      <div className="container-max py-4 flex items-center justify-between">
        <div className="flex gap-2 justify-center items-center">
          <Image
            src="/nav.png"
            width={50}
            height={50}
            alt="Picture of the author"
          />
          <Link href="/" className="font-semibold text-2xl tracking-tight text-gray-800">
            Nirvaan
          </Link>
        </div>
        <nav className="flex items-center gap-1">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-2 rounded-lg text-sm transition ${
                  active
                    ? "bg-[#fff5ec] text-gray-900"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          {!session ? (
            <Link href="/login" className="px-3 py-2 rounded-lg text-sm transition text-gray-700 hover:bg-gray-100">Login</Link>
          ) : (
            <button onClick={() => signOut({ callbackUrl: "/" })} className="px-3 py-2 rounded-lg text-sm transition text-gray-700 hover:bg-gray-100">Sign out</button>
          )}
        </nav>
      </div>
    </header>
  );
}
