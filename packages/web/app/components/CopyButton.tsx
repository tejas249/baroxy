"use client";

import { useState } from "react";
import { Copy, Check } from "@phosphor-icons/react";

async function writeClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

export default function CopyButton({
  text,
  label = "Copy",
  className = "",
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    if (await writeClipboard(text)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      className={`copy-btn ${copied ? "copy-btn--done" : ""} ${className}`}
      aria-label={copied ? "Copied to clipboard" : `Copy command: ${text}`}
    >
      {copied ? <Check size={14} weight="bold" /> : <Copy size={14} weight="duotone" />}
      <span aria-live="polite">{copied ? "Copied" : label}</span>
    </button>
  );
}
