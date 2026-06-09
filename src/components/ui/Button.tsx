import Link from "next/link";
import React, { cloneElement, isValidElement } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "outline"
  | "admin"
  | "adminSecondary"
  | "adminDanger"
  | "danger";

type ButtonSize = "sm" | "md" | "lg" | "xl" | "icon";

type CommonButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
  asChild?: boolean;
};

type NativeButtonProps = CommonButtonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

type LinkButtonProps = CommonButtonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    href: string;
  };

export type ButtonProps = NativeButtonProps | LinkButtonProps;

const variantClasses: Record<ButtonVariant, string> = {
  primary: "acbt-btn--primary",
  secondary: "acbt-btn--secondary",
  ghost: "acbt-btn--ghost",
  outline: "acbt-btn--outline",
  admin: "acbt-btn--admin",
  adminSecondary: "acbt-btn--admin-secondary",
  adminDanger: "acbt-btn--admin-danger",
  danger: "acbt-btn--danger",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "acbt-btn--sm",
  md: "acbt-btn--md",
  lg: "acbt-btn--lg",
  xl: "acbt-btn--xl",
  icon: "acbt-btn--icon",
};

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  leftIcon,
  rightIcon,
  className,
  children,
  asChild = false,
  ...props
}: ButtonProps) {
  const disabled = "disabled" in props ? props.disabled : undefined;
  const isDisabled = Boolean(disabled || loading);
  const classes = cn(
    "acbt-btn",
    variantClasses[variant],
    sizeClasses[size],
    isDisabled && "is-disabled",
    loading && "is-loading",
    className,
  );

  const content = (
    <>
      {loading && <span className="acbt-btn__spinner" aria-hidden="true" />}
      {leftIcon && <span className="acbt-btn__icon acbt-btn__icon--left">{leftIcon}</span>}
      {children && <span className="acbt-btn__label">{children}</span>}
      {rightIcon && <span className="acbt-btn__icon acbt-btn__icon--right">{rightIcon}</span>}
    </>
  );

  if (asChild && isValidElement(children)) {
    return cloneElement(children, {
      className: cn(classes, (children.props as { className?: string }).className),
      "aria-disabled": isDisabled || undefined,
    } as React.HTMLAttributes<HTMLElement>);
  }

  if ("href" in props && props.href) {
    const { href, target, rel, ...anchorProps } = props;

    return (
      <Link
        href={href}
        target={target}
        rel={target === "_blank" ? rel || "noopener noreferrer" : rel}
        aria-disabled={isDisabled || undefined}
        className={classes}
        {...anchorProps}
      >
        {content}
      </Link>
    );
  }

  const buttonProps = props as React.ButtonHTMLAttributes<HTMLButtonElement>;

  return (
    <button
      {...buttonProps}
      type={buttonProps.type || "button"}
      disabled={isDisabled}
      className={classes}
      aria-busy={loading || undefined}
    >
      {content}
    </button>
  );
}
