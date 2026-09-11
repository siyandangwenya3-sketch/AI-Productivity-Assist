import { useState } from 'react';
import { Mail, FileText, CalendarDays, BookOpen, MessageSquare, Sparkles, Menu, X, Shield, Zap, Clock, Presentation, Download, Loader2 } from 'lucide-react';
import EmailGenerator from '@/components/EmailGenerator';
import MeetingSummarizer from '@/components/MeetingSummarizer';
import TaskPlanner from '@/components/TaskPlanner';
import ResearchAssistant from '@/components/ResearchAssistant';
import Chatbot from '@/components/Chatbot';
import { generatePresentation } from '@/lib/presentation';

type Tab = 'email' | 'meeting' | 'planner' | 'research' | 'chatbot';

const tabs: { id: Tab; label: string; icon: typeof Mail; description: string }[] = [
  { id: 'email', label: 'Email Generator', icon: Mail, description: 'Draft professional emails' },
  { id: 'meeting', label: 'Meeting Summarizer', icon: FileText, description: 'Summarize meeting notes' },
  { id: 'planner', label: 'Task Planner', icon: CalendarDays, description: 'Plan & prioritize tasks' },
  { id: 'research', label: 'Research Assistant', icon: BookOpen, description: 'Summarize articles & reports' },
  { id: 'chatbot', label: 'AI Assistant', icon: MessageSquare, description: 'Chat with your assistant' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('email');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPresentation = async () => {
    setDownloading(true);
    try {
      await generatePresentation();
    } catch (err) {
      console.error('Presentation generation failed:', err);
    } finally {
      setDownloading(false);
    }
  };

  const activeTabData = tabs.find((t) => t.id === activeTab)!;

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900">FlowAI</h1>
            <p className="text-xs text-slate-500">Workplace Productivity Suite</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto p-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSidebarOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left transition ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                  isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${isActive ? 'text-blue-700' : 'text-slate-700'}`}>
                    {tab.label}
                  </p>
                  <p className="text-xs text-slate-400">{tab.description}</p>
                </div>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 p-4">
          <div className="rounded-xl bg-gradient-to-br from-slate-50 to-blue-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-600" />
              <p className="text-xs font-bold text-slate-700">Ethical AI Practices</p>
            </div>
            <p className="text-xs leading-relaxed text-slate-500">
              All AI-generated content is clearly labeled. Your data is securely stored and never shared with third parties.
            </p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <h2 className="text-lg font-bold text-slate-900">{activeTabData.label}</h2>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDownloadPresentation}
                disabled={downloading}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {downloading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="hidden sm:inline">Generating...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Download PPT</span>
                    <Presentation className="h-4 w-4 sm:hidden" />
                  </>
                )}
              </button>
              <div className="hidden items-center gap-4 lg:flex">
                <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-medium text-emerald-700">AI Engine Active</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock className="h-3.5 w-3.5" />
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6 lg:p-8">
          {/* Feature badges */}
          {activeTab === 'email' && (
            <div className="mb-6 flex flex-wrap gap-2">
              {['Context-based generation', 'Tone variations', 'Audience adaptation'].map((badge) => (
                <span key={badge} className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700">
                  <Zap className="h-3 w-3" />
                  {badge}
                </span>
              ))}
            </div>
          )}
          {activeTab === 'meeting' && (
            <div className="mb-6 flex flex-wrap gap-2">
              {['Key point extraction', 'Decision tracking', 'Action item identification'].map((badge) => (
                <span key={badge} className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
                  <Zap className="h-3 w-3" />
                  {badge}
                </span>
              ))}
            </div>
          )}
          {activeTab === 'planner' && (
            <div className="mb-6 flex flex-wrap gap-2">
              {['Priority-based scheduling', 'Urgency/importance analysis', 'Time optimization tips'].map((badge) => (
                <span key={badge} className="flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700">
                  <Zap className="h-3 w-3" />
                  {badge}
                </span>
              ))}
            </div>
          )}
          {activeTab === 'research' && (
            <div className="mb-6 flex flex-wrap gap-2">
              {['Article summarization', 'Key insight extraction', 'Actionable recommendations'].map((badge) => (
                <span key={badge} className="flex items-center gap-1.5 rounded-full bg-cyan-50 px-3 py-1.5 text-xs font-medium text-cyan-700">
                  <Zap className="h-3 w-3" />
                  {badge}
                </span>
              ))}
            </div>
          )}
          {activeTab === 'chatbot' && (
            <div className="mb-6 flex flex-wrap gap-2">
              {['Interactive dialogue', 'Multi-turn conversations', 'Workplace expertise'].map((badge) => (
                <span key={badge} className="flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-medium text-orange-700">
                  <Zap className="h-3 w-3" />
                  {badge}
                </span>
              ))}
            </div>
          )}

          {activeTab === 'email' && <EmailGenerator />}
          {activeTab === 'meeting' && <MeetingSummarizer />}
          {activeTab === 'planner' && <TaskPlanner />}
          {activeTab === 'research' && <ResearchAssistant />}
          {activeTab === 'chatbot' && <Chatbot />}
        </div>
      </main>
    </div>
  );
}
