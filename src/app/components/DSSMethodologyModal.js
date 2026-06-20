"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export default function DSSMethodologyModal({ isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl bg-white border border-border rounded-2xl shadow-xl overflow-hidden p-0 gap-0">
        <DialogHeader className="p-6 bg-slate-900 text-white flex flex-col justify-start">
          <div className="flex items-center gap-2 mb-1.5">
            <Badge className="bg-primary/20 hover:bg-primary/25 text-red-300 border border-red-400/30 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
              Decision Support System
            </Badge>
          </div>
          <DialogTitle className="text-xl font-extrabold tracking-tight text-white">
            DSS Methodology Overview
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-400 font-semibold mt-1">
            Operational guide explaining the logic behind village prioritization and scheme recommendations.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 max-h-[400px] overflow-y-auto text-xs text-muted-foreground font-semibold leading-relaxed space-y-5">
          
          <div className="space-y-2">
            <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-tight">
              📋 What information is considered?
            </h4>
            <p className="text-[11px] leading-relaxed text-slate-600">
              The Decision Support System evaluates demographic data and existing postal penetration to pinpoint areas for outreach:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600">
              <li><strong>Population &amp; Age Cohorts</strong>: Total population counts, child density (ages 7-17), and senior citizen density (ages 60+).</li>
              <li><strong>Literacy Levels</strong>: Male and female literacy rates to gauge communication requirements.</li>
              <li><strong>Workforce Profile</strong>: Share of agricultural workers and salaried professionals to match with relevant financial needs.</li>
              <li><strong>Crop Cycles</strong>: Timing of sowing and harvesting seasons to align outreach campaigns with regional liquidity.</li>
              <li><strong>Existing Enrollment Patterns</strong>: Current penetration rates in local sub-offices to identify target segments.</li>
            </ul>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-tight">
              🎯 What does the DSS Opportunity Index mean?
            </h4>
            <p className="text-[11px] leading-relaxed text-slate-600">
              The <strong>DSS Opportunity Index</strong> is a score from 0 to 100 representing suitability for a localized marketing campaign:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600">
              <li><strong>Higher Value (80–100)</strong>: Denotes high priority. The village has a substantial target demographic segment with low current scheme penetration.</li>
              <li><strong>Lower Value (Below 50)</strong>: Denotes lower priority. The target segment is smaller, or the scheme has already reached near-saturation in the village.</li>
            </ul>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-tight">
              ⚙️ How are recommendations generated?
            </h4>
            <p className="text-[11px] leading-relaxed text-slate-600">
              Recommendations are computed using a deterministic ruleset:
            </p>
            <ol className="list-decimal pl-4 space-y-1 text-[11px] text-slate-600">
              <li><strong>Eligibility Filtering</strong>: Eliminates schemes where target criteria are not met.</li>
              <li><strong>Demographic Scoring</strong>: Maps density, literacy, and occupation metrics directly to prioritization rankings.</li>
              <li><strong>Impact Estimation</strong>: Projects potential conversions during a standard 10-day campaign based on segment sizes.</li>
            </ol>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
