import Head from "next/head";
import Link from "next/link";
import ReadyCta from "@/components/ReadyCta";

const LAST_UPDATED = "9 juillet 2026";

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

function InfoBox({ children }) {
  return (
    <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-[14px] text-blue-900 leading-relaxed flex flex-col gap-2">
      {children}
    </div>
  );
}

export default function Accessibilite() {
  return (
    <>
      <Head>
        <title>Accessibilité & transparence — New World Courtage</title>
        <meta name="description" content="Déclaration d'accessibilité, transparence sur notre rémunération, numéro ORIAS et sécurité des données — New World Courtage." />
      </Head>

      <main className="min-h-screen bg-white">
        <div className="max-w-5xl mx-auto">

        {/* Hero */}
        <div className="bg-[var(--color-brand)] py-14 px-6 sm:px-10">
          <div className="max-w-4xl mx-auto flex flex-col gap-3">
            <p className="text-sm text-white/80">Dernière mise à jour : {LAST_UPDATED}</p>
            <h1 className="text-2xl sm:text-4xl font-bold text-white leading-tight">
              Accessibilité &amp; transparence
            </h1>
            <p className="text-base text-white/90 leading-relaxed max-w-2xl">
              Notre engagement envers tous nos utilisateurs : un site accessible, une rémunération transparente et des données sécurisées.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-6 sm:px-10 py-14 flex flex-col gap-12">

          {/* 1. Engagement accessibilité */}
          <Section id="engagement" title="1. Notre engagement d'accessibilité">
            <p>
              New World Courtage s'engage à rendre son site internet accessible au plus grand nombre, quelle que soit la technologie utilisée ou la situation de la personne. Nous prenons des mesures raisonnables pour concevoir et faire évoluer notre site conformément aux bonnes pratiques d'accessibilité numérique.
            </p>
            <p>
              Si vous ne parvenez pas à accéder à un contenu ou à utiliser une fonctionnalité en raison d'un handicap, tous nos services restent accessibles par téléphone ou par e-mail. Un conseiller vous répondra dans les meilleurs délais.
            </p>
          </Section>

          {/* 2. État de conformité */}
          <Section id="conformite" title="2. État de conformité">
            <p>
              Ce site est <strong className="text-[#131212]">partiellement conforme</strong> au Référentiel Général d'Amélioration de l'Accessibilité (RGAA 4.1). Certains contenus ou fonctionnalités peuvent présenter des lacunes en raison de contraintes techniques ou de la charge que leur correction représenterait pour une structure de notre taille.
            </p>
            <div className="rounded-xl border border-gray-100 overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-[#131212] font-semibold">
                  <tr>
                    <th className="px-4 py-3">Élément</th>
                    <th className="px-4 py-3">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-600">
                  {[
                    ["Navigation au clavier", "Conforme"],
                    ["Attributs alt sur les images", "Conforme"],
                    ["Contrastes de couleurs", "Partiellement conforme"],
                    ["Étiquetage des champs de formulaire", "En cours d'amélioration"],
                    ["Composants interactifs complexes (sélecteurs, menus)", "Partiellement conforme"],
                  ].map(([item, status], i) => (
                    <tr key={i}>
                      <td className="px-4 py-3">{item}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[12px] px-2 py-0.5 rounded-full font-medium ${
                          status === "Conforme"
                            ? "bg-green-100 text-green-800"
                            : status === "En cours d'amélioration"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-blue-100 text-blue-800"
                        }`}>
                          {status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          {/* 3. Signaler un problème */}
          <Section id="signaler" title="3. Signaler un problème d'accessibilité">
            <p>
              Si vous rencontrez une difficulté pour accéder à un contenu ou utiliser notre site, contactez-nous afin que nous puissions vous apporter une assistance ou vous proposer une alternative.
            </p>
            <InfoBox>
              <p className="font-semibold text-blue-900">Pour nous permettre de vous répondre efficacement, merci d'indiquer :</p>
              <ul className="list-disc list-inside flex flex-col gap-1 pl-1">
                <li>La nature du problème rencontré</li>
                <li>Le format dans lequel vous souhaitez recevoir l'information</li>
                <li>L'adresse de la page concernée</li>
                <li>Vos coordonnées (e-mail ou téléphone)</li>
              </ul>
            </InfoBox>
            <p>
              Contactez-nous par e-mail :{" "}
              <a href="mailto:contact@newworldcourtage.com" className="text-[var(--color-brand)] underline">
                contact@newworldcourtage.com
              </a>{" "}
              ou par téléphone au{" "}
              <a href="tel:+33745891865" className="text-[var(--color-brand)] underline">
                07 45 89 18 65
              </a>.
            </p>
          </Section>

          {/* 4. Rémunération */}
          <Section id="remuneration" title="4. Comment nous sommes rémunérés">
            <p>
              New World Courtage est un courtier en assurance indépendant. À ce titre, nous percevons une commission versée par les compagnies d'assurance pour chaque contrat souscrit par l'intermédiaire de nos services. Cette commission est intégrée dans le prix de la prime d'assurance : vous ne payez aucun frais supplémentaire en passant par nous.
            </p>
            <p>
              Notre rémunération peut varier selon le type de produit, le montant du contrat et la compagnie d'assurance concernée. Toutefois, nous ne favorisons aucun assureur pour des raisons commerciales. Notre mission est de défendre vos intérêts et de vous proposer la couverture la mieux adaptée à votre situation.
            </p>
            <p>
              Conformément à la réglementation en vigueur (DDA – Directive sur la Distribution d'Assurances), nous vous communiquerons la nature et le montant de notre rémunération avant la conclusion de tout contrat, sur simple demande.
            </p>
          </Section>

          {/* 5. Partenaires assureurs */}
          <Section id="partenaires" title="5. Nos partenaires assureurs">
            <p>
              Les produits d'assurance présentés sur ce site sont proposés par nos compagnies partenaires. La disponibilité des produits et des offres peut varier selon votre profil, votre situation personnelle et les critères de souscription propres à chaque assureur. Une demande de devis ne vaut pas acceptation de couverture.
            </p>
            <p>
              Les estimations tarifaires affichées sur notre calculateur sont fournies à titre indicatif. La prime définitive est déterminée par la compagnie d'assurance à l'issue du processus de souscription.
            </p>
          </Section>

          {/* 6. ORIAS & autorité de tutelle */}
          <Section id="orias" title="6. Immatriculation & autorité de tutelle">
            <p>
              New World Courtage SAS est immatriculée à l'ORIAS (Organisme pour le Registre des Intermédiaires en Assurance) en qualité de <strong className="text-[#131212]">Courtier en Opérations d'Assurances (COA)</strong>.
            </p>
            <div className="rounded-xl border border-gray-100 overflow-hidden">
              <table className="w-full text-sm text-left">
                <tbody className="divide-y divide-gray-100 text-gray-600">
                  {[
                    ["Numéro ORIAS", "25006506"],
                    ["Catégorie", "Courtier en Opérations d'Assurances (COA)"],
                    ["Date d'immatriculation", "29 août 2025"],
                    ["Autorité de tutelle", "ACPR – Autorité de Contrôle Prudentiel et de Résolution (Banque de France)"],
                    ["Vérification", "www.orias.fr"],
                  ].map(([label, value], i) => (
                    <tr key={i}>
                      <td className="px-4 py-3 font-semibold text-[#131212] whitespace-nowrap w-48">{label}</td>
                      <td className="px-4 py-3">
                        {label === "Vérification" ? (
                          <a href="https://www.orias.fr" target="_blank" rel="noopener noreferrer" className="text-[var(--color-brand)] underline">
                            www.orias.fr
                          </a>
                        ) : value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              Vous pouvez vérifier notre immatriculation à tout moment sur le registre public de l'ORIAS.
            </p>
          </Section>

          {/* 7. Sécurité des données */}
          <Section id="securite" title="7. Sécurité des données">
            <p>
              New World Courtage utilise des protocoles et outils de sécurité conformes aux standards du secteur pour protéger la confidentialité de vos données personnelles, tant lors de leur transmission sur internet que lors de leur stockage dans nos systèmes.
            </p>
            <p>
              Pour en savoir plus sur la manière dont nous collectons, utilisons et protégeons vos données, consultez notre{" "}
              <Link href="/confidentialite/" className="text-[var(--color-brand)] underline">
                Politique de confidentialité
              </Link>.
            </p>
          </Section>

          {/* 8. Voies de recours */}
          <Section id="recours" title="8. Voies de recours">
            <p>
              Si vous avez signalé un problème d'accessibilité et que vous n'avez pas obtenu de réponse satisfaisante dans un délai de deux mois, vous pouvez saisir le <strong className="text-[#131212]">Défenseur des droits</strong> :
            </p>
            <ul className="list-disc list-inside flex flex-col gap-1.5 pl-2">
              <li>
                En ligne :{" "}
                <a href="https://www.defenseurdesdroits.fr" target="_blank" rel="noopener noreferrer" className="text-[var(--color-brand)] underline">
                  www.defenseurdesdroits.fr
                </a>
              </li>
              <li>Par téléphone : 09 69 39 00 00 (du lundi au vendredi, de 8h00 à 20h00)</li>
              <li>Par courrier : Défenseur des droits – Libre réponse 71120 – 75342 Paris CEDEX 07</li>
            </ul>
          </Section>

        </div>
        </div>
        <ReadyCta />
      </main>
    </>
  );
}
