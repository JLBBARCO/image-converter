import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ImageIcon, ArrowLeft, Code2, Layers, Zap } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Documentation() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container flex items-center justify-between h-16">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 smooth-transition">
              <ImageIcon className="w-6 h-6 text-accent" />
              <span className="text-lg font-semibold text-foreground">ImageConvert</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/converter">
              <Button variant="ghost" size="sm">
                Conversor
              </Button>
            </Link>
            <Link href="/documentation">
              <Button variant="ghost" size="sm" className="opacity-60">
                Documentação
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <Link href="/converter">
              <Button variant="ghost" size="sm" className="gap-2 mb-6">
                <ArrowLeft className="w-4 h-4" />
                Voltar ao Conversor
              </Button>
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Documentação Técnica
            </h1>
            <p className="text-lg text-muted-foreground">
              Conheça as tecnologias e bibliotecas utilizadas no ImageConvert
            </p>
          </div>

          {/* Technologies Overview */}
          <section className="mb-12 p-8 rounded-2xl border border-border/40 bg-card/50">
            <div className="flex items-center gap-3 mb-6">
              <Code2 className="w-6 h-6 text-accent" />
              <h2 className="text-2xl font-bold text-foreground">Stack Tecnológico</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              O ImageConvert foi construído com tecnologias modernas e de alto desempenho para garantir uma experiência elegante e responsiva.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Frontend */}
              <div className="p-6 rounded-xl bg-muted/30 border border-border/40">
                <h3 className="text-lg font-semibold text-foreground mb-4">Frontend</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="text-accent font-bold">•</span>
                    <span><strong>React 19</strong> - Framework UI moderno com hooks</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent font-bold">•</span>
                    <span><strong>TypeScript</strong> - Tipagem estática para segurança</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent font-bold">•</span>
                    <span><strong>Tailwind CSS 4</strong> - Estilização utilitária</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent font-bold">•</span>
                    <span><strong>shadcn/ui</strong> - Componentes acessíveis</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent font-bold">•</span>
                    <span><strong>Wouter</strong> - Roteamento leve</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent font-bold">•</span>
                    <span><strong>Sonner</strong> - Notificações elegantes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent font-bold">•</span>
                    <span><strong>Lucide React</strong> - Ícones modernos</span>
                  </li>
                </ul>
              </div>

              {/* Backend & Ferramentas */}
              <div className="p-6 rounded-xl bg-muted/30 border border-border/40">
                <h3 className="text-lg font-semibold text-foreground mb-4">Backend & Ferramentas</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="text-accent font-bold">•</span>
                    <span><strong>Express.js</strong> - Servidor web</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent font-bold">•</span>
                    <span><strong>tRPC</strong> - RPC type-safe</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent font-bold">•</span>
                    <span><strong>Vite</strong> - Build tool moderno</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent font-bold">•</span>
                    <span><strong>Drizzle ORM</strong> - ORM type-safe</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent font-bold">•</span>
                    <span><strong>Vitest</strong> - Framework de testes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent font-bold">•</span>
                    <span><strong>Node.js 22</strong> - Runtime JavaScript</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent font-bold">•</span>
                    <span><strong>pnpm</strong> - Gerenciador de pacotes</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Core Features */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Layers className="w-6 h-6 text-accent" />
              <h2 className="text-2xl font-bold text-foreground">Funcionalidades Principais</h2>
            </div>

            <div className="space-y-4">
              {/* Feature 1 */}
              <div className="p-6 rounded-xl border border-border/40 bg-card/50 hover:bg-card/80 smooth-transition">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Canvas API para Conversão
                </h3>
                <p className="text-muted-foreground">
                  Utiliza a <strong>Canvas API</strong> do HTML5 para processar imagens diretamente no navegador. Suporta conversão entre múltiplos formatos (PNG, JPG, WEBP, GIF, BMP, TIFF) com controle de qualidade.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 rounded-xl border border-border/40 bg-card/50 hover:bg-card/80 smooth-transition">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Processamento Local
                </h3>
                <p className="text-muted-foreground">
                  Todas as conversões acontecem localmente no navegador usando <strong>FileReader API</strong> e <strong>Blob API</strong>. Dados nunca são enviados para servidores, garantindo privacidade total.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-xl border border-border/40 bg-card/50 hover:bg-card/80 smooth-transition">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Drag & Drop e Upload
                </h3>
                <p className="text-muted-foreground">
                  Interface intuitiva com suporte a <strong>Drag & Drop API</strong> e seleção tradicional de arquivos. Validação de tipos MIME para garantir que apenas imagens sejam processadas.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="p-6 rounded-xl border border-border/40 bg-card/50 hover:bg-card/80 smooth-transition">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Histórico de Conversões
                </h3>
                <p className="text-muted-foreground">
                  Utiliza <strong>localStorage API</strong> para manter histórico de conversões na sessão do usuário. Rastreia nome do arquivo, formato, tamanho original e convertido, com timestamps.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="p-6 rounded-xl border border-border/40 bg-card/50 hover:bg-card/80 smooth-transition">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Preview em Tempo Real
                </h3>
                <p className="text-muted-foreground">
                  Exibe imagem original e convertida lado a lado usando <strong>Object URLs</strong> para visualização eficiente. Permite comparação visual antes do download.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="p-6 rounded-xl border border-border/40 bg-card/50 hover:bg-card/80 smooth-transition">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Download Automático
                </h3>
                <p className="text-muted-foreground">
                  Implementa download programático usando <strong>Blob URLs</strong> e elemento <strong>&lt;a&gt;</strong> com atributo <code>download</code>. Nomeia arquivo automaticamente com base no formato selecionado.
                </p>
              </div>
            </div>
          </section>

          {/* API & Browser APIs */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-6 h-6 text-accent" />
              <h2 className="text-2xl font-bold text-foreground">APIs do Navegador Utilizadas</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl bg-muted/30 border border-border/40">
                <h3 className="font-semibold text-foreground mb-3">Processamento de Imagens</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• <strong>Canvas API</strong> - Desenho e manipulação de imagens</li>
                  <li>• <strong>Image API</strong> - Carregamento de imagens</li>
                  <li>• <strong>Blob API</strong> - Criação de blobs de dados</li>
                  <li>• <strong>FileReader API</strong> - Leitura de arquivos</li>
                </ul>
              </div>

              <div className="p-6 rounded-xl bg-muted/30 border border-border/40">
                <h3 className="font-semibold text-foreground mb-3">Interação do Usuário</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• <strong>Drag & Drop API</strong> - Upload por arrastar</li>
                  <li>• <strong>File API</strong> - Acesso a arquivos</li>
                  <li>• <strong>localStorage API</strong> - Persistência de dados</li>
                  <li>• <strong>URL.createObjectURL()</strong> - Visualização de blobs</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Design & UX */}
          <section className="mb-12 p-8 rounded-2xl border border-border/40 bg-card/50">
            <h2 className="text-2xl font-bold text-foreground mb-6">Design & Experiência do Usuário</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                <strong>Paleta de Cores:</strong> Tema claro elegante com cores em OKLCH (espaço de cor perceptualmente uniforme). Cores primárias em tons de azul/roxo para transmitir profissionalismo e confiança.
              </p>
              <p>
                <strong>Tipografia:</strong> Fonte <strong>Inter</strong> para corpo de texto (legibilidade) e <strong>Playfair Display</strong> para títulos (elegância). Hierarquia visual clara com pesos de fonte variados.
              </p>
              <p>
                <strong>Componentes:</strong> Utiliza biblioteca <strong>shadcn/ui</strong> que fornece componentes acessíveis, com suporte a teclado e leitores de tela. Todos os componentes seguem padrões WCAG.
              </p>
              <p>
                <strong>Animações:</strong> Transições suaves com Tailwind CSS para feedback visual. Efeitos hover em elementos interativos. Indicadores de carregamento durante conversão.
              </p>
              <p>
                <strong>Responsividade:</strong> Design mobile-first com breakpoints em 640px (tablet) e 1024px (desktop). Layouts adaptáveis para todos os tamanhos de tela.
              </p>
            </div>
          </section>

          {/* Performance */}
          <section className="mb-12 p-8 rounded-2xl border border-border/40 bg-card/50">
            <h2 className="text-2xl font-bold text-foreground mb-6">Otimizações de Performance</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-accent font-bold">✓</span>
                <span><strong>Processamento Local:</strong> Sem requisições de rede, conversão instantânea</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent font-bold">✓</span>
                <span><strong>Lazy Loading:</strong> Componentes carregados sob demanda</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent font-bold">✓</span>
                <span><strong>Code Splitting:</strong> Vite otimiza bundle size automaticamente</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent font-bold">✓</span>
                <span><strong>CSS-in-JS Otimizado:</strong> Tailwind gera apenas CSS necessário</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent font-bold">✓</span>
                <span><strong>Object URLs:</strong> Visualização eficiente sem cópia de dados</span>
              </li>
            </ul>
          </section>

          {/* CTA */}
          <section className="text-center p-12 rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/5 to-accent/10">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Pronto para converter suas imagens?
            </h2>
            <Link href="/converter">
              <Button size="lg" className="gap-2">
                Acessar Conversor
              </Button>
            </Link>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/30 py-8 mt-20">
        <div className="container text-center text-sm text-muted-foreground">
          <p>ImageConvert © 2025. Conversão de imagens elegante e segura.</p>
        </div>
      </footer>
    </div>
  );
}
