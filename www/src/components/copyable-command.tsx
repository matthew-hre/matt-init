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
    <div className="relative mx-auto sm:mx-0">
      <div className="flex items-center gap-2 bg-muted p-4 rounded-lg border font-mono text-sm">
        <span className="text-muted-foreground">$</span>
        <code className="flex-1">{command}</code>
        <Button variant="ghost" size="sm" onClick={copyToClipboard} className="h-8 w-8 p-0">
          {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
      {copied && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded">
          Copied!
        </div>
      )}
    </div>
  );
}
