import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  DollarSign, 
  ShieldCheck, 
  Clock, 
  CornerDownRight, 
  Bot,
  Plus,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { EmailMessage, Project, Buyer } from '../types';

interface EmailInboxViewProps {
  emails: EmailMessage[];
  projects: Project[];
  buyers: Buyer[];
  onSendReply: (emailId: string, replyBody: string) => Promise<void>;
  onSimulateInbound: (emailData: { buyerId: string; projectId: string; subject: string; body: string; sender: string }) => Promise<void>;
}

export const EmailInboxView: React.FC<EmailInboxViewProps> = ({
  emails,
  projects,
  buyers,
  onSendReply,
  onSimulateInbound,
}) => {
  const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(emails[0] || null);
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simSubject, setSimSubject] = useState('Acquisition Inquiry & Offer Terms - DevPulse AI');
  const [simBody, setSimBody] = useState(
    'Hi Farhan, our corporate development team at Datadog has completed an initial review of DevPulse AI. We are very interested in moving forward with a $52,000 all-cash proposal. Could you confirm what your monthly churn has been over the past 3 quarters and send over the mutual NDA?'
  );
  const [simBuyerId, setSimBuyerId] = useState(buyers[0]?.id || '');
  const [simProjectId, setSimProjectId] = useState(projects[0]?.id || '');
  const [showSimulateModal, setShowSimulateModal] = useState(false);

  const handleSelectEmail = (email: EmailMessage) => {
    setSelectedEmail(email);
    setReplyText(email.aiDraftReply || '');
  };

  const handleApproveAndSend = async () => {
    if (!selectedEmail) return;
    setIsSending(true);
    await onSendReply(selectedEmail.id, replyText || selectedEmail.aiDraftReply || '');
    setIsSending(false);
  };

  const handleRunSimulation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSimulating(true);
    const buyer = buyers.find(b => b.id === simBuyerId) || buyers[0];
    await onSimulateInbound({
      buyerId: simBuyerId,
      projectId: simProjectId,
      subject: simSubject,
      body: simBody,
      sender: buyer?.contactEmail || 'm-and-a@datadog.com',
    });
    setIsSimulating(false);
    setShowSimulateModal(false);
  };

  const getIntentBadge = (intent?: string) => {
    switch (intent) {
      case 'OFFER_PROPOSAL':
        return <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">💰 Offer Proposal</span>;
      case 'INTERESTED':
        return <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold text-indigo-400 border border-indigo-500/20">✨ Highly Interested</span>;
      case 'NDA_REQUEST':
        return <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold text-cyan-400 border border-cyan-500/20">🔒 NDA Requested</span>;
      case 'QUESTION':
        return <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/20">❓ Diligence Question</span>;
      default:
        return <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-400">Inbound</span>;
    }
  };

  return (
    <div id="email-inbox-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
            Autonomous Email Agent & Inbox
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time intent classification, question extraction, offer parsing, and calibrated AI draft synthesis.
          </p>
        </div>

        <button
          id="simulate-inbound-btn"
          onClick={() => setShowSimulateModal(true)}
          className="flex items-center space-x-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all self-start sm:self-auto"
        >
          <Bot className="h-4 w-4" />
          <span>⚡ Simulate Inbound Buyer Email</span>
        </button>
      </div>

      {/* Simulation Modal */}
      {showSimulateModal && (
        <div id="simulation-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-4">
            <h3 className="font-display text-base font-bold text-white">Simulate Inbound Buyer Email (AI Classifier Test)</h3>
            <p className="text-xs text-slate-400">Test how Gemini categorizes inbound inquiries and drafts negotiation replies in real time.</p>

            <form onSubmit={handleRunSimulation} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">From Buyer</label>
                  <select
                    value={simBuyerId}
                    onChange={(e) => setSimBuyerId(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 p-2 text-xs text-slate-100 border border-slate-800"
                  >
                    {buyers.map(b => (
                      <option key={b.id} value={b.id}>{b.companyName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Target Asset</label>
                  <select
                    value={simProjectId}
                    onChange={(e) => setSimProjectId(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 p-2 text-xs text-slate-100 border border-slate-800"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Email Subject</label>
                <input
                  type="text"
                  required
                  value={simSubject}
                  onChange={(e) => setSimSubject(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 p-2.5 text-xs text-slate-100 border border-slate-800"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Email Message Body</label>
                <textarea
                  rows={4}
                  required
                  value={simBody}
                  onChange={(e) => setSimBody(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 p-2.5 text-xs text-slate-100 border border-slate-800 resize-none font-sans"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowSimulateModal(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSimulating}
                  className="flex items-center space-x-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500 disabled:opacity-50"
                >
                  {isSimulating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bot className="h-4 w-4" />}
                  <span>Process Inbound Email</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Two-Pane Inbox Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden min-h-[600px]">
        {/* Left Pane: Email Thread List (5 cols) */}
        <div className="lg:col-span-5 border-r border-slate-800/80 divide-y divide-slate-800/60 overflow-y-auto max-h-[700px]">
          {emails.map((email) => {
            const isSelected = selectedEmail?.id === email.id;
            return (
              <div
                key={email.id}
                id={`email-item-${email.id}`}
                onClick={() => handleSelectEmail(email)}
                className={`p-4 cursor-pointer transition-colors ${
                  isSelected ? 'bg-indigo-950/30 border-l-2 border-indigo-500' : 'hover:bg-slate-950/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 truncate">{email.sender}</span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(email.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="text-xs font-semibold text-white mt-1 truncate">{email.subject}</div>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">{email.body}</p>

                <div className="mt-3 flex items-center justify-between">
                  {getIntentBadge(email.intent)}
                  {email.intentScore && (
                    <span className="text-[10px] font-mono text-slate-500 font-medium">
                      Confidence: {email.intentScore}%
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Pane: Selected Email & AI Draft Reply (7 cols) */}
        <div className="lg:col-span-7 p-6 flex flex-col justify-between space-y-6 overflow-y-auto max-h-[700px]">
          {selectedEmail ? (
            <div className="space-y-6">
              {/* Message Header */}
              <div className="border-b border-slate-800 pb-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base font-bold text-white">{selectedEmail.subject}</h3>
                  {getIntentBadge(selectedEmail.intent)}
                </div>
                <div className="mt-2 flex items-center space-x-2 text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">From:</span>
                  <span>{selectedEmail.sender}</span>
                  <span>•</span>
                  <span>{new Date(selectedEmail.timestamp).toLocaleString()}</span>
                </div>
              </div>

              {/* Inbound Message Content */}
              <div className="rounded-xl bg-slate-950/70 p-4 border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-line">
                {selectedEmail.body}
              </div>

              {/* Extracted Intelligence (Offers & Questions) */}
              {(selectedEmail.extractedOffers?.length || selectedEmail.extractedQuestions?.length) ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedEmail.extractedOffers && selectedEmail.extractedOffers.length > 0 && (
                    <div className="rounded-xl bg-emerald-950/20 p-3 border border-emerald-500/30">
                      <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">Parsed Offer Detected:</span>
                      <span className="font-display text-lg font-bold text-emerald-300">
                        ${selectedEmail.extractedOffers[0].amount.toLocaleString()} ({selectedEmail.extractedOffers[0].currency})
                      </span>
                    </div>
                  )}

                  {selectedEmail.extractedQuestions && selectedEmail.extractedQuestions.length > 0 && (
                    <div className="rounded-xl bg-amber-950/20 p-3 border border-amber-500/30">
                      <span className="text-[10px] uppercase font-bold text-amber-400 block mb-1">Extracted Buyer Questions:</span>
                      <ul className="text-[11px] text-slate-300 space-y-1">
                        {selectedEmail.extractedQuestions.map((q, qidx) => (
                          <li key={qidx}>• {q}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : null}

              {/* AI Draft Reply Section */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-4 w-4 text-indigo-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Autonomous AI Draft Reply
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">Calibrated to Seller Floor & Tone Policy</span>
                </div>

                <textarea
                  id="email-reply-textarea"
                  rows={6}
                  value={replyText || selectedEmail.aiDraftReply || ''}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 p-4 text-xs text-slate-100 border border-indigo-500/30 focus:border-indigo-500 focus:outline-none leading-relaxed resize-none font-sans"
                  placeholder="AI is generating or awaiting reply..."
                />

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Human Approval Enforced</span>
                  </div>

                  <button
                    id="approve-send-reply-btn"
                    disabled={isSending || !(replyText || selectedEmail.aiDraftReply)}
                    onClick={handleApproveAndSend}
                    className="flex items-center space-x-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 disabled:opacity-50 transition-all"
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Sending Outbound...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5" />
                        <span>Approve & Send Reply</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-xs text-slate-500">
              Select an email thread from the left pane to review AI classifications and draft replies.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
