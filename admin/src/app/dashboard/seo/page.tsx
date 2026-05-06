"use client";

import { useState } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  RefreshCw, 
  Sliders, 
  Search, 
  ArrowRight, 
  LineChart, 
  Check, 
  Settings, 
  Globe, 
  ChevronRight, 
  FileText, 
  TrendingUp, 
  ShieldAlert,
  Loader2
} from "lucide-react";

export default function SEOCommandCenter() {
  const configs = useQuery(api.seo.listConfigs);
  const getHomeConfig = useQuery(api.seo.getActiveConfig, { page: "home" });
  const getContactConfig = useQuery(api.seo.getActiveConfig, { page: "contact" });
  const getBlogConfig = useQuery(api.seo.getActiveConfig, { page: "blog" });

  const runSEOAudit = useAction(api.seo.generateSEORecommendations);
  const approveSEOChanges = useMutation(api.seo.approvePending);
  const toggleAutopilot = useMutation(api.seo.toggleAutoPilot);
  const updateConfigManual = useMutation(api.seo.updateConfig);

  const [activePageSlug, setActivePageSlug] = useState<string>("home");
  const [isAuditing, setIsAuditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states for manual updates
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [keywordsString, setKeywordsString] = useState("");
  const [heroHeadline, setHeroHeadline] = useState("");
  const [heroSubheadline, setHeroSubheadline] = useState("");
  const [marqueeKeywordsString, setMarqueeKeywordsString] = useState("");
  const [loadedPageSlug, setLoadedPageSlug] = useState<string | null>(null);

  if (configs === undefined) {
    return <div className="flex items-center justify-center h-screen text-slate-500 font-medium">Loading SEO configurations...</div>;
  }

  // Active configuration mapping
  const activeConfig = configs.find((c) => c.page === activePageSlug) || configs[0];

  if (activeConfig && loadedPageSlug !== activeConfig.page) {
    setMetaTitle(activeConfig.metaTitle);
    setMetaDescription(activeConfig.metaDescription);
    setKeywordsString(activeConfig.keywords.join(", "));
    setHeroHeadline(activeConfig.heroHeadline);
    setHeroSubheadline(activeConfig.heroSubheadline);
    setMarqueeKeywordsString(activeConfig.marqueeKeywords.join(", "));
    setLoadedPageSlug(activeConfig.page);
  }

  const handleManualSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConfig) return;
    setSaveSuccess(true);

    await updateConfigManual({
      id: activeConfig._id,
      page: activeConfig.page,
      metaTitle,
      metaDescription,
      keywords: keywordsString.split(",").map((k) => k.trim()).filter(Boolean),
      heroHeadline,
      heroSubheadline,
      marqueeKeywords: marqueeKeywordsString.split(",").map((k) => k.trim()).filter(Boolean),
    });

    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleTriggerAudit = async () => {
    if (!activeConfig) return;
    setIsAuditing(true);
    try {
      await runSEOAudit({ page: activeConfig.page });
    } catch (err) {
      console.error("SEO Audit failed:", err);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleApprovePending = async () => {
    if (!activeConfig) return;
    await approveSEOChanges({ id: activeConfig._id, page: activeConfig.page });
    setLoadedPageSlug(null); // Force form refresh with newly approved active values
  };

  const handleAutopilotToggle = async (checked: boolean) => {
    if (!activeConfig) return;
    await toggleAutopilot({ id: activeConfig._id, page: activeConfig.page, enabled: checked });
  };

  return (
    <div className="space-y-6 h-[calc(100vh-120px)] flex flex-col font-sans">
      {/* Page Header */}
      <div className="flex justify-between items-center shrink-0">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
            <LineChart className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 font-heading">Synergy Auto-SEO Architect</h1>
            <p className="text-sm text-slate-500">DeepSeek keyword search audits, dynamic metadata injection, and autopilot ranking optimization</p>
          </div>
        </div>
        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 px-3 py-1 text-sm font-semibold flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          Real-time SEO Link Active
        </Badge>
      </div>

      {/* Pages Selector Tabs */}
      <div className="flex space-x-2 shrink-0 border-b border-slate-200 pb-3">
        {["home", "contact", "blog"].map((pageSlug) => {
          const isActive = activePageSlug === pageSlug;
          const conf = configs.find((c) => c.page === pageSlug);
          return (
            <button
              key={pageSlug}
              onClick={() => {
                setActivePageSlug(pageSlug);
                setLoadedPageSlug(null); // Reset form mapping
              }}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all capitalize flex items-center space-x-2 ${
                isActive 
                  ? "bg-slate-900 text-white shadow-sm" 
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>{pageSlug} Page</span>
              {conf?.pendingReview && (
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse ml-1"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Workspace split */}
      <div className="flex-1 flex gap-6 overflow-hidden min-h-0">
        {/* Left Form: Active SEO Fields */}
        <div className="w-1/2 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-slate-500" />
              <h3 className="font-semibold text-slate-800 text-sm">Active Meta Configuration</h3>
            </div>
            {saveSuccess && (
              <span className="text-xs text-green-600 font-medium flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-md border border-green-100">
                <Check className="w-3.5 h-3.5" /> Overrides Saved
              </span>
            )}
          </div>

          <form onSubmit={handleManualSave} className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Meta Title */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Meta Title Tag</label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-orange-500 focus:bg-white transition-all"
                required
              />
              <p className="text-[10px] text-slate-400 mt-1">Recommended length: &lt; 60 characters. Current: {metaTitle.length}</p>
            </div>

            {/* Meta Description */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Meta Description Tag</label>
              <textarea
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                rows={3}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-orange-500 focus:bg-white transition-all"
                required
              />
              <p className="text-[10px] text-slate-400 mt-1">Recommended length: &lt; 160 characters. Current: {metaDescription.length}</p>
            </div>

            {/* Focus Keywords */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Target SEO Keywords (Comma separated)</label>
              <input
                type="text"
                value={keywordsString}
                onChange={(e) => setKeywordsString(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:bg-white transition-all"
              />
            </div>

            {/* Divider */}
            <div className="border-t border-slate-100 my-4"></div>

            {/* Hero Headline */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Dynamic Hero Headline</label>
              <input
                type="text"
                value={heroHeadline}
                onChange={(e) => setHeroHeadline(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:bg-white transition-all"
                required
              />
            </div>

            {/* Hero Subheadline */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Dynamic Hero Subheadline</label>
              <textarea
                value={heroSubheadline}
                onChange={(e) => setHeroSubheadline(e.target.value)}
                rows={3}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:bg-white transition-all"
                required
              />
            </div>

            {/* Marquee Ticker Keywords */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Marquee Ticker Keywords (Exactly 4)</label>
              <input
                type="text"
                value={marqueeKeywordsString}
                onChange={(e) => setMarqueeKeywordsString(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:bg-white transition-all"
              />
              <p className="text-[10px] text-slate-400 mt-1">Four uppercase values scrolling across the home ticker block.</p>
            </div>

            {/* Submit Bar */}
            <div className="pt-2 shrink-0">
              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-lg transition-colors text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                Save Manual Configuration Overrides
              </button>
            </div>
          </form>
        </div>

        {/* Right Pane: AI Strategy Command Desk */}
        <div className="flex-1 flex flex-col gap-6 overflow-hidden min-h-0">
          
          {/* Automation Control Settings Card */}
          <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-md shrink-0 flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="font-bold text-sm flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-orange-500" />
                SEO Autopilot Mode
              </h4>
              <p className="text-[10px] text-slate-400 max-w-sm">
                When enabled, DeepSeek keyword audits will automatically apply optimizations and meta copy adjustments to your live page.
              </p>
            </div>
            <div className="flex items-center space-x-3 bg-slate-850 p-2 rounded-lg border border-slate-800">
              <span className={`text-[10px] font-bold tracking-wider uppercase ${activeConfig.autoPilotEnabled ? "text-green-400" : "text-slate-400"}`}>
                {activeConfig.autoPilotEnabled ? "Active" : "Disabled"}
              </span>
              <button
                type="button"
                onClick={() => handleAutopilotToggle(!activeConfig.autoPilotEnabled)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  activeConfig.autoPilotEnabled ? "bg-green-500" : "bg-slate-700"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    activeConfig.autoPilotEnabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Recommended Updates Panel */}
          <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-orange-500" />
                <h3 className="font-semibold text-slate-800 text-sm">DeepSeek AI SEO Recommendation Desk</h3>
              </div>
              <button
                onClick={handleTriggerAudit}
                disabled={isAuditing}
                className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-1.5 px-3 rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-sm"
              >
                {isAuditing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Auditing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3.5 h-3.5" />
                    Trigger Keyword Audit
                  </>
                )}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {activeConfig.pendingReview ? (
                <div className="space-y-5">
                  {/* AI Reasoning Callout */}
                  <div className="border-l-4 border-orange-500 bg-orange-500/5 rounded-r-xl p-4 text-slate-700 text-xs leading-relaxed border border-y-slate-200/50 border-r-slate-200/50 space-y-1.5">
                    <div className="font-bold text-slate-800 flex items-center gap-1 uppercase tracking-wider text-[10px]">
                      <TrendingUp className="w-3.5 h-3.5 text-orange-500" />
                      DeepSeek Ranking Strategy Analysis
                    </div>
                    <p className="italic text-slate-600">"{activeConfig.pendingReview.reasoning}"</p>
                  </div>

                  {/* Side by side differences */}
                  <div className="space-y-4">
                    <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Review Copy Adjustments</h5>
                    
                    {/* Meta Title Diff */}
                    <div className="space-y-1 p-3 bg-slate-50/50 rounded-lg border border-slate-100">
                      <div className="text-[10px] font-bold text-slate-500">Meta Title Tag</div>
                      <div className="text-xs text-red-600 line-through bg-red-50/50 p-1.5 rounded">{activeConfig.metaTitle}</div>
                      <div className="text-xs text-green-700 font-semibold bg-green-50/50 p-1.5 rounded flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                        {activeConfig.pendingReview.metaTitle}
                      </div>
                    </div>

                    {/* Meta Description Diff */}
                    <div className="space-y-1 p-3 bg-slate-50/50 rounded-lg border border-slate-100">
                      <div className="text-[10px] font-bold text-slate-500">Meta Description Tag</div>
                      <div className="text-xs text-red-600 line-through bg-red-50/50 p-1.5 rounded leading-relaxed">{activeConfig.metaDescription}</div>
                      <div className="text-xs text-green-700 bg-green-50/50 p-1.5 rounded leading-relaxed flex items-start gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                        {activeConfig.pendingReview.metaDescription}
                      </div>
                    </div>

                    {/* Hero Title Diff */}
                    <div className="space-y-1 p-3 bg-slate-50/50 rounded-lg border border-slate-100">
                      <div className="text-[10px] font-bold text-slate-500">Dynamic Hero Headline</div>
                      <div className="text-xs text-red-600 line-through bg-red-50/50 p-1.5 rounded">{activeConfig.heroHeadline}</div>
                      <div className="text-xs text-green-700 font-semibold bg-green-50/50 p-1.5 rounded flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                        {activeConfig.pendingReview.heroHeadline}
                      </div>
                    </div>

                    {/* Hero Subheadline Diff */}
                    <div className="space-y-1 p-3 bg-slate-50/50 rounded-lg border border-slate-100">
                      <div className="text-[10px] font-bold text-slate-500">Dynamic Hero Subheadline</div>
                      <div className="text-xs text-red-600 line-through bg-red-50/50 p-1.5 rounded leading-relaxed">{activeConfig.heroSubheadline}</div>
                      <div className="text-xs text-green-700 bg-green-50/50 p-1.5 rounded leading-relaxed flex items-start gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                        {activeConfig.pendingReview.heroSubheadline}
                      </div>
                    </div>
                  </div>

                  {/* Apply Panel */}
                  <div className="pt-3">
                    <button
                      onClick={handleApprovePending}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition-colors text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <Check className="w-4 h-4" />
                      Approve & Push AI Recommendations Live
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-14 h-14 bg-orange-50 border border-orange-100 rounded-full flex items-center justify-center text-orange-500 mb-4 animate-pulse">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">Dynamic SEO is Active and Healthy</h4>
                  <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
                    No pending AI recommendations. Trigger a **DeepSeek Keyword Audit** above to let the AI analyze active Google rankings and suggest optimized copies!
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
