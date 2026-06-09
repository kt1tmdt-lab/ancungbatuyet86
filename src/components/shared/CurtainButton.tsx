import React from "react";
import Button from "@/components/ui/Button";

export interface CurtainButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  href?: string;
  className?: string;
  curtainBg?: string;
  textColor?: string;
  target?: string;
  rel?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

function getVariant(className = "") {
  if (className.includes("bg-white") || className.includes("border")) {
    return "outline" as const;
  }

  if (className.includes("bg-slate")) {
    return "secondary" as const;
  }

  return "primary" as const;
}

export default function CurtainButton({
  children,
  onClick,
  href,
  className = "",
  target,
  rel,
  disabled,
  type = "button",
}: CurtainButtonProps) {
  const variant = getVariant(className);

  if (href) {
    return (
      <Button
        href={href}
        target={target}
        rel={rel}
        variant={variant}
        size="lg"
        className={className}
        aria-disabled={disabled || undefined}
      >
        {children}
      </Button>
    );
  }

  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled}
      variant={variant}
      size="lg"
      className={className}
    >
      {children}
    </Button>
  );
}
