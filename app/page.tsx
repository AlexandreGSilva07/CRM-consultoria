"use client";

import { FormEvent, useMemo, useState } from "react";

type Stage = "Novo lead" | "Qualificação" | "Diagnóstico" | "Proposta" | "Negociação" | "Fechado";
type ActivityType = "Ligação" | "WhatsApp" | "E-mail" | "Reunião" | "Observação";

type Activity = {
  id: number;
  type: ActivityType;
  content: string;
  result: string;
  date: string;
};

type Client = {
  id: number;
  company: string;
  contact: string;
  email: string;
  phone: string;
  value: number;
  stage: Stage;
  consultant: string;
  source: string;
  nextAction: string;
  notes: string;
  activities: Activity[];
};

const stages: Stage[] = ["Novo lead", "Qualificação", "Diagnóstico", "Proposta", "Negociação", "Fechado"];
const consultants = ["Ana Costa", "Bruno Lima", "Carla Mendes", "Diego Alves"];

const initialClients: Client[] = [
  {
    id: 1,
    company: "Grupo Horizonte",
    contact: "Marina Azevedo",
    email: "marina@horizonte.com.br",
    phone: "(65) 99912-4401",
    value: 48000,
    stage: "Proposta",
    consultant: "Ana Costa",
    source: "Indicação",
    nextAction: "Revisar proposta executiva",
    notes: "Projeto de reorganização financeira e governança.",
    activities: [
      { id: 11, type: "Reunião", content: "Diagnóstico com diretoria financeira.", result: "Escopo validado e orçamento solicitado.", date: "18/09/2026 14:30" },
      { id: 12, type: "WhatsApp", content: "Envio do resumo do diagnóstico.", result: "Cliente confirmou recebimento.", date: "19/09/2026 10:10" },
    ],
  },
  {
    id: 2,
    company: "AgroVale Participações",
    contact: "Henrique Moura",
    email: "henrique@agrovale.com.br",
    phone: "(66) 99880-1188",
    value: 78000,
    stage: "Negociação",
    consultant: "Bruno Lima",
    source: "Evento",
    nextAction: "Negociar cronograma de implantação",
    notes: "Maior sensibilidade está no prazo, não no preço.",
    activities: [
      { id: 21, type: "Ligação", content: "Follow-up da proposta.", result: "Solicitou início em novembro.", date: "17/09/2026 16:20" },
    ],
  },
  {
    id: 3,
    company: "Clínica Integra",
    contact: "Patrícia Rocha",
    email: "patricia@clinicaintegra.com.br",
    phone: "(65) 99221-7780",
    value: 22000,
    stage: "Qualificação",
    consultant: "Carla Mendes",
    source: "Site",
    nextAction: "Confirmar faturamento e equipe",
    notes: "Busca estruturação comercial e indicadores.",
    activities: [],
  },
  {
    id: 4,
    company: "Norte Logística",
    contact: "Lucas Freitas",
    email: "lucas@nortelog.com.br",
    phone: "(65) 99770-3321",
    value: 35000,
    stage: "Diagnóstico",
    consultant: "Diego Alves",
    source: "LinkedIn",
    nextAction: "Reunião de diagnóstico operacional",
    notes: "Lead com urgência por expansão para nova unidade.",
    activities: [
      { id: 41, type: "E-mail", content: "Envio de questionário pré-diagnóstico.", result: "Questionário respondido.", date: "16/09/2026 09:05" },
    ],
  },
  {
    id: 5,
    company: "Matriz Engenharia",
    contact: "Rafael Nunes",
    email: "rafael@matrizeng.com.br",
    phone: "(65) 99602-1110",
    value: 64000,
    stage: "Fechado",
    consultant: "Ana Costa",
    source: "Cliente antigo",
    nextAction: "Kickoff do projeto",
    notes: "Contrato aprovado para 6 meses.",
    activities: [
      { id: 51, type: "Ligação", content: "Confirmação final do contrato.", result: "Aprovado sem ressalvas.", date: "15/09/2026 11:40" },
    ],
  },
  {
    id: 6,
    company: "Ativa Distribuição",
    contact: "Camila Farias",
    email: "camila@ativa.com.br",
    phone: "(65) 99190-2010",
    value: 18000,
    stage: "Novo lead",
    consultant: "Bruno Lima",
    source: "Instagram",
    nextAction: "Primeiro contato",
    notes: "Solicitou contato após ver conteúdo sobre processos.",
    activities: [],
  },
];

