import { Building2, Award, Target } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export const About = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Helmet>
        <title>Sobre Nós | Distribuidor MacSport e Alfa Fitness no RJ</title>
        <meta name="description" content="A RSS Fitness atua há mais de 20 anos como distribuidora oficial das marcas MacSport e Alfa Fitness no Rio de Janeiro. Conheça nossa infraestrutura e autoridade no mercado." />
      </Helmet>
      
      <div className="bg-primary text-white py-12 md:py-20 text-center">
        <div className="container mx-auto px-4 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Sobre a RSS Fitness</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="max-w-6xl mx-auto mt-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Direto da fábrica para o seu espaço.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center hover:border-accent hover:shadow-md transition-all">
              <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="h-8 w-8 text-accent" />
              </div>
              <h3 className="font-bold text-xl mb-4 text-gray-800">Distribuição Oficial</h3>
              <p className="text-gray-600 leading-relaxed">Acesso direto ao catálogo e peças de reposição MacSport e Alfa Fitness.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center hover:border-accent hover:shadow-md transition-all">
              <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="h-8 w-8 text-accent" />
              </div>
              <h3 className="font-bold text-xl mb-4 text-gray-800">+20 Anos de Mercado</h3>
              <p className="text-gray-600 leading-relaxed">Equipamentos nacionais com o maior índice de durabilidade do país.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center hover:border-accent hover:shadow-md transition-all">
              <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building2 className="h-8 w-8 text-accent" />
              </div>
              <h3 className="font-bold text-xl mb-4 text-gray-800">Suporte Local no RJ</h3>
              <p className="text-gray-600 leading-relaxed">Atendimento consultivo, entrega técnica e logística ágil no Rio.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
