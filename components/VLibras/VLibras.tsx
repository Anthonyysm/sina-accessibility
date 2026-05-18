"use client";

import Script from "next/script";

declare global {
  interface Window {
    VLibras: any;
  }
}

export default function VLibras() {
  return (
    <>
      {/* @ts-expect-error vw is a custom attribute required by VLibras */}
      <div vw="true">
        <div vw-access-button="true" className="active" />

        <div vw-plugin-wrapper="true">
          <div className="vw-plugin-top-wrapper" />
        </div>
      </div>

      <Script
        src="https://vlibras.gov.br/app/vlibras-plugin.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (window.VLibras) {
            new window.VLibras.Widget("https://vlibras.gov.br/app");
          }
        }}
      />
    </>
  );
}