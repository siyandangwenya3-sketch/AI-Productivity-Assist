// AI Prompt Engine — template-based text generation simulating AI-powered workplace productivity.
// Uses structured prompt engineering techniques: context injection, audience adaptation,
// tone modulation, and structured output parsing.

export type EmailTone = 'formal' | 'informal' | 'persuasive';
export type EmailAudience = 'client' | 'manager' | 'team';

export interface EmailInput {
  topic: string;
  audience: EmailAudience;
  tone: EmailTone;
  keyPoints: string;
}

export interface EmailOutput {
  subject: string;
  body: string;
}

const toneStyles: Record<EmailTone, { greeting: string; closing: string; style: string }> = {
  formal: {
    greeting: 'Dear',
    closing: 'Sincerely',
    style: 'professional, respectful, and structured with clear formality',
  },
  informal: {
    greeting: 'Hi',
    closing: 'Best',
    style: 'friendly, approachable, and conversational while remaining professional',
  },
  persuasive: {
    greeting: 'Dear',
    closing: 'Thank you for your consideration',
    style: 'compelling and action-oriented, emphasizing benefits and creating urgency',
  },
};

const audienceContext: Record<EmailAudience, string> = {
  client: 'a valued client — focus on delivering value, building trust, and addressing their business needs',
  manager: 'your manager — focus on clarity, results, alignment with priorities, and demonstrating initiative',
  team: 'your team — focus on collaboration, shared goals, clarity of expectations, and team success',
};

export function generateEmail(input: EmailInput): EmailOutput {
  const style = toneStyles[input.tone];
  const audience = audienceContext[input.audience];

  const points = input.keyPoints
    .split('\n')
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  const pointsList = points.length > 0
    ? points.map((p) => `  • ${p}`).join('\n')
    : '  • (No specific points provided — the email covers the topic generally.)';

  const subject = input.topic.charAt(0).toUpperCase() + input.topic.slice(1);

  const body = `${style.greeting} ${input.audience === 'team' ? 'Team' : input.audience === 'manager' ? '[Manager Name]' : '[Client Name]'},

I hope this message finds you well. I'm writing to you regarding ${input.topic}.

Given our shared priorities, I wanted to reach out in a ${style.style} manner, keeping in mind that you are ${audience}.

Here are the key points I'd like to address:

${pointsList}

${input.tone === 'persuasive'
    ? `I firmly believe that moving forward on this will yield significant benefits. The timing is ideal, and I'd welcome the opportunity to discuss this further at your earliest convenience.`
    : `I'm happy to provide additional details or discuss any of these points further. Please let me know what works best for you.`}

