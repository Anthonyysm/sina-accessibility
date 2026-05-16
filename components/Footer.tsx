import Image from "next/image";
import { MdAccessibility, MdEmail, MdLocationOn } from "react-icons/md";
import logo_sina from "@/public/LogoSina.png";

const platformLinks = [
  { label: "Recursos", href: "#recursos" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Começar", href: "#cta" },
];

export default function Footer() {
  return (
    <footer className="poppins bg-[#3d5f7a] text-white/80 pt-14 pb-8 px-6 lg:px-10">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-10 md:gap-16 mb-10">
          {/* Brand */}
          <div>
            <a href="#hero" className="flex items-center gap-2.5 mb-4 group w-fit">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <Image src={logo_sina} height={1000} width={1000} alt="logo da aplicação" className="invert object-cover"/>
              </div>
              <span className="font-bold text-lg text-white tracking-tight">
                Sina
              </span>
            </a>
            <p className="text-sm text-white/60 leading-relaxed max-w-xs">
              Educação acessível em Libras para professores, intérpretes e
              estudantes surdos em todo o Brasil.
            </p>
          </div>

          {/* Platform links */}
          <div>
            <h4 className="text-[11px] font-semibold tracking-widest uppercase text-white/40 mb-4">
              Plataforma
            </h4>
            <ul className="flex flex-col gap-2.5">
              {platformLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[11px] font-semibold tracking-widest uppercase text-white/40 mb-4">
              Contato
            </h4>
            <ul className="flex flex-col gap-2.5">
              <li>
                <a
                  href="mailto:segundohackathon@gmail.com"
                  className="text-sm text-white/70 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <MdEmail className="text-base shrink-0" />
                  segundohackathon@gmail.com
                </a>
              </li>
              <li className="text-sm text-white/70 flex items-center gap-1.5">
                <MdLocationOn className="text-base shrink-0" />
                Paulo Afonso, Brasil
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-6 flex flex-wrap justify-between items-center gap-3">
          <span className="text-xs text-white/40">
            © 2026 Jelly. Todos os direitos reservados.
          </span>
          <span className="text-xs text-white/40">
            Feito com cuidado para uma educação sem barreiras.
          </span>
        </div>
      </div>
    </footer>
  );
}
