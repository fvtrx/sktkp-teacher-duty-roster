import React, { useState } from "react";
import { Button } from "@src/components/ui/button";
import { Download } from "lucide-react";

declare global {
  interface Window {
    html2canvas: (
      element: HTMLElement,
      options: any
    ) => Promise<HTMLCanvasElement>;
  }
}

const DownloadTableImage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsLoading(true);

      // Find the table element
      const tableElement = document.querySelector(".table-container");
      if (!tableElement) {
        throw new Error("Table element not found");
      }

      // Check if html2canvas is already loaded
      if (!window.html2canvas) {
        // Load html2canvas
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src =
            "https://html2canvas.hertzen.com/dist/html2canvas.min.js";
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      // Convert table to canvas
      const canvas = await window.html2canvas(tableElement as HTMLElement, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        logging: true,
      });

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        try {
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Failed to create blob"));
            }
          }, "image/png");
        } catch (error) {
          reject(error);
        }
      });

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const date = new Date().toISOString().split("T")[0];
      link.href = url;
      link.download = `jadual-bertugas-${date}.png`;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PNG:", error);
      alert("Failed to download image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      variant="outline"
      size="sm"
      className="text-sm md:text-base flex items-center gap-2"
      disabled={isLoading}
    >
      <Download className="h-4 w-4" />
      <span>{isLoading ? "Sedang diproses..." : "Muat turun jadual"}</span>
    </Button>
  );
};

export default DownloadTableImage;
