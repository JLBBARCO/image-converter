import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Upload, Download, Image as ImageIcon, RotateCcw, Clock } from "lucide-react";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";

type ConversionFormat = "png" | "jpg" | "webp" | "gif" | "bmp" | "tiff";

interface ConversionHistory {
  id: string;
  originalName: string;
  format: ConversionFormat;
  timestamp: Date;
  originalSize: number;
  convertedSize: number;
}

const FORMAT_OPTIONS: { value: ConversionFormat; label: string; mimeType: string }[] = [
  { value: "png", label: "PNG", mimeType: "image/png" },
  { value: "jpg", label: "JPG", mimeType: "image/jpeg" },
  { value: "webp", label: "WEBP", mimeType: "image/webp" },
  { value: "gif", label: "GIF", mimeType: "image/gif" },
  { value: "bmp", label: "BMP", mimeType: "image/bmp" },
  { value: "tiff", label: "TIFF", mimeType: "image/tiff" },
];

export default function Converter() {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string>("");
  const [convertedPreview, setConvertedPreview] = useState<string>("");
  const [selectedFormat, setSelectedFormat] = useState<ConversionFormat>("png");
  const [isConverting, setIsConverting] = useState(false);
  const [history, setHistory] = useState<ConversionHistory[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem("conversionHistory");
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setHistory(parsed.map((item: any) => ({ ...item, timestamp: new Date(item.timestamp) })));
      } catch (error) {
        console.error("Failed to load history:", error);
      }
    }
  }, []);

  // Save history to localStorage
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
    reader.onload = (e) => {
      setOriginalPreview(e.target?.result as string);
      setConvertedPreview("");
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const convertImage = async () => {
    if (!originalImage || !originalPreview) {
      toast.error("Por favor, selecione uma imagem primeiro");
      return;
    }

    setIsConverting(true);
    try {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          toast.error("Erro ao processar imagem");
          setIsConverting(false);
          return;
        }

        ctx.drawImage(img, 0, 0);

        const format = FORMAT_OPTIONS.find((f) => f.value === selectedFormat);
        if (!format) {
          toast.error("Formato não suportado");
          setIsConverting(false);
          return;
        }

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              toast.error("Erro ao converter imagem");
              setIsConverting(false);
              return;
            }

            const convertedUrl = URL.createObjectURL(blob);
            setConvertedPreview(convertedUrl);

            // Add to history
            const newHistoryItem: ConversionHistory = {
              id: Math.random().toString(36).substr(2, 9),
              originalName: originalImage.name,
              format: selectedFormat,
              timestamp: new Date(),
              originalSize: originalImage.size,
              convertedSize: blob.size,
            };
            setHistory([newHistoryItem, ...history]);

            toast.success("Imagem convertida com sucesso!");
            setIsConverting(false);
          },
          format.mimeType,
          selectedFormat === "jpg" ? 0.95 : undefined
        );
      };

      img.onerror = () => {
        toast.error("Erro ao carregar imagem");
        setIsConverting(false);
      };

      img.src = originalPreview;
    } catch (error) {
      toast.error("Erro ao converter imagem");
      setIsConverting(false);
    }
  };

  const downloadImage = () => {
    if (!convertedPreview) {
      toast.error("Converta uma imagem primeiro");
      return;
    }

    const link = document.createElement("a");
    const nameWithoutExt = originalImage?.name.split(".")[0] || "image";
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
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

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
              <Button variant="ghost" size="sm" className="opacity-60">
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

      <div className="container py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Conversor de Imagens
            </h1>
            <p className="text-lg text-muted-foreground">
              Selecione uma imagem, escolha o formato e converta instantaneamente
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Converter */}
            <div className="lg:col-span-2 space-y-8">
              {/* Upload Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-12 text-center smooth-transition cursor-pointer ${
                  isDragging
                    ? "border-accent bg-accent/5"
                    : "border-border/40 bg-card/30 hover:bg-card/50"
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleFileSelect(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />
                <Upload className="w-12 h-12 text-accent mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Arraste sua imagem aqui
                </h3>
                <p className="text-muted-foreground mb-4">
                  ou clique para selecionar um arquivo
                </p>
                <p className="text-sm text-muted-foreground">
                  PNG, JPG, WEBP, GIF, BMP, TIFF
                </p>
              </div>

              {/* Preview Section */}
              {originalPreview && (
                <div className="space-y-6">
                  {/* Format Selection */}
                  <div className="p-6 rounded-2xl border border-border/40 bg-card/50">
                    <label className="block text-sm font-semibold text-foreground mb-4">
                      Formato de Saída
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {FORMAT_OPTIONS.map((format) => (
                        <button
                          key={format.value}
                          onClick={() => setSelectedFormat(format.value)}
                          className={`py-2 px-3 rounded-lg font-medium smooth-transition ${
                            selectedFormat === format.value
                              ? "bg-accent text-accent-foreground"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                        >
                          {format.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Preview Images */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Original */}
                    <div className="p-6 rounded-2xl border border-border/40 bg-card/50">
                      <h3 className="text-sm font-semibold text-foreground mb-4">Original</h3>
                      <div className="bg-muted rounded-lg overflow-hidden mb-4">
                        <img
                          src={originalPreview}
                          alt="Original"
                          className="w-full h-48 object-contain"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {originalImage?.name} • {formatFileSize(originalImage?.size || 0)}
                      </p>
                    </div>

                    {/* Converted */}
                    <div className="p-6 rounded-2xl border border-border/40 bg-card/50">
                      <h3 className="text-sm font-semibold text-foreground mb-4">
                        Convertida ({selectedFormat.toUpperCase()})
                      </h3>
                      <div className="bg-muted rounded-lg overflow-hidden mb-4">
                        {convertedPreview ? (
                          <img
                            src={convertedPreview}
                            alt="Converted"
                            className="w-full h-48 object-contain"
                          />
                        ) : (
                          <div className="w-full h-48 flex items-center justify-center text-muted-foreground">
                            Clique em "Converter"
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {convertedPreview ? "Pronto para download" : "Aguardando conversão"}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <Button
                      onClick={convertImage}
                      disabled={isConverting}
                      className="flex-1"
                      size="lg"
                    >
                      {isConverting ? "Convertendo..." : "Converter"}
                    </Button>
                    {convertedPreview && (
                      <Button
                        onClick={downloadImage}
                        variant="outline"
                        size="lg"
                        className="gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    )}
                    <Button
                      onClick={resetConverter}
                      variant="ghost"
                      size="lg"
                      className="gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* History Sidebar */}
            <div className="lg:col-span-1">
              <div className="p-6 rounded-2xl border border-border/40 bg-card/50 sticky top-24">
                <div className="flex items-center gap-2 mb-6">
                  <Clock className="w-5 h-5 text-accent" />
                  <h3 className="text-lg font-semibold text-foreground">Histórico</h3>
                </div>

                {history.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Nenhuma conversão realizada ainda
                  </p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-lg bg-muted/50 hover:bg-muted smooth-transition"
                      >
                        <p className="text-xs font-medium text-foreground truncate">
                          {item.originalName}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          → {item.format.toUpperCase()}
                        </p>
                        <div className="flex justify-between text-xs text-muted-foreground mt-2">
                          <span>{formatFileSize(item.originalSize)}</span>
                          <span>{formatFileSize(item.convertedSize)}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.timestamp.toLocaleTimeString("pt-BR")}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
