// Shared Clerk styling so sign-in and sign-up match the rest of the app
// (near-black glass cards, neutral hairlines, velvet primary button).
export const clerkAppearance = {
  variables: {
    colorPrimary: "#ff3a5c",
    colorBackground: "#09090b",
    colorInputBackground: "#111114",
    colorInputText: "#f0f0f5",
    colorText: "#f0f0f5",
    colorTextSecondary: "#8e8ea0",
    colorTextOnPrimaryBackground: "#ffffff",
    colorNeutral: "#f0f0f5",
    colorDanger: "#ff2d2d",
    borderRadius: "0.875rem",
    fontFamily: "var(--font-sans), var(--font-display), sans-serif",
    fontSize: "14px",
  },
  elements: {
    rootBox: "w-full",
    cardBox: "w-full shadow-none",
    card: "w-full rounded-[1.75rem] border border-white/[0.07] bg-zinc-950/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_24px_48px_-24px_rgba(0,0,0,0.9)] backdrop-blur-xl",
    header: "hidden",
    socialButtonsBlockButton:
      "h-11 rounded-xl border border-white/[0.08] bg-white/[0.03] text-[#f0f0f5] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-colors hover:border-white/[0.16] hover:bg-white/[0.06]",
    socialButtonsBlockButtonText: "font-display font-medium text-[#f0f0f5]",
    socialButtonsBlockButtonArrow: "text-[#f0f0f5]",
    dividerLine: "bg-white/[0.06]",
    dividerText: "text-xs text-[#6a6a7a]",
    formFieldLabel: "text-xs font-medium text-[#8e8ea0]",
    formFieldInput:
      "h-11 rounded-xl border-white/[0.08] bg-white/[0.03] text-[#f0f0f5] focus:border-[#ff3a5c]/60 focus:ring-[3px] focus:ring-[#ff3a5c]/10",
    formButtonPrimary:
      "h-11 rounded-xl bg-brand-gradient font-display font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_6px_16px_-8px_rgba(192,24,46,0.7)] transition-[filter] hover:brightness-110",
    footer: "bg-transparent",
    footerActionText: "text-[#8e8ea0]",
    footerActionLink: "font-medium text-white hover:text-[#ff3a5c]",
    identityPreviewText: "text-[#f0f0f5]",
    identityPreviewEditButton: "text-[#ff3a5c]",
    formFieldAction: "text-[#8e8ea0] hover:text-white",
    alertText: "text-[#f0f0f5]",
    formResendCodeLink: "text-[#ff3a5c]",
  },
};
