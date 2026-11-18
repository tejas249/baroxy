import type { ReactNode } from "react";
import { Check } from "@phosphor-icons/react/dist/ssr";
import { SITE_URL } from "../../lib/site";
import CopyButton from "./CopyButton";

export function Terminal({ title, copy, children }: { title: string; copy?: string; children: ReactNode }) {
  return (
    <div className="terminal">
      <div className="terminal-bar">
        <i />
        <i />
        <i />
        <span>{title}</span>
        {copy ? <CopyButton text={copy} className="copy-btn--bar" /> : null}
      </div>
      <div className="terminal-body">{children}</div>
    </div>
  );
}

export function Cmd({ children }: { children: ReactNode }) {
  return (
    <p className="t-line">
      <span className="t-prompt">$</span>
      <span>{children}</span>
    </p>
  );
}

export function Out({ children }: { children: ReactNode }) {
  return (
    <p className="t-out">
      <Check size={13} weight="bold" />
      <span>{children}</span>
    </p>
  );
}

export function WebMock() {
  return (
    <div className="webmock" aria-hidden="true">
      <div className="webmock-bar">
        <i />
        <i />
        <i />
        <span>{SITE_URL.replace(/^https?:\/\//, "")}/generate</span>
      </div>
      <div className="webmock-body">
        <div className="webmock-form">
          <b />
          <u />
          <b />
          <u />
          <b />
          <u />
          <em />
        </div>
        <div className="webmock-result">
          <div className="webmock-swatches">
            <span style={{ background: "#6b1d3a" }} />
            <span style={{ background: "#e0a085" }} />
            <span style={{ background: "#1f8a4c" }} />
            <span style={{ background: "#120b0e" }} />
          </div>
          <p className="webmock-name">Meridian</p>
          <p className="webmock-meta">Fraunces + Plex · analogous</p>
          <div className="webmock-chips">
            <span>tokens.css</span>
            <span>contract.md</span>
          </div>
        </div>
      </div>
    </div>
  );
}
