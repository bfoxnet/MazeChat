'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Sparkles,
  Check,
  Zap,
  HardDrive,
  BrainCircuit,
  CreditCard,
  Download,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { MOCK_USER } from '@/lib/mockData';

export default function DedicatedPlanPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [userProfile, setUserProfile] = useState(MOCK_USER);
  const [upgradeToast, setUpgradeToast] = useState<string | null>(null);

  const fastPercent = (userProfile.usage.fastQueriesUsed / userProfile.usage.fastQueriesLimit) * 100;
  const deepPercent = (userProfile.usage.deepQueriesUsed / userProfile.usage.deepQueriesLimit) * 100;
  const storagePercent = (userProfile.usage.storageUsedGb / userProfile.usage.storageLimitGb) * 100;

  const handlePlanSelect = (planName: 'Free' | 'Pro Workspace' | 'Enterprise') => {
    setUpgradeToast(`Plan switched to ${planName}!`);
    setUserProfile((prev) => ({ ...prev, planTier: planName }));
    setTimeout(() => setUpgradeToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Header */}
      <header className="h-14 border-b border-border px-4 sm:px-8 flex items-center justify-between bg-card/60 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Chat</span>
          </Link>
          <span className="text-border">/</span>
          <span className="text-sm font-semibold text-foreground">Plan & Billing</span>
        </div>

        <div className="flex items-center gap-3">
          {upgradeToast && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{upgradeToast}</span>
            </motion.div>
          )}

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
            <span>Billing cycle renews in {userProfile.usage.resetDays} days</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-8 space-y-8">
        {/* Active Plan Banner */}
        <div className="bg-gradient-to-r from-primary/15 via-indigo-500/10 to-transparent border border-primary/20 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Active Subscription</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {userProfile.planTier}
            </h1>
            <p className="text-sm text-muted-foreground max-w-lg">
              Full access to Aura 4.5 Sonar, deep reasoning chains, code sandbox execution, and persistent memory graph.
            </p>
          </div>

          <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-2 border-t md:border-t-0 pt-4 md:pt-0 border-border/60">
            <div className="text-right">
              <div className="text-2xl sm:text-3xl font-bold text-foreground font-mono">
                {billingCycle === 'monthly' ? '$20' : '$192'}
                <span className="text-sm font-normal text-muted-foreground">
                  /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                </span>
              </div>
              <div className="text-xs text-emerald-500 font-medium">Auto-renewing</div>
            </div>
          </div>
        </div>

        {/* Live Usage Consumption Gauges */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">Usage & Quotas This Billing Period</h2>
            <span className="text-xs text-muted-foreground font-mono">Resets on Oct 11, 2026</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Fast Queries */}
            <div className="p-4 rounded-2xl bg-secondary/30 border border-border space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Fast Queries
                </span>
                <span className="font-mono text-muted-foreground tabular-nums">
                  {userProfile.usage.fastQueriesUsed} / {userProfile.usage.fastQueriesLimit}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all"
                  style={{ width: `${Math.min(fastPercent, 100)}%` }}
                />
              </div>
              <div className="text-[11px] text-muted-foreground">
                {userProfile.usage.fastQueriesLimit - userProfile.usage.fastQueriesUsed} fast queries remaining
              </div>
            </div>

            {/* Deep Reasoning Queries */}
            <div className="p-4 rounded-2xl bg-secondary/30 border border-border space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground flex items-center gap-1.5">
                  <BrainCircuit className="w-4 h-4 text-indigo-500" />
                  Deep Reasoning
                </span>
                <span className="font-mono text-muted-foreground tabular-nums">
                  {userProfile.usage.deepQueriesUsed} / {userProfile.usage.deepQueriesLimit}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all"
                  style={{ width: `${Math.min(deepPercent, 100)}%` }}
                />
              </div>
              <div className="text-[11px] text-muted-foreground">
                {userProfile.usage.deepQueriesLimit - userProfile.usage.deepQueriesUsed} complex reasoning queries left
              </div>
            </div>

            {/* Storage */}
            <div className="p-4 rounded-2xl bg-secondary/30 border border-border space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground flex items-center gap-1.5">
                  <HardDrive className="w-4 h-4 text-emerald-500" />
                  Vector Storage
                </span>
                <span className="font-mono text-muted-foreground tabular-nums">
                  {userProfile.usage.storageUsedGb} GB / {userProfile.usage.storageLimitGb} GB
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{ width: `${Math.min(storagePercent, 100)}%` }}
                />
              </div>
              <div className="text-[11px] text-muted-foreground">
                {(userProfile.usage.storageLimitGb - userProfile.usage.storageUsedGb).toFixed(1)} GB available for attachments
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & Plan Comparison */}
        <div className="space-y-6">
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-bold text-foreground">Available Workspace Plans</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Scale up your reasoning compute, parallel tool executions, and knowledge memory.
            </p>

            {/* Billing Cycle Switch */}
            <div className="inline-flex items-center p-1 rounded-xl bg-secondary/80 border border-border">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-foreground text-background shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  billingCycle === 'yearly'
                    ? 'bg-foreground text-background shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>Annual</span>
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-white text-[10px]">Save 20%</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Starter Plan */}
            <div className="p-6 rounded-3xl border border-border bg-card flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-lg text-foreground">Starter Free</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Basic AI assistant for day-to-day writing and quick questions.
                  </p>
                </div>

                <div className="text-2xl font-bold font-mono">
                  $0 <span className="text-xs text-muted-foreground font-normal">/mo</span>
                </div>

                <ul className="space-y-2.5 text-xs text-foreground/90">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                    <span>Aura Flash 3.5 model</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                    <span>50 queries / day</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                    <span>Standard speed</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handlePlanSelect('Free')}
                className="w-full py-2.5 rounded-xl border border-border hover:bg-secondary text-foreground text-xs font-semibold transition-colors cursor-pointer"
              >
                Downgrade to Free
              </button>
            </div>

            {/* Pro Workspace (Active) */}
            <div className="p-6 rounded-3xl border-2 border-primary bg-primary/5 flex flex-col justify-between space-y-6 relative shadow-lg">
              <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-primary text-primary-foreground text-[11px] font-bold tracking-wide uppercase">
                Current Plan
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-lg text-foreground flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span>Pro Workspace</span>
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    For power researchers, engineers, and quantitative analysts.
                  </p>
                </div>

                <div className="text-2xl font-bold font-mono">
                  {billingCycle === 'monthly' ? '$20' : '$16'}
                  <span className="text-xs text-muted-foreground font-normal">/mo</span>
                </div>

                <ul className="space-y-2.5 text-xs text-foreground/90">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                    <span>All models (Sonar 4.5, Thinker, Codecraft)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                    <span>1,000 fast queries / mo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                    <span>50 deep reasoning proofs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                    <span>Python Sandbox & Web Search tools</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                    <span>Persistent long-term memory graph</span>
                  </li>
                </ul>
              </div>

              <button
                disabled
                className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold opacity-90 cursor-default"
              >
                Active Subscription
              </button>
            </div>

            {/* Enterprise Team */}
            <div className="p-6 rounded-3xl border border-border bg-card flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-lg text-foreground">Enterprise Team</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Dedicated compute clusters and private organizational knowledge bases.
                  </p>
                </div>

                <div className="text-2xl font-bold font-mono">
                  {billingCycle === 'monthly' ? '$60' : '$48'}
                  <span className="text-xs text-muted-foreground font-normal">/seat/mo</span>
                </div>

                <ul className="space-y-2.5 text-xs text-foreground/90">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                    <span>Unlimited fast & deep queries</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                    <span>100 GB team vector storage</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                    <span>SAML / SSO & Workspace integration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                    <span>Dedicated 99.9% uptime SLA</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handlePlanSelect('Enterprise')}
                className="w-full py-2.5 rounded-xl border border-primary hover:bg-primary/10 text-primary text-xs font-semibold transition-colors cursor-pointer"
              >
                Upgrade to Enterprise
              </button>
            </div>
          </div>
        </div>

        {/* Payment Method & Invoices */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
          {/* Card */}
          <div className="p-6 rounded-3xl border border-border bg-card space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" />
              <span>Payment Method</span>
            </h3>

            <div className="p-4 rounded-2xl bg-secondary/40 border border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center font-mono">
                  VISA
                </div>
                <div>
                  <div className="text-xs font-semibold text-foreground">Visa ending in 4242</div>
                  <div className="text-[11px] text-muted-foreground">Expires 08/2028</div>
                </div>
              </div>
              <span className="text-xs text-emerald-500 font-medium">Default</span>
            </div>
          </div>

          {/* Recent Invoices */}
          <div className="p-6 rounded-3xl border border-border bg-card space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Recent Invoices</h3>

            <div className="space-y-2 text-xs">
              {[
                { date: 'Sep 13, 2026', amount: '$20.00', status: 'Paid', id: 'INV-2026-09' },
                { date: 'Aug 13, 2026', amount: '$20.00', status: 'Paid', id: 'INV-2026-08' },
                { date: 'Jul 13, 2026', amount: '$20.00', status: 'Paid', id: 'INV-2026-07' },
              ].map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                >
                  <div>
                    <div className="font-semibold text-foreground">{inv.date}</div>
                    <div className="text-[11px] text-muted-foreground font-mono">{inv.id}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-foreground font-medium">{inv.amount}</span>
                    <span className="text-[11px] text-emerald-500 font-semibold">{inv.status}</span>
                    <button
                      onClick={() => alert(`Downloading ${inv.id}.pdf`)}
                      className="p-1 rounded-md text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
