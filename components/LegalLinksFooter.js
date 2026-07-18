import Link from "next/link";

const LEGAL_LINKS = [
  { label: "Politique de confidentialité", href: "/confidentialite/" },
  { label: "Accessibilité", href: "/accessibilite/" },
  { label: "Conditions générales", href: "/conditions-generales/" },
  { label: "Mentions légales", href: "/mentions-legales/" },
];

export default function LegalLinksFooter() {
  return (
    <div className="w-full mt-4 py-4 px-4 flex flex-wrap justify-center gap-x-4 gap-y-1 text-center">
      {LEGAL_LINKS.map(({ label, href }) => (
        <Link key={href} href={href} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:text-[var(--color-brand)] transition-colors">
          {label}
        </Link>
      ))}
    </div>
  );
}
