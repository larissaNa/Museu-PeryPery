import React, { useEffect, useState, useRef } from "react";
import { ImageService } from "@/services/ImageService";
import { UserImage } from "@/models/entities/UserImage";

const PAGE_SIZE = 20;

export const Gallery: React.FC = () => {
  const [images, setImages] = useState<UserImage[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef<HTMLDivElement | null>(null);

  const fetchImages = async (pageNum: number) => {
    setLoading(true);
    try {
      const newImages = await ImageService.listApprovedImages({ page: pageNum, pageSize: PAGE_SIZE });
      setImages(prev => [...prev, ...newImages]);
      setHasMore(newImages.length === PAGE_SIZE);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages(page);
  }, [page]);

  // Lazy loading (infinite scroll)
  useEffect(() => {
    if (!hasMore || loading) return;
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setPage(p => p + 1);
        }
      },
      { threshold: 1 }
    );
    const currentLoader = loader.current;
    if (currentLoader) observer.observe(currentLoader);
    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [hasMore, loading]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-start bg-white p-6">
      <h2 className="text-xl font-bold mb-6">Galeria do Museu</h2>
      {loading && <div className="text-center my-8">Carregando imagens...</div>}
      {!loading && images.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 w-full bg-gray-50 rounded shadow-inner">
          <span className="text-gray-500 text-lg">Nenhuma imagem disponível no momento.</span>
          <span className="text-gray-400 text-sm mt-2">Assim que uma imagem for aprovada pelo administrador, ela aparecerá aqui para todos os visitantes.</span>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full mt-2">
        {images.map(img => (
          <div key={img.id} className="bg-white rounded shadow overflow-hidden flex flex-col items-center">
            <img
              src={img.storage_path ? undefined : ""}
              alt={img.title || "Imagem da galeria"}
              className="w-full h-48 object-cover bg-gray-100"
              ref={async (el) => {
                if (el && img.storage_path) {
                  try {
                    const url = await ImageService.getSignedUrl(img.storage_path);
                    el.src = url;
                  } catch {
                    el.src = "";
                  }
                }
              }}
            />
            <div className="p-2 text-center text-sm truncate w-full">{img.title || <span className="italic text-gray-500">Sem título</span>}</div>
          </div>
        ))}
      </div>
      <div ref={loader} />
      {!hasMore && !loading && images.length > 0 && (
        <div className="text-center my-4 text-gray-400">Fim da galeria.</div>
      )}
    </div>
  );
};
