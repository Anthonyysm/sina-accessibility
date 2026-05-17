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
      <div vw="true" className="enabled">
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
            new window.VLibras.Widget(
              "https://vlibras.gov.br/app"
            );
          }
        }}
      />

      <style jsx global>{`
        /* garante que fique acima da UI */
        [vw] {
          z-index: 99999;
        }

        /* esconde no mobile */
        @media (max-width: 768px) {
          [vw] {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}