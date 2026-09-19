export type Stage =
  | "Novo lead"
  | "Qualificação"
  | "Diagnóstico"
  | "Proposta"
  | "Negociação"
  | "Fechado";

export type ActivityType = "Ligação" | "WhatsApp" | "E-mail" | "Reunião" | "Observação";

export type Activity = {
  id: number;
  type: ActivityType;
  content: string;
  result: string;
  date: string;
};

export type Client = {
  id: number;
  company: string;
  segment: string;
  contact: string;
  role: string;
  email: string;
  phone: string;
  value: number;
  stage: Stage;
  probability: number;
  consultant: string;
  source: string;
  nextAction: string;
  nextActionDate: string;
  expectedClose: string;
  notes: string;
  activities: Activity[];
};

export const stages: Stage[] = [
  "Novo lead",
  "Qualificação",
  "Diagnóstico",
  "Proposta",
  "Negociação",
  "Fechado",
];

export const stageProbability: Record<Stage, number> = {
  "Novo lead": 10,
  Qualificação: 25,
  Diagnóstico: 45,
  Proposta: 65,
  Negociação: 85,
  Fechado: 100,
};

export const consultants = ["Ana Costa", "Bruno Lima", "Carla Mendes", "Diego Alves"];

export const sources = ["Indicação", "Site", "LinkedIn", "Instagram", "Evento", "Prospecção ativa", "Cliente antigo"];

