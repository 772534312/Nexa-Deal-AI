import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  Building2, 
  Layers, 
  TrendingUp, 
  FileCheck2, 
  DollarSign, 
  Users, 
  Mail, 
  Cpu, 
  ExternalLink, 
  ChevronRight, 
  ChevronDown, 
  Code2, 
  FileText, 
  ShieldAlert, 
  Key, 
  Database, 
  Search, 
  HelpCircle,
  BarChart3,
  Clock,
  Briefcase
} from 'lucide-react';

interface PublicLandingPageProps {
  onStartSellerOnboarding: () => void;
  onExploreAcquisitions: () => void;
  onLaunchWorkspace: () => void;
}

export const PublicLandingPage: React.FC<PublicLandingPageProps> = ({
  onStartSellerOnboarding,
  onExploreAcquisitions,
  onLaunchWorkspace,
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const assetCategories = [
    { title: 'SaaS & Micro-SaaS', desc: 'B2B & B2C recurring subscription software with audited Stripe revenue.' },
    { title: 'AI Products & Agents', desc: 'Autonomous LLM platforms, specialized agents, and AI workflow tools.' },
    { title: 'Developer Tools & APIs', desc: 'SDKs, infrastructure utilities, CLI tooling, and programmatic backend APIs.' },
    { title: 'Web & Cloud Applications', desc: 'Full-stack web applications with verified traffic and active user bases.' },
    { title: 'Mobile Applications', desc: 'iOS & Android applications with verified App Store/Google Play telemetry.' },
    { title: 'Digital Marketplaces', desc: 'Multi-sided platforms, e-commerce brands, and digital business assets.' },
  ];

  const lifecycleSteps = [
    { step: '01', title: 'Submit Digital Asset', desc: 'Register asset specifications, tech stack, codebase repository, and financial ledger.' },
    { step: '02', title: 'Verify Ownership & Claims', desc: 'Cryptographic DNS TXT challenge, GitHub GPG commit validation, and Stripe Connect API sync.' },
    { step: '03', title: '8-Dimension M&A Readiness', desc: 'Automated audit of code quality, IP ownership, financial provenance, and legal cap table.' },
    { step: '04', title: 'AI Multi-Method Valuation', desc: 'Institutional valuation modeling via ARR multiples, DCF, comparable deals, and IP assets.' },
    { step: '05', title: 'Human Review & Sign-Off', desc: 'Broker compliance partners review claims and approve listing parameters.' },
    { step: '06', title: 'Corporate Buyer Matching', desc: 'AI maps asset profile against SEC 10-K CorpDev rosters and verified acquirers.' },
    { step: '07', title: 'Targeted Outreach', desc: 'DMARC/TLS 1.3 encrypted outreach with instant domain suppression and opt-out compliance.' },
    { step: '08', title: 'Autonomous Deal Room', desc: 'AI-assisted negotiation with strict seller minimum price floor invariants.' },
    { step: '09', title: 'Bilateral NDA Execution', desc: 'Cryptographic digital execution required before unlocking confidential data.' },
    { step: '10', title: 'Secure VDR Due Diligence', desc: '3-tier Virtual Data Room with dynamic viewer watermarking and AES-256 encryption.' },
    { step: '11', title: 'Escrow Funding', desc: 'Escrow.com integration with SHA-256 HMAC replay-protected disbursement.' },
    { step: '12', title: 'Closing & Handover', desc: '15-minute TTL secrets vault, 15-step closing checklist, and 30-day handover roadmaps.' },
  ];

  const faqs = [
    {
      q: 'How does Nexa Deal AI charge for brokering digital assets?',
      a: 'Nexa Deal AI operates on a strictly aligned 5% success fee model. There are zero upfront listing fees, zero monthly retainer costs, and zero evaluation charges. We only earn our success fee when your digital asset transaction successfully closes and escrow funds are disbursed to you.'
    },
    {
      q: 'Can the AI accept a lowball offer or discount below my reserve price?',
      a: 'Absolutely not. Nexa Deal AI enforces cryptographic, server-side minimum price floor invariants (e.g. $48,000+). The autonomous negotiation engine is mathematically restricted from conceding or offering any valuation below your defined reserve price. Any attempted below-floor concession triggers an immediate security alert and halts autonomous execution.'
    },
    {
      q: 'Does AI have unrestricted authority to sign agreements or release funds?',
      a: 'No. Nexa Deal AI operates under strict Human-in-the-Loop (HITL) governance. AI agents draft analyses, identify buyers, and model terms, but all financial commitments, counter-offer acceptances, NDA approvals, escrow releases, and asset transfers require explicit human approval by authorized signers.'
    },
    {
      q: 'How do you verify revenue and technical ownership?',
      a: 'We perform deterministic, multi-vector cryptographic verification: (1) Domain control via Cloudflare DNS TXT challenge, (2) Source code ownership via GitHub GPG commit signature verification, (3) Revenue authenticity via direct read-only Stripe Connect REST sync, and (4) Infrastructure control via AWS IAM assertions.'
    },
    {
      q: 'How is confidential company data protected during buyer diligence?',
      a: 'We employ a 3-tier Virtual Data Room (VDR) protected by AES-256 server-side encryption. Tier-1 and Tier-2 confidential files (cap tables, customer lists, architectural diagrams) are strictly gated behind bilateral cryptographic NDA signatures and dynamic watermarking containing the viewing buyer\'s verified corporate email, IP address, and timestamp.'
    },
    {
      q: 'Who are the buyers on the Nexa Deal AI platform?',
      a: 'Our buyer network consists of vetted corporate development teams at leading technology enterprises (e.g. Datadog, Cisco, Cloudflare), private equity firms, family offices, and verified serial digital acquirers with pre-qualified proof of funds.'
    }
  ];

  return (
    <div id="public-landing-page" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Public Top Navigation */}
      <nav id="public-nav" className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
                <Bot className="h-5 w-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-display font-bold tracking-tight text-white text-base">NEXA DEAL</span>
                <span className="rounded bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-500/20">AI</span>
              </div>
              <span className="block text-[9px] text-slate-400 font-medium tracking-wide">DIGITAL ASSET BROKERAGE</span>
            </div>
          </div>

          {/* Nav Links Desktop */}
          <div className="hidden md:flex items-center space-x-6 text-xs font-medium text-slate-300">
            <a href="#how-it-works" className="hover:text-indigo-400 transition-colors">How It Works</a>
            <a href="#sellers" className="hover:text-indigo-400 transition-colors">For Sellers</a>
            <a href="#buyers" className="hover:text-indigo-400 transition-colors">For Buyers</a>
            <a href="#verification" className="hover:text-indigo-400 transition-colors">Verification</a>
            <a href="#security" className="hover:text-indigo-400 transition-colors">Security & Governance</a>
            <a href="#faq" className="hover:text-indigo-400 transition-colors">FAQ</a>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <button
              id="public-launch-workspace-btn"
              onClick={onLaunchWorkspace}
              className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-200 border border-slate-800 hover:border-slate-700 hover:text-white transition-all"
            >
              Sign In / Console
            </button>
            <button
              id="public-nav-sell-btn"
              onClick={onStartSellerOnboarding}
              className="flex items-center space-x-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 transition-all"
            >
              <span>Sell Your Asset</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-800/80">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/40 via-slate-950 to-slate-950 pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <div className="inline-flex items-center space-x-2 rounded-full bg-indigo-500/10 px-3.5 py-1.5 text-xs font-semibold text-indigo-400 border border-indigo-500/20 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span>Next-Gen Autonomous Digital Asset Brokerage • 5% Success Fee Only</span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Sell or Acquire Digital Assets with{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Autonomous AI Precision
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Nexa Deal AI brokers profitable SaaS products, AI platforms, web applications, developer APIs, and digital marketplaces. Combining cryptographic provenance verification, 8-dimension M&A valuation, verified corporate buyer matching, and escrow-secured closing.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                id="hero-sell-asset-btn"
                onClick={onStartSellerOnboarding}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-600/30 hover:from-indigo-500 hover:to-indigo-400 transition-all"
              >
                <span>Sell Your Digital Asset</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                id="hero-explore-acquisitions-btn"
                onClick={onExploreAcquisitions}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-xl bg-slate-900/90 px-6 py-3.5 text-sm font-semibold text-slate-200 border border-slate-800 hover:bg-slate-800 hover:text-white transition-all"
              >
                <Search className="h-4 w-4 text-cyan-400" />
                <span>Explore Acquisition Opportunities</span>
              </button>
            </div>

            {/* Invariant Trust Badges */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  <span>Verified Provenance</span>
                </div>
                <p className="text-[11px] text-slate-400">Stripe billing sync, DNS challenge & GitHub GPG commits.</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-indigo-400">
                  <Lock className="h-3.5 w-3.5 shrink-0" />
                  <span>$48k+ Floor Invariant</span>
                </div>
                <p className="text-[11px] text-slate-400">Cryptographic protection against below-floor concessions.</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-cyan-400">
                  <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                  <span>Human Governance</span>
                </div>
                <p className="text-[11px] text-slate-400">Zero unapproved financial releases. Strict HITL oversight.</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-400">
                  <DollarSign className="h-3.5 w-3.5 shrink-0" />
                  <span>5% Success Fee</span>
                </div>
                <p className="text-[11px] text-slate-400">No upfront listing fees. Paid strictly upon closing.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Asset Classes Supported */}
      <section className="py-16 bg-slate-950/60 border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
              Supported Digital Asset Classes
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              From bootstrapped developer tools to high-scale recurring SaaS and autonomous AI platforms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assetCategories.map((cat, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 hover:border-indigo-500/40 transition-colors">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-indigo-500" />
                  <h3 className="text-sm font-bold text-slate-100">{cat.title}</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12-Stage Lifecycle Breakdown */}
      <section id="how-it-works" className="py-20 border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center space-x-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
              <Layers className="h-3.5 w-3.5" />
              <span>Full-Stack Brokerage Pipeline</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              How Nexa Deal AI Works: The 12-Stage Seller Lifecycle
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              A transparent, institutional M&A process executed by specialized AI agents with continuous human supervision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lifecycleSteps.map((item, idx) => (
              <div key={idx} className="relative p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 hover:border-slate-700 transition-all group">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                    STAGE {item.step}
                  </span>
                  <CheckCircle2 className="h-4 w-4 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                </div>
                <h4 className="text-sm font-bold text-slate-100">{item.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dual Value Proposition: For Sellers & For Buyers */}
      <section id="sellers" className="py-20 bg-slate-950/40 border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-16">
          {/* For Sellers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center space-x-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                <Briefcase className="h-3.5 w-3.5" />
                <span>For Asset Founders & Sellers</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                Maximize Your Valuation Without the Tedious Broker Drag
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Traditional digital brokers demand 10-15% commissions, take 6+ months, and leak confidential deal details. Nexa Deal AI automates technical diligence, reaches qualified strategic acquirers, and enforces your reserve price with uncompromising code guarantees.
              </p>
              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Zero Upfront Cost:</strong> Pay only 5% upon successful escrow closing.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Reserve Price Invariant:</strong> Autonomous agents cannot negotiate below your set minimum floor.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Confidential Diligence:</strong> Tiered VDR with bilateral NDAs and dynamic viewer watermarking.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Turnkey Handover:</strong> 15-minute TTL secrets vault and automated repository migration.</span>
                </div>
              </div>
              <div className="pt-2">
                <button
                  onClick={onStartSellerOnboarding}
                  className="inline-flex items-center space-x-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 transition-all"
                >
                  <span>List Your Digital Asset Now</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Seller Economics Comparison</span>
                <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded">Nexa Model</span>
              </div>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-400">Success Fee Rate</span>
                  <span className="font-bold text-emerald-400">5.0% flat (vs 12-15% legacy)</span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-400">Upfront Listing Fee</span>
                  <span className="font-bold text-emerald-400">$0.00 (Zero risk)</span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-400">Price Floor Protection</span>
                  <span className="font-bold text-emerald-400">Cryptographic Invariant</span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-400">Average Closing Velocity</span>
                  <span className="font-bold text-emerald-400">14 to 28 Days</span>
                </div>
              </div>
            </div>
          </div>

          {/* For Buyers */}
          <div id="buyers" className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center pt-8">
            <div className="order-2 lg:order-1 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Buyer Diligence Integrity Standard</span>
                <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded">100% Provenance</span>
              </div>
              <div className="space-y-3 text-xs">
                <div className="flex items-center space-x-2 text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span><strong>Direct Stripe Sync:</strong> Verified MRR, churn rate, and LTV without mock assertions.</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span><strong>Clean Codebase IP:</strong> GPG commit verification and dependency vulnerability audit.</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span><strong>Delaware Cap Table Check:</strong> Clean title verification and founder identity confirmation.</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span><strong>Protected Escrow:</strong> Funds held securely until all milestone deliverables pass inspection.</span>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-5">
              <div className="inline-flex items-center space-x-1.5 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400 border border-cyan-500/20">
                <Building2 className="h-3.5 w-3.5" />
                <span>For Corporate Acquirers & Funds</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                Acquire High-Quality Digital Businesses with Institutional-Grade Diligence
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Skip the opaque marketplaces filled with inflated metrics. Nexa Deal AI provides institutional acquirers with 10-pillar due diligence dossiers, verified Stripe financial feeds, and clean IP code transfers.
              </p>
              <div className="pt-2">
                <button
                  onClick={onExploreAcquisitions}
                  className="inline-flex items-center space-x-2 rounded-xl bg-cyan-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-600/20 hover:bg-cyan-500 transition-all"
                >
                  <Search className="h-3.5 w-3.5" />
                  <span>Explore Confidential Marketplace</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Verification & AI Valuation Core */}
      <section id="verification" className="py-20 border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center space-x-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
              <FileCheck2 className="h-3.5 w-3.5" />
              <span>Multi-Layer Diligence Engine</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              8-Dimension M&A Readiness & AI Multi-Method Valuation
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Every digital asset undergoes rigorous algorithmic appraisal and deterministic claim validation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <Code2 className="h-5 w-5 text-indigo-400" />
              <h4 className="text-sm font-bold text-slate-100">Technical Code Audit</h4>
              <p className="text-xs text-slate-400">AST parser analyzing modularity, test coverage, scalability bottlenecks, and dependencies.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              <h4 className="text-sm font-bold text-slate-100">Revenue Provenance</h4>
              <p className="text-xs text-slate-400">Live Stripe Connect sync evaluating MRR growth, churn, refund rates, and gross margins.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <ShieldCheck className="h-5 w-5 text-cyan-400" />
              <h4 className="text-sm font-bold text-slate-100">IP Ownership & DNS</h4>
              <p className="text-xs text-slate-400">Cloudflare DNS TXT tokens and GitHub GPG commit signature verification.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <BarChart3 className="h-5 w-5 text-amber-400" />
              <h4 className="text-sm font-bold text-slate-100">Multi-Model Valuation</h4>
              <p className="text-xs text-slate-400">Triangulated valuation combining ARR multiples, DCF modeling, and IP asset value.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Human-in-the-Loop Governance Notice */}
      <section id="security" className="py-20 bg-slate-950/60 border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-10">
          <div className="p-8 rounded-3xl bg-gradient-to-b from-indigo-950/30 to-slate-900 border border-indigo-500/30 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Human-In-The-Loop (HITL) Security Governance</h3>
                  <p className="text-xs text-slate-400">AI executes data processing; humans govern financial commitments.</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                STRICT GOVERNANCE INVARIANT
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-slate-300">
              <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <h5 className="font-bold text-slate-100">No Autonomous Financial Commitments</h5>
                <p className="text-slate-400">AI agents are strictly prohibited from binding sellers to pricing concessions, LOI acceptances, or legal terms without explicit human sign-off.</p>
              </div>

              <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <h5 className="font-bold text-slate-100">Escrow Replay & Idempotency</h5>
                <p className="text-slate-400">All Escrow.com disbursements require HMAC signature verification and strict single-execution idempotency guards.</p>
              </div>

              <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <h5 className="font-bold text-slate-100">15-Min TTL Secrets Vault</h5>
                <p className="text-slate-400">Handover credentials (AWS, Stripe, Database Master keys) are encrypted AES-256 with single-use, 15-minute time-to-live tokens.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 border-b border-slate-800">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-10">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center space-x-1.5 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-slate-300 border border-slate-800">
              <HelpCircle className="h-3.5 w-3.5 text-indigo-400" />
              <span>Frequently Asked Questions</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              Clear Answers for Founders and Acquirers
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="rounded-xl bg-slate-900/80 border border-slate-800 overflow-hidden transition-colors">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-4 text-left text-xs sm:text-sm font-bold text-slate-200 hover:text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${openFaqIndex === idx ? 'rotate-180 text-indigo-400' : ''}`} />
                </button>
                {openFaqIndex === idx && (
                  <div className="p-4 pt-0 text-xs text-slate-400 border-t border-slate-800/60 leading-relaxed bg-slate-950/40">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 bg-gradient-to-b from-slate-950 to-indigo-950/40">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center space-y-6">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
            Ready to Sell Your Digital Business with Maximum Value?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Get an institutional M&A readiness score and AI valuation in under 10 minutes. Zero upfront fees, guaranteed minimum price floor protection, and direct access to vetted buyers.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              id="final-sell-btn"
              onClick={onStartSellerOnboarding}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-600/30 hover:bg-indigo-500 transition-all"
            >
              <span>Sell Your Digital Asset</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              id="final-console-btn"
              onClick={onLaunchWorkspace}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-slate-200 border border-slate-800 hover:bg-slate-800 hover:text-white transition-all"
            >
              <span>Open Operator Console</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12 text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/20">
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <span className="font-display font-bold text-slate-300">NEXA DEAL AI</span>
              <span className="block text-[10px] text-slate-500">Autonomous Digital Asset Brokerage Platform</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] text-slate-400">
            <span>SaaS & AI Brokerage</span>
            <span>Escrow.com Certified</span>
            <span>Delaware Compliant</span>
            <span>Bilateral NDA Gated</span>
            <span>5% Success Fee</span>
          </div>

          <div className="text-[10px] text-slate-600 text-center md:text-right">
            © {new Date().getFullYear()} Nexa Deal AI. All rights reserved. Confidential transaction platform.
          </div>
        </div>
      </footer>
    </div>
  );
};
