import { useEffect, useState } from "react";
import { Landmark, Palette, Music, Theater, BookHeart, Brush, Camera } from "lucide-react";
import { HistoriaHeader } from "@/components/HistoriaHeader";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const Cultura = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const openModal = (title: string) => {
    setActiveCard(title);
    setIsModalOpen(true);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen bg-museum-dark">
      <HistoriaHeader />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl font-display">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-museum-orange to-museum-gold flex items-center justify-center">
                <Palette className="w-5 h-5 text-primary-foreground" />
              </div>
              {activeCard || "Detalhes da Cultura"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Em breve adicionaremos conteúdo detalhado desta manifestação cultural.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <p className="text-sm text-muted-foreground">
              Este é um modal padrão temporário. Em breve, esta seção será atualizada com informações específicas de cada card.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hero Section */}
      <section className="museum-dark-section relative overflow-hidden pt-12 sm:pt-16 pb-16 sm:pb-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-museum-orange/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-museum-gold/5 blur-3xl" />
        </div>

        <div className="museum-container relative z-10">
          <div className="text-center mb-12 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-museum-dark-soft border border-museum-orange/20 mb-6">
              <Palette className="w-4 h-4 text-museum-orange" />
              <span className="text-sm font-medium text-museum-orange tracking-wide">
                Expressões Culturais
              </span>
            </div>
            
            <h1 className="museum-heading text-primary-foreground mb-4">
              <span className="text-gradient">Cultura</span> & Tradição
            </h1>
            
            <p className="museum-subheading text-museum-warm-gray max-w-2xl mx-auto">
              Descubra a riqueza cultural de Piripiri através das manifestações artísticas,
              tradições populares e expressões que definem a identidade do nosso povo.
            </p>
          </div>
        </div>
      </section>

      {/* Manifestações Culturais */}
      <section className="museum-light-section museum-section">
        <div className="museum-container">
          <div className="text-center mb-12 animate-fade-up">
            <h2 className="museum-heading text-foreground mb-4">
              Manifestações <span className="text-gradient">Culturais</span>
            </h2>
            <p className="museum-subheading max-w-2xl mx-auto">
              As principais expressões artísticas e culturais que fazem parte da identidade piripiriense
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {/* Card 1 - Música */}
            <button
              type="button"
              onClick={() => openModal("Música Popular")}
              className="museum-card group animate-fade-up delay-100 text-left w-full"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-museum-orange/10 to-museum-gold/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <Music className="w-8 h-8 text-museum-orange" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-3 text-card-foreground group-hover:text-museum-orange transition-colors duration-300">
                Música Popular
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Do forró ao baião, a música piripiriense ecoa tradições nordestinas 
                que atravessam gerações e mantêm viva a alma do sertão.
              </p>
            </button>

            {/* Card 2 - Teatro */}
            <button
              type="button"
              onClick={() => openModal("Teatro & Drama")}
              className="museum-card group animate-fade-up delay-200 text-left w-full"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-museum-orange/10 to-museum-gold/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <Theater className="w-8 h-8 text-museum-orange" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-3 text-card-foreground group-hover:text-museum-orange transition-colors duration-300">
                Teatro & Drama
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Grupos teatrais locais preservam a arte cênica, contando histórias 
                que refletem os costumes e o cotidiano do povo piauiense.
              </p>
            </button>

            {/* Card 3 - Literatura */}
            <button
              type="button"
              onClick={() => openModal("Literatura & Poesia")}
              className="museum-card group animate-fade-up delay-300 text-left w-full"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-museum-orange/10 to-museum-gold/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <BookHeart className="w-8 h-8 text-museum-orange" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-3 text-card-foreground group-hover:text-museum-orange transition-colors duration-300">
                Literatura & Poesia
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Poetas e escritores locais eternizam em versos e prosa a beleza, 
                as lutas e os sonhos do povo piripiriense.
              </p>
            </button>

            {/* Card 4 - Artesanato */}
            <button
              type="button"
              onClick={() => openModal("Artesanato")}
              className="museum-card group animate-fade-up delay-100 text-left w-full"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-museum-orange/10 to-museum-gold/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <Brush className="w-8 h-8 text-museum-orange" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-3 text-card-foreground group-hover:text-museum-orange transition-colors duration-300">
                Artesanato
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Mãos habilidosas transformam matérias-primas regionais em peças 
                únicas que carregam a identidade e criatividade local.
              </p>
            </button>

            {/* Card 5 - Fotografia */}
            <button
              type="button"
              onClick={() => openModal("Fotografia Histórica")}
              className="museum-card group animate-fade-up delay-200 text-left w-full"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-museum-orange/10 to-museum-gold/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <Camera className="w-8 h-8 text-museum-orange" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-3 text-card-foreground group-hover:text-museum-orange transition-colors duration-300">
                Fotografia Histórica
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Registros fotográficos que documentam a evolução da cidade e 
                preservam momentos importantes da história local.
              </p>
            </button>

            {/* Card 6 - Festas */}
            <button
              type="button"
              onClick={() => openModal("Festas Tradicionais")}
              className="museum-card group animate-fade-up delay-300 text-left w-full"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-museum-orange/10 to-museum-gold/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <Palette className="w-8 h-8 text-museum-orange" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-3 text-card-foreground group-hover:text-museum-orange transition-colors duration-300">
                Festas Tradicionais
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Festividades religiosas e populares que reúnem a comunidade 
                em celebrações que fortalecem os laços culturais.
              </p>
            </button>
          </div>
        </div>
      </section>

      {/* Patrimônio Imaterial */}
      <section className="museum-dark-section museum-section relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--museum-orange)) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="museum-container relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 animate-fade-up">
              <h2 className="museum-heading text-primary-foreground mb-4">
                Patrimônio <span className="text-gradient">Imaterial</span>
              </h2>
            </div>

            <div className="museum-card animate-fade-up delay-100">
              <p className="text-muted-foreground leading-relaxed mb-6">
                O patrimônio cultural imaterial de Piripiri é composto por saberes, celebrações, 
                formas de expressão e lugares que são transmitidos de geração em geração. 
                Essas manifestações são fundamentais para a construção da identidade local e 
                representam a memória viva da comunidade.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                O Museu Pery Pery tem como missão documentar, preservar e difundir esse rico 
                patrimônio, garantindo que as futuras gerações possam conhecer e valorizar 
                as tradições que formam a essência da cultura piripiriense.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Através de exposições, eventos culturais e programas educativos, o museu 
                promove o encontro entre o passado e o presente, fortalecendo os vínculos 
                comunitários e incentivando a participação ativa da população na preservação 
                de sua própria história.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="museum-dark-section py-10 sm:py-12 border-t border-museum-dark-soft">
        <div className="museum-container">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-museum-orange to-museum-gold flex items-center justify-center">
                <Landmark className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display text-primary-foreground font-medium">Museu Pery Pery</span>
            </div>

            <p className="text-museum-warm-gray text-sm">
              © 2025 Museu Pery Pery — Todos os direitos reservados
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Cultura;
