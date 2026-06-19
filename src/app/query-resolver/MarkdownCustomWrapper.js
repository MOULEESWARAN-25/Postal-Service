import React from "react";
import Markdown from "markdown-to-jsx";

const MarkdownCustomWrapper = ({ children }) => {
  const options = {
    overrides: {
      h2: {
        component: ({ children }) => (
          <h2 className="text-sm font-bold text-foreground mt-4 mb-2 flex items-center gap-1.5 border-b pb-1 border-border">
            {children}
          </h2>
        ),
      },
      h3: {
        component: ({ children }) => (
          <h3 className="text-xs font-bold text-primary mt-3 mb-1.5">{children}</h3>
        ),
      },
      strong: {
        component: ({ children }) => (
          <strong className="text-foreground font-semibold">{children}</strong>
        ),
      },
      p: {
        component: ({ children }) => (
          <p className="my-1.5 leading-relaxed text-muted-foreground text-xs">{children}</p>
        ),
      },
      ul: {
        component: ({ children }) => (
          <ul className="space-y-1 my-2 list-none">{children}</ul>
        ),
      },
      li: {
        component: ({ children }) => (
          <li className="flex items-start gap-1.5 text-muted-foreground text-xs">
            <span className="text-primary font-bold">•</span>
            <span>{children}</span>
          </li>
        ),
      },
    },
  };

  return <Markdown options={options}>{children}</Markdown>;
};

export default MarkdownCustomWrapper;
