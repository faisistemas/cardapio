import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import {
  BookOpen,
  Building2,
  Store,
  CreditCard,
  Settings,
  Palette,
  Globe,
  BarChart3,
  HelpCircle,
  ChevronUp,
  CheckCircle2,
  Lightbulb,
  AlertTriangle,
  ArrowRight,
  Users,
  Rocket,
  Shield,
  Webhook,
  FileText,
  Phone,
  Mail,
} from 'lucide-react';

// Navigation sections
const sections = [
  { id: 'introducao', label: 'Introdução', icon: BookOpen },
  { id: 'primeiros-passos', label: 'Primeiros Passos', icon: Rocket },
  { id: 'restaurantes', label: 'Gerenciar Restaurantes', icon: Store },
  { id: 'planos', label: 'Planos de Assinatura', icon: CreditCard },
  { id: 'mercadopago', label: 'Integração Mercado Pago', icon: CreditCard },
  { id: 'financeiro', label: 'Gestão Financeira', icon: BarChart3 },
  { id: 'landing-page', label: 'Landing Page White-Label', icon: Globe },
  { id: 'administracao', label: 'Administração', icon: Settings },
  { id: 'relatorios', label: 'Monitoramento e Relatórios', icon: BarChart3 },
  { id: 'faq', label: 'FAQ e Suporte', icon: HelpCircle },
];

// Tip Card Component
function TipCard({ type = 'info', title, children }: { type?: 'info' | 'warning' | 'success'; title: string; children: React.ReactNode }) {
  const styles = {
    info: 'bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800',
    warning: 'bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800',
    success: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800',
  };
  const icons = {
    info: <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
    success: <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
  };

  return (
    <div className={cn('rounded-lg border p-4 my-4', styles[type])}>
      <div className="flex items-start gap-3">
        {icons[type]}
        <div>
          <p className="font-semibold text-sm mb-1">{title}</p>
          <div className="text-sm text-muted-foreground">{children}</div>
        </div>
      </div>
    </div>
  );
}

