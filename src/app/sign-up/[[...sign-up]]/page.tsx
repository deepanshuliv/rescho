"use client";

import { SignUp } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { PageShell, PageHeading } from "@/components/ui";
import { clerkAppearance } from "@/lib/ui/clerkAppearance";

export default function SignUpPage() {
  return (
    <PageShell backLabel="Home">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <PageHeading
          align="center"
          title={<>Create your <span className="text-text-secondary">account</span></>}
          subtitle="Sign up to start matching restaurants together."
        />
        <div className="flex justify-center">
          <SignUp appearance={clerkAppearance} />
        </div>
      </motion.div>
    </PageShell>
  );
}
