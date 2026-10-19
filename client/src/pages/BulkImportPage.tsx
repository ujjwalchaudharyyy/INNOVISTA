import React, { useState } from "react";
import { UploadCloud, Download, CheckCircle2, AlertCircle, FileText, ArrowRight, Table } from "lucide-react";
import { api, API_BASE } from "../services/api";

export const BulkImportPage: React.FC = () => {
  const [csvText, setCsvText] = useState("");
  const [validationResult, setValidationResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  const sampleCsv = `title,originalUrl,customAlias\nProduct Demo Video,https://youtube.com/watch?v=dQw4w9WgXcQ,demo-video\nCompany Blog Post,https://techcrunch.com/2026/01/01/future-of-saas,saas-future\nGithub Repository,https://github.com/linkpulse/core,lp-core`;

  const handleDownloadSample = () => {
    const blob = new Blob([sampleCsv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "linkpulse-import-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportAll = () => {
    window.open(`${API_BASE}/api/bulk/export`, "_blank");
  };

  const parseCsvToRows = (text: string) => {
    const lines = text.trim().split("\n");
    if (lines.length < 2) return [];

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const titleIdx = headers.indexOf("title");
    const urlIdx = headers.indexOf("originalurl") !== -1 ? headers.indexOf("originalurl") : headers.indexOf("url");
    const aliasIdx = headers.indexOf("customalias") !== -1 ? headers.indexOf("customalias") : headers.indexOf("alias");

    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const cols = line.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
      rows.push({
        title: titleIdx !== -1 ? cols[titleIdx] : cols[0] || "",
        originalUrl: urlIdx !== -1 ? cols[urlIdx] : cols[1] || "",
        customAlias: aliasIdx !== -1 ? cols[aliasIdx] : cols[2] || undefined,
      });
    }
    return rows;
  };

  const handleValidate = async () => {
    const rows = parseCsvToRows(csvText);
    if (rows.length === 0) {
      alert("Please paste valid CSV data with header row (title,originalUrl,customAlias)");
      return;
    }

    try {
      setLoading(true);
      setImportSuccess(null);
      const res = await api.post("/bulk/validate", { rows });
      setValidationResult(res.data);
    } catch (err: any) {
      alert(err.response?.data?.error || "Validation error");
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteImport = async () => {
    if (!validationResult || validationResult.validCount === 0) return;
    const validRows = validationResult.rows.filter((r: any) => r.isValid);

    try {
      setLoading(true);
      const res = await api.post("/bulk/import", { rows: validRows });
      setImportSuccess(res.data.message || `Successfully imported ${validRows.length} links`);
      setValidationResult(null);
      setCsvText("");
    } catch (err: any) {
      alert(err.response?.data?.error || "Import error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <UploadCloud className="h-6 w-6 text-indigo-400" />
              Bulk CSV Management
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              High Volume Engine
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Batch create hundreds of short links with real-time validation preview matrix
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleDownloadSample}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium transition cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Sample Template</span>
          </button>
          <button
            onClick={handleExportAll}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Active</span>
          </button>
        </div>
      </div>

      {importSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span className="font-semibold">{importSuccess}</span>
        </div>
      )}

      {/* CSV Input Area */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
            Paste CSV Data (title, originalUrl, customAlias)
          </label>
          <button
            onClick={() => setCsvText(sampleCsv)}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition cursor-pointer"
          >
            Fill Sample Rows
          </button>
        </div>

        <textarea
          rows={6}
          value={csvText}
          onChange={(e) => setCsvText(e.target.value)}
          placeholder={`title,originalUrl,customAlias\nProduct Demo Video,https://youtube.com/watch?v=demo,demo-video`}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 shadow-inner"
        />

        <div className="flex justify-end">
          <button
            onClick={handleValidate}
            disabled={loading || !csvText.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-md shadow-indigo-600/30 disabled:opacity-50 transition cursor-pointer"
          >
            <span>{loading ? "Validating..." : "Preview & Validate Rows"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Validation Matrix */}
      {validationResult && (
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-md space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Table className="h-4 w-4 text-indigo-400" />
                Validation Preview Matrix
              </h2>
              <p className="text-xs text-slate-400">
                <strong className="text-emerald-400">{validationResult.validCount}</strong> valid rows ready for import,{" "}
                <strong className="text-rose-400">{validationResult.invalidCount}</strong> with issues
              </p>
            </div>
            <button
              onClick={handleExecuteImport}
              disabled={loading || validationResult.validCount === 0}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 disabled:opacity-50 transition cursor-pointer self-start sm:self-auto"
            >
              Import {validationResult.validCount} Valid Links
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-900/80 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3">Row</th>
                  <th className="py-3 px-3">Title</th>
                  <th className="py-3 px-3">Destination URL</th>
                  <th className="py-3 px-3">Alias</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {(validationResult.rows || []).map((r: any, idx: number) => {
                  const rowNum = r.index ?? r.rowIndex ?? idx + 1;
                  const errorMsg = r.error || (Array.isArray(r.errors) ? r.errors[0] : null) || "Invalid URL";

                  return (
                    <tr key={rowNum} className={r.isValid ? "hover:bg-slate-900/30" : "bg-rose-500/5 hover:bg-rose-500/10"}>
                      <td className="py-3 px-3 font-mono text-slate-400">#{rowNum}</td>
                      <td className="py-3 px-3 font-bold text-slate-200 truncate max-w-[150px]">{r.title || "—"}</td>
                      <td className="py-3 px-3 text-slate-400 truncate max-w-xs">{r.originalUrl}</td>
                      <td className="py-3 px-3 font-mono text-cyan-400">{r.customAlias || "Auto"}</td>
                      <td className="py-3 px-3">
                        {r.isValid ? (
                          <span className="text-emerald-400 font-bold inline-flex items-center gap-1">
                            ✓ Ready
                          </span>
                        ) : (
                          <span className="text-rose-400 font-bold inline-flex items-center gap-1" title={errorMsg}>
                            ✕ {errorMsg}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};