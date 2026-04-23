import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Image, Zap, Layers } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Image className="w-6 h-6 text-accent" />
            <span className="text-lg font-semibold text-foreground">ImageConvert</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/converter">
              <Button variant="ghost" size="sm">
                Conversor
              </Button>
            </Link>
            <Link href="/documentation">
              <Button variant="ghost" size="sm">
                Documentação
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Converta suas imagens
              <span className="block text-accent">com elegância</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transforme suas imagens entre diferentes formatos de forma rápida, segura e totalmente no seu navegador. Sem upload para servidores, sem limites.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href="/converter">
              <Button size="lg" className="gap-2">
                Começar a Converter
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/documentation">
              <Button size="lg" variant="outline">
                Ver Tecnologias
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-20">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="group p-8 rounded-2xl border border-border/40 bg-card/50 hover:bg-card/80 smooth-transition hover:shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 smooth-transition">
              <Zap className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Processamento Local</h3>
            <p className="text-muted-foreground">
              Todas as conversões acontecem no seu navegador. Seus dados nunca deixam seu computador.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="group p-8 rounded-2xl border border-border/40 bg-card/50 hover:bg-card/80 smooth-transition hover:shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 smooth-transition">
              <Layers className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Múltiplos Formatos</h3>
            <p className="text-muted-foreground">
              Converta entre PNG, JPG, WEBP, GIF, BMP e TIFF com qualidade preservada.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="group p-8 rounded-2xl border border-border/40 bg-card/50 hover:bg-card/80 smooth-transition hover:shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 smooth-transition">
              <Image className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Preview em Tempo Real</h3>
            <p className="text-muted-foreground">
              Veja a imagem original e convertida lado a lado antes de fazer o download.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20">
        <div className="max-w-2xl mx-auto text-center p-12 rounded-3xl border border-accent/20 bg-gradient-to-br from-accent/5 to-accent/10">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Pronto para começar?
          </h2>
          <p className="text-muted-foreground mb-8">
            Converta suas imagens agora mesmo, sem cadastro ou limitações.
          </p>
          <Link href="/converter">
            <Button size="lg" className="gap-2">
              Acessar Conversor
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/30 py-8 mt-20">
        <div className="container text-center text-sm text-muted-foreground">
          <p>ImageConvert © 2025. Conversão de imagens elegante e segura.</p>
        </div>
      </footer>
    </div>
  );
}
