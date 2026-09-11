import { useState } from 'react';
import { Mail, Copy, Check, Save, Sparkles, ChevronRight } from 'lucide-react';
import { generateEmail, type EmailTone, type EmailAudience, type EmailOutput } from '@/lib/ai-engine';
import { supabase, type GeneratedEmail } from '@/lib/supabase';

export default function EmailGenerator() {
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState<EmailAudience>('client');
  const [tone, setTone] = useState<EmailTone>('formal');
  const [keyPoints, setKeyPoints] = useState('');
  const [output, setOutput] = useState<EmailOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [history, setHistory] = useState<GeneratedEmail[]>([]);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setSaved(false);
    await new Promise((r) => setTimeout(r, 600));
    const result = generateEmail({ topic, audience, tone, keyPoints });
    setOutput(result);
    setLoading(false);
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(`Subject: ${output.subject}\n\n${output.body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    if (!output) return;
    const { data, error } = await supabase
      .from('generated_emails')
      .insert({
        topic,
        audience,
        tone,
        key_points: keyPoints,
        content: `Subject: ${output.subject}\n\n${output.body}`,
      })
      .select()
      .single();

    if (!error && data) {
      setSaved(true);
      setHistory((prev) => [data as GeneratedEmail, ...prev]);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
          <Mail className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Smart Email Generator</h2>
          <p className="text-sm text-slate-500">Generate context-based professional emails with tone and audience control</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">Email Topic / Subject</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Project timeline update for Q4 launch"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">Audience</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['client', 'manager', 'team'] as EmailAudience[]).map((a) => (
                  <button
                    key={a}
                    onClick={() => setAudience(a)}
                    className={`rounded-lg px-2 py-2 text-xs font-medium capitalize transition ${
                      audience === a
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">Tone</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['formal', 'informal', 'persuasive'] as EmailTone[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={`rounded-lg px-2 py-2 text-xs font-medium capitalize transition ${
                      tone === t
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">Key Points to Include</label>
            <textarea
              value={keyPoints}
              onChange={(e) => setKeyPoints(e.target.value)}
              placeholder={'Enter one point per line:\nDeadline is October 15\nBudget approved at $50k\nNeed design review by Friday'}
              rows={5}
              className="w-full resize-none rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!topic.trim() || loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Sparkles className="h-4 w-4 animate-pulse" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Email
              </>
            )}
          </button>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
          {output ? (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-700">Generated Email</h3>
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
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="mb-3 text-sm">
                  <span className="font-semibold text-slate-700">Subject: </span>
                  <span className="text-slate-600">{output.subject}</span>
                </p>
                <div className="border-t border-slate-200 pt-3">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-600">
                    {output.body}
                  </pre>
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full min-h-[300px] flex-col items-center justify-center text-center">
              <Mail className="mb-3 h-12 w-12 text-slate-200" />
              <p className="text-sm text-slate-400">Your generated email will appear here</p>
              <p className="mt-1 text-xs text-slate-300">Fill in the details and click Generate</p>
            </div>
          )}
        </div>
      </div>

      {history.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="mb-3 text-sm font-bold text-slate-700">Saved Emails</h3>
          <div className="space-y-2">
            {history.map((email) => (
              <div key={email.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700">{email.topic}</p>
                  <p className="text-xs text-slate-400">
                    {email.audience} • {email.tone} • {new Date(email.created_at).toLocaleDateString()}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
