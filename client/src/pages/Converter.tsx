import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  ArrowDownToLine,
  ArrowRight,
  Check,
  Clock3,
  FileImage,
  Image as ImageIcon,
  LockKeyhole,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";
import { createIcoBlob, getIcoDimensions } from "@/lib/ico";

type ConversionFormat =
  | "png"
  | "jpg"
  | "webp"
  | "gif"
  | "bmp"
  | "tiff"
  | "svg"
  | "ico";

interface ConversionHistory {
  id: string;
  originalName: string;
  format: ConversionFormat;
  timestamp: Date;
  originalSize: number;
  convertedSize: number;
}

const FORMAT_OPTIONS: {
  value: ConversionFormat;
  label: string;
  mimeType: string;
}[] = [
  { value: "png", label: "PNG", mimeType: "image/png" },
  { value: "jpg", label: "JPEG", mimeType: "image/jpeg" },
  { value: "webp", label: "WEBP", mimeType: "image/webp" },
  { value: "gif", label: "GIF", mimeType: "image/gif" },
  { value: "bmp", label: "BMP", mimeType: "image/bmp" },
  { value: "tiff", label: "TIFF", mimeType: "image/tiff" },
  { value: "svg", label: "SVG", mimeType: "image/svg+xml" },
  { value: "ico", label: "ICO", mimeType: "image/png" },
];

const escapeSvgAttribute = (value: string) =>
  value.replace(/[&<>"']/g, character => {
    switch (character) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&apos;";
      default:
        return character;
    }
  });

