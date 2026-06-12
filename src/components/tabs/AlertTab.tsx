'use client';

import { useState } from 'react';
import { ALERT_TEMPLATES, SMS_ALERT_TEMPLATES } from '@/lib/constants';
import { Send, Eye, MessageSquare, Phone } from 'lucide-react';

export default function AlertTab() {
  const [twilioSid, setTwilioSid] = useState(process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID || '');
  const [twilioToken, setTwilioToken] = useState(process.env.NEXT_PUBLIC_TWILIO_AUTH_TOKEN || '');
  const [twilioNumbers, setTwilioNumbers] = useState(process.env.NEXT_PUBLIC_TWILIO_NUMBERS || '');
  const [twilioSmsFrom, setTwilioSmsFrom] = useState(process.env.NEXT_PUBLIC_TWILIO_SMS_FROM || '');
  
  const [channel, setChannel] = useState<'WhatsApp' | 'SMS'>('WhatsApp');
  const [selectedTemplate, setSelectedTemplate] = useState('🦠 Disease Outbreak Alert');
  const [customNote, setCustomNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState<any[]>([]);

  const activeTemplates = channel === 'SMS' ? SMS_ALERT_TEMPLATES : ALERT_TEMPLATES;
  const rawMessage = activeTemplates[selectedTemplate];
  
  const finalMessage = customNote.trim()
    ? rawMessage + (channel === 'SMS' ? `\n\nNote: ${customNote.trim()}` : `\n\n📌 *Note:* ${customNote.trim()}`)
    : rawMessage;

  const credsOk = twilioSid.trim() && twilioToken.trim() && twilioNumbers.trim() && 
                  (channel === 'WhatsApp' || twilioSmsFrom.trim());

  const handleSend = async () => {
    if (!credsOk) return;
    const nums = twilioNumbers.split('\n').map(n => n.trim()).filter(Boolean);
    if (!nums.length) return;

    setLoading(true);
    try {
      const res = await fetch('/api/twilio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountSid: twilioSid,
          authToken: twilioToken,
          channel,
          messageType: 'alert',
          numbers: nums,
          messageBody: finalMessage,
          customSmsFrom: twilioSmsFrom
        })
      });

      const data = await res.json();
      
      setLog(prev => [{
        time: new Date().toLocaleTimeString(),
        template: `[${channel}] ${selectedTemplate}`,
        results: data.results || []
      }, ...prev]);

    } catch (err: any) {
      alert(`Error sending alerts: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const rawNumbersList = twilioNumbers.split('\n').map(n => n.trim()).filter(Boolean);

  return (
    <div className="p-2 md:p-4 max-w-4xl mx-auto">
      <h3 className="text-xl font-bold mb-4">🚨 Disease Outbreak Alert Center</h3>
      
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-200 text-sm mb-6">
        ⚡ Send instant WhatsApp or SMS alerts to registered contacts during a disease outbreak or public health emergency.
      </div>

      {/* Collapsible Credentials Panel */}
      <details className="group mb-6" open={!credsOk}>
        <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-sm p-3 bg-cyan-900/10 border border-cyan-800/50 rounded-xl text-cyan-200">
          <span>⚙️ Twilio Credentials &amp; Numbers Configuration</span>
          <span className="transition group-open:rotate-180">
            <svg fill="none" height="20" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="20"><path d="M6 9l6 6 6-6"></path></svg>
          </span>
        </summary>
        <div className="mt-4 p-4 bg-slate-900/40 border border-gray-700/50 rounded-xl space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-400">Twilio Account SID</label>
              <input 
                type="text" 
                className="w-full input-field p-2.5 text-sm" 
                placeholder="Enter Twilio Account SID" 
                value={twilioSid} 
                onChange={e => setTwilioSid(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-400">Twilio Auth Token</label>
              <input 
                type="password" 
                className="w-full input-field p-2.5 text-sm" 
                placeholder="Enter Twilio Auth Token" 
                value={twilioToken} 
                onChange={e => setTwilioToken(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-400">Recipient Numbers (One per line)</label>
              <textarea 
                className="w-full input-field p-2.5 text-sm h-20 font-mono" 
                placeholder="Enter phone numbers (e.g. +919502283533)" 
                value={twilioNumbers} 
                onChange={e => setTwilioNumbers(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-400">SMS From Number</label>
              <input 
                type="text" 
                className="w-full input-field p-2.5 text-sm" 
                placeholder="Enter Twilio SMS Number (e.g. +15674061920)" 
                value={twilioSmsFrom} 
                onChange={e => setTwilioSmsFrom(e.target.value)}
              />
            </div>
          </div>
        </div>
      </details>

      <div className="flex gap-4 mb-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="radio" 
            name="channel" 
            checked={channel === 'WhatsApp'}
            onChange={() => setChannel('WhatsApp')}
            className="accent-green-500 w-4 h-4"
          />
          <MessageSquare size={18} className="text-green-400" />
          <span className="font-medium text-gray-200">WhatsApp</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="radio" 
            name="channel" 
            checked={channel === 'SMS'}
            onChange={() => setChannel('SMS')}
            className="accent-cyan-500 w-4 h-4"
          />
          <Phone size={18} className="text-cyan-400" />
          <span className="font-medium text-gray-200">SMS</span>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Select Alert Type</label>
          <select 
            className="w-full input-field p-3"
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
          >
            {Object.keys(activeTemplates).map(k => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2 text-gray-300">Message Preview</label>
        <textarea 
          className="w-full input-field p-4 text-sm font-mono whitespace-pre-wrap h-48"
          readOnly
          value={finalMessage}
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2 text-gray-300">📝 Add a custom note (optional)</label>
        <input 
          type="text"
          className="w-full input-field p-3"
          placeholder="e.g. Outbreak reported in District X – stay indoors"
          value={customNote}
          onChange={e => setCustomNote(e.target.value)}
        />
      </div>

      <div className="text-sm text-cyan-200 mb-4">
        📋 Recipients configured: <strong>{rawNumbersList.length}</strong>
      </div>

      <button 
        className="w-full btn-primary py-3 flex justify-center items-center gap-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!credsOk || loading || rawNumbersList.length === 0}
        onClick={handleSend}
      >
        {loading ? <div className="animate-spin rounded-full h-6 w-6 border-2 border-white"></div> : <Send size={20} />}
        📲 Send {channel} Alert Now
      </button>

      {log.length > 0 && (
        <div className="mt-10">
          <h4 className="text-lg font-medium mb-4 border-b border-gray-700 pb-2">📜 Alert History (this session)</h4>
          <div className="space-y-3">
            {log.map((entry, idx) => {
              const ok = entry.results.filter((r: any) => r.success).length;
              const total = entry.results.length;
              return (
                <div key={idx} className="bg-cyan-900/20 border border-cyan-800/50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-cyan-200">🕐 {entry.time} · {entry.template}</span>
                    <span className="text-sm text-cyan-400">{ok}/{total} sent</span>
                  </div>
                  <div className="space-y-1">
                    {entry.results.map((r: any, rIdx: number) => (
                      <div key={rIdx} className={`text-xs ${r.success ? 'text-green-400' : 'text-red-400'}`}>
                        {r.success ? '✅' : '❌'} <code>{r.number}</code> — {r.info}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <button 
            className="mt-4 text-sm text-red-400 hover:underline"
            onClick={() => setLog([])}
          >
            🗑️ Clear Alert History
          </button>
        </div>
      )}

      {/* Content Template Sender */}
      <div className="mt-10 pt-6 border-t border-gray-700">
        <details className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-lg mb-4 text-gray-200">
            <span>📋 Send Twilio Content Template (pre-approved HX… template)</span>
            <span className="transition group-open:rotate-180">
              <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
            </span>
          </summary>
          <div className="text-neutral-400 group-open:animate-fadeIn mt-3 text-sm">
            <p className="mb-4 text-cyan-200 opacity-80">Use a pre-approved Twilio WhatsApp Content Template (ContentSid). Variables are passed as numbered keys matching the placeholders in your template.</p>
            
            <ContentTemplateSender 
              twilioSid={twilioSid} 
              twilioToken={twilioToken} 
              twilioNumbers={rawNumbersList} 
              credsOk={credsOk} 
              setLog={setLog} 
            />
          </div>
        </details>
      </div>
    </div>
  );
}

function ContentTemplateSender({ twilioSid, twilioToken, twilioNumbers, credsOk, setLog }: any) {
  const [tmplSid, setTmplSid] = useState('');
  const [tmplVars, setTmplVars] = useState([{ key: '1', val: '12/1' }, { key: '2', val: '3pm' }]);
  const [loading, setLoading] = useState(false);

  const addVar = () => setTmplVars([...tmplVars, { key: String(tmplVars.length + 1), val: '' }]);
  const removeVar = (idx: number) => setTmplVars(tmplVars.filter((_, i) => i !== idx));

  const contentVariables = tmplVars.reduce((acc, curr) => {
    if (curr.key) acc[curr.key] = curr.val;
    return acc;
  }, {} as Record<string, string>);

  const handleSend = async () => {
    if (!credsOk || !twilioNumbers.length) return;
    if (!tmplSid.startsWith('HX')) {
      alert("ContentSid must start with 'HX'.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/twilio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountSid: twilioSid,
          authToken: twilioToken,
          channel: 'WhatsApp',
          messageType: 'template',
          numbers: twilioNumbers,
          contentSid: tmplSid,
          contentVariables
        })
      });

      const data = await res.json();
      setLog((prev: any) => [{
        time: new Date().toLocaleTimeString(),
        template: `ContentTemplate:${tmplSid.substring(0, 12)}...`,
        results: data.results || []
      }, ...prev]);

    } catch (err: any) {
      alert(`Error sending template: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-300">Content SID (HX…)</label>
        <input 
          type="text"
          className="w-full input-field p-2.5"
          placeholder="Enter HX... Content SID"
          value={tmplSid}
          onChange={e => setTmplSid(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-gray-300">Template Variables</label>
        {tmplVars.map((v, i) => (
          <div key={i} className="flex gap-2 mb-2 items-center">
            <input 
              type="text" 
              className="w-1/4 input-field p-2 text-sm" 
              placeholder="Key" 
              value={v.key} 
              onChange={e => {
                const newVars = [...tmplVars];
                newVars[i].key = e.target.value;
                setTmplVars(newVars);
              }}
            />
            <input 
              type="text" 
              className="flex-1 input-field p-2 text-sm" 
              placeholder="Value" 
              value={v.val} 
              onChange={e => {
                const newVars = [...tmplVars];
                newVars[i].val = e.target.value;
                setTmplVars(newVars);
              }}
            />
            <button onClick={() => removeVar(i)} className="text-red-400 hover:text-red-300 p-2 font-bold">✕</button>
          </div>
        ))}
        <button onClick={addVar} className="text-cyan-400 hover:underline text-sm font-medium">+ Add Variable</button>
      </div>

      <div className="text-xs font-mono text-cyan-200 mt-2 p-2 bg-cyan-900/10 rounded">
        Preview: {JSON.stringify(contentVariables)}
      </div>

      <button 
        className="w-full btn-secondary py-2.5 flex justify-center items-center gap-2 mt-4"
        onClick={handleSend}
        disabled={loading || !credsOk}
      >
        {loading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white"></div> : '📤 Send Content Template'}
      </button>
    </div>
  );
}
