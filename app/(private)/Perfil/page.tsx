"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Card, CardContent, CardHeader,
  CardTitle, CardDescription,
} from "@/components/ui/card";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import {
  MdPerson, MdEmail, MdLock,
  MdSchool, MdGroups, MdCameraAlt,
  MdCheck, MdWarning, MdClose,
} from "react-icons/md";

// ─── Types ────────────────────────────────────────────────────────────────────
type ProfileType = "interprete" | "professor" | "estudante" | "coordenador";
type FeedbackState = "idle" | "success" | "error";

// ─── Mock — substitua por useAuth() + Firestore ───────────────────────────────
const mockUser = {
  name:        "Marina Rocha",
  email:       "marina@sina.edu.br",
  profileType: "interprete" as ProfileType,
  avatarColor: "#3b5fa0",
  avatarUrl:   null as string | null,
  subjects:    ["Libras", "Português"] as string[],
  classes:     ["7º A", "8º B"]        as string[],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getInitials(n: string) {
  return n.trim().split(" ").filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "?";
}

function Feedback({ state, message }: { state: FeedbackState; message?: string }) {
  if (state === "idle") return null;
  return (
    <div className={`flex items-center gap-2 text-xs font-medium mt-1 ${
      state === "success" ? "text-green-600" : "text-red-500"
    }`}>
      {state === "success"
        ? <MdCheck className="text-base shrink-0" />
        : <MdWarning className="text-base shrink-0" />}
      {message}
    </div>
  );
}

function Section({ icon: Icon, title, description, children }: {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="rounded-2xl border-0 shadow-none bg-white">
      <CardHeader className="px-5 sm:px-6 border-b border-[#f0f4f9]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#f0f4f9] flex items-center justify-center shrink-0">
            <Icon className="text-[#1e3a5f] text-base" />
          </div>
          <div>
            <CardTitle className="text-sm font-bold text-[#1e3a5f]">{title}</CardTitle>
            <CardDescription className="text-xs text-[#9aadca] mt-0.5">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-5 sm:px-6 pb-6">{children}</CardContent>
    </Card>
  );
}

// ─── TagInput inline (sem dependência externa) ────────────────────────────────
function TagInput({ label, icon: Icon, tags, onChange, placeholder }: {
  label: string;
  icon: React.ElementType;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder: string;
}) {
  const [input, setInput] = useState("");

  function addTag() {
    const v = input.trim();
    if (v && !tags.includes(v)) onChange([...tags, v]);
    setInput("");
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs font-semibold text-[#3a5070] flex items-center gap-1.5">
        <Icon className="text-sm" />{label}
      </Label>
      <div className="flex flex-wrap gap-1.5 p-2.5 rounded-xl border border-[#dde5f0] min-h-[42px] bg-white focus-within:ring-2 focus-within:ring-[#5db5d8]">
        {tags.map((t) => (
          <span key={t} className="inline-flex items-center gap-1 text-[11px] font-semibold bg-[#f0f4f9] text-[#3a5070] rounded-full px-2 py-0.5">
            {t}
            <button
              type="button"
              onClick={() => onChange(tags.filter((x) => x !== t))}
              className="text-[#9aadca] hover:text-red-400 transition-colors"
            >
              <MdClose className="text-xs" />
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); } }}
          onBlur={addTag}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[80px] text-xs text-[#1e3a5f] outline-none bg-transparent placeholder:text-[#c8d8e8]"
        />
      </div>
      <p className="text-[10px] text-[#c8d8e8]">Enter ou vírgula para adicionar</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PerfilPage() {
  const [activeNav,      setActiveNav]      = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name,            setName]            = useState(mockUser.name);
  const [email,           setEmail]           = useState(mockUser.email);
  const [profileType,     setProfileType]     = useState<ProfileType>(mockUser.profileType);
  const [subjects,        setSubjects]        = useState<string[]>(mockUser.subjects);
  const [classes,         setClasses]         = useState<string[]>(mockUser.classes);
  const [avatarUrl,       setAvatarUrl]       = useState<string | null>(mockUser.avatarUrl);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword,     setNewPassword]     = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [profileFeedback,  setProfileFeedback]  = useState<FeedbackState>("idle");
  const [teachingFeedback, setTeachingFeedback] = useState<FeedbackState>("idle");
  const [passwordFeedback, setPasswordFeedback] = useState<FeedbackState>("idle");
  const [passwordMsg,      setPasswordMsg]      = useState("");

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarUrl(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSaveProfile() {
    // TODO: await updateDoc(doc(db, "users", uid), { name, email, profileType, avatarUrl })
    setProfileFeedback("success");
    setTimeout(() => setProfileFeedback("idle"), 3000);
  }

  async function handleSaveTeaching() {
    // TODO: await updateDoc(doc(db, "users", uid), { subjects, classes })
    setTeachingFeedback("success");
    setTimeout(() => setTeachingFeedback("idle"), 3000);
  }

  async function handleSavePassword() {
    if (!currentPassword) {
      setPasswordMsg("Informe sua senha atual.");
      setPasswordFeedback("error"); return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg("A nova senha precisa ter ao menos 6 caracteres.");
      setPasswordFeedback("error"); return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg("As senhas não coincidem.");
      setPasswordFeedback("error"); return;
    }
    // TODO: Firebase reauthenticate + updatePassword
    setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    setPasswordMsg("Senha alterada com sucesso!");
    setPasswordFeedback("success");
    setTimeout(() => setPasswordFeedback("idle"), 3000);
  }

  return (
    <div className="flex h-screen bg-[#f0f4f9] overflow-hidden montserrat">
      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <div className="flex-1 flex flex-col overflow-hidden w-full relative">
        <Topbar tituloPag="Editar perfil" onMenuClick={() => setMobileMenuOpen(true)} />

        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-5 md:py-7">
          <div className="max-w-[600px] mx-auto flex flex-col gap-5">

            {/* Avatar */}
            <div className="flex flex-col items-center gap-3 py-2">
              <div className="relative">
                <div
                  className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center text-2xl font-bold text-white select-none"
                  style={{ backgroundColor: mockUser.avatarColor }}
                >
                  {avatarUrl
                    ? <img src={avatarUrl} alt="foto" className="w-full h-full object-cover" />
                    : getInitials(name)
                  }
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#1e3a5f] flex items-center justify-center text-white hover:bg-[#162d4a] transition-colors shadow"
                  aria-label="Alterar foto"
                >
                  <MdCameraAlt className="text-sm" />
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
              </div>
              <p className="text-xs text-[#9aadca]">Clique no ícone para alterar a foto</p>
            </div>

            {/* Dados pessoais */}
            <Section icon={MdPerson} title="Dados pessoais" description="Nome e tipo de perfil visíveis para a equipe" >
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold text-[#3a5070]">Nome completo</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    className="h-10 rounded-xl border-[#dde5f0] text-[#1e3a5f] text-sm focus-visible:ring-[#5db5d8]" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold text-[#3a5070]">Tipo de perfil</Label>
                  <Select value={profileType} onValueChange={(v) => setProfileType(v as ProfileType)}>
                    <SelectTrigger className="h-10 rounded-xl border-[#dde5f0] text-sm text-[#1e3a5f] focus:ring-[#5db5d8]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl text-sm">
                      <SelectItem value="interprete">Intérprete · Libras</SelectItem>
                      <SelectItem value="professor">Professor</SelectItem>
                      <SelectItem value="estudante">Estudante</SelectItem>
                      <SelectItem value="coordenador">Coordenador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Feedback state={profileFeedback} message="Perfil atualizado com sucesso!" />
                <Button onClick={handleSaveProfile}
                  className="w-full sm:w-auto sm:self-end rounded-full bg-[#1e3a5f] hover:bg-[#162d4a] text-white text-sm font-semibold h-10 px-6">
                  Salvar dados
                </Button>
              </div>
            </Section>

            {/* E-mail */}
            <Section icon={MdEmail} title="E-mail" description="Endereço usado para login e notificações">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold text-[#3a5070]">E-mail</Label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="h-10 rounded-xl border-[#dde5f0] text-[#1e3a5f] text-sm focus-visible:ring-[#5db5d8]" />
                </div>
                <Feedback state={profileFeedback} message="E-mail atualizado com sucesso!" />
                <Button onClick={handleSaveProfile}
                  className="w-full sm:w-auto sm:self-end rounded-full bg-[#1e3a5f] hover:bg-[#162d4a] text-white text-sm font-semibold h-10 px-6">
                  Salvar e-mail
                </Button>
              </div>
            </Section>

            {/* Atuação pedagógica */}
            <Section icon={MdSchool} title="Atuação pedagógica" description="Disciplinas e turmas que você acompanha como intérprete">
              <div className="flex flex-col gap-4">
                <TagInput label="Disciplinas" icon={MdSchool}
                  tags={subjects} onChange={setSubjects} placeholder="Ex: Matemática" />
                <TagInput label="Turmas vinculadas" icon={MdGroups}
                  tags={classes} onChange={setClasses} placeholder="Ex: 7º A" />
                <Feedback state={teachingFeedback} message="Atuação atualizada com sucesso!" />
                <Button onClick={handleSaveTeaching}
                  className="w-full sm:w-auto sm:self-end rounded-full bg-[#1e3a5f] hover:bg-[#162d4a] text-white text-sm font-semibold h-10 px-6">
                  Salvar atuação
                </Button>
              </div>
            </Section>

            {/* Senha */}
            <Section icon={MdLock} title="Senha" description="Altere sua senha de acesso à plataforma">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold text-[#3a5070]">Senha atual</Label>
                  <Input type="password" value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••"
                    className="h-10 rounded-xl border-[#dde5f0] text-[#1e3a5f] text-sm focus-visible:ring-[#5db5d8]" />
                </div>
                <Separator className="bg-[#f0f4f9]" />
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-semibold text-[#3a5070]">Nova senha</Label>
                    <Input type="password" value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)} placeholder="Mínimo 6 caracteres"
                      className="h-10 rounded-xl border-[#dde5f0] text-[#1e3a5f] text-sm focus-visible:ring-[#5db5d8]" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-semibold text-[#3a5070]">Confirmar nova senha</Label>
                    <Input type="password" value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repita a nova senha"
                      className="h-10 rounded-xl border-[#dde5f0] text-[#1e3a5f] text-sm focus-visible:ring-[#5db5d8]" />
                  </div>
                </div>
                <Feedback state={passwordFeedback} message={passwordMsg} />
                <Button onClick={handleSavePassword}
                  className="w-full sm:w-auto sm:self-end rounded-full bg-[#1e3a5f] hover:bg-[#162d4a] text-white text-sm font-semibold h-10 px-6">
                  Alterar senha
                </Button>
              </div>
            </Section>

            {/* Zona de perigo */}
            <Card className="rounded-2xl border border-red-100 shadow-none bg-white">
              <CardHeader className="px-5 sm:px-6 border-b border-red-50">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                    <MdWarning className="text-red-500 text-base" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-bold text-red-600">Zona de perigo</CardTitle>
                    <CardDescription className="text-xs text-red-300 mt-0.5">Ações irreversíveis</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-5 sm:px-6 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#1e3a5f]">Excluir conta</p>
                    <p className="text-xs text-[#9aadca] mt-0.5">Remove permanentemente sua conta e todos os dados.</p>
                  </div>
                  <Button variant="outline"
                    className="rounded-full border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 text-xs font-semibold h-9 px-5 shrink-0">
                    Excluir conta
                  </Button>
                </div>
              </CardContent>
            </Card>

          </div>
        </main>
      </div>
    </div>
  );
}
