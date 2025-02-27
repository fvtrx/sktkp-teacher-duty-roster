import { Button } from "@src/components/ui/button";
import { Download } from "lucide-react";
import React, { useState } from "react";

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

interface DownloadTableImageProps {
  isFormEmpty: boolean;
  onBeforeDownload?: () => boolean;
}

const DownloadTableImage: React.FC<DownloadTableImageProps> = ({
  isFormEmpty,
  onBeforeDownload,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    // Check if onBeforeDownload is provided and execute it
    if (onBeforeDownload && !onBeforeDownload()) {
      // If onBeforeDownload returns false, abort the download
      return;
    }

    try {
      setIsLoading(true);

      // Find the table container
      const tableContainer = document.querySelector(".table-container");
      if (!tableContainer) {
        throw new Error("Table element not found");
      }

      // Create a clone of the table container
      const clone = tableContainer.cloneNode(true) as HTMLElement;

      // Apply desktop styling to the clone with improved visibility
      clone.style.cssText = `
        width: 800px;
        position: absolute;
        left: -9999px;
        top: ${window.scrollY}px;
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: none;
        z-index: -1;
        visibility: visible;
        opacity: 1;
      `;

      // Add a title to the exported table for better context
      const titleDiv = document.createElement("div");
      titleDiv.style.cssText = `
        text-align: center;
        margin-bottom: 15px;
        font-weight: bold;
        font-size: 24px;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
        color: #000000;
        padding: 8px;
      `;
      titleDiv.textContent = "Jadual Bertugas Guru SKTKP";
      clone.insertBefore(titleDiv, clone.firstChild);

      // Add the clone to the document
      document.body.appendChild(clone);

      // Insert the CSS styles for better rendering
      const styleElement = document.createElement("style");
      styleElement.textContent = `
        .waktu-cell {
          display: table-cell !important;
          visibility: visible !important;
          text-align: center !important;
          vertical-align: middle !important;
          background-color: #f9f9f9 !important;
          font-weight: bold !important;
          position: relative !important;
          color: #000000 !important;
          font-size: 16px !important;
        }
        
        .table-container tr td[rowspan] {
          position: relative !important;
          z-index: 2 !important;
        }
        
        /* Fix for badge visibility */
        .bg-blue-100, .bg-green-100, .bg-indigo-100, .bg-purple-100 {
          display: inline-block !important;
          padding: 4px 10px !important;
          margin: 3px !important;
          border-radius: 9999px !important;
          font-weight: 600 !important;
          font-size: 0.8rem !important;
          line-height: 1.25 !important;
        }
        
        /* Time period sections */
        td:empty {
          display: none !important;
        }
        
        /* Fix for "Belum dipilih" text */
        .text-gray-400 {
          font-style: italic !important;
          color: #9ca3af !important;
        }
      `;
      clone.appendChild(styleElement);

      // Force desktop layout styles on the table
      const tableElement = clone.querySelector("table");
      if (tableElement) {
        tableElement.style.cssText = `
          width: 100%;
          border-collapse: collapse;
          border: 2px solid #000000;
          background-color: #FFFFFF;
          table-layout: fixed;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
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

        // Apply waktu-cell class to all time section headers (PAGI, REHAT, PULANG, BUKU LAPORAN)
        const timeHeaders = tableElement.querySelectorAll(
          "td[rowspan], td.font-medium"
        );
        timeHeaders.forEach((header) => {
          (header as HTMLElement).classList.add("waktu-cell");

          // Get the time period from the header (PAGI, REHAT, PULANG, BUKU LAPORAN)
          const headerText = header.textContent?.trim() || "";

          // Set specific color based on the time period
          let textColor = "#000000";
          let bgColor = "#f9f9f9";

          if (headerText.includes("PAGI")) {
            textColor = "#1e40af"; // dark blue
            bgColor = "#dbeafe"; // light blue
          } else if (headerText.includes("REHAT")) {
            textColor = "#047857"; // dark green
            bgColor = "#d1fae5"; // light green
          } else if (headerText.includes("PULANG")) {
            textColor = "#4338ca"; // dark indigo
            bgColor = "#e0e7ff"; // light indigo
          } else if (headerText.includes("BUKU LAPORAN")) {
            textColor = "#6d28d9"; // dark purple
            bgColor = "#ede9fe"; // light purple
          }

          (header as HTMLElement).style.cssText = `
            padding: 12px;
            border: 1px solid #000000;
            color: ${textColor};
            font-weight: bold;
            text-align: center;
            vertical-align: middle;
            background-color: ${bgColor};
            display: table-cell !important;
            visibility: visible !important;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
            font-size: 16px;
            position: relative;
            z-index: 2;
          `;

          // Replace emoji if needed
          if (header.textContent?.includes("📌")) {
            header.innerHTML = header.innerHTML.replace("📌", "📍");
          }
        });

        // Style alternating rows for better readability
        const rows = tableElement.querySelectorAll("tr");
        rows.forEach((row, index) => {
          if (index > 0) {
            // Skip header row
            row.style.backgroundColor = index % 2 === 0 ? "#FFFFFF" : "#F9FAFB";
          }
        });

        // Style the badge/pills for teachers with improved styling
        const blueBadges = tableElement.querySelectorAll(".bg-blue-100");
        const greenBadges = tableElement.querySelectorAll(".bg-green-100");
        const indigoBadges = tableElement.querySelectorAll(".bg-indigo-100");
        const purpleBadges = tableElement.querySelectorAll(".bg-purple-100");

        // Base badge style that looks more attractive
        const baseBadgeStyle = `
          display: inline-block;
          padding: 5px 12px;
          margin: 3px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 12px;
          line-height: 1.4;
          text-align: center;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
        `;

        // Apply specific styling for each badge type
        blueBadges.forEach((badge) => {
          (badge as HTMLElement).style.cssText = `
            ${baseBadgeStyle}
            color: #1e3a8a;
            background-color: #dbeafe;
            border: none;
          `;
        });

        greenBadges.forEach((badge) => {
          (badge as HTMLElement).style.cssText = `
            ${baseBadgeStyle}
            color: #065f46;
            background-color: #d1fae5;
            border: none;
          `;
        });

        indigoBadges.forEach((badge) => {
          (badge as HTMLElement).style.cssText = `
            ${baseBadgeStyle}
            color: #3730a3;
            background-color: #e0e7ff;
            border: none;
          `;
        });

        purpleBadges.forEach((badge) => {
          (badge as HTMLElement).style.cssText = `
            ${baseBadgeStyle}
            color: #5b21b6;
            background-color: #ede9fe;
            border: none;
          `;
        });

        // Keep the color coding for different sections
        const blueRows = tableElement.querySelectorAll(".hover\\:bg-blue-50");
        const greenRows = tableElement.querySelectorAll(".hover\\:bg-green-50");
        const indigoRows = tableElement.querySelectorAll(
          ".hover\\:bg-indigo-50"
        );
        const purpleRows = tableElement.querySelectorAll(
          ".hover\\:bg-purple-50"
        );

        blueRows.forEach((row) => {
          (row as HTMLElement).style.borderLeft = "3px solid #3b82f6";
        });

        greenRows.forEach((row) => {
          (row as HTMLElement).style.borderLeft = "3px solid #10b981";
        });

        indigoRows.forEach((row) => {
          (row as HTMLElement).style.borderLeft = "3px solid #6366f1";
        });

        purpleRows.forEach((row) => {
          (row as HTMLElement).style.borderLeft = "3px solid #8b5cf6";
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

      // Add a timestamp at the bottom of the table
      const dateDiv = document.createElement("div");
      const today = new Date();
      const formattedDate = today.toLocaleDateString("ms-MY", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      dateDiv.style.cssText = `
        text-align: right;
        margin-top: 10px;
        font-style: italic;
        color: #6b7280;
        font-size: 12px;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      `;
      dateDiv.textContent = `Dihasilkan pada: ${formattedDate}`;
      clone.appendChild(dateDiv);

      // Prior to canvas conversion, make one more pass to directly style all badges
      // This ensures they are styled correctly regardless of their class names
      const allBadgesContainer = clone.querySelectorAll(
        ".flex.flex-wrap.gap-1"
      );
      allBadgesContainer.forEach((container) => {
        const spanElements = container.querySelectorAll("span");
        spanElements.forEach((span) => {
          let badgeColor = "#dbeafe"; // Default blue
          let textColor = "#1e3a8a";

          // Identify badge color context based on its position in the table
          const rowElement = span.closest("tr");
          if (rowElement) {
            if (rowElement.classList.contains("hover:bg-green-50")) {
              badgeColor = "#d1fae5"; // Green background
              textColor = "#065f46"; // Green text
            } else if (rowElement.classList.contains("hover:bg-indigo-50")) {
              badgeColor = "#e0e7ff"; // Indigo background
              textColor = "#3730a3"; // Indigo text
            } else if (rowElement.classList.contains("hover:bg-purple-50")) {
              badgeColor = "#ede9fe"; // Purple background
              textColor = "#5b21b6"; // Purple text
            }
          }

          // Apply specific styling directly
          (span as HTMLElement).style.cssText = `
            display: inline-block;
            padding: 5px 12px;
            margin: 3px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 12px;
            line-height: 1.4;
            text-align: center;
            color: ${textColor};
            background-color: ${badgeColor};
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
          `;
        });
      });

      // Convert to canvas with improved settings
      const canvas = await window.html2canvas(clone, {
        backgroundColor: "#ffffff",
        scale: 3.0, // Even higher resolution for better text clarity
        useCORS: true,
        logging: false,
        width: 800,
        windowWidth: 1920,
        onclone: (clonedDoc) => {
          // Get the cloned table container
          const clonedElement = clonedDoc.body.querySelector(
            ".table-container"
          ) as HTMLElement;

          if (clonedElement) {
            // Reset any transforms
            clonedElement.style.transform = "none";

            // Apply the waktu-cell class to all cells with rowspan
            const timeHeaders = clonedElement.querySelectorAll(
              "td[rowspan], td.font-medium"
            );
            timeHeaders.forEach((cell) => {
              cell.classList.add("waktu-cell");

              // Get the time period from the header
              const headerText = cell.textContent?.trim() || "";

              // Set specific color based on the time period
              let textColor = "#000000";
              let bgColor = "#f9f9f9";

              if (headerText.includes("PAGI")) {
                textColor = "#1e40af"; // dark blue
                bgColor = "#dbeafe"; // light blue
              } else if (headerText.includes("REHAT")) {
                textColor = "#047857"; // dark green
                bgColor = "#d1fae5"; // light green
              } else if (headerText.includes("PULANG")) {
                textColor = "#4338ca"; // dark indigo
                bgColor = "#e0e7ff"; // light indigo
              } else if (headerText.includes("BUKU LAPORAN")) {
                textColor = "#6d28d9"; // dark purple
                bgColor = "#ede9fe"; // light purple
              }

              (cell as HTMLElement).style.display = "table-cell";
              (cell as HTMLElement).style.visibility = "visible";
              (cell as HTMLElement).style.backgroundColor = bgColor;
              (cell as HTMLElement).style.color = textColor;
              (cell as HTMLElement).style.fontWeight = "bold";
              (cell as HTMLElement).style.textAlign = "center";
              (cell as HTMLElement).style.verticalAlign = "middle";
              (cell as HTMLElement).style.position = "relative";
              (cell as HTMLElement).style.zIndex = "2";
              (cell as HTMLElement).style.fontSize = "16px";

              // Replace emoji if needed to ensure visibility
              if (cell.textContent?.includes("📌")) {
                cell.innerHTML = cell.innerHTML.replace("📌", "📍");
              }
            });

            // Ensure emoji are visible by finding all td elements and checking their text content
            const allTdElements = clonedElement.querySelectorAll("td");
            allTdElements.forEach((elem) => {
              if (elem.textContent?.includes("📌")) {
                (elem as HTMLElement).style.fontSize = "16px";
              }
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

      // Download the image
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const date = new Date().toISOString().split("T")[0];
      link.href = url;
      link.download = `jadual-bertugas-guru-sktkp-${date}.png`;
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
      disabled={isLoading || isFormEmpty}
    >
      <Download className="h-4 w-4" />
      <span>{isLoading ? "Sedang diproses..." : "Muat turun jadual"}</span>
    </Button>
  );
};

export default DownloadTableImage;
