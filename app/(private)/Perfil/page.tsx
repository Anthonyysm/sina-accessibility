"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter, DialogSecondaryAction,
  DialogDestructiveAction,
} from "@/components/ui/dialog";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import TagInput from "@/components/profile/TagInput";
import ProfileSection from "@/components/profile/ProfileSection";
import { useProfileForm } from "@/hooks/useProfileForm";
import { AVATAR_COLORS, getInitials, ProfileType } from "@/lib/profile-constants";
import { toast } from "sonner";
import {
  MdPerson, MdEmail, MdLock,
  MdSchool, MdGroups, MdCameraAlt,
  MdDeleteOutline, MdSave,
  MdError,
} from "react-icons/md";

export default function PerfilPage() {
  const {
    loading, user,
    name, setName, email, setEmail, profileType, setProfileType,
    subjects, setSubjects, classes, setClasses,
    avatarUrl, setAvatarUrl,
    currentPassword, setCurrentPassword, newPassword, setNewPassword, confirmPassword, setConfirmPassword,
    savingProfile, savingTeaching, savingPassword,
    showDeleteDialog, setShowDeleteDialog,
    deleteConfirmText, setDeleteConfirmText,
    deletingAccount, dirtyProfile, setDirtyProfile, dirtyTeaching, setDirtyTeaching,
    canDelete,
    handleSaveProfile, handleSaveTeaching, handleSavePassword, handleDeleteAccount,
  } = useProfileForm();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeNav, setActiveNav] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f0f4f9]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#5db5d8] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[#9aadca]">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const avatarColor = AVATAR_COLORS[user.id_usuario % AVATAR_COLORS.length];

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setAvatarUrl(reader.result as string);
    reader.readAsDataURL(file);
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
          <div className="max-w-[640px] mx-auto flex flex-col gap-6">

            {/* Avatar */}
            <div className="rounded-2xl bg-white shadow-[0_2px_12px_-4px_rgba(30,58,95,0.08)] p-6">
              <div className="flex flex-col items-center gap-3">
                <div className="relative group">
                  <div
                    className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center text-3xl font-bold text-white select-none ring-4 ring-white shadow-lg"
                    style={{ backgroundColor: avatarColor }}
                  >
                    {avatarUrl
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={avatarUrl} alt="foto de perfil" className="w-full h-full object-cover" />
                      : getInitials(name)
                    }
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#1e3a5f] flex items-center justify-center text-white hover:bg-[#162d4a] transition-colors shadow-md opacity-0 group-hover:opacity-100 focus:opacity-100"
                    aria-label="Alterar foto"
                  >
                    <MdCameraAlt className="text-sm" />
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
                </div>
                <div className="text-center">
                  <p className="text-base font-bold text-[#1e3a5f]">{name || "Seu nome"}</p>
                  <p className="text-xs text-[#9aadca] mt-0.5">{email}</p>
                </div>
              </div>
            </div>

            {/* Dados pessoais */}
            <ProfileSection icon={MdPerson} title="Dados pessoais" description="Nome e tipo de perfil visíveis para a equipe">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold text-[#3a5070]">Nome completo</Label>
                  <Input value={name} onChange={(e) => { setName(e.target.value); setDirtyProfile(true); }}
                    placeholder="Seu nome completo"
                    className="h-10 rounded-xl border-[#dde5f0] text-[#1e3a5f] text-sm focus-visible:ring-[#5db5d8] px-3" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm font-semibold text-[#3a5070]">Tipo de perfil</Label>
                  <Select value={profileType} onValueChange={(v) => { setProfileType(v as ProfileType); setDirtyProfile(true); }}>
                    <SelectTrigger className="h-10 w-full rounded-xl border-[#dde5f0] text-sm text-[#1e3a5f] focus:ring-[#5db5d8] px-3">
                      <SelectValue placeholder="Selecione o tipo de perfil" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl text-sm p-1">
                      <SelectItem value="interprete" className="py-2.5">Intérprete · Libras</SelectItem>
                      <SelectItem value="professor" className="py-2.5">Professor</SelectItem>
                      <SelectItem value="estudante" className="py-2.5">Estudante</SelectItem>
                      <SelectItem value="coordenador" className="py-2.5">Coordenador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleSaveProfile} disabled={savingProfile || !dirtyProfile}
                  className="w-full sm:w-auto sm:self-end rounded-full bg-[#1e3a5f] hover:bg-[#162d4a] text-white text-sm font-semibold h-10 px-6 disabled:opacity-50 transition-all">
                  {savingProfile ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Salvando...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <MdSave className="text-base" />
                      Salvar dados
                    </span>
                  )}
                </Button>
              </div>
            </ProfileSection>

            {/* E-mail */}
            <ProfileSection icon={MdEmail} title="E-mail" description="Endereço usado para login e notificações">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold text-[#3a5070]">E-mail</Label>
                  <Input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setDirtyProfile(true); }}
                    placeholder="seu@email.com"
                    className="h-10 rounded-xl border-[#dde5f0] text-[#1e3a5f] text-sm focus-visible:ring-[#5db5d8] px-3" />
                </div>
                <Button onClick={handleSaveProfile} disabled={savingProfile || !dirtyProfile}
                  className="w-full sm:w-auto sm:self-end rounded-full bg-[#1e3a5f] hover:bg-[#162d4a] text-white text-sm font-semibold h-10 px-6 disabled:opacity-50 transition-all">
                  {savingProfile ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Salvando...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <MdSave className="text-base" />
                      Salvar e-mail
                    </span>
                  )}
                </Button>
              </div>
            </ProfileSection>

            {/* Atuação pedagógica */}
            <ProfileSection icon={MdSchool} title="Atuação pedagógica" description="Disciplinas e turmas que você acompanha">
              <div className="flex flex-col gap-5">
                <TagInput label="Disciplinas" icon={MdSchool}
                  tags={subjects} onChange={(t) => { setSubjects(t); setDirtyTeaching(true); }} placeholder="Ex: Matemática, Português" />
                <Separator className="bg-[#f0f4f9]" />
                <TagInput label="Turmas vinculadas" icon={MdGroups}
                  tags={classes} onChange={(t) => { setClasses(t); setDirtyTeaching(true); }} placeholder="Ex: 7º A, 8º B" />
                <Button onClick={handleSaveTeaching} disabled={savingTeaching || !dirtyTeaching}
                  className="w-full sm:w-auto sm:self-end rounded-full bg-[#1e3a5f] hover:bg-[#162d4a] text-white text-sm font-semibold h-10 px-6 disabled:opacity-50 transition-all">
                  {savingTeaching ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Salvando...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <MdSave className="text-base" />
                      Salvar atuação
                    </span>
                  )}
                </Button>
              </div>
            </ProfileSection>

            {/* Senha */}
            <ProfileSection icon={MdLock} title="Senha" description="Altere sua senha de acesso à plataforma">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold text-[#3a5070]">Senha atual</Label>
                  <Input type="password" value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Digite sua senha atual"
                    className="h-10 rounded-xl border-[#dde5f0] text-[#1e3a5f] text-sm focus-visible:ring-[#5db5d8] px-3" />
                </div>
                <Separator className="bg-[#f0f4f9]" />
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-semibold text-[#3a5070]">Nova senha</Label>
                    <Input type="password" value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)} placeholder="Mínimo 6 caracteres"
                      className="h-10 rounded-xl border-[#dde5f0] text-[#1e3a5f] text-sm focus-visible:ring-[#5db5d8] px-3" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-semibold text-[#3a5070]">Confirmar nova senha</Label>
                    <Input type="password" value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repita a nova senha"
                      className="h-10 rounded-xl border-[#dde5f0] text-[#1e3a5f] text-sm focus-visible:ring-[#5db5d8] px-3" />
                  </div>
                </div>
                <Button onClick={handleSavePassword} disabled={savingPassword}
                  className="w-full sm:w-auto sm:self-end rounded-full bg-[#1e3a5f] hover:bg-[#162d4a] text-white text-sm font-semibold h-10 px-6 disabled:opacity-50 transition-all">
                  {savingPassword ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Alterando...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <MdLock className="text-base" />
                      Alterar senha
                    </span>
                  )}
                </Button>
              </div>
            </ProfileSection>

            {/* Zona de perigo */}
            <div className="rounded-2xl border border-red-100 bg-white overflow-hidden">
              <div className="px-5 sm:px-6 py-4 border-b border-red-50 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                  <MdError className="text-red-500 text-lg" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-red-600">Zona de perigo</h3>
                  <p className="text-[11px] text-red-300 mt-0.5">Ações irreversíveis</p>
                </div>
              </div>
              <div className="px-5 sm:px-6 py-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#1e3a5f]">Excluir conta</p>
                    <p className="text-xs text-[#9aadca] mt-0.5">Remove permanentemente sua conta e todos os dados associados.</p>
                  </div>
                  <Button variant="outline"
                    onClick={() => { setShowDeleteDialog(true); setDeleteConfirmText(""); }}
                    className="rounded-full border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 text-xs font-semibold h-9 px-5 shrink-0">
                    <MdDeleteOutline className="text-sm" />
                    Excluir conta
                  </Button>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* Delete Account Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-2">
              <MdDeleteOutline className="text-red-500 text-2xl" />
            </div>
            <DialogTitle className="text-center">Excluir conta permanentemente</DialogTitle>
            <DialogDescription className="text-center">
              Esta ação não pode ser desfeita. Todos os seus dados, atividades e vínculos serão removidos permanentemente.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3 py-2">
            <Label className="text-xs font-semibold text-[#3a5070]">
              Digite <span className="text-red-500 font-bold">&ldquo;excluir minha conta&rdquo;</span> para confirmar
            </Label>
            <Input
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="excluir minha conta"
              className="h-10 rounded-xl border-red-200 text-[#1e3a5f] text-sm focus-visible:ring-red-400 px-3"
              autoFocus
            />
          </div>

          <DialogFooter>
            <DialogSecondaryAction onClick={() => setShowDeleteDialog(false)}>
              Cancelar
            </DialogSecondaryAction>
            <DialogDestructiveAction
              onClick={handleDeleteAccount}
              disabled={!canDelete || deletingAccount}
              className="disabled:opacity-50"
            >
              {deletingAccount ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Excluindo...
                </span>
              ) : (
                "Excluir minha conta"
              )}
            </DialogDestructiveAction>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
