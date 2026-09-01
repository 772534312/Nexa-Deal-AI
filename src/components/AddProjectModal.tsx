import React, { useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, GitBranch, Globe, Loader2, ShieldCheck, Sparkles, X } from 'lucide-react';
import { Project, ProjectCategory } from '../types';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: (project: Project) => void;
}

const emptyNumber = '';

export const AddProjectModal: React.FC<AddProjectModalProps> = ({ isOpen, onClose, onProjectCreated }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('SaaS');
  const [mrr, setMrr] = useState(emptyNumber);
  const [arr, setArr] = useState(emptyNumber);
  const [profit, setProfit] = useState(emptyNumber);
  const [expenses, setExpenses] = useState(emptyNumber);
  const [growth, setGrowth] = useState(emptyNumber);
  const [traffic, setTraffic] = useState(emptyNumber);
  const [users, setUsers] = useState(emptyNumber);
  const [churn, setChurn] = useState(emptyNumber);
  const [askingPrice, setAskingPrice] = useState(emptyNumber);
  const [minimumPrice, setMinimumPrice] = useState('48000');
  const [targetPrice, setTargetPrice] = useState(emptyNumber);
  const [techStackInput, setTechStackInput] = useState('');
  const [country, setCountry] = useState('');
  const [targetMarket, setTargetMarket] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const readiness = useMemo(() => {
    const required = [name, url, mrr, arr, askingPrice, targetPrice, country, techStackInput];
    const completed = required.filter(v => String(v).trim().length > 0).length;
    return Math.round((completed / required.length) * 100);
  }, [name, url, mrr, arr, askingPrice, targetPrice, country, techStackInput]);

  if (!isOpen) return null;

  const numberOrZero = (value: string) => Number(value) || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !url.trim() || !mrr.trim() || !arr.trim() || !askingPrice.trim() || !targetPrice.trim()) {
      setError('Complete the required asset, URL, financial, and pricing fields before submission.');
      return;
    }

    const minPrice = Math.max(numberOrZero(minimumPrice), 48000);
    const target = numberOrZero(targetPrice);
    const asking = numberOrZero(askingPrice);
    if (target < minPrice || asking < minPrice) {
      setError(`Target and asking prices must be at least the platform floor of $${minPrice.toLocaleString()}.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const mrrValue = numberOrZero(mrr);
      const arrValue = numberOrZero(arr);
      const payload = {
        name: name.trim(),
        url: url.trim(),
        repositoryUrl: repositoryUrl.trim(),
        tagline: tagline.trim(),
        description: description.trim(),
        category,
        technologies: techStackInput.split(',').map(t => t.trim()).filter(Boolean),
        monthlyRevenue: mrrValue,
        annualRevenue: arrValue,
        mrr: mrrValue,
        arr: arrValue,
        monthlyProfit: numberOrZero(profit),
        annualProfit: numberOrZero(profit) * 12,
        monthlyExpenses: numberOrZero(expenses),
        growthRateYoY: numberOrZero(growth),
        monthlyTraffic: numberOrZero(traffic),
        activeUsers: numberOrZero(users),
        churnRate: numberOrZero(churn),
        askingPrice: asking,
        minimumPrice: minPrice,
        targetPrice: target,
        country: country.trim(),
        targetMarket: targetMarket.trim(),
        // These are seller-provided claims. The server must NOT mark them verified
        // until a real external evidence provider confirms them.
        claimsData: [
          { field: 'mrr', label: 'Monthly Recurring Revenue', value: mrrValue, status: 'SELLER_PROVIDED' },
          { field: 'arr', label: 'Annual Recurring Revenue', value: arrValue, status: 'SELLER_PROVIDED' },
          { field: 'users', label: 'Active Users / Seats', value: numberOrZero(users), status: 'SELLER_PROVIDED' },
        ],
      };

      const res = await fetch('/api/projects/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || 'Asset submission failed.');
      if (!data.project) throw new Error('The server did not return a created asset.');
      onProjectCreated(data.project);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Unable to submit the asset.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/70 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400"><Sparkles className="h-5 w-5" /></div>
            <div>
              <h2 className="text-base font-bold text-white">Submit a Digital Asset</h2>
              <p className="text-xs text-slate-400">Seller-provided data only. Verification happens after submission.</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white"><X className="h-5 w-5" /></button>
        </div>

        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-6 py-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300"><ShieldCheck className="h-4 w-4 text-cyan-400" /> Submission completeness</div>
          <span className="font-mono font-bold text-cyan-400">{readiness}%</span>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[calc(92vh-120px)] overflow-y-auto space-y-6 p-6">
          {error && <div className="flex gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300"><AlertCircle className="h-4 w-4 shrink-0" />{error}</div>}

          <section className="space-y-4">
            <SectionTitle title="1. Asset Identity" />
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Asset / Product Name *"><input required value={name} onChange={e => setName(e.target.value)} placeholder="Your product name" /></Field>
              <Field label="Asset Category"><select value={category} onChange={e => setCategory(e.target.value as ProjectCategory)}><option>SaaS</option><option>AI Platform</option><option>Mobile App</option><option>Web Application</option><option>Marketplace</option><option>E-commerce</option><option>API / Developer Tool</option><option>Digital Business</option><option>Domain + Asset</option></select></Field>
              <Field label="Production Web Domain URL *" icon={<Globe className="h-3.5 w-3.5" />}><input required type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com" /></Field>
              <Field label="GitHub Repository URL" icon={<GitBranch className="h-3.5 w-3.5" />}><input type="url" value={repositoryUrl} onChange={e => setRepositoryUrl(e.target.value)} placeholder="https://github.com/org/repo" /></Field>
            </div>
            <Field label="Value Proposition / Tagline"><input value={tagline} onChange={e => setTagline(e.target.value)} placeholder="What does the asset do?" /></Field>
            <Field label="Description"><textarea rows={4} value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the product, customers, business model, and current stage." /></Field>
          </section>

          <section className="space-y-4">
            <SectionTitle title="2. Financial Evidence — Seller Provided" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Monthly MRR ($) *"><input required type="number" min="0" value={mrr} onChange={e => setMrr(e.target.value)} /></Field>
              <Field label="Annual ARR ($) *"><input required type="number" min="0" value={arr} onChange={e => setArr(e.target.value)} /></Field>
              <Field label="Monthly Profit ($)"><input type="number" min="0" value={profit} onChange={e => setProfit(e.target.value)} /></Field>
              <Field label="Monthly Expenses ($)"><input type="number" min="0" value={expenses} onChange={e => setExpenses(e.target.value)} /></Field>
              <Field label="YoY Growth (%)"><input type="number" value={growth} onChange={e => setGrowth(e.target.value)} /></Field>
              <Field label="Monthly Traffic"><input type="number" min="0" value={traffic} onChange={e => setTraffic(e.target.value)} /></Field>
              <Field label="Active Users / Seats"><input type="number" min="0" value={users} onChange={e => setUsers(e.target.value)} /></Field>
              <Field label="Monthly Churn (%)"><input type="number" min="0" value={churn} onChange={e => setChurn(e.target.value)} /></Field>
            </div>
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-200">These figures are recorded as <strong>SELLER_PROVIDED</strong>. Nexa must not display them as verified until Stripe, analytics, database, or other evidence is actually checked.</div>
          </section>

          <section className="space-y-4">
            <SectionTitle title="3. Pricing & Deal Guardrails" />
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Minimum Floor Price ($)"><input type="number" min="48000" value={minimumPrice} onChange={e => setMinimumPrice(e.target.value)} /></Field>
              <Field label="Target Closing Price ($) *"><input required type="number" min="48000" value={targetPrice} onChange={e => setTargetPrice(e.target.value)} /></Field>
              <Field label="Public Asking Price ($) *"><input required type="number" min="48000" value={askingPrice} onChange={e => setAskingPrice(e.target.value)} /></Field>
            </div>
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3 text-xs text-slate-300">Platform invariant: no offer, concession, or negotiated amount may go below <strong className="text-rose-300">$48,000</strong>.</div>
          </section>

          <section className="space-y-4">
            <SectionTitle title="4. Technology & Market" />
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Technology Stack"><input value={techStackInput} onChange={e => setTechStackInput(e.target.value)} placeholder="React, Node.js, PostgreSQL" /></Field>
              <Field label="Country"><input value={country} onChange={e => setCountry(e.target.value)} placeholder="Country of the business" /></Field>
            </div>
            <Field label="Target Market"><input value={targetMarket} onChange={e => setTargetMarket(e.target.value)} placeholder="Who buys this product?" /></Field>
          </section>

          <div className="flex flex-col gap-3 border-t border-slate-800 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-400"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Verification queue will start after submission.</div>
            <button disabled={isSubmitting} type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-xs font-bold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60">
              {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</> : 'Submit Asset for Verification'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

function SectionTitle({ title }: { title: string }) {
  return <div className="flex items-center gap-2 border-b border-slate-800 pb-2"><div className="h-1.5 w-1.5 rounded-full bg-indigo-400" /><h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">{title}</h3></div>;
}

function Field({ label, children, icon }: { label: string; children: React.ReactNode; icon?: React.ReactNode }) {
  return <label className="block space-y-1.5 text-xs font-semibold text-slate-300"><span className="flex items-center gap-1.5">{icon}{label}</span>{React.cloneElement(children as React.ReactElement<any>, { className: 'w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-100 outline-none focus:border-indigo-500' })}</label>;
}