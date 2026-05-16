export default function Topbar({tituloPag}: any) {
  return (
    <header className="h-16 bg-white border-b border-[#e5eaf2] px-8 flex items-center justify-between shrink-0">
      <h1 className="font-bold text-[#1e3a5f] text-xl tracking-tight">
        {tituloPag}
      </h1>
    </header>
  )
}