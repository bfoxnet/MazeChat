'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Sparkles, Shield } from 'lucide-react';
import { UserProfile } from '@/types/chat';
import { Button } from '@/components/ui/button';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSelectTier: (tier: 'Free' | 'Pro Workspace' | 'Enterprise') => void;
}

export function UpgradeModal({ isOpen, onClose, user, onSelectTier }: UpgradeModalProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  if (!isOpen) return null;

  const plans = [
    {
      id: 'Free' as const,
      name: 'Free Starter',
      price: '$0',
      period: 'forever',
      description: 'Ideal for lightweight inquiries and code reviews.',
      badge: 'Current',
      features: [
        '50 Fast Queries / day',
        'Standard reasoning model',
        'Basic web citations',
        '5 saved context memories',
      ],
      cta: 'Downgrade to Free',
      highlighted: false,
    },
    {
      id: 'Pro Workspace' as const,
      name: 'Pro Workspace',
      price: billingCycle === 'annual' ? '$18' : '$22',
      period: 'per user / month',
      description: 'Full capabilities for engineers, researchers, and technical builders.',
      badge: 'Recommended',
      features: [
        '1,000 Fast Queries / month',
        '50 Deep Reasoning queries (Aura Sonar)',
        'Full tool execution (Python Sandbox & Calendar)',
        'Unlimited context memories',
        'Priority streaming bandwidth',
      ],
      cta: user.planTier === 'Pro Workspace' ? 'Current Plan' : 'Select Pro Workspace',
      highlighted: true,
    },
    {
      id: 'Enterprise' as const,
      name: 'Enterprise Dedicated',
      price: billingCycle === 'annual' ? '$45' : '$55',
      period: 'per seat / month',
      description: 'Dedicated isolated GPU instances and enterprise security controls.',
      badge: 'Scale',
      features: [
        'Unlimited Fast & Deep Reasoning Queries',
        'Dedicated isolated GPU clusters',
        'Custom enterprise connectors',
        'SAML SSO & Audit Logging',
      ],
      cta: user.planTier === 'Enterprise' ? 'Current Plan' : 'Upgrade to Enterprise',
      highlighted: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 select-none">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-4xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-card-foreground"
      >
        {/* Header */}
        <div className="p-6 text-center border-b border-border bg-secondary/40 relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
            Upgrade your compute tier
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-md mx-auto">
            Choose the capacity that best matches your engineering workflow.
          </p>

          {/* Billing Cycle */}
          <div className="inline-flex items-center gap-1 mt-4 p-1 rounded-2xl bg-secondary border border-border">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                billingCycle === 'monthly' ? 'bg-card text-foreground shadow-xs font-semibold' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 ${
                billingCycle === 'annual' ? 'bg-primary text-primary-foreground shadow-xs font-semibold' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <span>Annual</span>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded font-bold">Save 20%</span>
            </button>
          </div>
        </div>

        {/* Plan Cards Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 overflow-y-auto">
          {plans.map((plan) => {
            const isCurrent = user.planTier === plan.id;
            return (
              <motion.div
                key={plan.id}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.15 }}
                className={`rounded-2xl p-5 flex flex-col justify-between transition-all ${
                  plan.highlighted
                    ? 'bg-primary/5 border-2 border-primary/70 shadow-lg'
                    : 'bg-secondary/40 border border-border'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                      {plan.name}
                    </span>
                    {plan.badge && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/15 text-primary font-medium">
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-1 my-3">
                    <span className="text-2xl sm:text-3xl font-bold text-foreground tabular-nums">
                      {plan.price}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">/{plan.period}</span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                    {plan.description}
                  </p>

                  <div className="space-y-2 border-t border-border pt-3">
                    {plan.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-xs text-foreground/85">
                        <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6">
                  <Button
                    onClick={() => {
                      onSelectTier(plan.id);
                      onClose();
                    }}
                    disabled={isCurrent}
                    variant={plan.highlighted ? 'primary' : 'secondary'}
                    className="w-full rounded-xl py-2.5 text-xs font-semibold"
                  >
                    {isCurrent ? 'Current Plan' : `Switch to ${plan.name}`}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-secondary/30 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span>14-day refund guarantee · Instant quota provisioning</span>
          </div>
          <button onClick={onClose} className="hover:text-foreground">
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
