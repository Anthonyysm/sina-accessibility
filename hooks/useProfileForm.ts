import { useState, useEffect } from "react";
import { useAuth } from "@/lib/useAuth";
import { toast } from "sonner";
import { DB_TO_PROFILE, PROFILE_TO_DB, ProfileType } from "@/lib/profile-constants";

export function useProfileForm() {
  const { loading, user, updateUser, changePassword, deleteAccount } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileType, setProfileType] = useState<ProfileType>("interprete");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [classes, setClasses] = useState<string[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingTeaching, setSavingTeaching] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);

  const [dirtyProfile, setDirtyProfile] = useState(false);
  const [dirtyTeaching, setDirtyTeaching] = useState(false);

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(user.nome);
      setEmail(user.email);
      setProfileType(DB_TO_PROFILE[user.tipo_usuario] ?? "estudante");
      setSubjects(user.disciplinas ?? []);
      setClasses(user.turmas ?? []);
    }
  }, [user]);

  async function handleSaveProfile() {
    if (!name.trim()) {
      toast.error("O nome não pode estar vazio.");
      return;
    }
    setSavingProfile(true);
    try {
      await updateUser({ nome: name.trim(), email, tipo_usuario: PROFILE_TO_DB[profileType] });
      toast.success("Perfil atualizado com sucesso!");
      setDirtyProfile(false);
    } catch {
      toast.error("Erro ao atualizar perfil. Tente novamente.");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleSaveTeaching() {
    setSavingTeaching(true);
    try {
      await updateUser({ disciplinas: subjects, turmas: classes });
      toast.success("Atuação pedagógica atualizada!");
      setDirtyTeaching(false);
    } catch {
      toast.error("Erro ao atualizar atuação. Tente novamente.");
    } finally {
      setSavingTeaching(false);
    }
  }

  async function handleSavePassword() {
    if (!currentPassword) {
      toast.error("Informe sua senha atual.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("A nova senha precisa ter ao menos 6 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }
    setSavingPassword(true);
    try {
      await changePassword(currentPassword, newPassword);
      toast.success("Senha alterada com sucesso!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao alterar senha.";
      if (msg.includes("wrong-password") || msg.includes("credential")) {
        toast.error("Senha atual incorreta.");
      } else {
        toast.error(msg);
      }
    } finally {
      setSavingPassword(false);
    }
  }

  async function handleDeleteAccount() {
    setDeletingAccount(true);
    try {
      await deleteAccount();
      toast.success("Conta excluída permanentemente.");
    } catch {
      toast.error("Erro ao excluir conta. Tente novamente.");
      setDeletingAccount(false);
      setShowDeleteDialog(false);
    }
  }

  const canDelete = deleteConfirmText.trim().toLowerCase() === "excluir minha conta";

  return {
    loading,
    user,
    name, setName,
    email, setEmail,
    profileType, setProfileType,
    subjects, setSubjects,
    classes, setClasses,
    avatarUrl, setAvatarUrl,
    currentPassword, setCurrentPassword,
    newPassword, setNewPassword,
    confirmPassword, setConfirmPassword,
    savingProfile,
    savingTeaching,
    savingPassword,
    showDeleteDialog, setShowDeleteDialog,
    deleteConfirmText, setDeleteConfirmText,
    deletingAccount,
    dirtyProfile, setDirtyProfile,
    dirtyTeaching, setDirtyTeaching,
    canDelete,
    handleSaveProfile,
    handleSaveTeaching,
    handleSavePassword,
    handleDeleteAccount,
  };
}
