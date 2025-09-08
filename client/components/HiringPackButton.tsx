import { useState } from "react";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export interface HiringPackButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onGenerate?: () => void;
  label?: string;
}

export default function HiringPackButton({ onGenerate, label = "Hiring Pack", className, ...props }: HiringPackButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);
      if (onGenerate) await onGenerate();
      else console.info("Hiring Pack: conectar jsPDF + html2canvas depois.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-busy={loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:brightness-110 disabled:opacity-60",
        className,
      )}
      {...props}
    >
      <FileText className="h-4 w-4" /> {loading ? "Gerando..." : label}
    </button>
  );
}
