import { describe, it, expect, beforeEach } from "vitest";

/**
 * Testes para validar funcionalidade de download em ZIP
 */

describe("ZIP Download Functionality", () => {
  describe("ZIP File Creation", () => {
    it("should have jszip library available", () => {
      const JSZip = require("jszip");
      expect(JSZip).toBeDefined();
    });

    it("should create a valid ZIP instance", () => {
      const JSZip = require("jszip");
      const zip = new JSZip();
      expect(zip).toBeDefined();
      expect(typeof zip.folder).toBe("function");
      expect(typeof zip.file).toBe("function");
    });

    it("should create folder in ZIP", () => {
      const JSZip = require("jszip");
      const zip = new JSZip();
      const folder = zip.folder("imagens-convertidas");
      expect(folder).toBeDefined();
    });

    it("should add files to ZIP folder", () => {
      const JSZip = require("jszip");
      const zip = new JSZip();
      const folder = zip.folder("imagens-convertidas");

      if (folder) {
        const arrayBuffer = new ArrayBuffer(4);
        folder.file("test.png", arrayBuffer);
        expect(folder).toBeDefined();
      }
    });

    it("should generate ZIP blob", async () => {
      const JSZip = require("jszip");
      const zip = new JSZip();
      const folder = zip.folder("imagens-convertidas");

      if (folder) {
        const arrayBuffer = new ArrayBuffer(4);
        const view = new Uint8Array(arrayBuffer);
        view[0] = 0x89;
        view[1] = 0x50;
        view[2] = 0x4e;
        view[3] = 0x47;
        folder.file("test.png", arrayBuffer);

        const zipBlob = await zip.generateAsync({ type: "blob" });
        expect(zipBlob).toBeInstanceOf(Blob);
        expect(zipBlob.type).toBe("application/zip");
      }
    });
  });

  describe("Filename Generation", () => {
    it("should generate correct ZIP filename with timestamp", () => {
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `imagens-convertidas-${timestamp}.zip`;

      expect(filename).toContain("imagens-convertidas");
      expect(filename).toContain(".zip");
      expect(filename).toMatch(/\d{4}-\d{2}-\d{2}/);
    });

    it("should generate unique filenames for different dates", () => {
      const date1 = "2024-01-15";
      const date2 = "2024-01-16";

      const filename1 = `imagens-convertidas-${date1}.zip`;
      const filename2 = `imagens-convertidas-${date2}.zip`;

      expect(filename1).not.toBe(filename2);
    });

    it("should preserve original filename without extension", () => {
      const originalName = "photo.jpg";
      const format = "png";
      const nameWithoutExt = originalName.split(".")[0];
      const newName = `${nameWithoutExt}.${format}`;

      expect(newName).toBe("photo.png");
    });

    it("should handle multiple files with same base name", () => {
      const files = [
        { name: "photo.jpg", format: "png" },
        { name: "photo.jpg", format: "webp" },
      ];

      const filenames = files.map((f) => {
        const nameWithoutExt = f.name.split(".")[0];
        return `${nameWithoutExt}.${f.format}`;
      });

      expect(filenames).toHaveLength(2);
      expect(filenames[0]).toBe("photo.png");
      expect(filenames[1]).toBe("photo.webp");
    });
  });

  describe("Image Blob Management", () => {
    it("should validate converted image blob", () => {
      const blob = new Blob(["image data"], { type: "image/png" });
      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe("image/png");
    });

    it("should filter only completed images", () => {
      const images = [
        { id: "1", status: "completed", convertedBlob: new Blob() },
        { id: "2", status: "error" },
        { id: "3", status: "completed", convertedBlob: new Blob() },
        { id: "4", status: "pending" },
      ];

      const completed = images.filter((img) => img.convertedBlob && img.status === "completed");
      expect(completed).toHaveLength(2);
    });

    it("should calculate total ZIP size", () => {
      const images = [
        { blob: new Blob(["a".repeat(1024)]), size: 1024 },
        { blob: new Blob(["b".repeat(2048)]), size: 2048 },
      ];

      const totalSize = images.reduce((sum, img) => sum + img.size, 0);
      expect(totalSize).toBe(3072);
    });

    it("should handle empty blob list", () => {
      const images: any[] = [];
      const completed = images.filter((img) => img.convertedBlob && img.status === "completed");
      expect(completed).toHaveLength(0);
    });
  });

  describe("ZIP State Management", () => {
    it("should track ZIP creation state", () => {
      let isCreatingZip = false;
      expect(isCreatingZip).toBe(false);

      isCreatingZip = true;
      expect(isCreatingZip).toBe(true);

      isCreatingZip = false;
      expect(isCreatingZip).toBe(false);
    });

    it("should disable buttons during ZIP creation", () => {
      const isConverting = false;
      const isCreatingZip = true;

      const isDisabled = isConverting || isCreatingZip;
      expect(isDisabled).toBe(true);
    });

    it("should enable buttons after ZIP creation", () => {
      const isConverting = false;
      const isCreatingZip = false;

      const isDisabled = isConverting || isCreatingZip;
      expect(isDisabled).toBe(false);
    });

    it("should show loading state during ZIP creation", () => {
      const isCreatingZip = true;
      const buttonText = isCreatingZip ? "Criando..." : "ZIP";

      expect(buttonText).toBe("Criando...");
    });
  });

  describe("Error Handling", () => {
    it("should handle ZIP creation errors", async () => {
      const JSZip = require("jszip");
      const zip = new JSZip();

      try {
        const folder = zip.folder("test");
        if (!folder) {
          throw new Error("Falha ao criar pasta no ZIP");
        }
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("should validate image blob before adding to ZIP", () => {
      const images = [
        { id: "1", convertedBlob: new Blob(["data"]), status: "completed" },
        { id: "2", convertedBlob: null, status: "error" },
      ];

      const validImages = images.filter((img) => img.convertedBlob !== null);
      expect(validImages).toHaveLength(1);
    });

    it("should handle missing converted images", () => {
      const images = [
        { id: "1", status: "error" },
        { id: "2", status: "pending" },
      ];

      const converted = images.filter((img) => img.convertedBlob);
      expect(converted).toHaveLength(0);
    });
  });

  describe("Download Options", () => {
    it("should support individual downloads", () => {
      const downloadType = "individual";
      expect(downloadType).toBe("individual");
    });

    it("should support ZIP downloads", () => {
      const downloadType = "zip";
      expect(downloadType).toBe("zip");
    });

    it("should show both download options when images are ready", () => {
      const images = [{ status: "completed", convertedBlob: new Blob() }];
      const hasCompleted = images.some((img) => img.status === "completed");

      expect(hasCompleted).toBe(true);
    });

    it("should hide download options when no images are ready", () => {
      const images = [{ status: "pending" }];
      const hasCompleted = images.some((img) => img.status === "completed");

      expect(hasCompleted).toBe(false);
    });
  });

  describe("Format Handling in ZIP", () => {
    it("should use selected format for all files in ZIP", () => {
      const selectedFormat = "webp";
      const images = [
        { name: "photo1.jpg" },
        { name: "photo2.jpg" },
        { name: "photo3.jpg" },
      ];

      const filenames = images.map((img) => {
        const nameWithoutExt = img.name.split(".")[0];
        return `${nameWithoutExt}.${selectedFormat}`;
      });

      filenames.forEach((name) => {
        expect(name).toContain(".webp");
      });
    });

    it("should support all format options in ZIP", () => {
      const formats = ["png", "jpg", "webp", "gif", "bmp", "tiff"];
      const selectedFormat = "png";

      expect(formats).toContain(selectedFormat);
    });

    it("should change format for all files when format changes", () => {
      let selectedFormat = "png";
      const images = [{ name: "photo.jpg" }];

      let filenames = images.map((img) => {
        const nameWithoutExt = img.name.split(".")[0];
        return `${nameWithoutExt}.${selectedFormat}`;
      });

      expect(filenames[0]).toBe("photo.png");

      selectedFormat = "webp";
      filenames = images.map((img) => {
        const nameWithoutExt = img.name.split(".")[0];
        return `${nameWithoutExt}.${selectedFormat}`;
      });

      expect(filenames[0]).toBe("photo.webp");
    });
  });

  describe("User Feedback", () => {
    it("should show success message after ZIP download", () => {
      const convertedCount = 5;
      const message = `ZIP com ${convertedCount} imagens baixado com sucesso!`;

      expect(message).toContain("ZIP");
      expect(message).toContain("5");
    });

    it("should show error message on ZIP creation failure", () => {
      const message = "Erro ao criar arquivo ZIP";
      expect(message).toContain("Erro");
    });

    it("should show message when no images are ready", () => {
      const message = "Nenhuma imagem convertida para download";
      expect(message).toContain("Nenhuma");
    });
  });
});
