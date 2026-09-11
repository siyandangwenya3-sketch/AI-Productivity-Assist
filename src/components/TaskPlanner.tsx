import { useState } from 'react';
import { CalendarDays, Save, Sparkles, Clock, Lightbulb, ArrowUp, ArrowRight, ArrowDown } from 'lucide-react';
import { planTasks, type TaskPlannerOutput } from '@/lib/ai-engine';
import { supabase, type TaskPlan } from '@/lib/supabase';

export default function TaskPlanner() {
  const [planType, setPlanType] = useState<'daily' | 'weekly'>('daily');
  const [tasks, setTasks] = useState('');
  const [workHours, setWorkHours] = useState('9-5');
  const [output, setOutput] = useState<TaskPlannerOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [history, setHistory] = useState<TaskPlan[]>([]);

  const handlePlan = async () => {
    if (!tasks.trim()) return;
    setLoading(true);
    setSaved(false);
    await new Promise((r) => setTimeout(r, 600));
    const result = planTasks({ planType, tasks, workHours });
    setOutput(result);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!output) return;
    const { data, error } = await supabase
      .from('task_plans')
      .insert({
        plan_type: planType,
        input_tasks: tasks,
        structured_plan: JSON.stringify(output),
      })
      .select()
      .single();

    if (!error && data) {
      setSaved(true);
      setHistory((prev) => [data as TaskPlan, ...prev]);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const priorityIcon = (priority: string) => {
    if (priority === 'High') return <ArrowUp className="h-4 w-4 text-rose-500" />;
    if (priority === 'Medium') return <ArrowRight className="h-4 w-4 text-amber-500" />;
    return <ArrowDown className="h-4 w-4 text-slate-400" />;
  };

  const priorityColor = (priority: string) => {
    if (priority === 'High') return 'bg-rose-50 text-rose-700 border-rose-200';
    if (priority === 'Medium') return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-slate-50 text-slate-600 border-slate-200';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50">
          <CalendarDays className="h-5 w-5 text-violet-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">AI Task Planner</h2>
          <p className="text-sm text-slate-500">Generate prioritized schedules with time optimization strategies</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">Plan Type</label>
            <div className="grid grid-cols-2 gap-2">
              {(['daily', 'weekly'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setPlanType(t)}
                  className={`rounded-lg px-4 py-2.5 text-sm font-medium capitalize transition ${
                    planType === t
                      ? 'bg-violet-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t} Plan
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">Your Tasks</label>
            <textarea
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
              placeholder={'Enter one task per line.\n\nTip: Include keywords like "urgent", "important", "deadline" for better prioritization.\n\ne.g.\nUrgent: Finish Q4 budget proposal by Friday\nImportant: Review team performance evaluations\nPrepare presentation for client meeting\nUpdate project documentation'}
              rows={8}
              className="w-full resize-none rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">Working Hours</label>
            <input
              type="text"
              value={workHours}
              onChange={(e) => setWorkHours(e.target.value)}
              placeholder="e.g., 9-5"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            />
          </div>

          <button
            onClick={handlePlan}
            disabled={!tasks.trim() || loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Sparkles className="h-4 w-4 animate-pulse" />
                Planning...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate {planType === 'daily' ? 'Daily' : 'Weekly'} Plan
              </>
            )}
          </button>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
          {output ? (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-700">Your {planType === 'daily' ? 'Daily' : 'Weekly'} Schedule</h3>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-200"
                >
                  {saved ? <span className="text-green-600">Saved!</span> : <><Save className="h-3.5 w-3.5" />Save Plan</>}
                </button>
              </div>

              <div className="space-y-2">
                {output.plan.map((task, i) => (
                  <div key={i} className="rounded-lg border border-slate-200 p-3.5 transition hover:shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">{priorityIcon(task.priority)}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium text-slate-700">{task.task}</p>
                          <span className={`flex-shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium ${priorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {task.timeSlot}
                          </span>
                          <span>{task.urgency}</span>
                          <span>{task.importance}</span>
                        </div>
                        <p className="mt-1.5 text-xs text-slate-400">{task.rationale}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-lg bg-violet-50 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-violet-600" />
                  <h4 className="text-sm font-bold text-slate-700">Time Optimization Strategies</h4>
                </div>
                <ul className="space-y-1.5">
                  {output.timeOptimization.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-violet-400" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="flex h-full min-h-[300px] flex-col items-center justify-center text-center">
              <CalendarDays className="mb-3 h-12 w-12 text-slate-200" />
              <p className="text-sm text-slate-400">Your prioritized schedule will appear here</p>
              <p className="mt-1 text-xs text-slate-300">Add your tasks and click Generate</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
