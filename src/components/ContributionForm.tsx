import React, { useRef, useState } from "react";
import { ImageService } from "@/services/ImageService";
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
    if (!file || !user) {
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
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Faça sua contribuição</h2>
      <div className="mb-4">
        <label htmlFor="image" className="block font-medium mb-2">
          Imagem (jpg, png, webp, até 5MB)*
        </label>
        <div className="flex items-center gap-4">
          <label htmlFor="image" className="px-4 py-2 bg-orange-500 text-white rounded cursor-pointer hover:bg-orange-600 transition-colors">
            Selecionar imagem
          </label>
          <span className="text-gray-600 text-sm">{file ? file.name : "Nenhum arquivo selecionado"}</span>
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
          <div className="mt-2 flex flex-col items-center">
            <img
              src={previewUrl}
              alt="Pré-visualização"
              className="w-48 h-48 object-cover rounded border"
            />
            <span className="text-xs text-gray-500 mt-1">Pré-visualização</span>
          </div>
        )}
      </div>
      <div className="mb-4">
        <Label htmlFor="title">Título (opcional)</Label>
        <Input
          id="title"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          maxLength={100}
        />
      </div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">Imagem enviada para análise!</div>}
      <Button type="submit" disabled={loading}>
        {loading ? "Enviando..." : "Enviar"}
      </Button>
    </form>
  );
};
