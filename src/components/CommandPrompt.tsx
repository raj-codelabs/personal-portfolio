import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Terminal, CornerDownLeft, Trash2 } from 'lucide-react';

interface CommandOutput {
  id: string;
  command: string;
  response: string | React.ReactNode;
}

export const CommandPrompt: React.FC = () => {
  const { toggleTheme } = useTheme();
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<CommandOutput[]>([
    {
      id: 'init-1',
      command: 'whoami',
      response: 'Raj Golder · B.Tech CSE (AI/ML) Undergraduate [1st Year]',
    },
  ]);

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed) return;

    let responseNode: React.ReactNode = '';

    if (trimmed === 'help') {
      responseNode = (
        <div className="space-y-1 text-xs text-[#8b949e]">
          <div>Available commands:</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 pt-1 font-mono text-[#58a6ff]">
            <span>projects</span>
            <span>journey</span>
            <span>skills</span>
            <span>about</span>
            <span>contact</span>
            <span>theme</span>
            <span>whoami</span>
            <span>clear</span>
          </div>
        </div>
      );
    } else if (trimmed === 'projects' || trimmed === 'ls projects' || trimmed === 'ls') {
      responseNode = 'Navigating to [Projects]: AI Study Notes Summarizer (deployed) & upcoming concepts.';
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
    } else if (trimmed === 'journey' || trimmed === 'timeline') {
      responseNode = 'Navigating to [Learning Journey]: MATS University, CS50x, CS50P & projects.';
      document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth' });
    } else if (trimmed === 'skills' || trimmed === 'cat skills') {
      responseNode = 'Navigating to [Skills]: Python, C, Git, GitHub, VS Code, and learning areas.';
      document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
    } else if (trimmed === 'about' || trimmed === 'cat about') {
      responseNode = 'Navigating to [About]: Student background at MATS University & learning philosophy.';
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    } else if (trimmed === 'contact' || trimmed === 'mail') {
      responseNode = 'Navigating to [Contact]: GitHub, LinkedIn & direct messaging.';
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    } else if (trimmed === 'theme' || trimmed === 'toggle theme' || trimmed === 'switch') {
      responseNode = 'Switching active visual identity...';
      toggleTheme();
    } else if (trimmed === 'whoami') {
      responseNode = 'Raj Golder · CSE Student Building Practical Projects · MATS University (First Year)';
    } else if (trimmed === 'clear') {
      setHistory([]);
      setInputVal('');
      return;
    } else {
      responseNode = `bash: command not found: ${trimmed}. Type 'help' for executable commands.`;
    }

    setHistory((prev) => [
      ...prev,
      {
        id: String(Date.now() + Math.random()),
        command: cmd,
        response: responseNode,
      },
    ]);
    setInputVal('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(inputVal);
  };

  const quickCommands = ['help', 'projects', 'journey', 'skills', 'about', 'contact', 'theme'];

  return (
    <div className="w-full rounded-md border border-[#30363d] bg-[#0d1117] font-mono text-xs overflow-hidden shadow-md">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#30363d] bg-[#161b22] text-[#8b949e]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
          </div>
          <span className="text-[11px] text-[#c9d1d9] font-medium ml-1">
            raj@workstation:~ (interactive prompt)
          </span>
        </div>
        {history.length > 0 && (
          <button
            onClick={() => setHistory([])}
            title="Clear terminal buffer"
            className="flex items-center gap-1 text-[11px] text-[#8b949e] hover:text-[#e6edf3] transition-colors cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
            <span>clear</span>
          </button>
        )}
      </div>

      {/* Terminal History Log */}
      <div className="p-3 space-y-2 max-h-48 overflow-y-auto">
        {history.map((item) => (
          <div key={item.id} className="space-y-1">
            <div className="flex items-center gap-1.5 text-[#58a6ff]">
              <span className="text-[#3fb950] font-bold">$</span>
              <span>{item.command}</span>
            </div>
            <div className="text-[#c9d1d9] pl-3 leading-relaxed border-l border-[#30363d]">
              {item.response}
            </div>
          </div>
        ))}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-1">
          <span className="text-[#3fb950] font-bold shrink-0">$</span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type 'help', 'projects', 'journey'..."
            aria-label="Interactive terminal command prompt"
            className="flex-1 bg-transparent text-[#e6edf3] placeholder-[#6e7681] focus:outline-none text-xs"
          />
          <button
            type="submit"
            aria-label="Execute command"
            className="p-1 rounded text-[#8b949e] hover:text-[#58a6ff] hover:bg-[#161b22] transition-colors"
          >
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Quick Clickable Suggestions */}
      <div className="px-3 py-2 border-t border-[#30363d] bg-[#161b22]/50 flex flex-wrap items-center gap-1.5 text-[11px]">
        <span className="text-[#8b949e] mr-1">Quick commands:</span>
        {quickCommands.map((cmd) => (
          <button
            key={cmd}
            type="button"
            onClick={() => executeCommand(cmd)}
            className="px-2 py-0.5 rounded border border-[#30363d] bg-[#161b22] text-[#8b949e] hover:border-[#58a6ff] hover:text-[#58a6ff] transition-colors cursor-pointer"
          >
            {cmd}
          </button>
        ))}
      </div>
    </div>
  );
};
