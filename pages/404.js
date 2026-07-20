import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import CtaButton from "@/components/CtaButton";

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Page introuvable — New World Courtage</title>
        <meta name="robots" content="noindex" />
      </Head>

      <header className="w-full">
        <div className="flex items-center justify-center px-4 lg:px-12 h-16">
          <Link href="/" aria-label="New World Courtage — Accueil">
            <Image src="/nwc_logo.svg" alt="New World Courtage" width={120} height={33} className="h-9 w-auto" />
          </Link>
        </div>
      </header>

      <main className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="flex flex-col items-center text-center gap-4 max-w-md">
          <p className="text-6xl font-bold text-[var(--color-brand)]">404</p>
          <h1 className="text-2xl font-semibold text-[var(--color-text)]">
            Cette page n&apos;existe pas.
          </h1>
          <p className="text-base text-gray-500 leading-relaxed">
            Le lien est peut-être incorrect ou la page a été déplacée. Revenez à l&apos;accueil pour obtenir votre devis.
          </p>
          <CtaButton href="/" label="Retour à l'accueil" className="mt-2" />
        </div>
      </main>
    </>
  );
}