const createSvgBlob = (
  source: string,
  width: number,
  height: number,
  file: File
) => {
  if (file.type === "image/svg+xml") {
    return file.slice(0, file.size, "image/svg+xml");
  }

  const escapedSource = escapeSvgAttribute(source);
  const svgMarkup = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <image href="${escapedSource}" xlink:href="${escapedSource}" width="${width}" height="${height}" preserveAspectRatio="none" />
</svg>`;

  return new Blob([svgMarkup], { type: "image/svg+xml" });
};

export default function Converter() {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState("");
  const [convertedPreview, setConvertedPreview] = useState("");
  const [selectedFormat, setSelectedFormat] = useState<ConversionFormat>("png");
  const [isConverting, setIsConverting] = useState(false);
  const [history, setHistory] = useState<ConversionHistory[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem("conversionHistory");
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setHistory(
          parsed.map((item: ConversionHistory) => ({
            ...item,
            timestamp: new Date(item.timestamp),
          }))
        );
      } catch (error) {
        console.error("Failed to load history:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("conversionHistory", JSON.stringify(history));
  }, [history]);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione um arquivo de imagem válido");
      return;
    }

    setOriginalImage(file);
    const reader = new FileReader();
    reader.onload = event => {
      setOriginalPreview(event.target?.result as string);
      setConvertedPreview("");
    };
    reader.onerror = () => toast.error("Não foi possível abrir esta imagem");
    reader.readAsDataURL(file);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setIsDragging(false);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const convertImage = async () => {
    if (!originalImage || !originalPreview) {
      toast.error("Selecione uma imagem para começar");
      return;
    }

    setIsConverting(true);
    try {
      const image = new Image();
      image.onload = () => {
        const dimensions =
          selectedFormat === "ico"
            ? getIcoDimensions(image.width, image.height)
            : { width: image.width, height: image.height };
        const canvas = document.createElement("canvas");
        canvas.width = dimensions.width;
        canvas.height = dimensions.height;

        const context = canvas.getContext("2d");
        if (!context) {
          toast.error("Não foi possível processar esta imagem");
          setIsConverting(false);
          return;
        }
        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        const format = FORMAT_OPTIONS.find(option => option.value === selectedFormat);
        if (!format) {
          toast.error("Formato não suportado");
          setIsConverting(false);
          return;
        }

        if (selectedFormat === "svg") {
          const blob = createSvgBlob(
            originalPreview,
            image.width,
            image.height,
            originalImage
          );
          setConvertedPreview(URL.createObjectURL(blob));
          setHistory(previous => [
            {
              id: Math.random().toString(36).slice(2, 11),
              originalName: originalImage.name,
              format: selectedFormat,
              timestamp: new Date(),
              originalSize: originalImage.size,
              convertedSize: blob.size,
            },
            ...previous,
          ]);
          toast.success("Imagem convertida com sucesso!");
          setIsConverting(false);
          return;
        }

        canvas.toBlob(
          blob => {
            if (!blob) {
              toast.error("Não foi possível converter esta imagem");
              setIsConverting(false);
              return;
            }

            const convertedBlob =
              selectedFormat === "ico"
                ? createIcoBlob(blob, canvas.width, canvas.height)
                : blob;
            setConvertedPreview(URL.createObjectURL(convertedBlob));
            setHistory(previous => [
              {
                id: Math.random().toString(36).slice(2, 11),
                originalName: originalImage.name,
                format: selectedFormat,
                timestamp: new Date(),
                originalSize: originalImage.size,
                convertedSize: convertedBlob.size,
              },
              ...previous,
            ]);
            toast.success("Imagem convertida com sucesso!");
            setIsConverting(false);
          },
          format.mimeType,
          selectedFormat === "jpg" ? 0.95 : undefined
        );
      };

      image.onerror = () => {
        toast.error("Não foi possível carregar esta imagem");
        setIsConverting(false);
      };
      image.src = originalPreview;
    } catch (error) {
      console.error("Image conversion failed:", error);
      toast.error("Ocorreu um erro ao converter a imagem");
      setIsConverting(false);
    }
  };

  const downloadImage = () => {
    if (!convertedPreview) {
      toast.error("Converta a imagem antes de baixar");
      return;
    }

    const link = document.createElement("a");
    const nameWithoutExt = originalImage?.name.replace(/\.[^.]+$/, "") || "imagem";
    link.href = convertedPreview;
    link.download = `${nameWithoutExt}.${selectedFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Download iniciado!");
  };

  const resetConverter = () => {
    setOriginalImage(null);
    setOriginalPreview("");
    setConvertedPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const units = ["B", "KB", "MB", "GB"];
    const index = Math.min(
      Math.floor(Math.log(bytes) / Math.log(1024)),
      units.length - 1
    );
    return `${Math.round((bytes / 1024 ** index) * 100) / 100} ${units[index]}`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5 rounded-lg">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <ImageIcon className="h-5 w-5" />
            </span>
            <span className="text-base font-bold tracking-tight">ImageConvert</span>
          </Link>
          <nav aria-label="Navegação principal" className="flex items-center gap-1 sm:gap-3">
            <Link href="/converter" className="rounded-lg bg-secondary px-3 py-2 text-sm font-semibold text-foreground">
              Conversor
            </Link>
            <Link href="/documentation" className="hidden rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:inline-flex">
              Ajuda
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12 lg:px-8">
        <div className="mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Simples, rápido e privado
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem]">
              Conversor de imagens
            </h1>
            <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              Troque o formato dos seus arquivos em poucos passos. Tudo acontece no seu navegador.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground shadow-sm">
            <LockKeyhole className="h-4 w-4 shrink-0 text-primary" />
            <span>Suas imagens não saem do seu dispositivo</span>
          </div>
        </div>

        <ol aria-label="Etapas da conversão" className="mb-6 grid grid-cols-3 gap-2 sm:mb-8 sm:gap-4">
          {[
            { number: "01", title: "Envie a imagem" },
            { number: "02", title: "Escolha o formato" },
            { number: "03", title: "Baixe o resultado" },
          ].map(step => (
            <li key={step.number} className="flex items-center gap-2.5 rounded-xl border border-border/70 bg-card/70 px-3 py-3 sm:gap-3 sm:px-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{step.number}</span>
              <span className="text-xs font-medium leading-4 text-foreground sm:text-sm">{step.title}</span>
            </li>
          ))}
        </ol>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="space-y-5">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`rounded-2xl border bg-card p-4 shadow-sm transition-all sm:p-6 ${
                isDragging
                  ? "border-primary bg-primary/5 ring-4 ring-primary/10"
                  : "border-border/80"
              }`}
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold">Sua imagem</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Arraste um arquivo para cá ou escolha no dispositivo.</p>
                </div>
                {originalImage && (
                  <Button type="button" variant="ghost" size="sm" onClick={resetConverter} className="shrink-0 gap-2 text-muted-foreground">
                    <RotateCcw className="h-4 w-4" />
                    <span className="hidden sm:inline">Recomeçar</span>
                  </Button>
                )}
              </div>
              <input
                ref={fileInputRef}
                id="image-upload"
                type="file"
                accept="image/*"
                className="peer sr-only"
                onChange={event => {
                  const file = event.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
              />
              <label
                htmlFor="image-upload"
                className="group flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-background/60 px-4 py-7 text-center transition-colors hover:border-primary/50 hover:bg-primary/[0.03] peer-focus-visible:ring-4 peer-focus-visible:ring-primary/20 sm:min-h-56"
              >
                {originalImage ? (
                  <>
                    <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <FileImage className="h-6 w-6" />
                    </span>
                    <span className="max-w-full truncate text-sm font-semibold">{originalImage.name}</span>
                    <span className="mt-1 text-xs text-muted-foreground">{formatFileSize(originalImage.size)} · clique para trocar</span>
                    <span className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-semibold shadow-sm transition-colors group-hover:border-primary/30">
                      <Upload className="h-4 w-4" /> Escolher outra imagem
                    </span>
                  </>
                ) : (
                  <>
                    <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:-translate-y-0.5">
                      <Upload className="h-6 w-6" />
                    </span>
                    <span className="text-base font-semibold">Arraste e solte sua imagem aqui</span>
                    <span className="mt-1.5 text-sm text-muted-foreground">ou clique para procurar arquivos</span>
                    <span className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors group-hover:bg-primary/90">
                      Selecionar imagem <ArrowRight className="h-4 w-4" />
                    </span>
                    <span className="mt-4 text-xs text-muted-foreground">PNG, JPEG, WEBP, GIF, BMP, TIFF, SVG e ICO</span>
                  </>
                )}
              </label>
            </div>

            <section aria-labelledby="format-heading" className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm sm:p-6">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h2 id="format-heading" className="text-base font-semibold">Formato de saída</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Selecione o formato desejado para sua imagem.</p>
                </div>
                <span className="rounded-md bg-secondary px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">8 formatos</span>
              </div>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
                {FORMAT_OPTIONS.map(format => (
                  <button
                    key={format.value}
                    type="button"
                    disabled={!originalImage}
                    aria-pressed={selectedFormat === format.value}
                    onClick={() => {
                      setSelectedFormat(format.value);
                      setConvertedPreview("");
                    }}
                    className={`min-h-11 rounded-lg border px-2 text-xs font-bold tracking-wide transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-45 sm:text-sm ${
                      selectedFormat === format.value
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-border bg-background text-muted-foreground hover:border-primary/35 hover:text-foreground"
                    }`}
                  >
                    {format.label}
                  </button>
                ))}
              </div>
              {!originalImage && <p className="mt-3 text-xs text-muted-foreground">Escolha uma imagem para ativar os formatos.</p>}
            </section>

            {originalPreview && (
              <section aria-label="Prévia da conversão" className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm sm:p-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold">Prévia</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Confira antes de baixar o arquivo.</p>
                  </div>
                  {convertedPreview && <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300"><Check className="h-3.5 w-3.5" /> Convertida</span>}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="min-w-0 rounded-xl border border-border/70 bg-background p-3">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold">Original</span>
                      <span className="rounded-md bg-secondary px-2 py-1 text-[10px] font-bold uppercase text-muted-foreground">{originalImage?.type.split("/")[1] || "Imagem"}</span>
                    </div>
                    <div className="image-checkerboard flex h-52 items-center justify-center overflow-hidden rounded-lg border border-border/50 p-3">
                      <img src={originalPreview} alt={`Prévia original: ${originalImage?.name}`} className="max-h-full max-w-full object-contain" />
                    </div>
                    <p className="mt-3 truncate text-xs text-muted-foreground" title={originalImage?.name}>{originalImage?.name} · {formatFileSize(originalImage?.size || 0)}</p>
                  </div>
                  <div className="min-w-0 rounded-xl border border-border/70 bg-background p-3">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold">Resultado</span>
                      <span className="rounded-md bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase text-primary">{selectedFormat}</span>
                    </div>
                    <div className="image-checkerboard flex h-52 items-center justify-center overflow-hidden rounded-lg border border-border/50 p-3">
                      {convertedPreview ? (
                        <img src={convertedPreview} alt={`Prévia convertida em ${selectedFormat.toUpperCase()}`} className="max-h-full max-w-full object-contain" />
                      ) : (
                        <div className="flex max-w-48 flex-col items-center text-center text-muted-foreground">
                          <ImageIcon className="mb-2 h-7 w-7 opacity-40" />
                          <span className="text-xs">O resultado aparecerá aqui após a conversão.</span>
                        </div>
                      )}
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">{convertedPreview ? "Pronto para baixar" : `Aguardando conversão para ${selectedFormat.toUpperCase()}`}</p>
                  </div>
                </div>
                <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <Button type="button" variant="outline" onClick={resetConverter} className="gap-2">
                    <RotateCcw className="h-4 w-4" /> Limpar
                  </Button>
                  {convertedPreview && (
                    <Button type="button" variant="outline" onClick={downloadImage} className="gap-2">
                      <ArrowDownToLine className="h-4 w-4" /> Baixar imagem
                    </Button>
                  )}
                  <Button type="button" onClick={convertImage} disabled={isConverting} className="gap-2">
                    {isConverting ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" /> : <Sparkles className="h-4 w-4" />}
                    {isConverting ? "Convertendo…" : `Converter para ${selectedFormat.toUpperCase()}`}
                  </Button>
                </div>
              </section>
            )}
          </section>

          <aside className="space-y-5">
            <section className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-foreground"><Clock3 className="h-4 w-4" /></span>
                  <div>
                    <h2 className="text-sm font-semibold">Conversões recentes</h2>
                    <p className="text-xs text-muted-foreground">Salvas neste navegador</p>
                  </div>
                </div>
                {history.length > 0 && <span className="rounded-full bg-secondary px-2 py-1 text-xs font-semibold text-muted-foreground">{history.length}</span>}
              </div>
              {history.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border bg-background/70 px-4 py-7 text-center">
                  <FileImage className="mx-auto mb-2 h-6 w-6 text-muted-foreground/60" />
                  <p className="text-sm font-medium">Ainda sem conversões</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">Quando você converter uma imagem, ela aparecerá aqui.</p>
                </div>
              ) : (
                <div className="max-h-[27rem] space-y-2 overflow-y-auto pr-1">
                  {history.map(item => (
                    <div key={item.id} className="rounded-xl border border-border/70 bg-background/70 p-3 transition-colors hover:bg-secondary/50">
                      <div className="flex items-start justify-between gap-2">
                        <p className="min-w-0 truncate text-xs font-semibold" title={item.originalName}>{item.originalName}</p>
                        <span className="shrink-0 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold uppercase text-primary">{item.format}</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
                        <span>{formatFileSize(item.originalSize)} <span aria-hidden="true">→</span> {formatFileSize(item.convertedSize)}</span>
                        <span>{item.timestamp.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-primary/15 bg-primary/[0.04] p-5 sm:p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><ShieldCheck className="h-5 w-5" /></div>
              <h2 className="text-sm font-semibold">Privacidade em primeiro lugar</h2>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">O processamento acontece no seu navegador. Seus arquivos não são enviados para um servidor.</p>
              <Link href="/documentation" className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                Saiba mais <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </section>
          </aside>
        </div>
      </main>

      <footer className="border-t border-border/70 py-5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <span>ImageConvert · Conversão simples, direto no navegador.</span>
          <span className="inline-flex items-center gap-1.5"><LockKeyhole className="h-3.5 w-3.5" /> Seus arquivos ficam no seu dispositivo</span>
        </div>
      </footer>
    </div>
  );
}
