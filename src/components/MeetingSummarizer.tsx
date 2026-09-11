import { useState } from 'react';
import { FileText, Copy, Check, Save, Sparkles, ListChecks, Gavel, Target, Clock } from 'lucide-react';
import { summarizeMeetingNotes, type MeetingNotesOutput } from '@/lib/ai-engine';
import { supabase, type MeetingSummary } from '@/lib/supabase';

export default function MeetingSummarizer() {
  const [title, setTitle] = useState('');
  const [rawNotes, setRawNotes] = useState('');
  const [output, setOutput] = useState<MeetingNotesOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [history, setHistory] = useState<MeetingSummary[]>([]);

  const handleSummarize = async () => {
    if (!title.trim() || !rawNotes.trim()) return;
    setLoading(true);
    setSaved(false);
    await new Promise((r) => setTimeout(r, 600));
    const result = summarizeMeetingNotes({ title, rawNotes });
    setOutput(result);
    setLoading(false);
  };

  const handleCopy = () => {
    if (!output) return;
    const text = `Meeting: ${title}\n\nSummary:\n${output.summary}\n\nKey Points:\n${output.keyPoints.map((p) => `  • ${p}`).join('\n')}\n\nDecisions:\n${output.decisions.map((d) => `  • ${d}`).join('\n')}\n\nAction Items:\n${output.actionItems.map((a) => `  • ${a.task} — ${a.owner} (Due: ${a.deadline})`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    if (!output) return;
    const { data, error } = await supabase
      .from('meeting_summaries')
      .insert({
        title,
        raw_notes: rawNotes,
        summary: output.summary,
        key_points: JSON.stringify(output.keyPoints),
        decisions: JSON.stringify(output.decisions),
        action_items: JSON.stringify(output.actionItems),
      })
      .select()
      .single();

    if (!error && data) {
      setSaved(true);
      setHistory((prev) => [data as MeetingSummary, ...prev]);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
          <FileText className="h-5 w-5 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Meeting Notes Summarizer</h2>
          <p className="text-sm text-slate-500">Convert lengthy notes into concise summaries with action items</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">Meeting Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Weekly Product Standup — Sept 11"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">Raw Meeting Notes</label>
            <textarea
              value={rawNotes}
              onChange={(e) => setRawNotes(e.target.value)}
              placeholder={'Paste your raw meeting notes here...\n\nExample:\nDiscussed Q4 roadmap priorities\nDecided: Launch date moved to November 15\nSarah will send the design mockups by Friday\nAction item: John to prepare budget report by Wednesday\nMarketing needs to approve the campaign assets'}
              rows={12}
              className="w-full resize-none rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
            <p className="mt-1.5 text-xs text-slate-400">
              Tip: Use keywords like "decided", "action item", or "will" to help the AI identify decisions and tasks.
            </p>
          </div>
          <button
            onClick={handleSummarize}
            disabled={!title.trim() || !rawNotes.trim() || loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Sparkles className="h-4 w-4 animate-pulse" />
                Summarizing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Summarize Notes
              </>
            )}
          </button>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
          {output ? (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-700">Structured Summary</h3>
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

              <div className="rounded-lg bg-emerald-50 p-4">
                <p className="text-sm leading-relaxed text-slate-700">{output.summary}</p>
              </div>

              {output.keyPoints.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <ListChecks className="h-4 w-4 text-emerald-600" />
                    <h4 className="text-sm font-bold text-slate-700">Key Points</h4>
                  </div>
                  <ul className="space-y-1.5">
                    {output.keyPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {output.decisions.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <Gavel className="h-4 w-4 text-amber-600" />
                    <h4 className="text-sm font-bold text-slate-700">Decisions</h4>
                  </div>
                  <ul className="space-y-1.5">
                    {output.decisions.map((decision, i) => (
                      <li key={i} className="flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-slate-700">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-400" />
                        {decision}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {output.actionItems.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <Target className="h-4 w-4 text-rose-600" />
                    <h4 className="text-sm font-bold text-slate-700">Action Items</h4>
                  </div>
                  <div className="space-y-2">
                    {output.actionItems.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-700">{item.task}</p>
                          <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                            <span>Owner: <span className="font-medium text-slate-600">{item.owner}</span></span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {item.deadline}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex h-full min-h-[300px] flex-col items-center justify-center text-center">
              <FileText className="mb-3 h-12 w-12 text-slate-200" />
              <p className="text-sm text-slate-400">Your structured summary will appear here</p>
              <p className="mt-1 text-xs text-slate-300">Paste your notes and click Summarize</p>
            </div>
          )}
        </div>
      </div>

      {history.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="mb-3 text-sm font-bold text-slate-700">Saved Summaries</h3>
          <div className="space-y-2">
            {history.map((m) => (
              <div key={m.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700">{m.title}</p>
                  <p className="text-xs text-slate-400">{new Date(m.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
