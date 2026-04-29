import Link from "next/link";
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";

type AuthPanelProps = {
  children: ReactNode;
};

type AuthFormHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

type AuthTextFieldProps = {
  label: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "className">;

type AuthSubmitButtonProps = {
  children: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className">;

type AuthFooterLinkProps = {
  prompt: string;
  href: string;
  children: ReactNode;
};

export function AuthPanel({ children }: AuthPanelProps) {
  return (
    <section className="relative flex min-h-[min(43rem,82cqh)] w-[min(38rem,52cqw)] max-w-full flex-col justify-center bg-[url('/panels/auth-panel.png')] bg-[length:100%_100%] bg-center bg-no-repeat px-[clamp(3rem,5cqw,4.35rem)] pb-[clamp(3.25rem,7cqh,4.9rem)] pt-[clamp(4rem,8.5cqh,6.1rem)] text-amber-100 drop-shadow-[0_22px_34px_rgba(0,0,0,0.68)] max-[760px]:min-h-[min(43rem,86cqh)] max-[760px]:w-[min(34rem,92cqw)] max-[760px]:px-[clamp(2.5rem,9cqw,4rem)]">
      <div className="mx-auto max-h-[72cqh] w-full max-w-[min(22rem,100%)] overflow-y-auto px-[clamp(0.25rem,0.8cqw,0.65rem)] py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {children}
      </div>
    </section>
  );
}

export function AuthFormHeader({
  eyebrow,
  title,
  description,
}: AuthFormHeaderProps) {
  return (
    <div className="mb-[clamp(0.55rem,1.8cqh,1.1rem)] space-y-[clamp(0.24rem,0.65cqh,0.45rem)] text-center">
      <p className="font-[family-name:var(--font-cinzel)] text-[clamp(0.62rem,1cqw,0.78rem)] font-black uppercase tracking-[0.34em] text-amber-300">
        {eyebrow}
      </p>
      <h2 className="font-[family-name:var(--font-cinzel)] text-[clamp(1.2rem,2.1cqw,1.78rem)] font-black leading-tight text-stone-50">
        {title}
      </h2>
      <p className="mx-auto max-w-[24rem] text-[clamp(0.68rem,1cqw,0.82rem)] leading-[1.4] text-stone-300">
        {description}
      </p>
    </div>
  );
}

export function AuthTextField({ label, ...inputProps }: AuthTextFieldProps) {
  return (
    <label className="block space-y-[clamp(0.22rem,0.7cqh,0.42rem)]">
      <span className="font-[family-name:var(--font-cinzel)] text-[clamp(0.56rem,0.86cqw,0.68rem)] font-black uppercase tracking-[0.24em] text-amber-200">
        {label}
      </span>
      <input
        {...inputProps}
        className="w-full rounded-md border border-amber-800/65 bg-black/55 px-[clamp(0.75rem,1.4cqw,1rem)] py-[clamp(0.48rem,1.05cqh,0.68rem)] text-[clamp(0.72rem,1.05cqw,0.88rem)] text-stone-50 outline-none shadow-[inset_0_2px_10px_rgba(0,0,0,0.55)] transition placeholder:text-stone-500 focus:border-amber-300/85 focus:bg-black/72 focus:shadow-[0_0_16px_rgba(245,158,11,0.2),inset_0_2px_10px_rgba(0,0,0,0.65)]"
      />
    </label>
  );
}

export function AuthError({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-md border border-rose-300/45 bg-rose-950/55 px-3 py-2 text-[clamp(0.68rem,1.05cqw,0.82rem)] leading-snug text-rose-100 shadow-[0_0_18px_rgba(127,29,29,0.25)]">
      {children}
    </div>
  );
}

export function AuthSubmitButton({
  children,
  type = "submit",
  ...buttonProps
}: AuthSubmitButtonProps) {
  return (
    <button
      {...buttonProps}
      type={type}
      className="flex min-h-[clamp(2.25rem,5.4cqh,3rem)] w-full items-center justify-center bg-[url('/buttons/auth-button.png')] bg-[length:100%_100%] bg-center bg-no-repeat px-[clamp(1rem,2.2cqw,1.6rem)] pb-[clamp(0.16rem,0.45cqh,0.25rem)] font-[family-name:var(--font-cinzel)] text-[clamp(0.62rem,0.96cqw,0.8rem)] font-black uppercase tracking-[0.28em] text-amber-50 transition duration-200 hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:brightness-100"
    >
      {children}
    </button>
  );
}

export function AuthFooterLink({
  prompt,
  href,
  children,
}: AuthFooterLinkProps) {
  return (
    <p className="mt-[clamp(0.65rem,1.6cqh,1rem)] text-center text-[clamp(0.66rem,0.98cqw,0.78rem)] text-stone-300">
      {prompt}{" "}
      <Link
        href={href}
        className="font-semibold text-amber-200 transition hover:text-amber-100"
      >
        {children}
      </Link>
    </p>
  );
}