const money = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value);

export default function Home() {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [selected, setSelected] = useState<Client | null>(null);
  const [showNewClient, setShowNewClient] = useState(false);
  const [activityType, setActivityType] = useState<ActivityType>("Ligação");
  const [activityContent, setActivityContent] = useState("");
  const [activityResult, setActivityResult] = useState("");

  const stats = useMemo(() => {
    const pipeline = clients.filter((c) => c.stage !== "Fechado").reduce((sum, c) => sum + c.value, 0);
    const won = clients.filter((c) => c.stage === "Fechado").reduce((sum, c) => sum + c.value, 0);
    const proposals = clients.filter((c) => ["Proposta", "Negociação"].includes(c.stage)).length;
    return { pipeline, won, proposals, clients: clients.length };
  }, [clients]);

  function moveClient(id: number, stage: Stage) {
    setClients((current) => current.map((client) => (client.id === id ? { ...client, stage } : client)));
    setSelected((current) => (current?.id === id ? { ...current, stage } : current));
  }

  function createClient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const client: Client = {
      id: Date.now(),
      company: String(data.get("company")),
      contact: String(data.get("contact")),
      email: String(data.get("email")),
      phone: String(data.get("phone")),
      value: Number(data.get("value")),
      stage: "Novo lead",
      consultant: String(data.get("consultant")),
      source: String(data.get("source")),
      nextAction: "Realizar primeiro contato",
      notes: String(data.get("notes")),
      activities: [],
    };
    setClients((current) => [client, ...current]);
    setShowNewClient(false);
  }

  function addActivity(event: FormEvent) {
    event.preventDefault();
    if (!selected || !activityContent.trim()) return;
    const activity: Activity = {
      id: Date.now(),
      type: activityType,
      content: activityContent,
      result: activityResult || "Sem resultado informado",
      date: new Date().toLocaleString("pt-BR"),
    };
    const updated = { ...selected, activities: [activity, ...selected.activities] };
    setClients((current) => current.map((client) => (client.id === updated.id ? updated : client)));
    setSelected(updated);
    setActivityContent("");
    setActivityResult("");
  }

  return (
    <main>
      <header className="topbar">
        <div>
          <div className="eyebrow">NEXO CONSULTORIA</div>
          <h1>Pipeline comercial</h1>
          <p>Clientes, oportunidades e relacionamento em uma única visão.</p>
        </div>
        <button className="primary" onClick={() => setShowNewClient(true)}>+ Novo cliente</button>
      </header>

      <section className="stats">
        <div className="stat"><span>Pipeline aberto</span><strong>{money(stats.pipeline)}</strong><small>Potencial em negociação</small></div>
        <div className="stat"><span>Receita fechada</span><strong>{money(stats.won)}</strong><small>Negócios ganhos</small></div>
        <div className="stat"><span>Propostas ativas</span><strong>{stats.proposals}</strong><small>Proposta + negociação</small></div>
        <div className="stat"><span>Oportunidades</span><strong>{stats.clients}</strong><small>Total no funil</small></div>
      </section>

      <section className="kanban">
        {stages.map((stage) => {
          const stageClients = clients.filter((client) => client.stage === stage);
          const total = stageClients.reduce((sum, client) => sum + client.value, 0);
          return (
            <div className="column" key={stage}>
              <div className="columnHead">
                <div><span className="dot" /><b>{stage}</b><em>{stageClients.length}</em></div>
                <small>{money(total)}</small>
              </div>
              <div className="cards">
                {stageClients.map((client) => (
                  <article className="card" key={client.id} onClick={() => setSelected(client)}>
                    <div className="cardTop"><span>{client.source}</span><b>{money(client.value)}</b></div>
                    <h3>{client.company}</h3>
                    <p>{client.contact}</p>
                    <div className="cardMeta"><span className="avatar">{client.consultant.charAt(0)}</span>{client.consultant}</div>
                    <div className="nextAction">Próxima ação: {client.nextAction}</div>
                  </article>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {showNewClient && (
        <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && setShowNewClient(false)}>
          <form className="modal formModal" onSubmit={createClient}>
            <div className="modalHead"><div><span className="eyebrow">NOVA OPORTUNIDADE</span><h2>Cadastrar cliente</h2></div><button type="button" className="iconButton" onClick={() => setShowNewClient(false)}>×</button></div>
            <div className="formGrid">
              <label>Empresa<input required name="company" placeholder="Ex.: Alpha Consultoria" /></label>
              <label>Contato<input required name="contact" placeholder="Nome do responsável" /></label>
              <label>E-mail<input required type="email" name="email" placeholder="contato@empresa.com" /></label>
              <label>Telefone<input name="phone" placeholder="(65) 99999-9999" /></label>
              <label>Valor estimado<input required type="number" name="value" min="0" placeholder="35000" /></label>
              <label>Origem<select name="source"><option>Indicação</option><option>Site</option><option>LinkedIn</option><option>Instagram</option><option>Evento</option><option>Prospecção ativa</option></select></label>
              <label className="wide">Consultor responsável<select name="consultant">{consultants.map((name) => <option key={name}>{name}</option>)}</select></label>
              <label className="wide">Observações<textarea name="notes" rows={3} placeholder="Contexto inicial, necessidade, urgência..." /></label>
            </div>
            <div className="modalActions"><button type="button" className="secondary" onClick={() => setShowNewClient(false)}>Cancelar</button><button className="primary">Cadastrar oportunidade</button></div>
          </form>
        </div>
      )}

      {selected && (
        <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && setSelected(null)}>
          <div className="modal detailModal">
            <div className="modalHead">
              <div><span className="eyebrow">{selected.stage.toUpperCase()}</span><h2>{selected.company}</h2><p>{selected.contact} · {selected.email}</p></div>
              <button className="iconButton" onClick={() => setSelected(null)}>×</button>
            </div>

            <div className="detailGrid">
              <section>
                <h4>Informações comerciais</h4>
                <div className="infoGrid">
                  <div><span>Valor</span><b>{money(selected.value)}</b></div>
                  <div><span>Consultor</span><b>{selected.consultant}</b></div>
                  <div><span>Origem</span><b>{selected.source}</b></div>
                  <div><span>Telefone</span><b>{selected.phone}</b></div>
                </div>
                <label className="stageSelect">Etapa do funil<select value={selected.stage} onChange={(e) => moveClient(selected.id, e.target.value as Stage)}>{stages.map((stage) => <option key={stage}>{stage}</option>)}</select></label>
                <div className="noteBox"><span>Observações</span><p>{selected.notes || "Nenhuma observação registrada."}</p></div>

                <form className="activityForm" onSubmit={addActivity}>
                  <div className="sectionTitle"><h4>Registrar interação</h4><span>Histórico comercial</span></div>
                  <div className="activityFields">
                    <select value={activityType} onChange={(e) => setActivityType(e.target.value as ActivityType)}>
                      <option>Ligação</option><option>WhatsApp</option><option>E-mail</option><option>Reunião</option><option>Observação</option>
                    </select>
                    <textarea required value={activityContent} onChange={(e) => setActivityContent(e.target.value)} placeholder="O que foi conversado?" rows={3} />
                    <input value={activityResult} onChange={(e) => setActivityResult(e.target.value)} placeholder="Resultado / próximo passo" />
                  </div>
                  <button className="primary">Registrar interação</button>
                </form>
              </section>

              <aside>
                <div className="sectionTitle"><h4>Histórico</h4><span>{selected.activities.length} registros</span></div>
                <div className="timeline">
                  {selected.activities.length === 0 && <div className="empty">Nenhuma interação registrada ainda.</div>}
                  {selected.activities.map((activity) => (
                    <div className="timelineItem" key={activity.id}>
                      <span className="timelineIcon">{activity.type.charAt(0)}</span>
                      <div><div className="timelineTop"><b>{activity.type}</b><small>{activity.date}</small></div><p>{activity.content}</p><em>{activity.result}</em></div>
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
