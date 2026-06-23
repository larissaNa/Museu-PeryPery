import React, { useEffect, useState, useRef, useMemo } from "react";
import { ImageService } from "@/models/services/ImageService";
import { UserImage } from "@/models/entities/UserImage";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ContributionForm } from "./ContributionForm";
import { useLocation } from "react-router-dom";

const PAGE_SIZE = 20;

const GalleryImage: React.FC<{ image: UserImage }> = ({ image }) => {
  const [url, setUrl] = useState<string>("");
  useEffect(() => {
    let active = true;
    if (image.storage_path) {
      ImageService.getSignedUrl(image.storage_path)
        .then((u) => active && setUrl(u))
        .catch(() => active && setUrl(""));
    }
    return () => { active = false; };
  }, [image.storage_path]);
  return (
    <div className="bg-museum-dark-soft/60 border border-white/5 rounded-2xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:scale-[1.02]">
      {url ? (
        <img src={url} alt={image.title || "Imagem da galeria"} className="w-full h-48 object-cover bg-museum-dark" loading="lazy" />
      ) : (
        <div className="w-full h-48 bg-museum-dark animate-pulse" />
      )}
      <div className="p-3.5 text-sm text-center truncate text-white/95 font-medium">
        {image.title || <span className="italic text-museum-warm-gray">Sem título</span>}
      </div>
    </div>
  );
};

export const Gallery: React.FC = () => {
  const [images, setImages] = useState<UserImage[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [query, setQuery] = useState("");
  const loader = useRef<HTMLDivElement | null>(null);

  const location = useLocation();
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const tabFromUrl = useMemo(() => queryParams.get("tab") === "contribuir" ? "contribuir" : "exposicao", [queryParams]);
  const [activeTab, setActiveTab] = useState(tabFromUrl);

  useEffect(() => {
    setActiveTab(tabFromUrl);
  }, [tabFromUrl]);

  const fetchImages = async (pageNum: number) => {
    setLoading(true);
    try {
      const newImages = await ImageService.listApprovedImages({ page: pageNum, pageSize: PAGE_SIZE });
      setImages((prev) => (pageNum === 1 ? newImages : [...prev, ...newImages]));
      setHasMore(newImages.length === PAGE_SIZE);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchImages(page); }, [page]);

  useEffect(() => {
    if (!hasMore || loading) return;
    const observer = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && setPage((p) => p + 1),
      { threshold: 1 }
    );
    const node = loader.current;
    if (node) observer.observe(node);
    return () => { if (node) observer.unobserve(node); };
  }, [hasMore, loading]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return images;
    return images.filter((i) => (i.title || "").toLowerCase().includes(q));
  }, [images, query]);

  return (
    <div className="w-full max-w-6xl mx-auto p-6 animate-fade-in">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-white/5 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-1">
              Galeria & <span className="text-gradient">Acervo</span>
            </h2>
            <p className="text-xs text-museum-warm-gray tracking-wide">
              Explore nossa exposição ou compartilhe suas próprias memórias.
            </p>
          </div>
          <TabsList className="bg-museum-dark-soft border border-white/5 p-1 rounded-full w-full md:w-auto self-start md:self-center">
            <TabsTrigger 
              value="exposicao" 
              className="rounded-full px-5 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-museum-orange data-[state=active]:to-museum-gold data-[state=active]:text-white transition-all text-sm w-1/2 md:w-auto"
            >
              Exposição Virtual
            </TabsTrigger>
            <TabsTrigger 
              value="contribuir" 
              className="rounded-full px-5 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-museum-orange data-[state=active]:to-museum-gold data-[state=active]:text-white transition-all text-sm w-1/2 md:w-auto"
            >
              Contribuir com Imagem
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="exposicao" className="space-y-6">
          <div className="flex justify-end mb-4">
            <Input
              placeholder="Buscar por título..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="max-w-xs bg-museum-dark/50 border-white/5 focus:border-museum-orange/50 focus:ring-1 focus:ring-museum-orange/50 text-white rounded-xl placeholder:text-zinc-500"
            />
          </div>

          {!loading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 w-full bg-museum-dark-soft/40 border border-white/5 rounded-2xl shadow-inner text-center p-6">
              <span className="text-museum-warm-gray text-lg font-medium">
                {query ? "Nenhuma imagem encontrada." : "Nenhuma imagem disponível no momento."}
              </span>
              {!query && (
                <span className="text-zinc-500 text-sm mt-2 max-w-md">
                  Assim que uma imagem for enviada e aprovada pela moderação, ela aparecerá em nossa exposição virtual.
                </span>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((img) => <GalleryImage key={img.id} image={img} />)}
          </div>

          <div ref={loader} />
          {loading && <div className="text-center my-6 text-gray-500">Carregando imagens...</div>}
          {!hasMore && !loading && filtered.length > 0 && (
            <div className="text-center my-4 text-gray-400">Fim da galeria.</div>
          )}
        </TabsContent>

        <TabsContent value="contribuir" className="animate-fade-up">
          <div className="max-w-2xl mx-auto bg-museum-dark-soft/60 backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            {/* Subtle glow inside card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-museum-orange/5 rounded-full blur-3xl pointer-events-none" />
            <ContributionForm />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