export const initialClients: Client[] = [
  {
    id: 1,
    company: "Grupo Horizonte",
    segment: "Holding familiar",
    contact: "Marina Azevedo",
    role: "Diretora Financeira",
    email: "marina@horizonte.com.br",
    phone: "(65) 99912-4401",
    value: 48000,
    stage: "Proposta",
    probability: 65,
    consultant: "Ana Costa",
    source: "Indicação",
    nextAction: "Revisar proposta executiva",
    nextActionDate: "2026-09-20",
    expectedClose: "2026-10-03",
    notes: "Projeto de reorganização financeira e governança. Diretoria quer iniciar ainda no quarto trimestre.",
    activities: [
      { id: 11, type: "Reunião", content: "Diagnóstico com diretoria financeira e sócios.", result: "Escopo validado e orçamento solicitado.", date: "18/09/2026 14:30" },
      { id: 12, type: "WhatsApp", content: "Envio do resumo executivo e próximos passos.", result: "Cliente confirmou recebimento.", date: "19/09/2026 10:10" },
    ],
  },
  {
    id: 2,
    company: "AgroVale Participações",
    segment: "Agronegócio",
    contact: "Henrique Moura",
    role: "CEO",
    email: "henrique@agrovale.com.br",
    phone: "(66) 99880-1188",
    value: 78000,
    stage: "Negociação",
    probability: 85,
    consultant: "Bruno Lima",
    source: "Evento",
    nextAction: "Negociar cronograma de implantação",
    nextActionDate: "2026-09-19",
    expectedClose: "2026-09-26",
    notes: "Maior sensibilidade está no prazo, não no preço. Existe concorrente, mas estamos tecnicamente à frente.",
    activities: [
      { id: 21, type: "Ligação", content: "Follow-up da proposta com Henrique.", result: "Solicitou início em novembro e ajuste no cronograma.", date: "17/09/2026 16:20" },
      { id: 22, type: "E-mail", content: "Envio da versão revisada da proposta.", result: "Em análise pelo conselho.", date: "18/09/2026 09:50" },
    ],
  },
  {
    id: 3,
    company: "Clínica Integra",
    segment: "Saúde",
    contact: "Patrícia Rocha",
    role: "Sócia",
    email: "patricia@clinicaintegra.com.br",
    phone: "(65) 99221-7780",
    value: 22000,
    stage: "Qualificação",
    probability: 25,
    consultant: "Carla Mendes",
    source: "Site",
    nextAction: "Confirmar faturamento e tamanho da equipe",
    nextActionDate: "2026-09-21",
    expectedClose: "2026-10-20",
    notes: "Busca estruturação comercial, indicadores e rotina de gestão. Ainda validando orçamento.",
    activities: [],
  },
  {
    id: 4,
    company: "Norte Logística",
    segment: "Logística",
    contact: "Lucas Freitas",
    role: "Diretor de Operações",
    email: "lucas@nortelog.com.br",
    phone: "(65) 99770-3321",
    value: 35000,
    stage: "Diagnóstico",
    probability: 45,
    consultant: "Diego Alves",
    source: "LinkedIn",
    nextAction: "Reunião de diagnóstico operacional",
    nextActionDate: "2026-09-22",
    expectedClose: "2026-10-12",
    notes: "Lead com urgência por expansão para nova unidade e necessidade de padronizar processos.",
    activities: [
      { id: 41, type: "E-mail", content: "Envio de questionário pré-diagnóstico.", result: "Questionário respondido por operações.", date: "16/09/2026 09:05" },
    ],
  },
  {
    id: 5,
    company: "Matriz Engenharia",
    segment: "Engenharia",
    contact: "Rafael Nunes",
    role: "Diretor Executivo",
    email: "rafael@matrizeng.com.br",
    phone: "(65) 99602-1110",
    value: 64000,
    stage: "Fechado",
    probability: 100,
    consultant: "Ana Costa",
    source: "Cliente antigo",
    nextAction: "Kickoff do projeto",
    nextActionDate: "2026-09-23",
    expectedClose: "2026-09-15",
    notes: "Contrato aprovado para 6 meses. Oportunidade de expansão para controladoria no próximo ciclo.",
    activities: [
      { id: 51, type: "Ligação", content: "Confirmação final do contrato.", result: "Aprovado sem ressalvas.", date: "15/09/2026 11:40" },
    ],
  },
  {
    id: 6,
    company: "Ativa Distribuição",
    segment: "Distribuição",
    contact: "Camila Farias",
    role: "Gerente Administrativa",
    email: "camila@ativa.com.br",
    phone: "(65) 99190-2010",
    value: 18000,
    stage: "Novo lead",
    probability: 10,
    consultant: "Bruno Lima",
    source: "Instagram",
    nextAction: "Realizar primeiro contato",
    nextActionDate: "2026-09-19",
    expectedClose: "2026-11-05",
    notes: "Solicitou contato após ver conteúdo sobre processos e indicadores.",
    activities: [],
  },
  {
    id: 7,
    company: "Cerrado Foods",
    segment: "Indústria de alimentos",
    contact: "Júlia Martins",
    role: "Controller",
    email: "julia@cerradofoods.com.br",
    phone: "(65) 99330-7211",
    value: 92000,
    stage: "Proposta",
    probability: 65,
    consultant: "Carla Mendes",
    source: "Prospecção ativa",
    nextAction: "Apresentar business case ao CFO",
    nextActionDate: "2026-09-24",
    expectedClose: "2026-10-08",
    notes: "Projeto de controladoria e FP&A. Potencial para contrato recorrente.",
    activities: [
      { id: 71, type: "Reunião", content: "Apresentação do diagnóstico e baseline financeiro.", result: "CFO pediu business case com ROI.", date: "18/09/2026 15:00" },
    ],
  },
  {
    id: 8,
    company: "Via Capital",
    segment: "Serviços financeiros",
    contact: "Eduardo Paes",
    role: "Sócio",
    email: "eduardo@viacapital.com.br",
    phone: "(65) 99811-6630",
    value: 31000,
    stage: "Qualificação",
    probability: 25,
    consultant: "Diego Alves",
    source: "Indicação",
    nextAction: "Mapear decisores do projeto",
    nextActionDate: "2026-09-20",
    expectedClose: "2026-10-28",
    notes: "Interesse em revisão de processos, metas e modelo de remuneração variável.",
    activities: [
      { id: 81, type: "Ligação", content: "Primeiro contato com o sócio.", result: "Reunião de descoberta agendada.", date: "19/09/2026 09:20" },
    ],
  },
];
