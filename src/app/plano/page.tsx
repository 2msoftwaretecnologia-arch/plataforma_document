'use client';

import { Check, Star, Zap, Crown, Settings } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export default function Plano() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const planos = [
    {
      id: 'basico',
      nome: 'Básico',
      preco: 'R$ 29',
      periodo: '/mês',
      descricao: 'Ideal para pequenas empresas iniciantes',
      icone: <Star className="w-8 h-8" />,
      cor: isDark ? 'from-blue-600 to-blue-700' : 'from-blue-500 to-blue-600',
      corBorda: isDark ? 'border-blue-700' : 'border-blue-200',
      recursos: [
        'Até 5 usuários',
        'Armazenamento de 10GB',
        'Suporte por email',
        'Relatórios básicos',
        'Backup semanal'
      ],
      popular: false
    },
    {
      id: 'medio',
      nome: 'Médio',
      preco: 'R$ 59',
      periodo: '/mês',
      descricao: 'Perfeito para empresas em crescimento',
      icone: <Zap className="w-8 h-8" />,
      cor: isDark ? 'from-green-600 to-green-700' : 'from-green-500 to-green-600',
      corBorda: isDark ? 'border-green-700' : 'border-green-200',
      recursos: [
        'Até 25 usuários',
        'Armazenamento de 100GB',
        'Suporte prioritário',
        'Relatórios avançados',
        'Backup diário',
        'Integrações básicas'
      ],
      popular: true
    },
    {
      id: 'grande',
      nome: 'Grande',
      preco: 'R$ 99',
      periodo: '/mês',
      descricao: 'Para empresas estabelecidas com grandes equipes',
      icone: <Crown className="w-8 h-8" />,
      cor: isDark ? 'from-purple-600 to-purple-700' : 'from-purple-500 to-purple-600',
      corBorda: isDark ? 'border-purple-700' : 'border-purple-200',
      recursos: [
        'Usuários ilimitados',
        'Armazenamento de 1TB',
        'Suporte 24/7',
        'Relatórios personalizados',
        'Backup em tempo real',
        'Todas as integrações',
        'API completa'
      ],
      popular: false
    },
    {
      id: 'customizado',
      nome: 'Customizado',
      preco: 'Sob consulta',
      periodo: '',
      descricao: 'Solução personalizada para suas necessidades específicas',
      icone: <Settings className="w-8 h-8" />,
      cor: isDark ? 'from-gray-600 to-gray-700' : 'from-gray-700 to-gray-800',
      corBorda: isDark ? 'border-gray-600' : 'border-gray-200',
      recursos: [
        'Recursos personalizados',
        'Armazenamento sob demanda',
        'Suporte dedicado',
        'Implementação assistida',
        'Treinamento da equipe',
        'SLA personalizado',
        'Consultoria especializada'
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Escolha o Plano Ideal
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Encontre a solução perfeita para sua empresa. Todos os planos incluem 
            recursos essenciais para otimizar seus processos e aumentar sua produtividade.
          </p>
        </div>

        {/* Grid de Planos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {planos.map((plano) => (
            <div
              key={plano.id}
              className={`relative bg-background border-2 ${plano.corBorda} rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden flex flex-col h-full`}
            >
              {/* Badge Popular */}
              {plano.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-400 to-orange-500 text-white px-4 py-1 rounded-bl-lg font-semibold text-sm z-10">
                  Mais Popular
                </div>
              )}

              {/* Header do Card */}
              <div className={`bg-gradient-to-r ${plano.cor} text-white p-6 text-center flex-shrink-0`}>
                <div className="flex justify-center mb-4">
                  {plano.icone}
                </div>
                <h3 className="text-2xl font-bold mb-2">{plano.nome}</h3>
                <p className="text-sm opacity-90">{plano.descricao}</p>
              </div>

              {/* Preço */}
              <div className="p-6 text-center border-b border-border flex-shrink-0">
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-foreground">{plano.preco}</span>
                  <span className="text-muted-foreground ml-1">{plano.periodo}</span>
                </div>
              </div>

              {/* Recursos */}
              <div className="p-6 flex-grow">
                <ul className="space-y-4">
                  {plano.recursos.map((recurso, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{recurso}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Botão */}
              <div className="p-6 pt-0 flex-shrink-0">
                <button
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                    plano.popular
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg'
                      : isDark 
                        ? 'bg-secondary text-secondary-foreground hover:bg-muted border border-border'
                        : 'bg-secondary text-secondary-foreground hover:bg-muted border border-border'
                  }`}
                >
                  {plano.id === 'customizado' ? 'Falar com Vendas' : 'Começar Agora'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Seção de Garantia */}
        <div className="text-center mt-16 p-8 bg-background border border-border rounded-2xl shadow-lg">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Garantia de 30 dias
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experimente nossa plataforma sem riscos. Se não ficar satisfeito, 
            devolvemos 100% do seu dinheiro nos primeiros 30 dias.
          </p>
        </div>

        {/* FAQ Rápido */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-8">
            Dúvidas Frequentes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background border border-border p-6 rounded-xl shadow-md">
              <h4 className="font-semibold text-foreground mb-2">Posso mudar de plano?</h4>
              <p className="text-muted-foreground text-sm">
                Sim, você pode fazer upgrade ou downgrade a qualquer momento.
              </p>
            </div>
            <div className="bg-background border border-border p-6 rounded-xl shadow-md">
              <h4 className="font-semibold text-foreground mb-2">Há taxa de setup?</h4>
              <p className="text-muted-foreground text-sm">
                Não cobramos nenhuma taxa de configuração ou instalação.
              </p>
            </div>
            <div className="bg-background border border-border p-6 rounded-xl shadow-md">
              <h4 className="font-semibold text-foreground mb-2">Suporte incluído?</h4>
              <p className="text-muted-foreground text-sm">
                Todos os planos incluem suporte, variando o nível de prioridade.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
