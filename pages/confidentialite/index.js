import Head from "next/head";
import Link from "next/link";
import ReadyCta from "@/components/ReadyCta";
import ManageCookiesButton from "@/components/ManageCookiesButton";

const LAST_UPDATED = "8 juillet 2026";

function Section({ id, title, children }) {
  return (
    <section id={id} className="flex flex-col gap-4">
      <h2 className="text-xl font-bold text-[#131212]">{title}</h2>
      <div className="flex flex-col gap-3 text-[15px] text-gray-600 leading-relaxed">
        {children}
      </div>
    </section>
  );
}

function CookieTable({ rows }) {
  return (
    <div className="mt-1">
      {/* Mobile: cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {rows.map((r, i) => (
          <div key={i} className="rounded-xl border border-gray-100 p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="font-mono text-xs font-semibold text-[#131212]">{r.name}</span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${r.category === "Analytique" ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800"}`}>
                {r.category}
              </span>
            </div>
            <p className="text-[13px] text-gray-600 leading-relaxed">{r.purpose}</p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{r.provider}</span>
              <span>·</span>
              <span>{r.duration}</span>
            </div>
          </div>
        ))}
      </div>
      {/* Desktop: table */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-[#131212] font-semibold">
            <tr>
              {["Cookie", "Fournisseur", "Catégorie", "Durée", "Finalité"].map(h => (
                <th key={h} className="px-4 py-3 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((r, i) => (
              <tr key={i} className="text-gray-600">
                <td className="px-4 py-3 font-mono text-xs text-[#131212]">{r.name}</td>
                <td className="px-4 py-3 whitespace-nowrap">{r.provider}</td>
                <td className="px-4 py-3 whitespace-nowrap">{r.category}</td>
                <td className="px-4 py-3 whitespace-nowrap">{r.duration}</td>
                <td className="px-4 py-3">{r.purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const COOKIES = [
  { name: "_ga",        provider: "Google Analytics",  category: "Analytique", duration: "2 ans",   purpose: "Identifier les visiteurs uniques et mémoriser les sessions" },
  { name: "_ga_XXXXX",  provider: "Google Analytics",  category: "Analytique", duration: "2 ans",   purpose: "Conserver l'état de session Analytics" },
  { name: "_gid",       provider: "Google Analytics",  category: "Analytique", duration: "24 h",    purpose: "Identifier les utilisateurs sur une période de 24 h" },
  { name: "_clck",      provider: "Microsoft Clarity", category: "Analytique", duration: "1 an",    purpose: "Identifier l'utilisateur unique pour les enregistrements Clarity" },
  { name: "_clsk",      provider: "Microsoft Clarity", category: "Analytique", duration: "1 jour",  purpose: "Regrouper les requêtes d'une même session" },
  { name: "CLID",       provider: "Microsoft Clarity", category: "Analytique", duration: "1 an",    purpose: "Stocker l'identifiant Clarity de l'utilisateur" },
  { name: "_fbp",       provider: "Meta",              category: "Marketing",  duration: "3 mois",  purpose: "Identifier les visiteurs et mesurer les conversions publicitaires" },
  { name: "fr",         provider: "Meta",              category: "Marketing",  duration: "3 mois",  purpose: "Diffuser et mesurer l'efficacité des publicités Facebook & Instagram" },
];

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Politique de confidentialité — New World Courtage</title>
        <meta name="description" content="Comment New World Courtage collecte, utilise et protège vos données personnelles." />
      </Head>

      <main className="min-h-screen bg-white">
        <div className="max-w-5xl mx-auto">

        {/* Hero */}
        <div className="bg-[var(--color-brand)] py-24 px-6 sm:px-10">
          <div className="max-w-4xl mx-auto flex flex-col gap-3">
            <p className="text-sm text-white/80">Dernière mise à jour : {LAST_UPDATED}</p>
            <h1 className="text-2xl sm:text-4xl font-bold text-white leading-tight">
              Politique de confidentialité
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-6 sm:px-10 py-14 flex flex-col gap-12">

          <Section id="responsable" title="1. Responsable du traitement">
            <p>
              <strong className="text-[#131212]">New World Courtage SAS</strong>, courtier en assurance indépendant immatriculé à l'ORIAS (numéro disponible sur demande).
            </p>
            <p>
              Siège social : 455 Promenade des Anglais, Immeuble Nice Premier – Arenas Partners, 06000 Nice, France.
            </p>
            <p>
              Contact : <a href="mailto:contact@newworldcourtage.com" className="text-[var(--color-brand)] underline">contact@newworldcourtage.com</a>
            </p>
          </Section>

          <Section id="donnees" title="2. Données collectées">
            <p>Nous collectons les catégories de données suivantes :</p>
            <ul className="list-disc list-inside flex flex-col gap-1.5 pl-2">
              <li><strong className="text-[#131212]">Données d'identification</strong> : nom, prénom, adresse e-mail, numéro de téléphone.</li>
              <li><strong className="text-[#131212]">Données d'assurance</strong> : informations sur votre véhicule, votre situation personnelle et vos besoins de couverture, collectées via notre calculateur de devis.</li>
              <li><strong className="text-[#131212]">Données de navigation</strong> : adresse IP, type de navigateur, pages visitées, durée des sessions — collectées via les outils d'analyse (Google Analytics, Microsoft Clarity) avec votre consentement.</li>
              <li><strong className="text-[#131212]">Données de contact</strong> : messages envoyés via nos formulaires de contact.</li>
            </ul>
          </Section>

          <Section id="finalites" title="3. Finalités et bases légales">
            {/* Mobile: stacked rows */}
            <div className="flex flex-col gap-2 md:hidden">
              {[
                ["Établir et transmettre votre devis d'assurance", "Exécution d'un contrat (art. 6.1.b)"],
                ["Améliorer nos services et analyser le trafic", "Consentement (art. 6.1.a)"],
                ["Personnaliser les publicités en ligne", "Consentement (art. 6.1.a)"],
                ["Répondre à vos demandes de contact", "Intérêt légitime (art. 6.1.f)"],
                ["Respecter nos obligations légales et réglementaires", "Obligation légale (art. 6.1.c)"],
              ].map(([f, b], i) => (
                <div key={i} className="rounded-xl border border-gray-100 p-4 flex flex-col gap-1">
                  <p className="text-[13px] text-gray-600">{f}</p>
                  <p className="text-[12px] font-medium text-[#131212]">{b}</p>
                </div>
              ))}
            </div>
            {/* Desktop: table */}
            <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-100">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-[#131212] font-semibold">
                  <tr>
                    <th className="px-4 py-3">Finalité</th>
                    <th className="px-4 py-3">Base légale (RGPD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-600">
                  {[
                    ["Établir et transmettre votre devis d'assurance", "Exécution d'un contrat (art. 6.1.b)"],
                    ["Améliorer nos services et analyser le trafic", "Consentement (art. 6.1.a)"],
                    ["Personnaliser les publicités en ligne", "Consentement (art. 6.1.a)"],
                    ["Répondre à vos demandes de contact", "Intérêt légitime (art. 6.1.f)"],
                    ["Respecter nos obligations légales et réglementaires", "Obligation légale (art. 6.1.c)"],
                  ].map(([f, b], i) => (
                    <tr key={i}>
                      <td className="px-4 py-3">{f}</td>
                      <td className="px-4 py-3 text-[#131212] font-medium">{b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section id="cookies" title="4. Cookies et traceurs">
            <p>
              Nous utilisons des cookies pour faire fonctionner notre site, analyser son usage et, avec votre accord, diffuser des publicités ciblées. Vous pouvez gérer vos préférences à tout moment.
            </p>
            <CookieTable rows={COOKIES} />
            <p className="text-sm text-gray-500">
              Les durées de conservation des cookies tiers peuvent évoluer selon les politiques de leurs éditeurs respectifs. Consultez les politiques de confidentialité de{" "}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[var(--color-brand)] underline">Google</a>,{" "}
              <a href="https://privacy.microsoft.com/fr-fr/privacystatement" target="_blank" rel="noopener noreferrer" className="text-[var(--color-brand)] underline">Microsoft</a> et{" "}
              <a href="https://www.facebook.com/privacy/policy" target="_blank" rel="noopener noreferrer" className="text-[var(--color-brand)] underline">Meta</a> pour plus d'informations.
            </p>
          </Section>

          <Section id="conservation" title="5. Durée de conservation">
            <ul className="list-disc list-inside flex flex-col gap-1.5 pl-2">
              <li>Données de devis et de contact : <strong className="text-[#131212]">3 ans</strong> à compter du dernier contact.</li>
              <li>Données clients dans le cadre d'un contrat : <strong className="text-[#131212]">5 ans</strong> après la fin du contrat (obligation légale).</li>
              <li>Préférences cookies : <strong className="text-[#131212]">13 mois</strong> (recommandation CNIL).</li>
              <li>Données de navigation anonymisées (Google Analytics) : <strong className="text-[#131212]">14 mois</strong> (paramètre par défaut).</li>
            </ul>
          </Section>

          <Section id="destinataires" title="6. Destinataires des données">
            <p>
              Vos données peuvent être transmises aux catégories de destinataires suivants, dans le strict cadre des finalités décrites :
            </p>
            <ul className="list-disc list-inside flex flex-col gap-1.5 pl-2">
              <li>Compagnies d'assurance partenaires, dans le cadre de l'établissement de votre devis.</li>
              <li>Prestataires techniques (hébergement, outils d'analyse) soumis à des obligations contractuelles de confidentialité.</li>
              <li>Autorités compétentes, sur réquisition judiciaire ou légale.</li>
            </ul>
          </Section>

          <Section id="transferts" title="7. Transferts hors Union européenne">
            <p>
              Google (Analytics) et Meta (Pixel) peuvent transférer certaines données vers leurs serveurs situés aux États-Unis. Ces transferts s'effectuent dans le cadre de clauses contractuelles types approuvées par la Commission européenne ou d'autres mécanismes de transfert conformes au RGPD.
            </p>
          </Section>

          <Section id="droits" title="8. Vos droits">
            <p>Conformément au RGPD (articles 15 à 22), vous disposez des droits suivants :</p>
            <ul className="list-disc list-inside flex flex-col gap-1.5 pl-2">
              <li><strong className="text-[#131212]">Droit d'accès</strong> : obtenir une copie de vos données.</li>
              <li><strong className="text-[#131212]">Droit de rectification</strong> : corriger des données inexactes ou incomplètes.</li>
              <li><strong className="text-[#131212]">Droit à l'effacement</strong> (« droit à l'oubli ») : demander la suppression de vos données.</li>
              <li><strong className="text-[#131212]">Droit d'opposition</strong> : vous opposer au traitement de vos données pour les finalités fondées sur l'intérêt légitime.</li>
              <li><strong className="text-[#131212]">Droit à la portabilité</strong> : recevoir vos données dans un format structuré et lisible par machine.</li>
              <li><strong className="text-[#131212]">Droit de retirer votre consentement</strong> : à tout moment, sans que cela affecte la licéité des traitements antérieurs.</li>
              <li><strong className="text-[#131212]">Droit de réclamation</strong> : introduire une réclamation auprès de la <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-[var(--color-brand)] underline">CNIL</a>.</li>
            </ul>
            <p>
              Pour exercer vos droits, contactez-nous à <a href="mailto:contact@newworldcourtage.com" className="text-[var(--color-brand)] underline">contact@newworldcourtage.com</a>. Nous répondrons dans un délai maximum d'un mois.
            </p>
          </Section>

          <Section id="modifications" title="9. Modifications de cette politique">
            <p>
              Nous nous réservons le droit de mettre à jour cette politique pour refléter les évolutions légales ou de nos pratiques. En cas de modification substantielle, nous vous en informerons par une notification visible sur notre site. La date de la dernière mise à jour est indiquée en haut de cette page.
            </p>
          </Section>

          <div className="pt-4 border-t border-gray-100">
            <ManageCookiesButton />
          </div>

        </div>
        </div>
        <ReadyCta />
      </main>
    </>
  );
}
