import CtaButton from "@/components/CtaButton";
import { libreCaslon } from "@/lib/fonts";

export default function ReadyCta() {
  return (
    <section className="w-full py-20 bg-white">
      <div className="flex flex-col items-center text-center gap-6 px-6">
        <h2
          className={`text-[28px] sm:text-[36px] lg:text-[42px] font-bold leading-tight text-[var(--color-text)] max-w-2xl`}
        >
          Prêt à trouver votre assurance ?
        </h2>
        <p className="text-[16px] text-gray-500 max-w-xl leading-relaxed">
          Trouvez l&apos;assurance qu&apos;il vous faut et économisez en
          comparant les offres des assureurs les plus fiables.
        </p>
        <CtaButton label="Obtenir des devis" className="mt-2 px-10" />
      </div>
    </section>
  );
}
