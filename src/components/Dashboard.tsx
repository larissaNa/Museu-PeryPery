import React, { useState } from "react";
import { Header } from "./Header";
import logoLaranja from "../assets/logolaranja.png";
import { Landmark, Palette, MapPin, Clock, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export const Dashboard: React.FC = () => {
  const [isVisitasOpen, setIsVisitasOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Seção Matterport - Museu Virtual */}
      <section id="museu-virtual" className="museum-dark-section relative overflow-hidden pt-8 sm:pt-12 pb-16 sm:pb-20 lg:pb-28">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-museum-orange/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-museum-gold/5 blur-3xl" />
        </div>

        <div className="museum-container relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-museum-dark-soft border border-museum-orange/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-museum-orange animate-pulse" />
              <span className="text-sm font-medium text-museum-orange tracking-wide">
                Experiência Imersiva
              </span>
            </div>
            
            <h2 className="museum-heading text-primary-foreground mb-4">
              <span className="text-gradient">Museu</span> Virtual
            </h2>
            
            <p className="museum-subheading text-museum-warm-gray max-w-2xl mx-auto">
              Explore este espaço histórico em uma experiência imersiva 3D. 
              Navegue pelos corredores e descubra cada detalhe do nosso acervo.
            </p>
          </div>

          {/* Matterport Embed */}
          <div className="w-full max-w-6xl mx-auto animate-fade-up delay-200">
            <div className="relative group">
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-museum-orange via-museum-gold to-museum-orange rounded-3xl opacity-30 blur-xl group-hover:opacity-50 transition-opacity duration-500" />
              
              {/* Frame */}
              <div className="relative bg-museum-dark-soft rounded-2xl sm:rounded-3xl p-1.5 sm:p-2 shadow-2xl">
                <div className="relative w-full rounded-xl sm:rounded-2xl overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    src="https://my.matterport.com/show/?m=wvCMe9UW1kd&play=1&qs=1&wh=0"
                    allow="xr-spatial-tracking *; fullscreen *; autoplay *;"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full border-0"
                    title="Tour Virtual do Museu Pery Pery"
                  />
                </div>
              </div>
            </div>

            {/* Controls Hint */}
            <div className="flex items-center justify-center gap-6 mt-6 text-museum-warm-gray">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
                <span className="text-sm">Clique para navegar</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                <span className="text-sm">Tela cheia</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Sobre */}
      <section id="sobre" className="museum-ligth-section museum-section relative overflow-hidden">
        <div className="text-center mb-12 sm:mb-16 animate-fade-up">
            <h2 className="museum-heading text-dark-foreground mb-4">
              Museu de <span className="text-gradient">Piripiri</span>
            </h2>
            <p className="museum-subheading text-museum-warm-gray max-w-xl mx-auto">
              Tudo o que você precisa saber sobre o Museu Pery Pery
            </p>
          </div>
        <div className="museum-container">
          <p className="museum-subheading text-museum-warm-gray max-w-xl mx-auto">
            Situado em Piripiri, no estado do Piauí, o Museu de Perypery é uma instituição municipal que reúne documentos e artefatos ligados à história local. 
            Sua criação foi proposta por Adauto Coelho de Resende e contou com a colaboração do humorista João Cláudio Moreno, preservando a antiga escrita “Perypery” como marca oficial. 
            O museu funciona em um edifício da década de 1930, que já teve múltiplas finalidades, como cinema, clube social, bancos e escola comercial, até ser destinado ao museu em 1987. 
            Depois de ficar alguns anos fechado no fim dos anos 2000, o espaço passou por uma grande reforma e foi reaberto ao público em 2016.
          </p>
        </div>
      </section>

      {/* Seção Informações */}
      <section className="museum-dark-section museum-section relative overflow-hidden">
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--museum-orange)) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="museum-container relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16 animate-fade-up">
            <h2 className="museum-heading text-primary-foreground mb-4">
              Informações <span className="text-gradient">Importantes</span>
            </h2>
            <p className="museum-subheading text-museum-warm-gray max-w-xl mx-auto">
              Tudo o que você precisa saber sobre o Museu Pery Pery
            </p>
          </div>
          
          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {/* Card 1 - História */}
            <Link to="/historia" className="museum-card group animate-fade-up delay-100 cursor-pointer">
              <div className="relative">
                {/* Icon Container */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-museum-orange/10 to-museum-gold/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Landmark className="w-8 h-8 text-museum-orange" />
                </div>
                
                {/* Accent Line */}
                <div className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-0 right-0 w-12 h-0.5 bg-gradient-to-l from-museum-orange to-transparent" />
                  <div className="absolute top-0 right-0 w-0.5 h-12 bg-gradient-to-b from-museum-orange to-transparent" />
                </div>
              </div>
              
              <h3 className="text-xl sm:text-2xl font-display font-semibold mb-3 text-card-foreground group-hover:text-museum-orange transition-colors duration-300">
                História
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Conheça a rica história do Museu Pery Pery e sua importância para a preservação
                do patrimônio cultural da região.
              </p>
              
              {/* Learn More Link */}
              <span className="inline-flex items-center gap-2 mt-6 text-museum-orange font-medium text-sm group/link">
                <span>Saiba mais</span>
                <svg className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Link>

            {/* Card 2 - Cultura */}
            <Link to="/cultura" className="museum-card group animate-fade-up delay-200 cursor-pointer">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-museum-orange/10 to-museum-gold/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Palette className="w-8 h-8 text-museum-orange" />
                </div>
                
                <div className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-0 right-0 w-12 h-0.5 bg-gradient-to-l from-museum-gold to-transparent" />
                  <div className="absolute top-0 right-0 w-0.5 h-12 bg-gradient-to-b from-museum-gold to-transparent" />
                </div>
              </div>
              
              <h3 className="text-xl sm:text-2xl font-display font-semibold mb-3 text-card-foreground group-hover:text-museum-orange transition-colors duration-300">
                Cultura
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Explore a importância cultural do espaço e descubra como ele contribui para
                a valorização da identidade local.
              </p>
              <span className="inline-flex items-center gap-2 mt-6 text-museum-orange font-medium text-sm group/link">
                <span>Saiba mais</span>
                <svg className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Link>

            {/* Card 3 - Visitas */}
            <button
              onClick={() => setIsVisitasOpen(true)}
              className="museum-card group animate-fade-up delay-300 md:col-span-2 lg:col-span-1 cursor-pointer text-left w-full"
            >
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-museum-orange/10 to-museum-gold/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <MapPin className="w-8 h-8 text-museum-orange" />
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-semibold mb-3 text-card-foreground group-hover:text-museum-orange transition-colors duration-300">
                Visitas
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Informações sobre visitas presenciais, horários de funcionamento e como agendar sua visita ao museu.
              </p>
            </button>
          </div>
        </div>
      </section>

      <Dialog open={isVisitasOpen} onOpenChange={setIsVisitasOpen}>
        <DialogContent className="sm:max-w-lg bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl font-display">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-museum-orange to-museum-gold flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary-foreground" />
              </div>
              Informações de Visita
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">Planeje sua visita ao Museu Pery Pery</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary/50">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-museum-orange/20 to-museum-gold/20 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-museum-orange" />
              </div>
              <div>
                <p className="font-medium text-card-foreground mb-1">Horário de Funcionamento</p>
                <p className="text-sm text-muted-foreground">Segunda a Sexta: 08h às 17h</p>
                <p className="text-sm text-muted-foreground">Sábado: 08h às 12h</p>
                <p className="text-sm text-muted-foreground">Domingo: Fechado</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary/50">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-museum-orange/20 to-museum-gold/20 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-museum-orange" />
              </div>
              <div>
                <p className="font-medium text-card-foreground mb-1">Localização</p>
                <p className="text-sm text-muted-foreground">Centro de Piripiri, Piauí</p>
                <p className="text-sm text-muted-foreground">CEP: 64260-000</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary/50">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-museum-orange/20 to-museum-gold/20 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-museum-orange" />
              </div>
              <div>
                <p className="font-medium text-card-foreground mb-1">Agendamento</p>
                <p className="text-sm text-muted-foreground">Visitas em grupo devem ser agendadas com antecedência</p>
              </div>
            </div>
            <div className="pt-4 border-t border-border">
              <p className="text-sm text-center text-muted-foreground">Entrada gratuita • Visitas guiadas disponíveis</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Seção Contato */}
      <section id="contato" className="museum-light-section museum-section">
        <div className="museum-container">
          <div className="max-w-2xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-10 animate-fade-up">
              <h2 className="museum-heading text-foreground mb-4">
                Entre em <span className="text-gradient">Contato</span>
              </h2>
              <p className="museum-subheading">
                Marque a sua visita.
              </p>
            </div>
            
            {/* Contact Card */}
            <div className="museum-card animate-fade-up delay-100">
              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors duration-300">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-museum-orange to-museum-gold flex items-center justify-center shrink-0">
                    <a href=""><svg className="w-5 h-5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg> </a>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Email</p>
                    <p className="text-lg font-medium text-foreground">contato@museuperypery.com.br</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors duration-300">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-museum-orange to-museum-gold flex items-center justify-center shrink-0">
                    <a href=""><svg className="w-5 h-5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg></a>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Telefone</p>
                    <p className="text-lg font-medium text-foreground">(00) 0000-0000</p>
                  </div>
                </div>

                {/* Message */}
                <div className="pt-4 border-t border-border">
                  <p className="text-center text-muted-foreground">
                    Estamos à disposição para recebê-lo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Contribuição */}
      <section id="contato" className="museum-light-section museum-section">
        <div className="museum-container">
          <div className="max-w-2xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-10 animate-fade-up">
              <h2 className="museum-heading text-foreground mb-4">
                Faça sua <span className="text-gradient">Contribuição</span>
              </h2>
              <p className="museum-subheading">
                Ajude-nos a manter a cultura viva.
              </p>
            </div>
            <div className="museum-card animate-fade-up delay-100">
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors duration-300">
                  image
                </div>

                {/* Message */}
                <div className="pt-4 border-t border-border">
                  <p className="text-center text-muted-foreground">
                    Obrigado pela ajuda!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="museum-dark-section py-10 sm:py-12 border-t border-museum-dark-soft">
        <div className="museum-container">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center">
                <img 
                  src={logoLaranja} 
                  alt="Logo Museu Pery Pery" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-display text-primary-foreground font-medium">Museu Pery Pery</span>
            </div>

            {/* Copyright */}
            <p className="text-museum-warm-gray text-sm">
              © 2025 Museu Pery Pery — Todos os direitos reservados
            </p>

            {/* Social Links (placeholder) */}
            <div className="flex items-center gap-4">
              <a href="https://www.instagram.com/museu_perypery?igsh=aXE3eTloanh4aGZk" className="w-10 h-10 rounded-full bg-museum-dark-soft flex items-center justify-center text-museum-warm-gray hover:text-museum-orange hover:bg-museum-orange/10 transition-all duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