${style.closing},
[Your Name]`;

  return { subject, body };
}

export interface MeetingNotesInput {
  title: string;
  rawNotes: string;
}

export interface MeetingNotesOutput {
  summary: string;
  keyPoints: string[];
  decisions: string[];
  actionItems: { task: string; owner: string; deadline: string }[];
}

export function summarizeMeetingNotes(input: MeetingNotesInput): MeetingNotesOutput {
  const lines = input.rawNotes
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const keyPoints: string[] = [];
  const decisions: string[] = [];
  const actionItems: { task: string; owner: string; deadline: string }[] = [];

  for (const line of lines) {
    const lower = line.toLowerCase();

    if (lower.includes('decided') || lower.includes('agreed') || lower.includes('approved') || lower.includes('confirmed')) {
      decisions.push(line.replace(/^(decided|agreed|approved|confirmed)[:\s]*/i, '').trim());
    } else if (lower.includes('action item') || lower.includes('to-do') || lower.includes('todo') || lower.includes('assign') || lower.includes('will ') || lower.includes('needs to')) {
      let task = line.replace(/^(action item|to-do|todo)[:\s]*/i, '').trim();
      let owner = 'Unassigned';
      let deadline = 'No deadline set';

      const ownerMatch = line.match(/(?:by|owner:|assigned to)\s+([A-Z][a-z]+)/i);
      if (ownerMatch) owner = ownerMatch[1];

      const deadlineMatch = line.match(/(?:by|before|due)\s+([^,\n]+)/i);
      if (deadlineMatch) deadline = deadlineMatch[1].trim();

      actionItems.push({ task, owner, deadline });
    } else if (line.length > 10) {
      keyPoints.push(line.replace(/^[-•*\d.\s]+/, '').trim());
    }
  }

  const summary = `This meeting (${input.title}) covered ${keyPoints.length} key discussion points, resulted in ${decisions.length} decisions, and identified ${actionItems.length} action items requiring follow-up. ${decisions.length > 0 ? `Key decisions were made regarding ${decisions.slice(0, 2).join(' and ')}. ` : ''}${actionItems.length > 0 ? `Action items have been assigned and should be tracked to completion.` : 'No specific action items were identified.'}`;

  return { summary, keyPoints, decisions, actionItems };
}

export interface TaskPlannerInput {
  planType: 'daily' | 'weekly';
  tasks: string;
  workHours: string;
}

export interface PlannedTask {
  task: string;
  priority: 'High' | 'Medium' | 'Low';
  urgency: string;
  importance: string;
  timeSlot: string;
  rationale: string;
}

export interface TaskPlannerOutput {
  plan: PlannedTask[];
  timeOptimization: string[];
}

export function planTasks(input: TaskPlannerInput): TaskPlannerOutput {
  const taskLines = input.tasks
    .split('\n')
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

  const urgencyKeywords = ['urgent', 'asap', 'immediately', 'today', 'deadline', 'overdue', 'critical', 'important'];
  const importanceKeywords = ['important', 'key', 'strategic', 'revenue', 'client', 'customer', 'goal', 'objective'];

  const planned: PlannedTask[] = taskLines.map((task) => {
    const lower = task.toLowerCase();
    const urgencyScore = urgencyKeywords.filter((k) => lower.includes(k)).length;
    const importanceScore = importanceKeywords.filter((k) => lower.includes(k)).length;
    const totalScore = urgencyScore + importanceScore;

    let priority: 'High' | 'Medium' | 'Low' = 'Low';
    if (totalScore >= 2) priority = 'High';
    else if (totalScore >= 1) priority = 'Medium';

    return {
      task,
      priority,
      urgency: urgencyScore >= 1 ? 'Urgent' : 'Not time-sensitive',
      importance: importanceScore >= 1 ? 'High impact' : 'Standard',
      timeSlot: '',
      rationale: '',
    };
  });

  planned.sort((a, b) => {
    const order = { High: 0, Medium: 1, Low: 2 };
    return order[a.priority] - order[b.priority];
  });

  const slots = input.planType === 'daily'
    ? ['9:00 AM – 10:30 AM', '10:30 AM – 12:00 PM', '1:00 PM – 2:30 PM', '2:30 PM – 4:00 PM', '4:00 PM – 5:00 PM']
    : ['Monday Morning', 'Monday Afternoon', 'Tuesday Morning', 'Tuesday Afternoon', 'Wednesday Morning', 'Wednesday Afternoon', 'Thursday Morning', 'Thursday Afternoon', 'Friday Morning', 'Friday Afternoon'];

  planned.forEach((task, i) => {
    task.timeSlot = slots[i % slots.length];
    task.rationale = `${task.priority} priority — ${task.urgency === 'Urgent' ? 'time-sensitive' : 'flexible timing'}, ${task.importance.toLowerCase()}. Scheduled during ${task.priority === 'High' ? 'peak energy hours' : 'secondary slots'}.`;
  });

  const timeOptimization = [
    'Block calendar for deep-work sessions on High priority tasks to minimize context switching.',
    'Batch similar low-priority tasks together during the 4:00 PM – 5:00 PM slot for efficiency.',
    'Reserve the first 15 minutes of each day to review and re-prioritize this plan.',
    'Use the 2-minute rule: if a task takes less than 2 minutes, do it immediately rather than scheduling it.',
    'Protect your peak productivity hours (typically morning) for High priority, high-impact work.',
  ];

  return { plan: planned, timeOptimization };
}

export interface ResearchInput {
  topic: string;
  sourceText: string;
}

export interface ResearchOutput {
  summary: string;
  keyInsights: string[];
  recommendations: string[];
}

export function summarizeResearch(input: ResearchInput): ResearchOutput {
  const paragraphs = input.sourceText
    .split(/\n\n+|\.\s+(?=[A-Z])/)
    .map((p) => p.trim())
    .filter((p) => p.length > 20);

  const sentences = input.sourceText
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 30);

  const summary = `This research on "${input.topic}" spans ${paragraphs.length} paragraphs of source material. ${sentences.slice(0, 2).join(' ')} The material covers key aspects of ${input.topic} and provides actionable information for decision-making.`;

  const keyInsights: string[] = [];
  const insightMarkers = ['important', 'key', 'significant', 'notable', 'critical', 'found', 'shows', 'reveals', 'indicates', 'demonstrates'];
  for (const sentence of sentences) {
    if (keyInsights.length >= 5) break;
    const lower = sentence.toLowerCase();
    if (insightMarkers.some((m) => lower.includes(m))) {
      keyInsights.push(sentence.replace(/^[-•*\d.\s]+/, '').trim());
    }
  }
  if (keyInsights.length < 3 && sentences.length > 0) {
    keyInsights.push(...sentences.slice(0, 5 - keyInsights.length).map((s) => s.replace(/^[-•*\d.\s]+/, '').trim()));
  }

  const recommendations = [
    `Apply the findings from this research on ${input.topic} to inform your next strategic decision or project planning session.`,
    `Share the key insights with relevant stakeholders to ensure alignment and collective understanding of ${input.topic}.`,
    `Consider conducting a follow-up deep dive into the most impactful aspects identified above for more thorough analysis.`,
    `Use the summarized information to create a brief presentation or briefing document for leadership review.`,
  ];

  return { summary, keyInsights, recommendations };
}

export interface ChatResponse {
  content: string;
}

const workplaceKnowledge: { keywords: string[]; response: string }[] = [
  {
    keywords: ['email', 'write email', 'draft email'],
    response: "I can help you draft professional emails! Here's a quick framework:\n\n1. Start with a clear subject line\n2. Open with a context-appropriate greeting\n3. State your purpose in the first sentence\n4. Provide necessary details in bullet points\n5. End with a clear call-to-action\n6. Close professionally\n\nWould you like me to generate a specific email? Try the Smart Email Generator tab!",
  },
  {
    keywords: ['meeting', 'notes', 'summarize meeting'],
    response: "For effective meeting notes, I recommend:\n\n1. Note the meeting title, date, and attendees\n2. Record key discussion points as they happen\n3. Flag decisions with 'DECIDED:' prefix\n4. Mark action items with 'ACTION:' + owner + deadline\n5. Summarize in 2-3 sentences at the end\n\nYou can paste your raw notes into the Meeting Notes Summarizer to get a structured summary automatically!",
  },
  {
    keywords: ['schedule', 'plan', 'task', 'priority', 'time management'],
    response: "Here's a prioritization framework I recommend:\n\n• **Urgent + Important** → Do first (crises, deadlines)\n• **Important, not urgent** → Schedule for deep work\n• **Urgent, not important** → Delegate if possible\n• **Neither** → Eliminate or defer\n\nTry the AI Task Planner tab to auto-generate a structured schedule from your task list!",
  },
  {
    keywords: ['research', 'summarize article', 'summarize report'],
    response: "When researching a topic efficiently:\n\n1. Define your research question clearly\n2. Skim for the thesis/abstract first\n3. Look for section headings to map structure\n4. Extract key data points and quotes\n5. Note contradictions or gaps\n6. Synthesize into your own summary\n\nUse the AI Research Assistant tab to paste any article and get an instant structured summary!",
  },
  {
    keywords: ['productivity', 'efficient', 'focus', 'procrastination'],
    response: "Here are proven productivity techniques:\n\n• **Pomodoro Technique**: 25 min focused work + 5 min break\n• **Time Blocking**: Assign specific time slots to specific tasks\n• **2-Minute Rule**: If it takes <2 min, do it now\n• **Eat the Frog**: Tackle the hardest task first\n• **Single-tasking**: Close tabs and silence notifications\n\nWhich technique would you like to explore further?",
  },
  {
    keywords: ['communication', 'presentation', 'stakeholder'],
    response: "For effective workplace communication:\n\n1. **Know your audience** — adjust tone and detail level\n2. **Lead with the conclusion** — busy people read top-down\n3. **Use the BLUF method** (Bottom Line Up Front)\n4. **Structure with headers and bullets** for scannability\n5. **End with clear next steps** — no ambiguity about who does what\n\nWould you like help drafting a specific communication?",
  },
  {
    keywords: ['stress', 'overwhelmed', 'burnout', 'workload'],
    response: "Managing workplace stress is important. Here are some strategies:\n\n• **Prioritize ruthlessly** — not everything is urgent\n• **Take real breaks** — step away from your desk\n• **Set boundaries** — learn to say 'not right now'\n• **Break large projects into small tasks**\n• **Ask for help** — delegating is a skill, not a weakness\n• **Protect sleep and exercise** — they're productivity multipliers\n\nWould you like me to help you create a structured plan to manage your current workload?",
  },
  {
    keywords: ['hello', 'hi', 'hey', 'help', 'what can you do'],
    response: "Hello! I'm your AI Workplace Assistant. I can help you with:\n\n1. **Smart Email Generator** — Draft professional emails with tone and audience control\n2. **Meeting Notes Summarizer** — Turn raw notes into structured summaries with action items\n3. **AI Task Planner** — Generate prioritized daily or weekly schedules\n4. **AI Research Assistant** — Summarize articles and extract key insights\n5. **This Chatbot** — Ask me anything about workplace productivity\n\nWhat would you like help with today?",
  },
];

export function generateChatResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();

  for (const entry of workplaceKnowledge) {
    if (entry.keywords.some((k) => lower.includes(k))) {
      return entry.response;
    }
  }

  if (lower.includes('?') || lower.length > 0) {
    return `That's a great question. Here's my take:\n\nBased on what you've shared, I'd recommend breaking this down into smaller, actionable steps. In a workplace context, the key is to:\n\n1. **Clarify the goal** — what does success look like?\n2. **Identify constraints** — time, resources, stakeholders\n3. **Plan the approach** — use the Task Planner for structured scheduling\n4. **Communicate early** — use the Email Generator to keep stakeholders informed\n5. **Review and adjust** — track progress and adapt as needed\n\nWould you like me to help with any of these steps specifically? You can also try the other tools in the sidebar for more targeted assistance.`;
  }

  return "I'm here to help with workplace productivity! You can ask me about email drafting, meeting notes, task scheduling, research summarization, or general productivity tips. What's on your mind?";
}
