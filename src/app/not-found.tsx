import { Button, PageShell, PageHeading } from "@/components/ui";

export default function NotFound() {
  return (
    <PageShell backLabel="Home">
      <PageHeading
        align="center"
        title={<>Page <span className="text-text-secondary">not found</span></>}
        subtitle="The link may be broken, or the room may have expired."
      />
      <div className="flex flex-col gap-3">
        <Button href="/" size="lg" className="w-full">
          Back to home
        </Button>
        <Button href="/room/join" variant="ghost" className="w-full">
          Join a room with a code
        </Button>
      </div>
    </PageShell>
  );
}
