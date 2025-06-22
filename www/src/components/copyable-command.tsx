"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { Button } from "~/components/ui/button";

export default function CopyableCommand() {
  const [copied, setCopied] = useState(false);
  const command = "npx matt-init@latest";

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className={`
        bg-primary/[0.05] flex items-center gap-2 rounded-lg border p-4
        font-mono text-sm
      `}
      >
        <span className="text-muted-foreground">$</span>
        <code className="flex-1">{command}</code>
        <Button
          variant="outline"
          size="sm"
          onClick={copyToClipboard}
          className="h-8 w-8 cursor-pointer p-0"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
      {copied && (
        <div className={`
          bg-foreground text-background absolute -top-8 left-1/2
          -translate-x-1/2 transform rounded px-2 py-1 text-xs
        `}
        >
          Copied!
        </div>
      )}
    </div>
  );
}
