interface ProfileSectionProps {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function ProfileSection({ icon: Icon, title, description, children }: ProfileSectionProps) {
  return (
    <div className="rounded-2xl bg-white shadow-[0_2px_12px_-4px_rgba(30,58,95,0.08)] overflow-hidden">
      <div className="px-5 sm:px-6 py-4 border-b border-[#f0f4f9] flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#f0f4f9] flex items-center justify-center shrink-0">
          <Icon className="text-[#1e3a5f] text-lg" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#1e3a5f]">{title}</h3>
          <p className="text-[11px] text-[#9aadca] mt-0.5">{description}</p>
        </div>
      </div>
      <div className="px-5 sm:px-6 py-5">{children}</div>
    </div>
  );
}
