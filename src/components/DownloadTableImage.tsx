import React, { useState } from "react";
import { Button } from "@src/components/ui/button";
import { Download } from "lucide-react";

declare global {
  interface Window {
    html2canvas: (
      element: HTMLElement,
      options: {
        backgroundColor: string;
        scale: number;
        useCORS: boolean;
        logging: boolean;
        windowWidth: number;
        width: number;
        onclone: (event: Document) => void;
      }
    ) => Promise<HTMLCanvasElement>;
  }
}

const DownloadTableImage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsLoading(true);

      // Find the table container
      const tableContainer = document.querySelector(".table-container");
      if (!tableContainer) {
        throw new Error("Table element not found");
      }

      // Create a clone of the table container
      const clone = tableContainer.cloneNode(true) as HTMLElement;

      // Apply desktop styling to the clone
      clone.style.cssText = `
        width: 800px;
        position: absolute;
        left: -9999px;
        top: ${window.scrollY}px;
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: none;
      `;

      // Add the clone to the document
      document.body.appendChild(clone);

      // Force desktop layout styles
      const tableElement = clone.querySelector("table");
      if (tableElement) {
        tableElement.style.cssText = `
          width: 100%;
          border-collapse: collapse;
          border: 1px solid #000000;
          background-color: #FFFFFF;
        `;

        // Style all cells
        const cells = tableElement.querySelectorAll("td, th");
        cells.forEach((cell) => {
          (cell as HTMLElement).style.cssText = `
            padding: 12px;
            border: 1px solid #000000;
            color: #000000;
            font-family: Arial, sans-serif;
          `;
        });

        // Style headers
        const headers = tableElement.querySelectorAll("th");
        headers.forEach((header) => {
          (header as HTMLElement).style.cssText = `
            padding: 12px;
            border: 1px solid #000000;
            background-color: #F3F4F6;
            color: #000000;
            font-weight: bold;
            text-align: left;
            font-family: Arial, sans-serif;
          `;
        });

        // First fix the section headers (PAGI, REHAT, PULANG)
        const sections = ["PAGI", "REHAT", "PULANG", "BUKU LAPORAN"];
        sections.forEach((section) => {
          const sectionCell = tableElement.querySelector(
            `td[rowspan]:has(span:contains("${section}"))`
          ) as HTMLElement;
          if (sectionCell) {
            sectionCell.style.cssText = `
              padding: 12px;
              border: 1px solid #000000;
              background-color: #FFFFFF;
              color: #000000;
              font-weight: bold;
              width: 120px;
              font-family: Arial, sans-serif;
              vertical-align: middle;
              display: table-cell;
              visibility: visible;
            `;
            // Make the emoji and text visible
            const emojiSpan = sectionCell.querySelector("span") as HTMLElement;
            if (emojiSpan) {
              emojiSpan.style.cssText = `
                display: inline;
                visibility: visible;
              `;
            }
          }
        });

        // Style alternating rows but preserve section header background
        const rows = tableElement.querySelectorAll("tr");
        rows.forEach((row, index) => {
          if (index > 0) {
            // Skip header row
            const cells = row.querySelectorAll("td:not([rowspan])");
            cells.forEach((cell) => {
              (cell as HTMLElement).style.backgroundColor =
                index % 2 === 0 ? "#FFFFFF" : "#F9FAFB";
            });
          }
        });
      }

      // Check if html2canvas is loaded
      if (!window.html2canvas) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src =
            "https://html2canvas.hertzen.com/dist/html2canvas.min.js";
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      // Convert to canvas with specific settings for better text rendering
      const canvas = await window.html2canvas(clone, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        logging: false,
        width: 800,
        windowWidth: 1920,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.body.querySelector(
            ".table-container"
          ) as HTMLElement;
          if (clonedElement) {
            clonedElement.style.transform = "none";
            // Ensure all text is rendered
            const allText = clonedElement.querySelectorAll("td, th, span");
            allText.forEach((element) => {
              (element as HTMLElement).style.visibility = "visible";
              (element as HTMLElement).style.display =
                element.tagName === "SPAN" ? "inline" : "table-cell";
            });
          }
        },
      });

      // Convert to blob with maximum quality
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => {
            if (b) resolve(b);
            else reject(new Error("Failed to create blob"));
          },
          "image/png",
          1.0
        );
      });

      // Download
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const date = new Date().toISOString().split("T")[0];
      link.href = url;
      link.download = `jadual-bertugas-${date}.png`;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      document.body.removeChild(clone);
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
