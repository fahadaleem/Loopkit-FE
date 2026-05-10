import Link from "next/link";

type AuthShellProps = {
  title: string;
  subtitle: string;
  footer: { prompt: string; href: string; cta: string };
  children: React.ReactNode;
};

export function AuthShell({ title, subtitle, footer, children }: AuthShellProps) {
  return (
    <main className="min-h-screen w-full grid lg:grid-cols-2 bg-background">
      <section className="hidden lg:flex relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #6d28d9 0%, #8b5cf6 50%, #4338ca 100%)",
          }}
        />
        <div className="absolute inset-0 opacity-30 mix-blend-overlay"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.4), transparent 40%), radial-gradient(circle at 80% 60%, rgba(255,255,255,0.25), transparent 35%)",
          }}
        />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <span className="size-9 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center font-bold">
              LK
            </span>
            LoopKit
          </div>
          <div>
            <h2 className="text-4xl font-semibold leading-tight">
              Walk into every<br />interview ready.
            </h2>
            <p className="mt-4 max-w-md text-white/80">
              Upload your resume and the job description — get a tailored report
              with behavioral questions, technical questions, gap analysis, and
              concrete prep suggestions.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-white/85">
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-white/80" />
                Behavioral &amp; technical question banks tuned to the role
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-white/80" />
                Resume-to-JD gap analysis with severity scores
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-white/80" />
                Prep suggestions you can act on the same day
              </li>
            </ul>
          </div>
          <p className="text-sm text-white/60">© {new Date().getFullYear()} LoopKit</p>
        </div>
      </section>

      <section className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              {title}
            </h1>
            <p className="mt-2 text-muted-foreground">{subtitle}</p>
          </div>
          {children}
          <p className="mt-8 text-center text-sm text-muted-foreground">
            {footer.prompt}{" "}
            <Link
              href={footer.href}
              className="font-medium text-primary hover:text-primary-hover"
            >
              {footer.cta}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
