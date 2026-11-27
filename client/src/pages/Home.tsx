import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  ArrowRight,
  Check,
  Image as ImageIcon,
  Layers3,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const features = [
  {
    icon: ShieldCheck,
    title: "Privado por natureza",
    description:
      "Suas imagens são processadas no navegador e não são enviadas para um servidor.",
  },
  {
    icon: Layers3,
    title: "Os formatos que você precisa",
    description:
      "Converta entre PNG, JPEG, WEBP, GIF, BMP, TIFF, SVG e ICO em poucos cliques.",
  },
  {
    icon: Zap,
    title: "Sem complicação",
    description:
      "Visualize o resultado, escolha outro formato e baixe seu arquivo quando estiver pronto.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground">
      <header className="relative z-10 border-b border-border/70 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5 rounded-lg">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <ImageIcon className="h-5 w-5" />
            </span>
            <span className="text-base font-bold tracking-tight">ImageConvert</span>
          </Link>
          <nav aria-label="Navegação principal" className="flex items-center gap-2 sm:gap-3">
            <Link href="/documentation" className="hidden rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:inline-flex">
              Como funciona
            </Link>
            <ThemeToggle />
            <Link href="/converter">
              <Button size="sm" className="gap-2">
                Abrir conversor <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="relative isolate">
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-[34rem] max-w-6xl bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/12 via-primary/[0.035] to-transparent blur-3xl" />
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-16 sm:px-6 sm:pb-24 sm:pt-24 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16 lg:px-8 lg:pb-28 lg:pt-28">
            <div className="max-w-2xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3.5 py-1.5 text-xs font-semibold text-primary">
                <Sparkles className="h-3.5 w-3.5" /> Imagens no formato certo, sem complicação
              </div>
              <h1 className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                Converta imagens.
                <span className="mt-1 block text-primary">Continue criando.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                Transforme seus arquivos entre formatos populares em poucos cliques. Rápido, simples e feito direto no seu navegador.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/converter">
                  <Button size="lg" className="w-full gap-2 px-6 sm:w-auto">
                    Começar a converter <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/documentation">
                  <Button size="lg" variant="outline" className="w-full px-6 sm:w-auto">
                    Ver como funciona
                  </Button>
                </Link>
              </div>
              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Sem cadastro</span>
                <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Sem instalação</span>
                <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Conversão local</span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl">
              <div aria-hidden="true" className="absolute -inset-5 rounded-[2rem] bg-primary/[0.08] blur-2xl" />
              <div className="relative rounded-3xl border border-border/80 bg-card p-4 shadow-xl shadow-foreground/[0.04] sm:p-6">
                <div className="flex items-center justify-between border-b border-border/70 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><ImageIcon className="h-5 w-5" /></span>
                    <div>
                      <p className="text-sm font-semibold">Conversão rápida</p>
                      <p className="text-xs text-muted-foreground">Uma experiência sem distrações</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">Pronto para usar</span>
                </div>
                <div className="my-5 rounded-2xl border-2 border-dashed border-border bg-background/70 px-5 py-8 text-center sm:py-10">
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"><ImageIcon className="h-7 w-7" /></span>
                  <p className="mt-4 text-sm font-semibold">Sua imagem, do seu jeito</p>
                  <p className="mt-1 text-xs text-muted-foreground">Selecione, converta e baixe</p>
                  <div className="mt-5 flex flex-wrap justify-center gap-2">
                    {["PNG", "JPEG", "WEBP", "SVG"].map(format => (
                      <span key={format} className={`rounded-lg border px-3 py-1.5 text-xs font-bold ${format === "WEBP" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground"}`}>{format}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-secondary/70 px-3.5 py-3 text-xs text-muted-foreground">
                  <LockKeyhole className="h-4 w-4 shrink-0 text-primary" />
                  Seus arquivos permanecem no seu dispositivo.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-border/70 bg-card/50">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">Feito para ser fácil</p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">Tudo o que você precisa, sem etapas desnecessárias</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {features.map(feature => (
                <article key={feature.title} className="rounded-2xl border border-border/80 bg-background p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-7">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><feature.icon className="h-5 w-5" /></span>
                  <h3 className="mt-5 text-base font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-primary/15 bg-primary/[0.045] p-6 sm:p-10 md:flex-row md:items-center">
            <div className="max-w-xl">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Sparkles className="h-5 w-5" /></div>
              <h2 className="text-2xl font-bold tracking-tight">Pronto para transformar sua imagem?</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Escolha um arquivo e encontre o formato ideal em segundos.</p>
            </div>
            <Link href="/converter">
              <Button size="lg" className="gap-2">
                Abrir conversor <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/70 py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <span>ImageConvert · Conversão simples, direto no navegador.</span>
          <span className="inline-flex items-center gap-1.5"><LockKeyhole className="h-3.5 w-3.5" /> Privacidade sem complicação</span>
        </div>
      </footer>
    </div>
  );
}
