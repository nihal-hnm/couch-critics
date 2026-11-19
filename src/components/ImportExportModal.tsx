/**
 * =============================================================================
 * Import & Export / Backup Modal
 * =============================================================================
 *
 * Supports:
 *   1. Letterboxd CSV Import (ratings.csv, watched.csv, watchlist.csv)
 *   2. Generic CSV Import (Title, Year, Rating, Shelf)
 *   3. JSON Full Journal Backup & Restore (zero cloud dependency)
 *   4. Export to Letterboxd CSV format
 */

"use client";

import { useState, useRef } from "react";
import {
  X,
  Upload,
  Download,
  FileSpreadsheet,
  Database,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  Sparkles,
} from "lucide-react";
import type { MovieEntry, Shelf } from "@/lib/types";
import { useJournal } from "@/lib/journal-context";
import { searchMovies } from "@/lib/tmdb";

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ParsedCSVRow {
  title: string;
  year: string;
  rating?: number;
  shelf: Shelf;
  dateCompleted?: string;
  uri?: string;
}

export function ImportExportModal({ isOpen, onClose }: ImportExportModalProps) {
  const { entries, importEntries } = useJournal();
  const [activeTab, setActiveTab] = useState<"import-csv" | "export" | "backup">("import-csv");

  // Import State
  const [parsedRows, setParsedRows] = useState<ParsedCSVRow[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [importMode, setImportMode] = useState<"merge" | "replace">("merge");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressCount, setProgressCount] = useState(0);
  const [importStatus, setImportStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // ── CSV Parsing Logic ──────────────────────────────────────────────────────
  function parseCSV(text: string): ParsedCSVRow[] {
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) return [];

    const header = lines[0].toLowerCase();
    const rows: ParsedCSVRow[] = [];

    // Helper to parse CSV line respecting quotes
    function parseCSVLine(line: string): string[] {
      const result: string[] = [];
      let current = "";
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"' || char === "'") {
          inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
          result.push(current.trim());
          current = "";
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    }

    const headers = parseCSVLine(header).map((h) => h.toLowerCase().replace(/['"]/g, ""));
    const nameIndex = headers.findIndex((h) => h === "name" || h === "title" || h === "film");
    const yearIndex = headers.findIndex((h) => h === "year" || h === "release year");
    const ratingIndex = headers.findIndex((h) => h === "rating" || h === "user rating");
    const dateIndex = headers.findIndex((h) => h === "date" || h === "watched date");
    const uriIndex = headers.findIndex((h) => h.includes("letterboxd") || h === "uri" || h === "url");

    const isWatchlist = header.includes("letterboxd") && !header.includes("rating") && (header.includes("uri") || headers.length <= 4);

    for (let i = 1; i < lines.length; i++) {
      const cols = parseCSVLine(lines[i]).map((c) => c.replace(/^["']|["']$/g, ""));
      if (cols.length === 0 || !cols[nameIndex >= 0 ? nameIndex : 0]) continue;

      const title = cols[nameIndex >= 0 ? nameIndex : 1] || cols[0];
      const year = (yearIndex >= 0 ? cols[yearIndex] : "") || "";
      let rating: number | undefined = undefined;

      if (ratingIndex >= 0 && cols[ratingIndex]) {
        const rawRating = parseFloat(cols[ratingIndex]);
        if (!isNaN(rawRating)) {
          // If rating is 0.5 to 5.0 (Letterboxd standard), convert to 1–10
          rating = rawRating <= 5 ? Math.round(rawRating * 2) : Math.round(rawRating);
          rating = Math.max(1, Math.min(10, rating));
        }
      }

      let shelf: Shelf = "watched";
      if (isWatchlist || (headers.includes("shelf") && cols[headers.indexOf("shelf")] === "toWatch")) {
        shelf = "toWatch";
      }

      const dateCompleted = dateIndex >= 0 && cols[dateIndex] ? cols[dateIndex] : new Date().toISOString();
      const uri = uriIndex >= 0 ? cols[uriIndex] : undefined;

      rows.push({
        title,
        year,
        rating,
        shelf,
        dateCompleted,
        uri,
      });
    }

    return rows;
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setImportStatus("idle");
    setStatusMessage("");

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        if (file.name.endsWith(".json")) {
          // JSON Backup restore
          const parsed = JSON.parse(content);
          if (Array.isArray(parsed)) {
            importEntries(parsed, importMode);
            setImportStatus("success");
            setStatusMessage(`Successfully restored ${parsed.length} entries from backup!`);
          } else {
            setImportStatus("error");
            setStatusMessage("Invalid JSON backup structure.");
          }
        } else {
          // CSV Parse
          const rows = parseCSV(content);
          if (rows.length === 0) {
            setImportStatus("error");
            setStatusMessage("Could not parse rows from CSV. Please check formatting.");
          } else {
            setParsedRows(rows);
            setStatusMessage(`Found ${rows.length} titles ready for import.`);
          }
        }
      } catch (err) {
        setImportStatus("error");
        setStatusMessage("Failed to read file.");
      }
    };
    reader.readAsText(file);
  }

  async function handleExecuteImport() {
    if (parsedRows.length === 0) return;

    setIsProcessing(true);
    setProgressCount(0);
    const newEntries: MovieEntry[] = [];

    // Process in batches
    for (let i = 0; i < parsedRows.length; i++) {
      const row = parsedRows[i];
      setProgressCount(i + 1);

      // Create high-fidelity optimistic entry
      const optimisticEntry: MovieEntry = {
        id: `import-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 7)}`,
        shelf: row.shelf,
        addedAt: row.dateCompleted || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tmdb: {
          tmdbId: 900000 + i,
          title: row.title,
          posterUrl: null,
          releaseYear: row.year || "N/A",
          runtime: 110,
          genres: ["Drama"],
          director: "Various",
          overview: `Imported from Letterboxd (${row.title})`,
          mediaType: "movie",
        },
        review:
          row.shelf === "watched"
            ? {
                rating: row.rating || 8,
                notes: row.uri ? `Letterboxd: ${row.uri}` : "Imported entry",
                tags: ["imported", "letterboxd"],
                dateCompleted: row.dateCompleted || new Date().toISOString(),
              }
            : undefined,
      };

      // Query TMDB in batches for the first 50 items so posters immediately populate
      if (i < 40) {
        try {
          const results = await searchMovies(`${row.title} ${row.year}`.trim());
          if (results.length > 0) {
            optimisticEntry.tmdb = results[0];
          }
        } catch {}
      }

      newEntries.push(optimisticEntry);
    }

    importEntries(newEntries, importMode);
    setIsProcessing(false);
    setImportStatus("success");
    setStatusMessage(`Successfully imported ${newEntries.length} titles into Couch Critics!`);
    setParsedRows([]);
  }

  // ── Export JSON Backup ─────────────────────────────────────────────────────
  function handleDownloadBackup() {
    const jsonStr = JSON.stringify(entries, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `couch-critics-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ── Export to Letterboxd CSV ───────────────────────────────────────────────
  function handleExportLetterboxdCSV() {
    const headers = ["Title", "Year", "Rating", "WatchedDate", "Shelf", "Review"];
    const rows = entries.map((e) => {
      const title = `"${(e.tmdb.title || "").replace(/"/g, '""')}"`;
      const year = e.tmdb.releaseYear || "";
      const rating = e.review?.rating ? (e.review.rating / 2).toFixed(1) : ""; // Convert 1-10 to 0.5-5 stars
      const date = e.review?.dateCompleted ? e.review.dateCompleted.split("T")[0] : e.addedAt.split("T")[0];
      const shelf = e.shelf;
      const review = `"${(e.review?.notes || "").replace(/"/g, '""')}"`;
      return [title, year, rating, date, shelf, review].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `couch-critics-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#15151C] border border-[#292932] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ══ Header ══ */}
        <div className="p-4 sm:p-5 border-b border-[#292932] bg-[#0B0B0F] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D97706]/15 border border-[#D97706]/30 flex items-center justify-center text-[#D97706]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Import, Export &amp; Backup
              </h2>
              <p className="text-xs text-[#A1A1AA]">
                Letterboxd migration, CSV spreadsheet sync, and one-click JSON backups
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#A1A1AA] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ══ Navigation Tabs ══ */}
        <div className="flex items-center gap-2 p-3 bg-[#0B0B0F] border-b border-[#292932] overflow-x-auto">
          <button
            onClick={() => setActiveTab("import-csv")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "import-csv"
                ? "bg-[#D97706] text-white shadow-sm"
                : "text-[#A1A1AA] hover:text-white hover:bg-white/5"
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Letterboxd / CSV Import</span>
          </button>

          <button
            onClick={() => setActiveTab("export")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "export"
                ? "bg-[#D97706] text-white shadow-sm"
                : "text-[#A1A1AA] hover:text-white hover:bg-white/5"
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setActiveTab("backup")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "backup"
                ? "bg-[#D97706] text-white shadow-sm"
                : "text-[#A1A1AA] hover:text-white hover:bg-white/5"
            }`}
          >
            <Database className="w-4 h-4" />
            <span>JSON Backup &amp; Restore</span>
          </button>
        </div>

        {/* ══ Body Content ══ */}
        <div className="p-4 sm:p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* TAB 1: CSV / LETTERBOXD IMPORT */}
          {activeTab === "import-csv" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#0B0B0F] border border-[#292932] space-y-2">
                <div className="flex items-center gap-2 text-white font-semibold text-sm">
                  <Sparkles className="w-4 h-4 text-[#F5C542]" />
                  <span>Letterboxd Migration Supported</span>
                </div>
                <p className="text-xs text-[#A1A1AA] leading-relaxed">
                  Export your data from Letterboxd (Account &gt; Data &gt; Export Your Data) and upload
                  any of the resulting CSV files (<code className="text-[#F5C542]">ratings.csv</code>,{" "}
                  <code className="text-[#F5C542]">watched.csv</code>, or{" "}
                  <code className="text-[#F5C542]">watchlist.csv</code>).
                </p>
              </div>

              {/* Upload Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#292932] hover:border-[#D97706]/50 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-[#0B0B0F]/50 hover:bg-[#0B0B0F]"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".csv,.json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Upload className="w-8 h-8 text-[#D97706] mx-auto mb-3" />
                <p className="text-sm font-semibold text-white">
                  {fileName ? fileName : "Click or drag & drop your CSV file here"}
                </p>
                <p className="text-xs text-[#A1A1AA] mt-1">
                  Supports Letterboxd CSVs, Trakt CSVs, or JSON backups
                </p>
              </div>

              {/* Status or Preview */}
              {statusMessage && (
                <div
                  className={`p-3 rounded-xl flex items-center gap-2 text-xs border ${
                    importStatus === "success"
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : importStatus === "error"
                      ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                      : "bg-[#0B0B0F] border-[#292932] text-white"
                  }`}
                >
                  {importStatus === "success" ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : importStatus === "error" ? (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  ) : (
                    <FileText className="w-4 h-4 shrink-0 text-[#F5C542]" />
                  )}
                  <span>{statusMessage}</span>
                </div>
              )}

              {/* Parsed Rows Preview & Actions */}
              {parsedRows.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#A1A1AA]">
                      Import Mode:
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setImportMode("merge")}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer border ${
                          importMode === "merge"
                            ? "bg-[#D97706] text-white border-[#D97706]"
                            : "bg-[#0B0B0F] text-[#A1A1AA] border-[#292932]"
                        }`}
                      >
                        Merge with existing
                      </button>
                      <button
                        onClick={() => setImportMode("replace")}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer border ${
                          importMode === "replace"
                            ? "bg-[#D97706] text-white border-[#D97706]"
                            : "bg-[#0B0B0F] text-[#A1A1AA] border-[#292932]"
                        }`}
                      >
                        Replace all
                      </button>
                    </div>
                  </div>

                  {/* Preview list */}
                  <div className="max-h-48 overflow-y-auto space-y-1.5 p-2 bg-[#0B0B0F] rounded-xl border border-[#292932]">
                    {parsedRows.slice(0, 15).map((row, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg bg-[#15151C] border border-[#292932]"
                      >
                        <span className="font-semibold text-white truncate max-w-[280px]">
                          {row.title} {row.year && `(${row.year})`}
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          {row.rating && (
                            <span className="text-[#F5C542] font-mono text-[11px]">
                              ★ {row.rating}/10
                            </span>
                          )}
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-white/5 border border-white/10 text-[#A1A1AA]">
                            {row.shelf}
                          </span>
                        </div>
                      </div>
                    ))}
                    {parsedRows.length > 15 && (
                      <p className="text-center text-[11px] text-[#A1A1AA] py-1">
                        + {parsedRows.length - 15} more titles
                      </p>
                    )}
                  </div>

                  <button
                    onClick={handleExecuteImport}
                    disabled={isProcessing}
                    className="w-full py-3 rounded-xl bg-[#D97706] hover:bg-[#F59E0B] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Importing ({progressCount}/{parsedRows.length})...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>Confirm &amp; Import {parsedRows.length} Titles</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: EXPORT CSV */}
          {activeTab === "export" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#0B0B0F] border border-[#292932] space-y-2">
                <h3 className="text-sm font-semibold text-white">Letterboxd-Compatible CSV Export</h3>
                <p className="text-xs text-[#A1A1AA] leading-relaxed">
                  Export all {entries.length} titles from your journal into a universal CSV file
                  compatible with Letterboxd, IMDb, Trakt, and spreadsheet apps.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0B0B0F] border border-[#292932] flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-white">Total Exportable Records</p>
                  <p className="text-xs text-[#A1A1AA]">{entries.length} titles with ratings, dates &amp; reviews</p>
                </div>
                <button
                  onClick={handleExportLetterboxdCSV}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D97706] hover:bg-[#F59E0B] text-white text-xs font-bold transition-all shadow cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download CSV</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: JSON BACKUP & RESTORE */}
          {activeTab === "backup" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#0B0B0F] border border-[#292932] space-y-2">
                <h3 className="text-sm font-semibold text-white">Full JSON Journal Snapshot</h3>
                <p className="text-xs text-[#A1A1AA] leading-relaxed">
                  Download a complete backup of your Couch Critics database. Perfect for transferring
                  your journal to another device, browser, or keeping an offline archive.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-[#0B0B0F] border border-[#292932] flex flex-col justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">
                      Create Backup
                    </h4>
                    <p className="text-xs text-[#A1A1AA]">
                      Save current state ({entries.length} items) as a JSON file.
                    </p>
                  </div>
                  <button
                    onClick={handleDownloadBackup}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/15 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download JSON Backup</span>
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-[#0B0B0F] border border-[#292932] flex flex-col justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">
                      Restore Backup
                    </h4>
                    <p className="text-xs text-[#A1A1AA]">
                      Upload and restore a previous JSON backup file.
                    </p>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#D97706] hover:bg-[#F59E0B] text-white text-xs font-bold transition-all shadow cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Restore from JSON</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
