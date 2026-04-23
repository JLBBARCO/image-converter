import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import JSZip from "jszip";
import {
  Upload,
  Download,
  Image as ImageIcon,
  RotateCcw,
  Trash2,
  CheckCircle,
  AlertCircle,
  Clock,
  Archive,
} from "lucide-react";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";

type ConversionFormat = "png" | "jpg" | "webp" | "gif" | "bmp" | "tiff";

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  status: "pending" | "converting" | "completed" | "error";
  progress: number;
  error?: string;
  convertedBlob?: Blob;
}

interface BatchHistory {
  id: string;
  timestamp: Date;
  totalImages: number;
  format: ConversionFormat;
  successCount: number;
}

const FORMAT_OPTIONS: { value: ConversionFormat; label: string; mimeType: string }[] = [
  { value: "png", label: "PNG", mimeType: "image/png" },
  { value: "jpg", label: "JPG", mimeType: "image/jpeg" },
  { value: "webp", label: "WEBP", mimeType: "image/webp" },
  { value: "gif", label: "GIF", mimeType: "image/gif" },
  { value: "bmp", label: "BMP", mimeType: "image/bmp" },
  { value: "tiff", label: "TIFF", mimeType: "image/tiff" },
];

export default function BatchConverter() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<ConversionFormat>("png");
  const [isConverting, setIsConverting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [batchHistory, setBatchHistory] = useState<BatchHistory[]>([]);
  const [isCreatingZip, setIsCreatingZip] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load batch history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem("batchHistory");
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setBatchHistory(
          parsed.map((item: any) => ({ ...item, timestamp: new Date(item.timestamp) }))
        );
      } catch (error) {
        console.error("Failed to load batch history:", error);
      }
    }
  }, []);

  // Save batch history to localStorage
  useEffect(() => {
    localStorage.setItem("batchHistory", JSON.stringify(batchHistory));
  }, [batchHistory]);

  const handleFileSelect = (files: FileList) => {
    const newImages: ImageFile[] = [];

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} não é uma imagem válida`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageFile: ImageFile = {
          id: Math.random().toString(36).substr(2, 9),
          file,
          preview: e.target?.result as string,
          status: "pending",
          progress: 0,
        };
        setImages((prev) => [...prev, imageFile]);
      };
      reader.readAsDataURL(file);
    });
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
    if (e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const convertImage = (imageFile: ImageFile): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(null);
          return;
        }

        ctx.drawImage(img, 0, 0);

        const format = FORMAT_OPTIONS.find((f) => f.value === selectedFormat);
        if (!format) {
          resolve(null);
          return;
        }

        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          format.mimeType,
          selectedFormat === "jpg" ? 0.95 : undefined
        );
      };

      img.onerror = () => {
        resolve(null);
      };

      img.src = imageFile.preview;
    });
  };

  const startBatchConversion = async () => {
    if (images.length === 0) {
      toast.error("Selecione pelo menos uma imagem");
      return;
    }

    setIsConverting(true);
    let successCount = 0;

    for (let i = 0; i < images.length; i++) {
      const imageFile = images[i];

      // Update status to converting
      setImages((prev) =>
        prev.map((img) =>
          img.id === imageFile.id ? { ...img, status: "converting", progress: 0 } : img
        )
      );

      try {
        const blob = await convertImage(imageFile);

        if (blob) {
          successCount++;
          setImages((prev) =>
            prev.map((img) =>
              img.id === imageFile.id
                ? { ...img, status: "completed", progress: 100, convertedBlob: blob }
                : img
            )
          );
        } else {
          setImages((prev) =>
            prev.map((img) =>
              img.id === imageFile.id
                ? { ...img, status: "error", error: "Falha ao converter imagem" }
                : img
            )
          );
        }
      } catch (error) {
        setImages((prev) =>
          prev.map((img) =>
            img.id === imageFile.id
              ? { ...img, status: "error", error: "Erro durante conversão" }
              : img
          )
        );
      }

      // Simulate progress
      for (let j = 0; j < 100; j += 10) {
        await new Promise((resolve) => setTimeout(resolve, 10));
        if (j < 90) {
          setImages((prev) =>
            prev.map((img) =>
              img.id === imageFile.id ? { ...img, progress: j } : img
            )
          );
        }
      }
    }

    // Add to batch history
    const historyItem: BatchHistory = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      totalImages: images.length,
      format: selectedFormat,
      successCount,
    };
    setBatchHistory([historyItem, ...batchHistory]);

    setIsConverting(false);
    toast.success(`${successCount} de ${images.length} imagens convertidas com sucesso!`);
  };

  const downloadAllImages = async () => {
    const convertedImages = images.filter((img) => img.convertedBlob && img.status === "completed");

    if (convertedImages.length === 0) {
      toast.error("Nenhuma imagem convertida para download");
      return;
    }

    // Download individual files
    convertedImages.forEach((img) => {
      if (img.convertedBlob) {
        const link = document.createElement("a");
        const nameWithoutExt = img.file.name.split(".")[0];
        link.href = URL.createObjectURL(img.convertedBlob);
        link.download = `${nameWithoutExt}.${selectedFormat}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });

    toast.success(`${convertedImages.length} imagens baixadas!`);
  };

  const downloadAsZip = async () => {
    const convertedImages = images.filter((img) => img.convertedBlob && img.status === "completed");

    if (convertedImages.length === 0) {
      toast.error("Nenhuma imagem convertida para download");
      return;
    }

    setIsCreatingZip(true);
    try {
      const zip = new JSZip();
      const folder = zip.folder("imagens-convertidas");

      if (!folder) {
        throw new Error("Falha ao criar pasta no ZIP");
      }

      convertedImages.forEach((img) => {
        if (img.convertedBlob) {
          const nameWithoutExt = img.file.name.split(".")[0];
          const filename = `${nameWithoutExt}.${selectedFormat}`;
          folder.file(filename, img.convertedBlob);
        }
      });

      const zipBlob = await zip.generateAsync({ type: "blob" });

      const link = document.createElement("a");
      const timestamp = new Date().toISOString().slice(0, 10);
      link.href = URL.createObjectURL(zipBlob);
      link.download = `imagens-convertidas-${timestamp}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`ZIP com ${convertedImages.length} imagens baixado com sucesso!`);
    } catch (error) {
      console.error("Erro ao criar ZIP:", error);
      toast.error("Erro ao criar arquivo ZIP");
    } finally {
      setIsCreatingZip(false);
    }
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const clearAll = () => {
    setImages([]);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "converting":
        return <Clock className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const totalProgress = images.length > 0
    ? Math.round(images.reduce((sum, img) => sum + img.progress, 0) / images.length)
    : 0;

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
            <Link href="/batch">
              <Button variant="ghost" size="sm" className="opacity-60">
                Lote
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
              Conversão em Lote
            </h1>
            <p className="text-lg text-muted-foreground">
              Converta múltiplas imagens simultaneamente com progresso visual
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Area */}
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
                  multiple
                  onChange={(e) => {
                    if (e.target.files) {
                      handleFileSelect(e.target.files);
                    }
                  }}
                  className="hidden"
                />
                <Upload className="w-12 h-12 text-accent mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Arraste múltiplas imagens aqui
                </h3>
                <p className="text-muted-foreground mb-4">
                  ou clique para selecionar vários arquivos
                </p>
                <p className="text-sm text-muted-foreground">
                  PNG, JPG, WEBP, GIF, BMP, TIFF
                </p>
              </div>

              {/* Format Selection */}
              {images.length > 0 && (
                <div className="p-6 rounded-2xl border border-border/40 bg-card/50">
                  <label className="block text-sm font-semibold text-foreground mb-4">
                    Formato de Saída
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {FORMAT_OPTIONS.map((format) => (
                      <button
                        key={format.value}
                        onClick={() => setSelectedFormat(format.value)}
                        disabled={isConverting}
                        className={`py-2 px-3 rounded-lg font-medium smooth-transition disabled:opacity-50 ${
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
              )}

              {/* Overall Progress */}
              {images.length > 0 && isConverting && (
                <div className="p-6 rounded-2xl border border-border/40 bg-card/50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-foreground">Progresso Geral</h3>
                    <span className="text-sm font-semibold text-accent">{totalProgress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-accent h-2 rounded-full smooth-transition"
                      style={{ width: `${totalProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Images List */}
              {images.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">
                      {images.length} imagem{images.length !== 1 ? "s" : ""} selecionada{images.length !== 1 ? "s" : ""}
                    </h3>
                    <Button
                      onClick={clearAll}
                      disabled={isConverting}
                      variant="ghost"
                      size="sm"
                      className="gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Limpar Tudo
                    </Button>
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {images.map((img) => (
                      <div
                        key={img.id}
                        className="p-4 rounded-xl border border-border/40 bg-muted/30"
                      >
                        <div className="flex items-start gap-4">
                          <img
                            src={img.preview}
                            alt={img.file.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              {getStatusIcon(img.status)}
                              <p className="text-sm font-medium text-foreground truncate">
                                {img.file.name}
                              </p>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">
                              {formatFileSize(img.file.size)}
                            </p>
                            {img.status === "converting" && (
                              <div className="w-full bg-muted rounded-full h-1">
                                <div
                                  className="bg-accent h-1 rounded-full smooth-transition"
                                  style={{ width: `${img.progress}%` }}
                                />
                              </div>
                            )}
                            {img.status === "error" && (
                              <p className="text-xs text-red-500">{img.error}</p>
                            )}
                            {img.status === "completed" && img.convertedBlob && (
                              <p className="text-xs text-green-500">
                                {formatFileSize(img.convertedBlob.size)}
                              </p>
                            )}
                          </div>
                          <Button
                            onClick={() => removeImage(img.id)}
                            disabled={isConverting}
                            variant="ghost"
                            size="sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {images.length > 0 && (
                <div className="space-y-3">
                  <div className="flex gap-4">
                    <Button
                      onClick={startBatchConversion}
                      disabled={isConverting || isCreatingZip}
                      className="flex-1"
                      size="lg"
                    >
                      {isConverting ? "Convertendo..." : "Iniciar Conversão"}
                    </Button>
                  </div>
                  {images.some((img) => img.status === "completed") && (
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        onClick={downloadAllImages}
                        disabled={isConverting || isCreatingZip}
                        variant="outline"
                        size="lg"
                        className="gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Individual
                      </Button>
                      <Button
                        onClick={downloadAsZip}
                        disabled={isConverting || isCreatingZip}
                        variant="default"
                        size="lg"
                        className="gap-2 bg-accent hover:bg-accent/90"
                      >
                        <Archive className="w-4 h-4" />
                        {isCreatingZip ? "Criando..." : "ZIP"}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar - History */}
            <div className="lg:col-span-1">
              <div className="p-6 rounded-2xl border border-border/40 bg-card/50 sticky top-24">
                <div className="flex items-center gap-2 mb-6">
                  <Clock className="w-5 h-5 text-accent" />
                  <h3 className="text-lg font-semibold text-foreground">Histórico</h3>
                </div>

                {batchHistory.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Nenhuma conversão em lote realizada ainda
                  </p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {batchHistory.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-lg bg-muted/50 hover:bg-muted smooth-transition"
                      >
                        <p className="text-xs font-medium text-foreground">
                          {item.totalImages} imagem{item.totalImages !== 1 ? "s" : ""}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          → {item.format.toUpperCase()}
                        </p>
                        <p className="text-xs text-green-500 mt-1">
                          ✓ {item.successCount} sucesso
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
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
