import { useEffect } from "react";
import { Landmark, BookOpen, Users, Calendar, Award, Heart, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { HistoriaHeader } from "@/components/HistoriaHeader";

const Historia = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen bg-museum-dark">
      <HistoriaHeader />

      {/* Hero Section */}
      <section className="museum-dark-section relative overflow-hidden pt-12 sm:pt-20 pb-16 sm:pb-24">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-museum-orange/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-museum-gold/5 blur-3xl" />
        </div>

        <div className="museum-container relative z-10">
          <div className="text-center mb-12 sm:mb-16 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-museum-dark-soft border border-museum-orange/20 mb-6">
              <BookOpen className="w-4 h-4 text-museum-orange" />
              <span className="text-sm font-medium text-museum-orange tracking-wide">
                Nossa História
              </span>
            </div>
            
            <h1 className="museum-heading text-primary-foreground mb-6">
              A História do <span className="text-gradient">Museu Pery Pery</span>
            </h1>
            
            <p className="museum-subheading text-museum-warm-gray max-w-3xl mx-auto">
              Uma jornada através do tempo, preservando memórias e celebrando a cultura piripiriense.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="museum-light-section museum-section relative overflow-hidden">
        <div className="museum-container">
          {/* Intro */}
          <div className="max-w-4xl mx-auto mb-16 animate-fade-up">
            <div className="museum-card">
              <h2 className="text-2xl sm:text-3xl font-display font-semibold text-card-foreground mb-6">
                O Início de Tudo
              </h2>
              <p className="text-muted-foreground leading-relaxed text-lg mb-6">
                Situado em Piripiri, no estado do Piauí, o Museu de Perypery é uma instituição municipal 
                que reúne documentos e artefatos ligados à história local. Sua criação foi proposta por 
                <strong className="text-museum-orange"> Adauto Coelho de Resende</strong> e contou com a 
                colaboração do humorista <strong className="text-museum-orange">João Cláudio Moreno</strong>.
              </p>
              <p className="text-muted-foreground leading-relaxed text-lg">
                O museu representa um marco importante na preservação da memória cultural da região, 
                reunindo peças históricas, fotografias antigas, documentos e objetos que contam a 
                rica história de Piripiri e seu povo.
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative max-w-4xl mx-auto">
            {/* Timeline Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-museum-orange via-museum-gold to-museum-orange transform -translate-x-1/2 hidden md:block" />

            {/* Timeline Items */}
            <div className="space-y-12">
              {/* Item 1 */}
              <div className="flex flex-col md:flex-row items-center gap-8 animate-fade-up">
                <div className="flex-1 text-center md:text-right order-2 md:order-1">
                  <div className="museum-card">
                    <div className="flex items-center justify-center md:justify-end gap-2 mb-3">
                      <Calendar className="w-5 h-5 text-museum-orange" />
                      <span className="text-museum-orange font-medium">Fundação</span>
                    </div>
                    <h3 className="text-xl font-display font-semibold text-card-foreground mb-3">
                      A Proposta Inicial
                    </h3>
                    <p className="text-muted-foreground">
                      A ideia de criar um espaço dedicado à memória de Piripiri nasceu da visão de 
                      preservar a identidade cultural da cidade para as futuras gerações.
                    </p>
                  </div>
                </div>
                
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-museum-orange to-museum-gold flex items-center justify-center shrink-0 z-10 shadow-glow order-1 md:order-2">
                  <Landmark className="w-8 h-8 text-primary-foreground" />
                </div>
                
                <div className="flex-1 hidden md:block order-3" />
              </div>

              {/* Item 2 */}
              <div className="flex flex-col md:flex-row items-center gap-8 animate-fade-up delay-100">
                <div className="flex-1 hidden md:block" />
                
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-museum-orange to-museum-gold flex items-center justify-center shrink-0 z-10 shadow-glow">
                  <Users className="w-8 h-8 text-primary-foreground" />
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <div className="museum-card">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                      <Users className="w-5 h-5 text-museum-orange" />
                      <span className="text-museum-orange font-medium">Colaboração</span>
                    </div>
                    <h3 className="text-xl font-display font-semibold text-card-foreground mb-3">
                      União de Forças
                    </h3>
                    <p className="text-muted-foreground">
                      Com o apoio de personalidades locais e a comunidade, o projeto ganhou força 
                      e se tornou realidade, contando com doações de acervos e recursos.
                    </p>
                  </div>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex flex-col md:flex-row items-center gap-8 animate-fade-up delay-200">
                <div className="flex-1 text-center md:text-right order-2 md:order-1">
                  <div className="museum-card">
                    <div className="flex items-center justify-center md:justify-end gap-2 mb-3">
                      <Award className="w-5 h-5 text-museum-orange" />
                      <span className="text-museum-orange font-medium">Reconhecimento</span>
                    </div>
                    <h3 className="text-xl font-display font-semibold text-card-foreground mb-3">
                      Patrimônio Cultural
                    </h3>
                    <p className="text-muted-foreground">
                      O museu se consolidou como referência cultural da região, atraindo visitantes 
                      de todo o Brasil interessados em conhecer a história piauiense.
                    </p>
                  </div>
                </div>
                
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-museum-orange to-museum-gold flex items-center justify-center shrink-0 z-10 shadow-glow order-1 md:order-2">
                  <Award className="w-8 h-8 text-primary-foreground" />
                </div>
                
                <div className="flex-1 hidden md:block order-3" />
              </div>

              {/* Item 4 */}
              <div className="flex flex-col md:flex-row items-center gap-8 animate-fade-up delay-300">
                <div className="flex-1 hidden md:block" />
                
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-museum-orange to-museum-gold flex items-center justify-center shrink-0 z-10 shadow-glow">
                  <Heart className="w-8 h-8 text-primary-foreground" />
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <div className="museum-card">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                      <Heart className="w-5 h-5 text-museum-orange" />
                      <span className="text-museum-orange font-medium">Comunidade</span>
                    </div>
                    <h3 className="text-xl font-display font-semibold text-card-foreground mb-3">
                      Abraço Popular
                    </h3>
                    <p className="text-muted-foreground">
                      A comunidade piripiriense abraçou o projeto, doando acervos familiares, 
                      fotografias antigas e objetos históricos que enriquecem nossa coleção.
                    </p>
                  </div>
                </div>
              </div>

              {/* Item 5 */}
              <div className="flex flex-col md:flex-row items-center gap-8 animate-fade-up delay-400">
                <div className="flex-1 text-center md:text-right order-2 md:order-1">
                  <div className="museum-card">
                    <div className="flex items-center justify-center md:justify-end gap-2 mb-3">
                      <Sparkles className="w-5 h-5 text-museum-orange" />
                      <span className="text-museum-orange font-medium">Futuro</span>
                    </div>
                    <h3 className="text-xl font-display font-semibold text-card-foreground mb-3">
                      Novos Horizontes
                    </h3>
                    <p className="text-muted-foreground">
                      Hoje, o museu segue expandindo seu acervo e modernizando suas instalações, 
                      preparando-se para continuar contando a história de Piripiri por muitas gerações.
                    </p>
                  </div>
                </div>
                
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-museum-orange to-museum-gold flex items-center justify-center shrink-0 z-10 shadow-glow order-1 md:order-2">
                  <Sparkles className="w-8 h-8 text-primary-foreground" />
                </div>
                
                <div className="flex-1 hidden md:block order-3" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="museum-dark-section museum-section relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--museum-orange)) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="museum-container relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-up">
            <h2 className="museum-heading text-primary-foreground mb-8">
              Nossa <span className="text-gradient">Missão</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="museum-card text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-museum-orange/10 to-museum-gold/10 flex items-center justify-center mb-4 mx-auto">
                  <BookOpen className="w-7 h-7 text-museum-orange" />
                </div>
                <h3 className="text-lg font-display font-semibold text-card-foreground mb-2">Preservar</h3>
                <p className="text-muted-foreground text-sm">
                  Guardar e proteger a memória histórica de Piripiri
                </p>
              </div>

              <div className="museum-card text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-museum-orange/10 to-museum-gold/10 flex items-center justify-center mb-4 mx-auto">
                  <Users className="w-7 h-7 text-museum-orange" />
                </div>
                <h3 className="text-lg font-display font-semibold text-card-foreground mb-2">Educar</h3>
                <p className="text-muted-foreground text-sm">
                  Transmitir conhecimento às novas gerações
                </p>
              </div>

              <div className="museum-card text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-museum-orange/10 to-museum-gold/10 flex items-center justify-center mb-4 mx-auto">
                  <Award className="w-7 h-7 text-museum-orange" />
                </div>
                <h3 className="text-lg font-display font-semibold text-card-foreground mb-2">Celebrar</h3>
                <p className="text-muted-foreground text-sm">
                  Valorizar a cultura e identidade local
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="museum-dark-section py-10 sm:py-12 border-t border-museum-dark-soft">
        <div className="museum-container">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-museum-orange to-museum-gold flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <Landmark className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display text-primary-foreground font-medium">Museu Pery Pery</span>
            </Link>

            <p className="text-museum-warm-gray text-sm">
              © 2025 Museu Pery Pery — Todos os direitos reservados
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Historia;