// Diagram Component using CSS
function FlowDiagram({ title, steps }: { title: string; steps: { label: string; description?: string }[] }) {
  return (
    <div className="my-6">
      <p className="font-medium text-sm mb-4 text-muted-foreground">{title}</p>
      <div className="flex flex-wrap items-center gap-2">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="bg-primary/10 border border-primary/20 rounded-lg px-4 py-3 text-center min-w-[120px]">
              <p className="font-medium text-sm">{step.label}</p>
              {step.description && (
                <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
              )}
            </div>
            {index < steps.length - 1 && (
              <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Architecture Diagram
function ArchitectureDiagram() {
  return (
    <div className="my-6 p-6 bg-muted/50 rounded-xl border">
      <p className="font-medium text-sm mb-6 text-center text-muted-foreground">Arquitetura do Sistema</p>
      <div className="flex flex-col items-center gap-4">
        {/* Reseller Level */}
        <div className="bg-primary text-primary-foreground rounded-xl px-6 py-4 text-center shadow-lg">
          <Building2 className="h-6 w-6 mx-auto mb-2" />
          <p className="font-bold">Revendedor</p>
          <p className="text-xs opacity-80">Você gerencia tudo</p>
        </div>
        
        <div className="h-8 w-0.5 bg-border" />
        
        {/* Restaurants Level */}
        <div className="flex flex-wrap justify-center gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card border rounded-xl px-4 py-3 text-center shadow">
              <Store className="h-5 w-5 mx-auto mb-1 text-primary" />
              <p className="font-medium text-sm">Restaurante {i}</p>
              <p className="text-xs text-muted-foreground">Seu cliente</p>
            </div>
          ))}
        </div>
        
        <div className="h-8 w-0.5 bg-border" />
        
        {/* Customers Level */}
        <div className="bg-muted rounded-xl px-6 py-4 text-center">
          <Users className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
          <p className="font-medium">Clientes Finais</p>
          <p className="text-xs text-muted-foreground">Fazem pedidos nos restaurantes</p>
        </div>
      </div>
    </div>
  );
}

// Step List Component
function StepList({ steps }: { steps: string[] }) {
  return (
    <ol className="list-none space-y-3 my-4">
      {steps.map((step, index) => (
        <li key={index} className="flex items-start gap-3">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
            {index + 1}
          </span>
          <span className="text-sm pt-0.5">{step}</span>
        </li>
      ))}
    </ol>
  );
}

export default function ResellerDocs() {
  const [activeSection, setActiveSection] = useState('introducao');
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);

      // Update active section based on scroll position
      const sectionElements = sections.map(s => ({
        id: s.id,
        element: document.getElementById(s.id),
      }));

      for (const section of sectionElements.reverse()) {
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Helmet>
        <title>Documentação - Plataforma de Cardápio Digital</title>
        <meta name="description" content="Documentação completa para revendedores da plataforma de cardápio digital multi-tenant." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        {/* Public Header */}
        <header className="sticky top-0 z-40 bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-foreground">Documentação</h1>
                <p className="text-xs text-muted-foreground">Guia completo para revendedores</p>
              </div>
            </div>
            <Link 
              to="/auth" 
              className="text-sm text-primary hover:underline font-medium"
            >
              Acessar Painel →
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex gap-6">
        {/* Sidebar Navigation - Desktop */}
        <aside className="hidden xl:block w-64 flex-shrink-0">
          <div className="sticky top-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Índice
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <nav className="space-y-1">
                    {sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={cn(
                          'flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors text-left',
                          activeSection === section.id
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        )}
                      >
                        <section.icon className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{section.label}</span>
                      </button>
                    ))}
                  </nav>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0 space-y-8">
          {/* Mobile Navigation */}
          <Card className="xl:hidden">
            <CardContent className="p-4">
              <ScrollArea className="w-full">
                <div className="flex gap-2 pb-2">
                  {sections.map((section) => (
                    <Button
                      key={section.id}
                      variant={activeSection === section.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => scrollToSection(section.id)}
                      className="flex-shrink-0"
                    >
                      {section.label}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Section: Introdução */}
          <section id="introducao" className="scroll-mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Introdução ao Sistema</CardTitle>
                    <p className="text-sm text-muted-foreground">Visão geral da plataforma</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                <p>
                  Bem-vindo à plataforma de cardápio digital multi-tenant! Como revendedor, você tem acesso 
                  a um sistema completo para gerenciar múltiplos restaurantes, cada um com seu próprio 
                  cardápio digital, sistema de pedidos e painel administrativo.
                </p>

                <h4 className="font-semibold mt-6 mb-3">Principais Funcionalidades</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { icon: Store, label: 'Gestão de Restaurantes', desc: 'Crie e gerencie múltiplos restaurantes' },
                    { icon: CreditCard, label: 'Cobrança Automática', desc: 'Integração com Mercado Pago' },
                    { icon: Palette, label: 'White-Label', desc: 'Personalização de marca completa' },
                    { icon: BarChart3, label: 'Relatórios', desc: 'Dashboard financeiro detalhado' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <item.icon className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <ArchitectureDiagram />

                <TipCard type="info" title="Modelo Multi-Tenant">
                  Cada restaurante opera de forma independente com sua própria URL, cardápio e configurações, 
                  mas você mantém controle centralizado sobre todos eles através do painel de revendedor.
                </TipCard>
              </CardContent>
            </Card>
          </section>

          {/* Section: Primeiros Passos */}
          <section id="primeiros-passos" className="scroll-mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Rocket className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Primeiros Passos</CardTitle>
                    <p className="text-sm text-muted-foreground">Configure sua conta de revendedor</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                <FlowDiagram 
                  title="Fluxo de Onboarding"
                  steps={[
                    { label: 'Criar Conta', description: 'Cadastro inicial' },
                    { label: 'Configurar Perfil', description: 'Nome e empresa' },
                    { label: 'Personalizar Marca', description: 'Cores e logo' },
                    { label: 'Integrar Pagamentos', description: 'Mercado Pago' },
                    { label: 'Criar Planos', description: 'Assinaturas' },
                  ]}
                />

                <h4 className="font-semibold mt-6 mb-3">1. Configurar seu Perfil</h4>
                <p>Acesse <strong>Configurações</strong> no menu lateral e preencha:</p>
                <StepList steps={[
                  'Nome completo do responsável',
                  'Nome da empresa/marca',
                  'Email de contato',
                  'Telefone/WhatsApp',
                ]} />

                <h4 className="font-semibold mt-6 mb-3">2. Personalizar Cores da Marca</h4>
                <p>Na mesma página de configurações, defina as cores que serão usadas em todo o sistema:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li><strong>Cor Primária:</strong> Botões, links e destaques principais</li>
                  <li><strong>Cor Secundária:</strong> Elementos complementares e acentos</li>
                </ul>

                <TipCard type="success" title="Dica de Branding">
                  Use cores que representem sua marca. Essas cores serão aplicadas automaticamente 
                  em todo o painel de revendedor e podem ser diferentes das cores dos restaurantes.
                </TipCard>

                <h4 className="font-semibold mt-6 mb-3">3. Configurar Slug Personalizado</h4>
                <p>
                  O slug é a URL personalizada da sua landing page. Por exemplo, se seu slug for 
                  <code className="bg-muted px-1.5 py-0.5 rounded text-xs mx-1">minha-empresa</code>, 
                  sua landing page ficará em:
                </p>
                <div className="bg-muted rounded-lg p-3 my-3">
                  <code className="text-sm">https://seusite.com/lp/minha-empresa</code>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Section: Restaurantes */}
          <section id="restaurantes" className="scroll-mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Store className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Gerenciamento de Restaurantes</CardTitle>
                    <p className="text-sm text-muted-foreground">Crie e administre seus clientes</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                <h4 className="font-semibold mb-3">Criar Novo Restaurante</h4>
                <StepList steps={[
                  'Acesse "Restaurantes" no menu lateral',
                  'Clique no botão "Novo Restaurante"',
                  'Preencha o nome do estabelecimento',
                  'Defina o slug (URL única) - ex: pizzaria-do-joao',
                  'Informe os dados do proprietário (nome, email, telefone)',
                  'Selecione o plano de assinatura',
                  'Clique em "Criar Restaurante"',
                ]} />

                <TipCard type="warning" title="Sobre o Slug">
                  O slug deve ser único e não pode ser alterado depois. Use apenas letras minúsculas, 
                  números e hífens. Exemplo: <code>pizzaria-bella-napoli</code>
                </TipCard>

                <h4 className="font-semibold mt-6 mb-3">Status dos Restaurantes</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">Trial</Badge>
                    <span className="text-sm">Período de teste gratuito (configurável por plano)</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-200">Ativo</Badge>
                    <span className="text-sm">Pagamento em dia, restaurante funcionando normalmente</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">Suspenso</Badge>
                    <span className="text-sm">Pagamento atrasado, cardápio bloqueado para clientes</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">Cancelado</Badge>
                    <span className="text-sm">Assinatura cancelada permanentemente</span>
                  </div>
                </div>

                <h4 className="font-semibold mt-6 mb-3">Ações Disponíveis</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li><strong>Ver Detalhes:</strong> Acesse todas as informações do restaurante</li>
                  <li><strong>Acessar Admin:</strong> Entre no painel administrativo do restaurante</li>
                  <li><strong>Editar Dados:</strong> Altere informações do proprietário</li>
                  <li><strong>Suspender/Ativar:</strong> Controle o acesso ao cardápio</li>
                  <li><strong>Enviar Mensagem:</strong> Comunique-se via WhatsApp ou email</li>
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Section: Planos */}
          <section id="planos" className="scroll-mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Planos de Assinatura</CardTitle>
                    <p className="text-sm text-muted-foreground">Configure seus pacotes de serviço</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                <p>
                  Os planos de assinatura definem os valores e condições que você oferece aos seus clientes 
                  restaurantes. Você pode criar quantos planos quiser.
                </p>

                <h4 className="font-semibold mt-6 mb-3">Criar Novo Plano</h4>
                <StepList steps={[
                  'Acesse "Mensalidades" no menu lateral',
                  'Clique em "Novo Plano"',
                  'Defina o nome do plano (ex: Básico, Profissional, Premium)',
                  'Configure o valor mensal',
                  'Defina a taxa de setup (cobrança única na adesão - opcional)',
                  'Configure os dias de trial gratuito',
                  'Adicione a descrição e recursos inclusos',
                  'Marque como "Popular" se for o plano recomendado',
                ]} />

                <h4 className="font-semibold mt-6 mb-3">Campos do Plano</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 pr-4">Campo</th>
                        <th className="text-left py-2">Descrição</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b">
                        <td className="py-2 pr-4 font-medium text-foreground">Nome</td>
                        <td className="py-2">Nome exibido para o cliente (ex: Plano Pro)</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 pr-4 font-medium text-foreground">Valor Mensal</td>
                        <td className="py-2">Quanto será cobrado por mês (R$)</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 pr-4 font-medium text-foreground">Taxa de Setup</td>
                        <td className="py-2">Valor único cobrado na adesão (opcional)</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 pr-4 font-medium text-foreground">Dias de Trial</td>
                        <td className="py-2">Período gratuito antes da primeira cobrança</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 pr-4 font-medium text-foreground">Recursos</td>
                        <td className="py-2">Lista de funcionalidades inclusas no plano</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-medium text-foreground">Popular</td>
                        <td className="py-2">Destaca o plano na landing page</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <TipCard type="info" title="Estratégia de Precificação">
                  Recomendamos criar pelo menos 3 planos (Básico, Pro, Premium) para dar opções aos clientes. 
                  O plano do meio geralmente é o mais vendido - marque-o como "Popular".
                </TipCard>
              </CardContent>
            </Card>
          </section>

          {/* Section: Mercado Pago */}
          <section id="mercadopago" className="scroll-mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Integração Mercado Pago</CardTitle>
                    <p className="text-sm text-muted-foreground">Configure cobranças automáticas</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                <p>
                  A integração com Mercado Pago permite cobrar automaticamente as mensalidades dos seus 
                  restaurantes através de assinaturas recorrentes.
                </p>

                <FlowDiagram 
                  title="Fluxo de Pagamento Automático"
                  steps={[
                    { label: 'Restaurante Cadastrado' },
                    { label: 'Link de Pagamento Gerado' },
                    { label: 'Cliente Paga' },
                    { label: 'Webhook Recebido' },
                    { label: 'Status Atualizado' },
                  ]}
                />

                <h4 className="font-semibold mt-6 mb-3">Passo 1: Obter Credenciais</h4>
                <StepList steps={[
                  'Acesse sua conta Mercado Pago (www.mercadopago.com.br)',
                  'Vá em "Seu negócio" → "Configurações" → "Credenciais"',
                  'Selecione "Credenciais de produção"',
                  'Copie o Access Token (começa com APP_USR)',
                  'Copie a Public Key (começa com APP_USR)',
                ]} />

                <TipCard type="warning" title="Atenção às Credenciais">
                  Use sempre as credenciais de <strong>produção</strong>, não as de teste. 
                  O Access Token é sensível - nunca compartilhe publicamente.
                </TipCard>

                <h4 className="font-semibold mt-6 mb-3">Passo 2: Configurar no Sistema</h4>
                <StepList steps={[
                  'Acesse "Configurações" no menu lateral',
                  'Role até a seção "Integração Mercado Pago"',
                  'Cole o Access Token no campo correspondente',
                  'Cole a Public Key',
                  'Ative a integração',
                  'Clique em "Salvar"',
                ]} />

                <h4 className="font-semibold mt-6 mb-3">Passo 3: Configurar Webhook</h4>
                <p>O webhook permite que o sistema receba notificações automáticas de pagamentos.</p>
                
                <div className="bg-muted rounded-lg p-4 my-4">
                  <p className="text-xs text-muted-foreground mb-2">URL do Webhook:</p>
                  <code className="text-sm break-all">
                    https://fcsgjhxcvglmvkbnbiur.supabase.co/functions/v1/mercadopago-webhook
                  </code>
                </div>

                <StepList steps={[
                  'No Mercado Pago, vá em "Seu negócio" → "Configurações" → "Webhooks"',
                  'Clique em "Configurar notificações"',
                  'Cole a URL do webhook acima',
                  'Selecione os eventos: "Pagamentos" e "Assinaturas"',
                  'Salve a configuração',
                ]} />

                <h4 className="font-semibold mt-6 mb-3">Como Funciona a Cobrança</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Quando você cria um restaurante com assinatura ativa, um link de pagamento é gerado</li>
                  <li>O proprietário do restaurante acessa o link e cadastra o cartão</li>
                  <li>O Mercado Pago cobra automaticamente todo mês</li>
                  <li>O sistema recebe a notificação via webhook e atualiza o status</li>
                  <li>Se o pagamento falhar, o restaurante é suspenso automaticamente</li>
                </ol>

                <TipCard type="success" title="Benefícios da Automação">
                  Com a integração configurada, você não precisa cobrar manualmente. O sistema cuida 
                  de tudo: geração de links, cobrança recorrente, suspensão por inadimplência e reativação 
                  após regularização.
                </TipCard>
              </CardContent>
            </Card>
          </section>

          {/* Section: Financeiro */}
          <section id="financeiro" className="scroll-mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Gestão Financeira</CardTitle>
                    <p className="text-sm text-muted-foreground">Acompanhe suas receitas</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                <p>
                  O Dashboard e a página de Relatórios oferecem uma visão completa da saúde financeira 
                  do seu negócio.
                </p>

                <h4 className="font-semibold mt-6 mb-3">Dashboard Principal</h4>
                <p>Na tela inicial do painel, você encontra:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li><strong>Total de Restaurantes:</strong> Quantidade de clientes cadastrados</li>
                  <li><strong>Restaurantes Ativos:</strong> Com pagamento em dia</li>
                  <li><strong>Em Trial:</strong> Período de teste gratuito</li>
                  <li><strong>Suspensos:</strong> Pagamento pendente</li>
                  <li><strong>Receita Mensal:</strong> Soma das mensalidades ativas</li>
                  <li><strong>Receita Potencial:</strong> Se todos pagassem</li>
                </ul>

                <h4 className="font-semibold mt-6 mb-3">Relatórios Detalhados</h4>
                <p>Na página de Relatórios, você tem acesso a:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Gráfico de evolução de receita mensal</li>
                  <li>Distribuição de restaurantes por status</li>
                  <li>Lista de pagamentos recentes</li>
                  <li>Histórico de transações</li>
                  <li>Filtros por período e status</li>
                </ul>

                <TipCard type="info" title="Acompanhamento">
                  Acesse o Dashboard diariamente para identificar rapidamente restaurantes com 
                  pagamentos pendentes e tomar ações antes que se tornem inadimplentes.
                </TipCard>
              </CardContent>
            </Card>
          </section>

          {/* Section: Landing Page */}
          <section id="landing-page" className="scroll-mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Landing Page White-Label</CardTitle>
                    <p className="text-sm text-muted-foreground">Sua página de vendas personalizada</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                <p>
                  A Landing Page é sua página de vendas pública onde novos clientes podem conhecer 
                  seus serviços e contratar um plano. Ela é totalmente personalizável com sua marca.
                </p>

                <h4 className="font-semibold mt-6 mb-3">Configurações Disponíveis</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium text-sm">Logo</p>
                    <p className="text-xs text-muted-foreground">Faça upload do logo da sua empresa</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium text-sm">Título e Subtítulo</p>
                    <p className="text-xs text-muted-foreground">Textos principais da página inicial</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium text-sm">Cores</p>
                    <p className="text-xs text-muted-foreground">Primária e secundária da página</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium text-sm">WhatsApp</p>
                    <p className="text-xs text-muted-foreground">Número para botão de contato</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium text-sm">Email</p>
                    <p className="text-xs text-muted-foreground">Email de contato exibido na página</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium text-sm">Estatísticas</p>
                    <p className="text-xs text-muted-foreground">Números de destaque (restaurantes, pedidos, etc)</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium text-sm">Depoimentos</p>
                    <p className="text-xs text-muted-foreground">Avaliações de clientes satisfeitos</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium text-sm">FAQ</p>
                    <p className="text-xs text-muted-foreground">Perguntas frequentes personalizadas</p>
                  </div>
                </div>

                <h4 className="font-semibold mt-6 mb-3">Ativar Landing Page</h4>
                <StepList steps={[
                  'Acesse "Configurações" no menu lateral',
                  'Encontre a seção "Landing Page"',
                  'Ative a opção "Habilitar Landing Page"',
                  'Configure o slug (URL personalizada)',
                  'Preencha os campos de personalização',
                  'Salve as alterações',
                ]} />

                <div className="bg-muted rounded-lg p-4 my-4">
                  <p className="text-xs text-muted-foreground mb-2">Sua Landing Page estará em:</p>
                  <code className="text-sm">https://seusite.com/lp/seu-slug</code>
                </div>

                <TipCard type="success" title="Dica de Marketing">
                  Use a landing page para captar novos clientes! Compartilhe o link nas redes sociais, 
                  WhatsApp e materiais de divulgação. Os planos que você criar aparecerão automaticamente 
                  com botão de contratação.
                </TipCard>
              </CardContent>
            </Card>
          </section>

          {/* Section: Administração */}
          <section id="administracao" className="scroll-mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Settings className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Administração de Restaurantes</CardTitle>
                    <p className="text-sm text-muted-foreground">Gerencie acessos e configurações</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                <h4 className="font-semibold mb-3">Acessar Painel do Restaurante</h4>
                <p>
                  Como revendedor, você pode acessar o painel administrativo de qualquer restaurante 
                  para ajudar na configuração ou resolver problemas.
                </p>
                <StepList steps={[
                  'Vá em "Restaurantes" no menu lateral',
                  'Encontre o restaurante desejado',
                  'Clique em "Ver Detalhes"',
                  'Use o botão "Acessar Admin" para entrar no painel',
                ]} />

                <h4 className="font-semibold mt-6 mb-3">Criar Administrador para Restaurante</h4>
                <p>
                  Cada restaurante pode ter seu próprio administrador (o proprietário) que terá 
                  acesso apenas ao seu estabelecimento.
                </p>
                <StepList steps={[
                  'Na página de detalhes do restaurante',
                  'Encontre a seção "Administradores"',
                  'Clique em "Adicionar Administrador"',
                  'Informe o email do proprietário',
                  'Uma senha temporária será gerada automaticamente',
                  'Envie as credenciais ao proprietário',
                ]} />

                <TipCard type="warning" title="Segurança">
                  Oriente seus clientes a alterarem a senha no primeiro acesso. 
                  Você também pode usar o botão "Resetar Senha" se eles esquecerem.
                </TipCard>

                <h4 className="font-semibold mt-6 mb-3">Suspender Restaurante</h4>
                <p>
                  Restaurantes podem ser suspensos manualmente (por inadimplência, por exemplo) 
                  ou automaticamente (quando o pagamento falha).
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Restaurantes suspensos não podem receber pedidos</li>
                  <li>O cardápio exibe uma mensagem de indisponibilidade</li>
                  <li>O painel admin continua acessível ao proprietário</li>
                  <li>A reativação é imediata após regularização</li>
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Section: Relatórios */}
          <section id="relatorios" className="scroll-mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Monitoramento e Relatórios</CardTitle>
                    <p className="text-sm text-muted-foreground">Acompanhe métricas importantes</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                <h4 className="font-semibold mb-3">Métricas Disponíveis</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium text-sm">Restaurantes por Status</p>
                    <p className="text-xs text-muted-foreground">Gráfico de pizza mostrando distribuição</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium text-sm">Evolução de Receita</p>
                    <p className="text-xs text-muted-foreground">Gráfico de linha mensal</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium text-sm">Taxa de Conversão</p>
                    <p className="text-xs text-muted-foreground">Trial → Pagante</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium text-sm">Churn Rate</p>
                    <p className="text-xs text-muted-foreground">Taxa de cancelamento mensal</p>
                  </div>
                </div>

                <h4 className="font-semibold mt-6 mb-3">Histórico de Pagamentos</h4>
                <p>Na página de Mensalidades, você encontra:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Lista de todos os pagamentos recebidos</li>
                  <li>Status de cada transação (Pago, Pendente, Falhou)</li>
                  <li>Filtros por restaurante e período</li>
                  <li>Detalhes do Mercado Pago (ID da transação)</li>
                </ul>

                <h4 className="font-semibold mt-6 mb-3">Comunicação com Clientes</h4>
                <p>
                  O sistema mantém um histórico de todas as comunicações enviadas aos restaurantes:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Mensagens de WhatsApp</li>
                  <li>Emails enviados</li>
                  <li>Notificações de cobrança</li>
                  <li>Avisos de suspensão</li>
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Section: FAQ */}
          <section id="faq" className="scroll-mt-32">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <HelpCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>FAQ e Suporte</CardTitle>
                    <p className="text-sm text-muted-foreground">Perguntas frequentes</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-sm text-left">
                      O que acontece quando um pagamento falha?
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      O sistema recebe a notificação do Mercado Pago e atualiza o status do restaurante 
                      para "Suspenso". O cardápio fica indisponível para clientes finais até que o 
                      pagamento seja regularizado. O proprietário continua tendo acesso ao painel admin.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-sm text-left">
                      Como reativar um restaurante suspenso?
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      Se o pagamento for regularizado automaticamente (nova tentativa do MP), o sistema 
                      reativa sozinho. Para reativação manual, acesse os detalhes do restaurante e 
                      clique em "Ativar Restaurante" após confirmar o recebimento.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-sm text-left">
                      Posso alterar o plano de um restaurante?
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      Sim! Na página de detalhes do restaurante, você pode alterar o plano vinculado. 
                      Se houver uma assinatura ativa no Mercado Pago, será necessário cancelar a atual 
                      e criar uma nova com o valor atualizado.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                    <AccordionTrigger className="text-sm text-left">
                      O webhook do Mercado Pago não está funcionando
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      Verifique: 1) Se a URL do webhook está correta nas configurações do MP; 
                      2) Se os eventos "Pagamentos" e "Assinaturas" estão selecionados; 
                      3) Se o Access Token está correto no sistema. Você pode testar enviando uma 
                      notificação de teste pelo painel do Mercado Pago.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5">
                    <AccordionTrigger className="text-sm text-left">
                      Como funciona o período de trial?
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      O trial é definido por plano (em dias). Durante esse período, o restaurante 
                      funciona normalmente sem cobrança. Ao final, o sistema tenta realizar a primeira 
                      cobrança. Se não houver forma de pagamento cadastrada ou o pagamento falhar, 
                      o restaurante é suspenso.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-6">
                    <AccordionTrigger className="text-sm text-left">
                      Posso ter mais de uma landing page?
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      Atualmente, cada revendedor tem uma única landing page. Se você precisa de 
                      páginas diferentes para nichos específicos, considere criar múltiplas contas 
                      de revendedor ou entre em contato com o suporte para soluções personalizadas.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-7">
                    <AccordionTrigger className="text-sm text-left">
                      Como resetar a senha de um administrador de restaurante?
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      Acesse os detalhes do restaurante, encontre o administrador na lista e clique 
                      em "Resetar Senha". Uma nova senha temporária será gerada e você poderá 
                      compartilhá-la com o proprietário.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className="mt-8 p-4 bg-muted/50 rounded-xl">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Precisa de Ajuda?
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Se você não encontrou a resposta que procura, entre em contato conosco:
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Mail className="h-4 w-4" />
                      suporte@sistema.com
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Phone className="h-4 w-4" />
                      WhatsApp
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
          </div>
        </div>

        {/* Back to Top Button */}
        {showBackToTop && (
          <Button
            variant="secondary"
            size="icon"
            className="fixed bottom-6 right-6 rounded-full shadow-lg z-50"
            onClick={scrollToTop}
          >
            <ChevronUp className="h-5 w-5" />
          </Button>
        )}
        </main>
      </div>
    </>
  );
}
