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

function Row({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:gap-4">
      <span className="shrink-0 font-medium text-[#131212] sm:w-56">{label}</span>
      <span>{value}</span>
    </div>
  );
}

export default function MentionsLegales() {
  return (
    <>
      <Head>
        <title>Mentions légales — New World Courtage</title>
        <meta name="description" content="Mentions légales de New World Courtage, courtier en assurance immatriculé à l'ORIAS." />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://www.newworldcourtage.com/mentions-legales/" />
      </Head>

      <main className="min-h-screen bg-white">
        <div className="max-w-5xl mx-auto">

        {/* Hero */}
        <div className="bg-[var(--color-brand)] py-24 px-6 sm:px-10">
          <div className="max-w-4xl mx-auto flex flex-col gap-3">
            <p className="text-sm text-white/80">Dernière mise à jour : {LAST_UPDATED}</p>
            <h1 className="text-2xl sm:text-4xl font-bold text-white leading-tight">
              Mentions légales
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-6 sm:px-10 py-14 flex flex-col gap-12">

          <Section id="editeur" title="1. Éditeur du site">
            <div className="flex flex-col gap-2.5">
              <Row label="Raison sociale" value="New World Courtage" />
              <Row label="Forme juridique" value="Société par actions simplifiée (SAS)" />
              <Row label="Capital social" value="1 000 €" />
              <Row label="SIREN" value="989 448 329" />
              <Row label="SIRET" value="989 448 329 00015" />
              <Row label="Code NAF / APE" value="6622Z — Activités des agents et courtiers d'assurances" />
              <Row label="RCS" value="Nice" />
              <Row label="Première immatriculation" value="24 juillet 2019" />
<Row label="Siège social" value="Immeuble Nice Premier A, C/o Arenas Partners, 455 Promenade des Anglais, 06200 Nice, France" />
              <Row label="Téléphone" value="07 45 89 18 65" />
              <Row label="Email" value={<a href="mailto:contact@newworldcourtage.com" className="text-[var(--color-brand)] hover:underline">contact@newworldcourtage.com</a>} />
            </div>
          </Section>

          <Section id="directeur" title="2. Directeur de la publication">
            <p>
              Le directeur de la publication est <strong className="text-[#131212]">Younes Oulachguer</strong>, en qualité de Président de New World Courtage SAS.
            </p>
          </Section>

          <Section id="hebergement" title="3. Hébergement">
            <div className="flex flex-col gap-2.5">
              <Row label="Hébergeur" value="Hostinger International Ltd" />
              <Row label="Adresse" value="61 Lordou Vironos Street, 6023 Larnaca, Chypre" />
              <Row label="Site web" value={<a href="https://www.hostinger.fr" target="_blank" rel="noopener noreferrer" className="text-[var(--color-brand)] hover:underline">www.hostinger.fr</a>} />
            </div>
          </Section>

          <Section id="activite" title="4. Activité réglementée">
            <p>
              New World Courtage SAS exerce l'activité de courtier en assurance, activité réglementée soumise aux dispositions du code des assurances.
            </p>
            <div className="flex flex-col gap-2.5">
              <Row label="Immatriculation ORIAS" value={<><strong className="text-[#131212]">25006506</strong> — vérifiable sur <a href="https://www.orias.fr" target="_blank" rel="noopener noreferrer" className="text-[var(--color-brand)] hover:underline">orias.fr</a></>} />
              <Row label="Catégorie" value="Courtier d'assurance et de réassurance (COA)" />
              <Row label="Date d'immatriculation ORIAS" value="29 août 2025" />
              <Row label="Autorité de contrôle" value={<>ACPR — Autorité de Contrôle Prudentiel et de Résolution, 4 place de Budapest, CS 92459, 75436 Paris Cedex 09 — <a href="https://www.acpr.banque-france.fr" target="_blank" rel="noopener noreferrer" className="text-[var(--color-brand)] hover:underline">acpr.banque-france.fr</a></>} />
            </div>
          </Section>

          <Section id="propriete" title="5. Propriété intellectuelle">
            <p>
              L'ensemble du contenu de ce site (textes, images, graphismes, logo, icônes, sons, logiciels…) est la propriété exclusive de New World Courtage SAS ou de ses partenaires, et est protégé par les lois françaises et internationales relatives à la propriété intellectuelle.
            </p>
            <p>
              Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans l'autorisation écrite préalable de New World Courtage SAS.
            </p>
          </Section>

          <Section id="responsabilite" title="6. Limitation de responsabilité">
            <p>
              New World Courtage SAS s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site. Toutefois, elle ne peut garantir l'exhaustivité ni l'absence d'erreur des informations présentes, et se réserve le droit de les corriger à tout moment sans préavis.
            </p>
            <p>
              Les informations présentes sur ce site ont un caractère informatif général et ne constituent pas un conseil en assurance personnalisé. New World Courtage SAS ne saurait être tenue responsable des décisions prises par les utilisateurs sur la base de ces informations.
            </p>
            <p>
              Ce site peut contenir des liens hypertextes vers des sites tiers. New World Courtage SAS n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.
            </p>
          </Section>

          <Section id="mediateur" title="7. Médiation de l'assurance">
            <p>
              Conformément aux articles L.612-1 et suivants du code de la consommation, en cas de litige non résolu avec New World Courtage SAS, vous pouvez saisir gratuitement le médiateur de l'assurance :
            </p>
            <div className="flex flex-col gap-2.5">
              <Row label="Médiateur désigné" value="La Médiation de l'Assurance" />
              <Row label="Adresse" value="TSA 50110 - 75441 Paris Cedex 09" />
              <Row label="Site web" value={<a href="https://www.mediation-assurance.org" target="_blank" rel="noopener noreferrer" className="text-[var(--color-brand)] hover:underline">www.mediation-assurance.org</a>} />
              <Row label="Email" value={<a href="mailto:le.mediateur@mediation-assurance.org" className="text-[var(--color-brand)] hover:underline">le.mediateur@mediation-assurance.org</a>} />
            </div>
            <p className="text-xs text-gray-400">
              La saisine du médiateur n'est possible qu'après avoir préalablement tenté de résoudre le litige directement avec nos services à l'adresse <a href="mailto:contact@newworldcourtage.com" className="text-[var(--color-brand)] hover:underline">contact@newworldcourtage.com</a>.
            </p>
          </Section>

          <Section id="donnees" title="8. Données personnelles">
            <p>
              La collecte et le traitement de vos données personnelles sont décrits dans notre{" "}
              <Link href="/confidentialite/" className="text-[var(--color-brand)] hover:underline">
                Politique de confidentialité
              </Link>.
            </p>
          </Section>

          <Section id="droit" title="9. Droit applicable">
            <p>
              Les présentes mentions légales sont soumises au droit français. En cas de litige, et à défaut de résolution amiable, les tribunaux compétents du ressort du siège social de New World Courtage SAS seront seuls compétents.
            </p>
          </Section>

        </div>
        </div>
        <ReadyCta />
      </main>
    </>
  );
}
