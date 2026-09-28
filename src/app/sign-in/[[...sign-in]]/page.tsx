"use client";

import { SignIn } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { PageShell, PageHeading } from "@/components/ui";
import { clerkAppearance } from "@/lib/ui/clerkAppearance";

export default function SignInPage() {
  return (
    <PageShell backLabel="Home">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <PageHeading
          align="center"
          title={<>Welcome <span className="text-text-secondary">back</span></>}
          subtitle="Sign in to create your restaurant matching room."
        />
        <div className="flex justify-center">
          <SignIn appearance={clerkAppearance} />
        </div>
      </motion.div>
    </PageShell>
  );
}
