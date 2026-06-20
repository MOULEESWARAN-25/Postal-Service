import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Standard ApexCharts options for clean, neutral-heavy SaaS styling
export const APEX_CHART_THEME = {
  colors: ["#1A2B4A", "#C8102E", "#475569", "#94A3B8", "#64748B", "#CBD5E1"],
  chart: {
    fontFamily: "Inter, sans-serif",
    toolbar: {
      show: false
    }
  },
  stroke: {
    colors: ["transparent"],
    width: 0
  },
  tooltip: {
    theme: "light",
    style: {
      fontSize: "11px",
      fontFamily: "Inter, sans-serif"
    },
    x: {
      show: true
    },
    y: {
      title: {
        formatter: (val) => `${val}:`
      }
    }
  },
  legend: {
    fontSize: "11px",
    fontFamily: "Inter, sans-serif",
    position: "bottom",
    labels: {
      colors: "#64748B"
    },
    markers: {
      radius: 12
    }
  },
  grid: {
    borderColor: "#EEF1F8",
    strokeDashArray: 4
  }
};

// Recharts Card wrapper for consistent layout heights and spacing
export function ChartContainer({ title, description, children, className }) {
  return (
    <Card className={`border border-border bg-card shadow-sm rounded-xl p-5 h-full ${className || ""}`}>
      {(title || description) && (
        <CardHeader className="p-0 pb-4 border-b border-border mb-4">
          {title && (
            <CardTitle className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
              {title}
            </CardTitle>
          )}
          {description && (
            <p className="text-[10px] text-muted-foreground mt-0.5 font-semibold">
              {description}
            </p>
          )}
        </CardHeader>
      )}
      <CardContent className="p-0 w-full h-[220px] flex items-center justify-center">
        {children}
      </CardContent>
    </Card>
  );
}

// Custom Recharts Tooltip styled to match design system
export function ChartTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border p-3 rounded-lg shadow-md text-xs font-semibold space-y-1">
        {label && <p className="text-muted-foreground uppercase tracking-wider font-bold mb-1">{label}</p>}
        {payload.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color || item.fill }} />
            <span className="text-foreground">{item.name || item.dataKey}:</span>
            <span className="text-foreground font-extrabold">{item.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

// Custom Recharts Legend styled to match design system
export function ChartLegend({ payload }) {
  if (!payload) return null;
  return (
    <div className="flex flex-wrap justify-center gap-4 text-xs font-semibold text-muted-foreground pt-4">
      {payload.map((entry, index) => (
        <div key={`item-${index}`} className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
          <span>{entry.value}</span>
        </div>
      ))}
    </div>
  );
}
