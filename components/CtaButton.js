import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

export default function CtaButton({ href = "/devis", label = "Devis gratuit", className = "", target, rel, type = "link", onClick }) {
  const buttonClassName = cn("cta-btn text-white text-base font-normal py-[25px] px-[15px]", className);

  if (type === "submit" || type === "button") {
    return (
      <Button type={type} onClick={onClick} className={buttonClassName}>
        <span className="flex items-center gap-0.5">
          {label}
          <ChevronRight size={18} strokeWidth={2.5} />
        </span>
      </Button>
    );
  }

  return (
    <Button
      size="lg"
      asChild
      className={buttonClassName}
    >
      <Link href={href} target={target} rel={rel} className="flex items-center gap-0.5">
        {label}
        <ChevronRight size={18} strokeWidth={2.5} />
      </Link>
    </Button>
  );
}
