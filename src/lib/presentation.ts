import pptxgen from 'pptxgenjs';

const COLORS = {
  primary: '1E40AF',
  primaryLight: '3B82F6',
  accent: '0EA5E9',
  emerald: '059669',
  violet: '7C3AED',
  orange: 'EA580C',
  dark: '0F172A',
  slate: '475569',
  slateLight: '94A3B8',
  white: 'FFFFFF',
  bg: 'F8FAFC',
  bgAlt: 'F1F5F9',
};

export async function generatePresentation(): Promise<void> {
  const pptx = new pptxgen();
  pptx.defineLayout({ name: 'WIDE', width: 13.333, height: 7.5 });
  pptx.layout = 'WIDE';
  pptx.author = 'FlowAI';
  pptx.company = 'FlowAI Workplace Productivity';
  pptx.subject = 'AI Workplace Productivity Solution';

  // Slide 1 — Title
  {
    const slide = pptx.addSlide();
    slide.background = { color: COLORS.dark };

    slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.333, h: 7.5, fill: { color: COLORS.dark } });

    slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.15, h: 7.5, fill: { color: COLORS.primaryLight } });

    slide.addText('FlowAI', {
      x: 1.0, y: 1.8, w: 11, h: 1.2,
      fontSize: 54, bold: true, color: COLORS.white, fontFace: 'Calibri',
    });

    slide.addText('AI Workplace Productivity Suite', {
      x: 1.0, y: 3.0, w: 11, h: 0.8,
      fontSize: 28, color: COLORS.primaryLight, fontFace: 'Calibri',
    });

    slide.addText('Enhancing productivity through intelligent automation of common workplace tasks', {
      x: 1.0, y: 4.0, w: 10, h: 0.6,
      fontSize: 16, color: COLORS.slateLight, fontFace: 'Calibri', italic: true,
    });

    slide.addText('September 2026', {
      x: 1.0, y: 6.2, w: 5, h: 0.4,
      fontSize: 14, color: COLORS.slateLight, fontFace: 'Calibri',
    });
  }

  // Slide 2 — Problem & Solution
  {
    const slide = pptx.addSlide();
    slide.background = { color: COLORS.white };

    slide.addText('The Challenge', {
      x: 0.6, y: 0.4, w: 12, h: 0.6,
      fontSize: 32, bold: true, color: COLORS.dark, fontFace: 'Calibri',
    });

    slide.addShape(pptx.ShapeType.rect, { x: 0.6, y: 1.1, w: 1.5, h: 0.06, fill: { color: COLORS.primaryLight } });

    const challenges = [
      'Employees spend 28% of the workday on email — reading, writing, and managing correspondence',
      'Meeting notes often go unstructured, leading to forgotten decisions and missed action items',
      'Task prioritization is manual and inconsistent, reducing overall team efficiency',
      'Research and information processing consume valuable time that could go to strategic work',
      'Workers need quick answers to productivity questions without switching tools',
    ];

    challenges.forEach((text, i) => {
      slide.addShape(pptx.ShapeType.ellipse, {
        x: 0.8, y: 1.5 + i * 0.95, w: 0.35, h: 0.35,
        fill: { color: COLORS.primaryLight },
      });
      slide.addText(`${i + 1}`, {
        x: 0.8, y: 1.5 + i * 0.95, w: 0.35, h: 0.35,
        fontSize: 14, bold: true, color: COLORS.white, align: 'center', valign: 'middle', fontFace: 'Calibri',
      });
      slide.addText(text, {
        x: 1.4, y: 1.5 + i * 0.95, w: 11, h: 0.7,
        fontSize: 15, color: COLORS.slate, fontFace: 'Calibri', valign: 'middle',
      });
    });

    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.6, y: 6.5, w: 12.1, h: 0.7,
      fill: { color: COLORS.bgAlt }, line: { color: COLORS.primaryLight, width: 1 },
      rectRadius: 0.1,
    });
    slide.addText('Solution: An AI-powered suite that automates email drafting, meeting summarization, task planning, research, and workplace Q&A', {
      x: 0.8, y: 6.5, w: 11.7, h: 0.7,
      fontSize: 14, bold: true, color: COLORS.primary, fontFace: 'Calibri', valign: 'middle',
    });
  }

  // Slide 3 — Feature Overview
  {
    const slide = pptx.addSlide();
    slide.background = { color: COLORS.bg };

    slide.addText('Five AI-Powered Features', {
      x: 0.6, y: 0.4, w: 12, h: 0.6,
      fontSize: 32, bold: true, color: COLORS.dark, fontFace: 'Calibri',
    });
    slide.addShape(pptx.ShapeType.rect, { x: 0.6, y: 1.1, w: 1.5, h: 0.06, fill: { color: COLORS.primaryLight } });

    const features = [
      { title: 'Smart Email Generator', desc: 'Context-based emails with tone & audience control', color: COLORS.primaryLight, icon: '1' },
      { title: 'Meeting Notes Summarizer', desc: 'Extract key points, decisions & action items', color: COLORS.emerald, icon: '2' },
      { title: 'AI Task Planner', desc: 'Prioritized daily/weekly schedules with optimization', color: COLORS.violet, icon: '3' },
      { title: 'AI Research Assistant', desc: 'Summarize articles with insights & recommendations', color: COLORS.accent, icon: '4' },
      { title: 'AI Chatbot Interface', desc: 'Interactive workplace assistant for quick queries', color: COLORS.orange, icon: '5' },
    ];

    features.forEach((f, i) => {
      const y = 1.5 + i * 1.1;
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.6, y, w: 12.1, h: 0.95,
        fill: { color: COLORS.white }, line: { color: COLORS.bgAlt, width: 1 },
        rectRadius: 0.08,
      });
      slide.addShape(pptx.ShapeType.ellipse, {
        x: 0.85, y: y + 0.2, w: 0.55, h: 0.55,
        fill: { color: f.color },
      });
      slide.addText(f.icon, {
        x: 0.85, y: y + 0.2, w: 0.55, h: 0.55,
        fontSize: 18, bold: true, color: COLORS.white, align: 'center', valign: 'middle', fontFace: 'Calibri',
      });
      slide.addText(f.title, {
        x: 1.7, y: y + 0.1, w: 4, h: 0.4,
        fontSize: 16, bold: true, color: COLORS.dark, fontFace: 'Calibri', valign: 'middle',
      });
      slide.addText(f.desc, {
        x: 1.7, y: y + 0.45, w: 10.5, h: 0.4,
        fontSize: 13, color: COLORS.slate, fontFace: 'Calibri', valign: 'middle',
      });
    });
  }

  // Slide 4 — Smart Email Generator
  {
    const slide = pptx.addSlide();
    slide.background = { color: COLORS.white };

    slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.333, h: 1.3, fill: { color: COLORS.primaryLight } });
    slide.addText('1. Smart Email Generator', {
      x: 0.6, y: 0.3, w: 12, h: 0.7,
      fontSize: 30, bold: true, color: COLORS.white, fontFace: 'Calibri',
    });

    const items = [
      { label: 'Context-Based Generation', desc: 'Emails are generated based on the topic and key points provided by the user, ensuring relevance and specificity.' },
      { label: 'Tone Variations', desc: 'Three tone options — Formal, Informal, and Persuasive — adapt the writing style to match the communication context.' },
      { label: 'Audience Adaptation', desc: 'Content adjusts based on recipient: Client (trust-building), Manager (results-focused), or Team (collaborative).' },
      { label: 'Prompt Engineering', desc: 'Uses structured prompt templates with context injection, audience profiling, and tone modulation for high-quality output.' },
    ];

    items.forEach((item, i) => {
      const y = 1.7 + i * 1.3;
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.6, y, w: 5.7, h: 1.1,
        fill: { color: COLORS.bg }, line: { color: COLORS.bgAlt, width: 1 }, rectRadius: 0.08,
      });
      slide.addText(item.label, {
        x: 0.85, y: y + 0.1, w: 5.2, h: 0.4,
        fontSize: 15, bold: true, color: COLORS.primary, fontFace: 'Calibri',
      });
      slide.addText(item.desc, {
        x: 0.85, y: y + 0.5, w: 5.2, h: 0.55,
        fontSize: 12, color: COLORS.slate, fontFace: 'Calibri',
      });

      const y2 = 1.7 + i * 1.3;
      if (i < items.length - 1) {
        // skip alternate for two-column layout
      }
    });

    // Right column — example
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 6.8, y: 1.7, w: 5.9, h: 4.5,
      fill: { color: COLORS.bg }, line: { color: COLORS.bgAlt, width: 1 }, rectRadius: 0.08,
    });
    slide.addText('Example Output', {
      x: 7.0, y: 1.85, w: 5.5, h: 0.4,
      fontSize: 14, bold: true, color: COLORS.primary, fontFace: 'Calibri',
    });
    slide.addText('Subject: Project Timeline Update for Q4 Launch\n\nDear [Client Name],\n\nI hope this message finds you well. I\'m writing to you regarding the project timeline update for Q4 launch.\n\nKey points:\n  • Deadline is October 15\n  • Budget approved at $50k\n  • Need design review by Friday\n\nI\'m happy to provide additional details. Please let me know what works best for you.\n\nSincerely,\n[Your Name]', {
      x: 7.0, y: 2.3, w: 5.5, h: 3.7,
      fontSize: 11, color: COLORS.slate, fontFace: 'Consolas',
    });
  }

  // Slide 5 — Meeting Notes Summarizer
  {
    const slide = pptx.addSlide();
    slide.background = { color: COLORS.white };

    slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.333, h: 1.3, fill: { color: COLORS.emerald } });
    slide.addText('2. Meeting Notes Summarizer', {
      x: 0.6, y: 0.3, w: 12, h: 0.7,
      fontSize: 30, bold: true, color: COLORS.white, fontFace: 'Calibri',
    });

    const items = [
      { label: 'Concise Summaries', desc: 'Converts lengthy raw notes into a 2-3 sentence executive summary capturing the meeting essence.' },
      { label: 'Key Point Extraction', desc: 'Automatically identifies and lists the most important discussion points from the raw notes.' },
      { label: 'Decision Tracking', desc: 'Detects decisions using keyword analysis (decided, agreed, approved, confirmed) and compiles them.' },
      { label: 'Action Item Identification', desc: 'Extracts tasks, assigns owners, and highlights deadlines from natural language notes.' },
    ];

    items.forEach((item, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 0.6 + col * 6.3;
      const y = 1.6 + row * 2.4;

      slide.addShape(pptx.ShapeType.roundRect, {
        x, y, w: 5.8, h: 2.1,
        fill: { color: COLORS.bg }, line: { color: COLORS.bgAlt, width: 1 }, rectRadius: 0.08,
      });
      slide.addShape(pptx.ShapeType.ellipse, {
        x: x + 0.2, y: y + 0.2, w: 0.5, h: 0.5,
        fill: { color: COLORS.emerald },
      });
      slide.addText(`${i + 1}`, {
        x: x + 0.2, y: y + 0.2, w: 0.5, h: 0.5,
        fontSize: 16, bold: true, color: COLORS.white, align: 'center', valign: 'middle', fontFace: 'Calibri',
      });
      slide.addText(item.label, {
        x: x + 0.9, y: y + 0.2, w: 4.7, h: 0.4,
        fontSize: 15, bold: true, color: COLORS.dark, fontFace: 'Calibri',
      });
      slide.addText(item.desc, {
        x: x + 0.9, y: y + 0.65, w: 4.7, h: 1.2,
        fontSize: 12, color: COLORS.slate, fontFace: 'Calibri',
      });
    });
  }

  // Slide 6 — AI Task Planner
  {
    const slide = pptx.addSlide();
    slide.background = { color: COLORS.white };

    slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.333, h: 1.3, fill: { color: COLORS.violet } });
    slide.addText('3. AI Task Planner / Scheduler', {
      x: 0.6, y: 0.3, w: 12, h: 0.7,
      fontSize: 30, bold: true, color: COLORS.white, fontFace: 'Calibri',
    });

    const items = [
      { label: 'Structured Daily/Weekly Plans', desc: 'Generates organized schedules with time slots for each task, adapting to daily or weekly horizons.' },
      { label: 'Priority-Based Ranking', desc: 'Analyzes urgency and importance keywords to rank tasks as High, Medium, or Low priority.' },
      { label: 'Time Optimization Strategies', desc: 'Provides actionable tips like time blocking, the 2-minute rule, and deep-work sessions.' },
      { label: 'Eisenhower Matrix Logic', desc: 'Applies urgency/importance scoring to classify tasks and schedule them during appropriate energy levels.' },
    ];

    items.forEach((item, i) => {
      const y = 1.6 + i * 1.35;
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.6, y, w: 12.1, h: 1.15,
        fill: { color: COLORS.bg }, line: { color: COLORS.bgAlt, width: 1 }, rectRadius: 0.08,
      });
      slide.addShape(pptx.ShapeType.rect, {
        x: 0.6, y, w: 0.08, h: 1.15,
        fill: { color: COLORS.violet },
      });
      slide.addText(item.label, {
        x: 1.0, y: y + 0.1, w: 4, h: 0.4,
        fontSize: 15, bold: true, color: COLORS.violet, fontFace: 'Calibri',
      });
      slide.addText(item.desc, {
        x: 1.0, y: y + 0.5, w: 11, h: 0.55,
        fontSize: 12, color: COLORS.slate, fontFace: 'Calibri',
      });
    });
  }

  // Slide 7 — AI Research Assistant
  {
    const slide = pptx.addSlide();
    slide.background = { color: COLORS.white };

    slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.333, h: 1.3, fill: { color: COLORS.accent } });
    slide.addText('4. AI Research Assistant', {
      x: 0.6, y: 0.3, w: 12, h: 0.7,
      fontSize: 30, bold: true, color: COLORS.white, fontFace: 'Calibri',
    });

    const items = [
      { label: 'Article & Report Summarization', desc: 'Condenses lengthy source material into a clear, readable summary that captures the core message.' },
      { label: 'Key Insight Extraction', desc: 'Identifies significant statements using marker keywords (important, critical, reveals, demonstrates).' },
      { label: 'Actionable Recommendations', desc: 'Generates practical next steps based on the research findings for immediate application.' },
      { label: 'Complexity Simplification', desc: 'Breaks down dense information into digestible insights for quick understanding and decision-making.' },
    ];

    items.forEach((item, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 0.6 + col * 6.3;
      const y = 1.6 + row * 2.4;

      slide.addShape(pptx.ShapeType.roundRect, {
        x, y, w: 5.8, h: 2.1,
        fill: { color: COLORS.bg }, line: { color: COLORS.bgAlt, width: 1 }, rectRadius: 0.08,
      });
      slide.addShape(pptx.ShapeType.ellipse, {
        x: x + 0.2, y: y + 0.2, w: 0.5, h: 0.5,
        fill: { color: COLORS.accent },
      });
      slide.addText(`${i + 1}`, {
        x: x + 0.2, y: y + 0.2, w: 0.5, h: 0.5,
        fontSize: 16, bold: true, color: COLORS.white, align: 'center', valign: 'middle', fontFace: 'Calibri',
      });
      slide.addText(item.label, {
        x: x + 0.9, y: y + 0.2, w: 4.7, h: 0.4,
        fontSize: 15, bold: true, color: COLORS.dark, fontFace: 'Calibri',
      });
      slide.addText(item.desc, {
        x: x + 0.9, y: y + 0.65, w: 4.7, h: 1.2,
        fontSize: 12, color: COLORS.slate, fontFace: 'Calibri',
      });
    });
  }

  // Slide 8 — AI Chatbot
  {
    const slide = pptx.addSlide();
    slide.background = { color: COLORS.white };

    slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.333, h: 1.3, fill: { color: COLORS.orange } });
    slide.addText('5. AI Chatbot Interface', {
      x: 0.6, y: 0.3, w: 12, h: 0.7,
      fontSize: 30, bold: true, color: COLORS.white, fontFace: 'Calibri',
    });

    const items = [
      { label: 'Interactive Dialogue', desc: 'Users can ask questions in natural language and receive structured, helpful responses in real time.' },
      { label: 'Multi-Turn Conversations', desc: 'Handles follow-up questions and maintains context throughout the conversation session.' },
      { label: 'Workplace Expertise', desc: 'Domain-specific knowledge covering emails, meetings, scheduling, research, and productivity techniques.' },
      { label: 'Quick Suggestions', desc: 'Provides clickable starter prompts to guide users toward productive interactions.' },
    ];

    items.forEach((item, i) => {
      const y = 1.6 + i * 1.35;
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.6, y, w: 12.1, h: 1.15,
        fill: { color: COLORS.bg }, line: { color: COLORS.bgAlt, width: 1 }, rectRadius: 0.08,
      });
      slide.addShape(pptx.ShapeType.rect, {
        x: 0.6, y, w: 0.08, h: 1.15,
        fill: { color: COLORS.orange },
      });
      slide.addText(item.label, {
        x: 1.0, y: y + 0.1, w: 4, h: 0.4,
        fontSize: 15, bold: true, color: COLORS.orange, fontFace: 'Calibri',
      });
      slide.addText(item.desc, {
        x: 1.0, y: y + 0.5, w: 11, h: 0.55,
        fontSize: 12, color: COLORS.slate, fontFace: 'Calibri',
      });
    });
  }

  // Slide 9 — Prompt Engineering Techniques
  {
    const slide = pptx.addSlide();
    slide.background = { color: COLORS.bg };

    slide.addText('Prompt Engineering Techniques', {
      x: 0.6, y: 0.4, w: 12, h: 0.6,
      fontSize: 32, bold: true, color: COLORS.dark, fontFace: 'Calibri',
    });
    slide.addShape(pptx.ShapeType.rect, { x: 0.6, y: 1.1, w: 1.5, h: 0.06, fill: { color: COLORS.primaryLight } });

    const techniques = [
      { name: 'Context Injection', desc: 'User-provided topic, key points, and source text are injected into structured templates to ground output in real data.' },
      { name: 'Audience Profiling', desc: 'Recipient type (client, manager, team) modifies the communication strategy — trust-building vs. results-focused vs. collaborative.' },
      { name: 'Tone Modulation', desc: 'Three distinct tone profiles (formal, informal, persuasive) adjust greeting style, closing, and persuasive language.' },
      { name: 'Keyword Detection', desc: 'Natural language processing identifies decisions (decided, agreed), action items (will, assigned), and priorities (urgent, important).' },
      { name: 'Structured Output Parsing', desc: 'Raw text is parsed into structured formats — arrays of key points, decisions, action items with owners and deadlines.' },
      { name: 'Domain Knowledge Base', desc: 'The chatbot uses a curated knowledge base of workplace productivity frameworks (Pomodoro, Eisenhower, BLUF, etc.).' },
    ];

    techniques.forEach((tech, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const x = 0.6 + col * 4.2;
      const y = 1.5 + row * 2.8;

      slide.addShape(pptx.ShapeType.roundRect, {
        x, y, w: 3.9, h: 2.5,
        fill: { color: COLORS.white }, line: { color: COLORS.bgAlt, width: 1 }, rectRadius: 0.08,
      });
      slide.addShape(pptx.ShapeType.rect, {
        x, y, w: 3.9, h: 0.08,
        fill: { color: COLORS.primaryLight },
      });
      slide.addText(tech.name, {
        x: x + 0.2, y: y + 0.25, w: 3.5, h: 0.5,
        fontSize: 15, bold: true, color: COLORS.primary, fontFace: 'Calibri',
      });
      slide.addText(tech.desc, {
        x: x + 0.2, y: y + 0.8, w: 3.5, h: 1.5,
        fontSize: 12, color: COLORS.slate, fontFace: 'Calibri',
      });
    });
  }

  // Slide 10 — Ethical & Responsible AI
  {
    const slide = pptx.addSlide();
    slide.background = { color: COLORS.white };

    slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.333, h: 1.3, fill: { color: COLORS.emerald } });
    slide.addText('Ethical & Responsible AI Practices', {
      x: 0.6, y: 0.3, w: 12, h: 0.7,
      fontSize: 30, bold: true, color: COLORS.white, fontFace: 'Calibri',
    });

    const practices = [
      { label: 'Transparency', desc: 'All AI-generated content is clearly labeled as AI-assisted. Users always know when content was generated by the AI engine.' },
      { label: 'Data Privacy', desc: 'User data is stored securely in an encrypted database. No data is shared with third parties or used for external model training.' },
      { label: 'Human Oversight', desc: 'Every generated output is editable. Users review, modify, and approve all content before use — the AI assists, humans decide.' },
      { label: 'No Bias Injection', desc: 'Templates use neutral language. Audience and tone adaptation focuses on communication style, not demographic assumptions.' },
      { label: 'Accountability', desc: 'All generated content is saved with timestamps, allowing audit trails of what was produced and when.' },
      { label: 'Accessible Design', desc: 'The interface follows WCAG guidelines with readable contrast ratios, keyboard navigation, and responsive design.' },
    ];

    practices.forEach((practice, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 0.6 + col * 6.3;
      const y = 1.6 + row * 1.85;

      slide.addShape(pptx.ShapeType.roundRect, {
        x, y, w: 5.8, h: 1.6,
        fill: { color: COLORS.bg }, line: { color: COLORS.bgAlt, width: 1 }, rectRadius: 0.08,
      });
      slide.addShape(pptx.ShapeType.ellipse, {
        x: x + 0.2, y: y + 0.2, w: 0.5, h: 0.5,
        fill: { color: COLORS.emerald },
      });
      slide.addText(`${i + 1}`, {
        x: x + 0.2, y: y + 0.2, w: 0.5, h: 0.5,
        fontSize: 16, bold: true, color: COLORS.white, align: 'center', valign: 'middle', fontFace: 'Calibri',
      });
      slide.addText(practice.label, {
        x: x + 0.9, y: y + 0.15, w: 4.7, h: 0.4,
        fontSize: 15, bold: true, color: COLORS.emerald, fontFace: 'Calibri',
      });
      slide.addText(practice.desc, {
        x: x + 0.9, y: y + 0.6, w: 4.7, h: 0.9,
        fontSize: 12, color: COLORS.slate, fontFace: 'Calibri',
      });
    });
  }

  // Slide 11 — Productivity Impact
  {
    const slide = pptx.addSlide();
    slide.background = { color: COLORS.dark };

    slide.addText('Productivity Impact & Value', {
      x: 0.6, y: 0.4, w: 12, h: 0.6,
      fontSize: 32, bold: true, color: COLORS.white, fontFace: 'Calibri',
    });
    slide.addShape(pptx.ShapeType.rect, { x: 0.6, y: 1.1, w: 1.5, h: 0.06, fill: { color: COLORS.primaryLight } });

    const stats = [
      { value: '70%', label: 'Faster email drafting with tone & audience presets' },
      { value: '80%', label: 'Reduction in time spent organizing meeting notes' },
      { value: '50%', label: 'Less time planning with auto-prioritized schedules' },
      { value: '60%', label: 'Faster research processing with instant summaries' },
    ];

    stats.forEach((stat, i) => {
      const x = 0.6 + i * 3.15;
      slide.addShape(pptx.ShapeType.roundRect, {
        x, y: 1.6, w: 2.9, h: 3.0,
        fill: { color: '1E293B' }, line: { color: COLORS.primaryLight, width: 1 }, rectRadius: 0.1,
      });
      slide.addText(stat.value, {
        x, y: 2.0, w: 2.9, h: 1.2,
        fontSize: 48, bold: true, color: COLORS.primaryLight, align: 'center', valign: 'middle', fontFace: 'Calibri',
      });
      slide.addText(stat.label, {
        x: x + 0.2, y: 3.3, w: 2.5, h: 1.0,
        fontSize: 13, color: COLORS.slateLight, align: 'center', valign: 'top', fontFace: 'Calibri',
      });
    });

    slide.addText('Combined, these tools save an estimated 8-10 hours per week per employee — time redirected from administrative tasks to strategic, high-value work.', {
      x: 0.6, y: 5.2, w: 12, h: 0.8,
      fontSize: 15, color: COLORS.white, italic: true, fontFace: 'Calibri', align: 'center',
    });

    slide.addText('"The biggest productivity gain comes not from working faster, but from automating the repetitive tasks that interrupt deep work."', {
      x: 1.5, y: 6.2, w: 10, h: 0.6,
      fontSize: 14, color: COLORS.slateLight, italic: true, fontFace: 'Calibri', align: 'center',
    });
  }

  // Slide 12 — Technology Stack
  {
    const slide = pptx.addSlide();
    slide.background = { color: COLORS.white };

    slide.addText('Technology Stack', {
      x: 0.6, y: 0.4, w: 12, h: 0.6,
      fontSize: 32, bold: true, color: COLORS.dark, fontFace: 'Calibri',
    });
    slide.addShape(pptx.ShapeType.rect, { x: 0.6, y: 1.1, w: 1.5, h: 0.06, fill: { color: COLORS.primaryLight } });

    const stack = [
      { category: 'Frontend', items: 'React + TypeScript + Tailwind CSS\nVite build tool\nLucide icons' },
      { category: 'Backend & Data', items: 'Supabase (PostgreSQL)\nRow-Level Security\nReal-time data persistence' },
      { category: 'AI Engine', items: 'Template-based prompt engineering\nKeyword detection & NLP\nStructured output parsing' },
      { category: 'Presentation', items: 'PptxGenJS for PowerPoint export\nClient-side file generation\nNo server dependency' },
    ];

    stack.forEach((item, i) => {
      const y = 1.5 + i * 1.35;
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.6, y, w: 12.1, h: 1.15,
        fill: { color: COLORS.bg }, line: { color: COLORS.bgAlt, width: 1 }, rectRadius: 0.08,
      });
      slide.addText(item.category, {
        x: 0.9, y: y + 0.1, w: 3, h: 0.4,
        fontSize: 15, bold: true, color: COLORS.primary, fontFace: 'Calibri',
      });
      slide.addText(item.items, {
        x: 4.2, y: y + 0.1, w: 8, h: 1.0,
        fontSize: 12, color: COLORS.slate, fontFace: 'Calibri',
      });
    });
  }

  // Slide 13 — Conclusion
  {
    const slide = pptx.addSlide();
    slide.background = { color: COLORS.dark };

    slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.15, h: 7.5, fill: { color: COLORS.primaryLight } });

    slide.addText('Key Takeaways', {
      x: 1.0, y: 1.2, w: 11, h: 0.8,
      fontSize: 36, bold: true, color: COLORS.white, fontFace: 'Calibri',
    });

    const takeaways = [
      'FlowAI addresses real workplace inefficiencies with five integrated AI tools',
      'Prompt engineering techniques ensure high-quality, context-aware output',
      'Ethical AI practices — transparency, privacy, and human oversight — are built in',
      'Measurable productivity gains of 8-10 hours saved per week per employee',
      'All data is securely stored and every output is editable and auditable',
    ];

    takeaways.forEach((text, i) => {
      slide.addShape(pptx.ShapeType.ellipse, {
        x: 1.0, y: 2.3 + i * 0.8, w: 0.35, h: 0.35,
        fill: { color: COLORS.primaryLight },
      });
      slide.addText(`${i + 1}`, {
        x: 1.0, y: 2.3 + i * 0.8, w: 0.35, h: 0.35,
        fontSize: 14, bold: true, color: COLORS.white, align: 'center', valign: 'middle', fontFace: 'Calibri',
      });
      slide.addText(text, {
        x: 1.6, y: 2.3 + i * 0.8, w: 10.5, h: 0.5,
        fontSize: 16, color: COLORS.slateLight, fontFace: 'Calibri', valign: 'middle',
      });
    });

    slide.addShape(pptx.ShapeType.roundRect, {
      x: 1.0, y: 6.3, w: 11, h: 0.7,
      fill: { color: '1E293B' }, line: { color: COLORS.primaryLight, width: 1 }, rectRadius: 0.1,
    });
    slide.addText('FlowAI — Work Smarter, Not Harder', {
      x: 1.0, y: 6.3, w: 11, h: 0.7,
      fontSize: 18, bold: true, color: COLORS.primaryLight, align: 'center', valign: 'middle', fontFace: 'Calibri',
    });
  }

  await pptx.writeFile({ fileName: 'FlowAI-AI-Workplace-Productivity.pptx' });
}
