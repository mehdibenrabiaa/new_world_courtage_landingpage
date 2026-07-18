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

export default function ConditionsGenerales() {
  return (
    <>
      <Head>
        <title>Conditions générales d'utilisation — New World Courtage</title>
        <meta name="description" content="Conditions générales d'utilisation du site newworldcourtage.com." />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://www.newworldcourtage.com/conditions-generales/" />
      </Head>

      <main className="min-h-screen bg-white">
        <div className="max-w-5xl mx-auto">

        {/* Hero */}
        <div className="bg-[var(--color-brand)] py-24 px-6 sm:px-10">
          <div className="max-w-4xl mx-auto flex flex-col gap-3">
            <p className="text-sm text-white/80">Dernière mise à jour : {LAST_UPDATED}</p>
            <h1 className="text-2xl sm:text-4xl font-bold text-white leading-tight">
              Conditions générales d'utilisation
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-6 sm:px-10 py-14 flex flex-col gap-12">

          <Section id="objet" title="1. Objet et acceptation">
            <p>
              Les présentes conditions générales d'utilisation (ci-après « CGU ») ont pour objet de définir les modalités et conditions d'accès au site <strong className="text-[#131212]">newworldcourtage.com</strong> (ci-après « le Site ») et les services qui y sont proposés par New World Courtage SAS (ci-après « New World Courtage »).
            </p>
            <p>
              L'accès au Site implique l'acceptation pleine et entière des présentes CGU. Si vous n'acceptez pas ces conditions, nous vous invitons à ne pas utiliser le Site.
            </p>
            <p>
              New World Courtage se réserve le droit de modifier les présentes CGU à tout moment. Les modifications prennent effet dès leur mise en ligne. Il appartient à l'utilisateur de les consulter régulièrement.
            </p>
          </Section>

          <Section id="acces" title="2. Accès au site">
            <p>
              Le Site est accessible gratuitement à tout utilisateur disposant d'un accès à internet. Tous les frais nécessaires pour accéder au Site (matériel, logiciels, connexion internet) sont à la charge de l'utilisateur.
            </p>
            <p>
              New World Courtage met en œuvre tous les moyens raisonnables pour assurer un accès de qualité au Site, mais n'est tenu à aucune obligation de résultat. Des interruptions peuvent survenir pour des raisons de maintenance, de mise à jour ou de force majeure.
            </p>
          </Section>

          <Section id="services" title="3. Services proposés">
            <p>
              Le Site a pour vocation de présenter les services de courtage en assurance de New World Courtage, notamment :
            </p>
            <ul className="list-disc list-inside flex flex-col gap-1.5 pl-2">
              <li>La comparaison d'offres d'assurance auprès de compagnies partenaires.</li>
              <li>La mise en relation entre les utilisateurs et des conseillers en assurance agréés.</li>
              <li>La fourniture d'informations et de guides sur les produits d'assurance.</li>
              <li>La réception de demandes de devis via les formulaires en ligne.</li>
            </ul>
            <p>
              New World Courtage agit en qualité de courtier d'assurance et de réassurance (COA), immatriculé à l'ORIAS sous le numéro <strong className="text-[#131212]">25006506</strong>. À ce titre, il est rémunéré par commission versée par les compagnies d'assurance partenaires, sans coût supplémentaire pour l'utilisateur.
            </p>
            <p>
              Les informations présentées sur le Site ont un caractère informatif général et ne constituent pas un conseil en assurance personnalisé au sens de la directive sur la distribution d'assurances (DDA).
            </p>
          </Section>

          <Section id="utilisateur" title="4. Obligations de l'utilisateur">
            <p>L'utilisateur s'engage à :</p>
            <ul className="list-disc list-inside flex flex-col gap-1.5 pl-2">
              <li>Utiliser le Site conformément à sa destination et aux présentes CGU.</li>
              <li>Ne pas porter atteinte aux droits de tiers ou à l'ordre public.</li>
              <li>Fournir des informations exactes et sincères lors de l'utilisation des formulaires de contact ou de demande de devis.</li>
              <li>Ne pas tenter de perturber le fonctionnement technique du Site (virus, scripts malveillants, surcharge délibérée…).</li>
              <li>Ne pas utiliser le Site à des fins commerciales sans autorisation préalable écrite de New World Courtage.</li>
            </ul>
          </Section>

          <Section id="propriete" title="5. Propriété intellectuelle">
            <p>
              L'ensemble des éléments constituant le Site (textes, graphismes, logiciels, images, sons, vidéos, logo, structure) est la propriété exclusive de New World Courtage SAS ou de ses partenaires, et est protégé par le droit de la propriété intellectuelle français et international.
            </p>
            <p>
              Toute reproduction, représentation, utilisation ou adaptation, sous quelque forme que ce soit, de tout ou partie de ces éléments sans l'autorisation écrite préalable de New World Courtage est strictement interdite et constituerait une contrefaçon sanctionnée par les articles L.335-2 et suivants du code de la propriété intellectuelle.
            </p>
          </Section>

          <Section id="liens" title="6. Liens hypertextes">
            <p>
              Le Site peut contenir des liens vers des sites tiers. Ces liens sont fournis à titre informatif uniquement. New World Courtage n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu, leur disponibilité ou leur politique de confidentialité.
            </p>
            <p>
              La création de liens hypertextes vers le Site est autorisée sous réserve qu'elle ne porte pas atteinte à l'image de New World Courtage et que les pages ne soient pas intégrées dans des cadres (frames) d'un site tiers.
            </p>
          </Section>

          <Section id="responsabilite" title="7. Limitation de responsabilité">
            <p>
              New World Courtage ne saurait être tenu responsable des dommages directs ou indirects résultant de l'accès ou de l'utilisation du Site, notamment en cas d'interruption, d'indisponibilité, de virus ou d'informations inexactes.
            </p>
            <p>
              Les simulations et estimations de tarifs disponibles sur le Site sont fournies à titre indicatif et ne constituent pas des offres contractuelles. Seuls les documents émis par les compagnies d'assurance ont valeur contractuelle.
            </p>
          </Section>

          <Section id="donnees" title="8. Données personnelles et cookies">
            <p>
              Le traitement des données personnelles collectées via le Site est décrit dans notre{" "}
              <Link href="/confidentialite/" className="text-[var(--color-brand)] hover:underline">
                Politique de confidentialité
              </Link>. La gestion des cookies est détaillée dans ce même document.
            </p>
          </Section>

          <Section id="modification" title="9. Modification des CGU">
            <p>
              New World Courtage se réserve le droit de modifier à tout moment les présentes CGU afin de les adapter aux évolutions du Site, des services proposés ou de la réglementation applicable. La date de dernière mise à jour est indiquée en haut de cette page.
            </p>
          </Section>

          <Section id="droit" title="10. Droit applicable et juridiction">
            <p>
              Les présentes CGU sont soumises au droit français. En cas de litige relatif à leur interprétation ou à leur exécution, et à défaut de résolution amiable, les tribunaux du ressort du siège social de New World Courtage SAS à Nice seront seuls compétents.
            </p>
            <p>
              Pour toute question relative aux présentes CGU, vous pouvez nous contacter à{" "}
              <a href="mailto:contact@newworldcourtage.com" className="text-[var(--color-brand)] hover:underline">
                contact@newworldcourtage.com
              </a>.
            </p>
          </Section>

        </div>
        </div>
        <ReadyCta />
      </main>
    </>
  );
}
