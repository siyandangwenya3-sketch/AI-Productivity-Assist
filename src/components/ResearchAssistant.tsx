import { useState } from 'react';
import { BookOpen, Copy, Check, Save, Sparkles, Lightbulb, TrendingUp } from 'lucide-react';
import { summarizeResearch, type ResearchOutput } from '@/lib/ai-engine';
import { supabase, type ResearchSummary } from '@/lib/supabase';

export default function ResearchAssistant() {
  const [topic, setTopic] = useState('');
  const [sourceText, setSourceText] = useState('');
  const [output, setOutput] = useState<ResearchOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [history, setHistory] = useState<ResearchSummary[]>([]);

  const handleSummarize = async () => {
    if (!topic.trim() || !sourceText.trim()) return;
    setLoading(true);
    setSaved(false);
    await new Promise((r) => setTimeout(r, 600));
    const result = summarizeResearch({ topic, sourceText });
    setOutput(result);
    setLoading(false);
  };

  const handleCopy = () => {
    if (!output) return;
    const text = `Research: ${topic}\n\nSummary:\n${output.summary}\n\nKey Insights:\n${output.keyInsights.map((i) => `  • ${i}`).join('\n')}\n\nRecommendations:\n${output.recommendations.map((r) => `  • ${r}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    if (!output) return;
    const { data, error } = await supabase
      .from('research_summaries')
      .insert({
        topic,
        source_text: sourceText,
        summary: output.summary,
        key_insights: JSON.stringify(output.keyInsights),
        recommendations: JSON.stringify(output.recommendations),
      })
      .select()
      .single();

    if (!error && data) {
      setSaved(true);
      setHistory((prev) => [data as ResearchSummary, ...prev]);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50">
          <BookOpen className="h-5 w-5 text-cyan-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">AI Research Assistant</h2>
          <p className="text-sm text-slate-500">Summarize articles and reports with key insights and recommendations</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">Research Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Market trends in renewable energy 2024"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">Source Text (Article / Report)</label>
            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder={'Paste the full text of the article or report you want to summarize...\n\nThe AI will extract key insights, generate a concise summary, and provide actionable recommendations based on the content.'}
              rows={12}
              className="w-full resize-none rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
            />
          </div>
          <button
            onClick={handleSummarize}
            disabled={!topic.trim() || !sourceText.trim() || loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Sparkles className="h-4 w-4 animate-pulse" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Summarize & Extract Insights
              </>
            )}
          </button>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
          {output ? (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-700">Research Summary</h3>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-200"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-200"
                  >
                    {saved ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Save className="h-3.5 w-3.5" />}
                    {saved ? 'Saved!' : 'Save'}
                  </button>
                </div>
              </div>

              <div className="rounded-lg bg-cyan-50 p-4">
                <p className="text-sm leading-relaxed text-slate-700">{output.summary}</p>
              </div>

              {output.keyInsights.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-cyan-600" />
                    <h4 className="text-sm font-bold text-slate-700">Key Insights</h4>
                  </div>
                  <ul className="space-y-2">
                    {output.keyInsights.map((insight, i) => (
                      <li key={i} className="flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan-400" />
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <div className="mb-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                  <h4 className="text-sm font-bold text-slate-700">Recommendations</h4>
                </div>
                <ul className="space-y-2">
                  {output.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2 rounded-lg border border-emerald-100 bg-emerald-50/50 px-3 py-2 text-sm text-slate-600">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="flex h-full min-h-[300px] flex-col items-center justify-center text-center">
              <BookOpen className="mb-3 h-12 w-12 text-slate-200" />
              <p className="text-sm text-slate-400">Your research summary will appear here</p>
              <p className="mt-1 text-xs text-slate-300">Paste an article and click Summarize</p>
            </div>
          )}
        </div>
      </div>

      {history.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="mb-3 text-sm font-bold text-slate-700">Saved Research</h3>
          <div className="space-y-2">
            {history.map((r) => (
              <div key={r.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700">{r.topic}</p>
                  <p className="text-xs text-slate-400">{new Date(r.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
