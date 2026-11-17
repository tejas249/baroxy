"use client";

import { useState } from "react";
import { Copy, Check } from "@phosphor-icons/react";

export function ShareLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="share-link">
      <input value={url} readOnly onFocus={(e) => e.currentTarget.select()} />
      <button type="button" onClick={copy}>
        {copied ? <Check size={14} weight="bold" /> : <Copy size={14} weight="duotone" />}
        {copied ? "Copied!" : "Copy link"}
      </button>
    </div>
  );
}
