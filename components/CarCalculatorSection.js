import { libreCaslon } from "@/lib/fonts";
import VehicleIdentityForm from "./VehicleIdentityForm";

export default function CarCalculatorSection({ redirectTo }) {
  return (
    <section className="w-full py-4">
      <div className="px-4 lg:px-12 2xl:px-24">
        <div className="rounded-xl overflow-hidden flex flex-col lg:flex-row min-h-[480px] bg-[var(--color-brand)]">

          {/* Left — title (1/3) */}
          <div className="hidden lg:flex lg:w-[40%] px-8 py-10 lg:px-14 lg:py-14 items-start">
            <h1 className={`text-[8vw] sm:text-[38px] lg:text-[46px] leading-[1.1] text-white ${libreCaslon.className}`}>
              Recevez votre devis d&apos;assurance <em className={`italic ${libreCaslon.className}`}>gratuitement.</em>
            </h1>
          </div>

          {/* Right — content (2/3) */}
          <div className="lg:w-[60%] px-8 py-10 lg:px-14 lg:py-14 flex flex-col gap-6">

            <div className="inline-flex items-start bg-white/10 border border-white/20 rounded-xl px-5 py-4 max-w-lg">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-white">0 frais. 0 commission.</p>
                <p className="text-sm text-white/80 leading-snug">
                  Votre devis assurance au même prix que chez l&apos;assureur, tout simplement.
                </p>
              </div>
            </div>

            <VehicleIdentityForm redirectTo={redirectTo} />

          </div>
        </div>
      </div>
    </section>
  );
}
