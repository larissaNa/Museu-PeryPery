import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ImageService } from "@/models/services/ImageService";
import { useAuthContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const MAX_SIZE_MB = 5;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

export const ContributionForm: React.FC = () => {
  const { user } = useAuthContext();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (!ALLOWED_TYPES.includes(selected.type)) {
      setError("Tipo de arquivo não permitido.");
      setFile(null);
      setPreviewUrl(null);
      return;
    }
    if (selected.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`Tamanho máximo: ${MAX_SIZE_MB}MB.`);
      setFile(null);
      setPreviewUrl(null);
      return;
    }
    setError(null);
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("Você precisa estar autenticado para enviar uma contribuição.");
      return;
    }
    if (!file) {
      setError("Selecione uma imagem válida.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await ImageService.uploadUserImage({ file, userId: user.uid, title });
      setSuccess(true);
      setError(null);
      setFile(null);
      setPreviewUrl(null);
      setTitle("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: any) {
      console.error("[ContributionForm] Erro ao enviar imagem:", err);
      setSuccess(false);
      setError("Erro ao enviar imagem. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 sm:p-6 bg-transparent text-white">
      <h2 className="text-xl sm:text-2xl font-display font-semibold mb-6 text-center text-white">
        Faça sua Contribuição
      </h2>
      {!user && (
        <div className="mb-6 p-4 rounded-xl bg-museum-orange/10 border border-museum-orange/20 text-sm text-museum-orange-light leading-relaxed">
          Para enviar uma imagem você precisa estar autenticado.{" "}
          <Link to="/login" className="font-semibold underline text-white hover:text-museum-orange transition-colors">Entrar</Link> ou{" "}
          <Link to="/login?mode=register" className="font-semibold underline text-white hover:text-museum-orange transition-colors">criar conta</Link>.
        </div>
      )}
      <div className="mb-5">
        <label htmlFor="image" className="block font-medium text-sm text-white/90 mb-2">
          Imagem (JPG, PNG, WEBP, até {MAX_SIZE_MB}MB)*
        </label>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <label htmlFor="image" className="px-5 py-2.5 bg-gradient-to-r from-museum-orange to-museum-gold text-white font-medium rounded-full cursor-pointer hover:opacity-90 active:scale-95 transition-all text-center text-sm shadow-md shadow-museum-orange/10">
            Selecionar imagem
          </label>
          <span className="text-museum-warm-gray text-xs sm:text-sm truncate max-w-xs block self-center">
            {file ? file.name : "Nenhum arquivo selecionado"}
          </span>
        </div>
        <input
          id="image"
          name="image"
          type="file"
          accept={ALLOWED_TYPES.join(",")}
          onChange={handleFileChange}
          ref={fileInputRef}
          required
          className="hidden"
        />
        {previewUrl && !success && (
          <div className="mt-4 flex flex-col items-center p-2 rounded-xl bg-museum-dark/40 border border-white/5">
            <img
              src={previewUrl}
              alt="Pré-visualização"
              className="w-48 h-48 object-cover rounded-lg border border-white/10"
            />
            <span className="text-xs text-museum-warm-gray mt-1.5 font-light">Pré-visualização da imagem</span>
          </div>
        )}
      </div>
      <div className="mb-6">
        <Label htmlFor="title" className="text-white/95 font-medium mb-2 block">
          Título da Imagem (opcional)
        </Label>
        <Input
          id="title"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          maxLength={100}
          className="bg-museum-dark/50 text-white placeholder:text-zinc-500 border border-white/5 focus:border-museum-orange/50 focus:ring-1 focus:ring-museum-orange/50 rounded-xl outline-none"
          placeholder="Ex: Prédio Histórico, Foto Antiga, etc."
        />
      </div>
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg py-2.5 px-4 mb-4 text-center">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm rounded-lg py-2.5 px-4 mb-4 text-center">
          Imagem enviada com sucesso para análise da curadoria!
        </div>
      )}
      <Button 
        type="submit" 
        disabled={loading}
        className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-museum-orange to-museum-gold text-white font-semibold hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg shadow-museum-orange/15 disabled:opacity-60 disabled:pointer-events-none mt-2"
      >
        {loading ? "Enviando..." : "ENVIAR CONTRIBUIÇÃO"}
      </Button>
    </form>
  );
};

