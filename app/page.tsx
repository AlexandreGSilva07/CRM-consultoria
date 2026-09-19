"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  Activity as ActivityIcon,
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Columns3,
  GripVertical,
  LayoutDashboard,
  Mail,
  MessageCircle,
  Phone,
  Plus,
  Search,
  Settings,
  SlidersHorizontal,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import { Avatar, Badge, Button, Modal, Select } from "@/components/ui";
import {
  ActivityType,
  Client,
  Stage,
  consultants,
  initialClients,
  sources,
  stageProbability,
  stages,
} from "@/lib/crm-data";

const TODAY = "2026-09-19";

const money = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);

const shortDate = (value: string) =>
  new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(
    new Date(`${value}T12:00:00`),
  );

const stageTone: Record<Stage, "neutral" | "brand" | "warning" | "success"> = {
  "Novo lead": "neutral",
  Qualificação: "brand",
  Diagnóstico: "brand",
  Proposta: "warning",
  Negociação: "warning",
  Fechado: "success",
};

const activityIcons: Record<ActivityType, typeof Phone> = {
  Ligação: Phone,
  WhatsApp: MessageCircle,
  "E-mail": Mail,
  Reunião: Users,
  Observação: ActivityIcon,
};

export default function Home() {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [newClientOpen, setNewClientOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [consultantFilter, setConsultantFilter] = useState("Todos");
  const [sourceFilter, setSourceFilter] = useState("Todas");
  const [newConsultant, setNewConsultant] = useState(consultants[0]);
  const [newSource, setNewSource] = useState(sources[0]);
  const [activityType, setActivityType] = useState<ActivityType>("Ligação");
  const [activityContent, setActivityContent] = useState("");
  const [activityResult, setActivityResult] = useState("");

  const selected = clients.find((client) => client.id === selectedId) ?? null;

  const filteredClients = useMemo(() => {
    const query = search.trim().toLowerCase();
    return clients.filter((client) => {
      const matchesSearch =
        !query ||
        [client.company, client.contact, client.segment, client.consultant]
          .join(" ")
          .toLowerCase()
          .includes(query);
      const matchesConsultant =
        consultantFilter === "Todos" || client.consultant === consultantFilter;
      const matchesSource = sourceFilter === "Todas" || client.source === sourceFilter;
      return matchesSearch && matchesConsultant && matchesSource;
    });
  }, [clients, search, consultantFilter, sourceFilter]);

  const stats = useMemo(() => {
    const open = clients.filter((client) => client.stage !== "Fechado");
    const pipeline = open.reduce((sum, client) => sum + client.value, 0);
    const forecast = open.reduce(
      (sum, client) => sum + client.value * (client.probability / 100),
      0,
    );
    const won = clients
      .filter((client) => client.stage === "Fechado")
      .reduce((sum, client) => sum + client.value, 0);
    const wonCount = clients.filter((client) => client.stage === "Fechado").length;
    const conversion = clients.length ? Math.round((wonCount / clients.length) * 100) : 0;
    const overdue = open.filter((client) => client.nextActionDate < TODAY).length;
    return { pipeline, forecast, won, conversion, overdue };
  }, [clients]);

  function updateClient(id: number, patch: Partial<Client>) {
    setClients((current) =>
      current.map((client) => (client.id === id ? { ...client, ...patch } : client)),
    );
  }

  function moveClient(id: number, stage: Stage) {
    updateClient(id, { stage, probability: stageProbability[stage] });
  }

  function onDrop(event: React.DragEvent, stage: Stage) {
    event.preventDefault();
    const id = Number(event.dataTransfer.getData("text/client-id"));
    if (id) moveClient(id, stage);
  }

  function createClient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const closeDate = String(data.get("expectedClose"));
    const client: Client = {
      id: Date.now(),
      company: String(data.get("company")),
      segment: String(data.get("segment")),
      contact: String(data.get("contact")),
      role: String(data.get("role")),
      email: String(data.get("email")),
      phone: String(data.get("phone")),
      value: Number(data.get("value")),
      stage: "Novo lead",
      probability: 10,
      consultant: newConsultant,
      source: newSource,
      nextAction: String(data.get("nextAction")) || "Realizar primeiro contato",
      nextActionDate: String(data.get("nextActionDate")),
      expectedClose: closeDate,
      notes: String(data.get("notes")),
      activities: [],
    };

    setClients((current) => [client, ...current]);
    form.reset();
    setNewClientOpen(false);
  }

  function addActivity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected || !activityContent.trim()) return;

    const activity = {
      id: Date.now(),
      type: activityType,
      content: activityContent.trim(),
      result: activityResult.trim() || "Sem resultado informado",
      date: new Date().toLocaleString("pt-BR"),
    };

    updateClient(selected.id, {
      activities: [activity, ...selected.activities],
    });
    setActivityContent("");
    setActivityResult("");
  }

  const nav = [
    { label: "Visão geral", icon: LayoutDashboard },
    { label: "Pipeline", icon: Columns3, active: true },
    { label: "Clientes", icon: Building2 },
    { label: "Atividades", icon: ActivityIcon },
    { label: "Relatórios", icon: BarChart3 },
  ];

  return (
    <div className="appShell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brandMark">N</div>
          <div>
            <strong>Nexo CRM</strong>
            <span>Consultoria</span>
          </div>
        </div>

        <nav className="sideNav">
          <span className="navSection">Workspace</span>
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <button className={item.active ? "navItem navItem--active" : "navItem"} key={item.label}>
                <Icon size={17} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="sidebarFooter">
          <div className="workspaceCard">
            <Sparkles size={16} />
            <div>
              <strong>MVP Comercial</strong>
              <span>Dados demonstrativos</span>
            </div>
          </div>
          <button className="navItem">
            <Settings size={17} />
            Configurações
          </button>
        </div>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div>
            <span className="eyebrow">COMERCIAL / PIPELINE</span>
            <h1>Pipeline de vendas</h1>
            <p>Acompanhe oportunidades, previsão de receita e próximos passos.</p>
          </div>
          <div className="topbarActions">
            <Button variant="secondary">
              <CalendarDays size={16} />
              Atividades
            </Button>
            <Button onClick={() => setNewClientOpen(true)}>
              <Plus size={16} />
              Nova oportunidade
            </Button>
          </div>
        </header>

        <section className="metrics">
          <div className="metricCard">
            <div className="metricIcon"><CircleDollarSign size={18} /></div>
            <div className="metricCopy"><span>Pipeline aberto</span><strong>{money(stats.pipeline)}</strong><small>Valor total em negociação</small></div>
          </div>
          <div className="metricCard">
            <div className="metricIcon metricIcon--brand"><TrendingUp size={18} /></div>
            <div className="metricCopy"><span>Forecast ponderado</span><strong>{money(stats.forecast)}</strong><small>Valor x probabilidade</small></div>
          </div>
          <div className="metricCard">
            <div className="metricIcon metricIcon--success"><Trophy size={18} /></div>
            <div className="metricCopy"><span>Receita fechada</span><strong>{money(stats.won)}</strong><small>Conversão atual: {stats.conversion}%</small></div>
          </div>
          <div className="metricCard">
            <div className={stats.overdue ? "metricIcon metricIcon--danger" : "metricIcon"}><Clock3 size={18} /></div>
            <div className="metricCopy"><span>Ações vencidas</span><strong>{stats.overdue}</strong><small>{stats.overdue ? "Requer atenção comercial" : "Agenda em dia"}</small></div>
          </div>
        </section>

        <section className="pipelinePanel">
          <div className="toolbar">
            <div className="searchBox">
              <Search size={16} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar empresa, contato ou segmento..."
              />
            </div>

            <div className="filters">
              <SlidersHorizontal size={15} />
              <Select
                value={consultantFilter}
                onValueChange={setConsultantFilter}
                ariaLabel="Filtrar por consultor"
                options={[
                  { value: "Todos", label: "Todos os consultores" },
                  ...consultants.map((name) => ({ value: name, label: name })),
                ]}
              />
              <Select
                value={sourceFilter}
                onValueChange={setSourceFilter}
                ariaLabel="Filtrar por origem"
                options={[
                  { value: "Todas", label: "Todas as origens" },
                  ...sources.map((source) => ({ value: source, label: source })),
                ]}
              />
            </div>
          </div>

          <div className="kanban">
            {stages.map((stage) => {
              const stageClients = filteredClients.filter((client) => client.stage === stage);
              const total = stageClients.reduce((sum, client) => sum + client.value, 0);

              return (
                <section
                  className="kanbanColumn"
                  key={stage}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => onDrop(event, stage)}
                >
                  <div className="columnHeader">
                    <div className="columnTitle">
                      <span className={`stageDot stageDot--${stages.indexOf(stage)}`} />
                      <strong>{stage}</strong>
                      <span className="countPill">{stageClients.length}</span>
                    </div>
                    <span>{money(total)}</span>
                  </div>

                  <div className="cardStack">
                    {stageClients.map((client) => {
                      const overdue =
                        client.stage !== "Fechado" && client.nextActionDate < TODAY;

                      return (
                        <article
                          draggable
                          className="dealCard"
                          key={client.id}
                          onDragStart={(event) =>
                            event.dataTransfer.setData("text/client-id", String(client.id))
                          }
                          onClick={() => setSelectedId(client.id)}
                        >
                          <div className="dealTop">
                            <div className="dealCompany">
                              <GripVertical className="dragHandle" size={14} />
                              <div>
                                <h3>{client.company}</h3>
                                <span>{client.segment}</span>
                              </div>
                            </div>
                            <Badge tone={client.probability >= 80 ? "success" : client.probability >= 60 ? "warning" : "neutral"}>
                              {client.probability}%
                            </Badge>
                          </div>

                          <div className="dealValue">{money(client.value)}</div>

                          <div className="dealMeta">
                            <div className="consultant">
                              <Avatar name={client.consultant} small />
                              <span>{client.consultant}</span>
                            </div>
                            <span className="sourcePill">{client.source}</span>
                          </div>

                          <div className={overdue ? "nextStep nextStep--overdue" : "nextStep"}>
                            <Clock3 size={13} />
                            <div>
                              <span>{client.nextAction}</span>
                              <small>{overdue ? "Vencido" : shortDate(client.nextActionDate)}</small>
                            </div>
                          </div>
                        </article>
                      );
                    })}

                    {stageClients.length === 0 ? (
                      <div className="emptyColumn">
                        <Target size={17} />
                        <span>Solte uma oportunidade aqui</span>
                      </div>
                    ) : null}
                  </div>
                </section>
              );
            })}
          </div>
        </section>
      </main>

      <Modal
        open={newClientOpen}
        onOpenChange={setNewClientOpen}
        title="Nova oportunidade"
        subtitle="Cadastre um lead e já deixe o próximo passo definido."
      >
        <form className="form" onSubmit={createClient}>
          <div className="formSection">
            <div className="formSectionTitle">Empresa e contato</div>
            <div className="formGrid">
              <label className="field">
                <span>Empresa</span>
                <input required name="company" placeholder="Ex.: Alpha Participações" />
              </label>
              <label className="field">
                <span>Segmento</span>
                <input required name="segment" placeholder="Ex.: Agronegócio" />
              </label>
              <label className="field">
                <span>Contato principal</span>
                <input required name="contact" placeholder="Nome do contato" />
              </label>
              <label className="field">
                <span>Cargo</span>
                <input required name="role" placeholder="Ex.: Diretor Financeiro" />
              </label>
              <label className="field">
                <span>E-mail</span>
                <input required type="email" name="email" placeholder="contato@empresa.com" />
              </label>
              <label className="field">
                <span>Telefone</span>
                <input name="phone" placeholder="(65) 99999-9999" />
              </label>
            </div>
          </div>

          <div className="formSection">
            <div className="formSectionTitle">Oportunidade comercial</div>
            <div className="formGrid">
              <label className="field">
                <span>Valor estimado</span>
                <input required type="number" name="value" min="0" placeholder="35000" />
              </label>
              <label className="field">
                <span>Fechamento previsto</span>
                <input required type="date" name="expectedClose" defaultValue="2026-10-15" />
              </label>
              <div className="field">
                <span>Consultor responsável</span>
                <Select
                  value={newConsultant}
                  onValueChange={setNewConsultant}
                  options={consultants.map((name) => ({ value: name, label: name }))}
                />
              </div>
              <div className="field">
                <span>Origem</span>
                <Select
                  value={newSource}
                  onValueChange={setNewSource}
                  options={sources.map((source) => ({ value: source, label: source }))}
                />
              </div>
              <label className="field field--wide">
                <span>Próxima ação</span>
                <input required name="nextAction" placeholder="Ex.: Agendar reunião de diagnóstico" />
              </label>
              <label className="field">
                <span>Data da próxima ação</span>
                <input required type="date" name="nextActionDate" defaultValue="2026-09-22" />
              </label>
              <label className="field field--wide">
                <span>Observações</span>
                <textarea name="notes" rows={3} placeholder="Contexto, dor principal, urgência, decisores..." />
              </label>
            </div>
          </div>

          <div className="formActions">
            <Button type="button" variant="secondary" onClick={() => setNewClientOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              <Plus size={16} />
              Criar oportunidade
            </Button>
          </div>
        </form>
      </Modal>

      {selected ? (
        <Modal
          open={Boolean(selected)}
          onOpenChange={(open) => !open && setSelectedId(null)}
          title={selected.company}
          subtitle={`${selected.contact} · ${selected.role}`}
          size="large"
        >
          <div className="clientHeaderBar">
            <div className="clientIdentity">
              <Avatar name={selected.company} />
              <div>
                <div className="clientBadges">
                  <Badge tone={stageTone[selected.stage]}>{selected.stage}</Badge>
                  <Badge>{selected.segment}</Badge>
                </div>
                <span>{selected.email} · {selected.phone}</span>
              </div>
            </div>
            <div className="quickActions">
              <a className="iconAction" href={`tel:${selected.phone}`} title="Ligar"><Phone size={16} /></a>
              <a className="iconAction" href={`mailto:${selected.email}`} title="Enviar e-mail"><Mail size={16} /></a>
              <button className="iconAction" title="WhatsApp"><MessageCircle size={16} /></button>
            </div>
          </div>

          <div className="detailLayout">
            <section className="clientMain">
              <div className="commercialCards">
                <div><span>Valor</span><strong>{money(selected.value)}</strong><CircleDollarSign size={16} /></div>
                <div><span>Probabilidade</span><strong>{selected.probability}%</strong><Target size={16} /></div>
                <div><span>Forecast</span><strong>{money(selected.value * selected.probability / 100)}</strong><TrendingUp size={16} /></div>
                <div><span>Fechamento</span><strong>{shortDate(selected.expectedClose)}</strong><CalendarDays size={16} /></div>
              </div>

              <div className="detailSection">
                <div className="detailSectionHeader">
                  <div><span className="sectionEyebrow">GESTÃO DA OPORTUNIDADE</span><h3>Dados comerciais</h3></div>
                </div>
                <div className="detailControls">
                  <div className="field">
                    <span>Etapa do funil</span>
                    <Select
                      value={selected.stage}
                      onValueChange={(value) => moveClient(selected.id, value as Stage)}
                      options={stages.map((stage) => ({ value: stage, label: stage }))}
                    />
                  </div>
                  <div className="field">
                    <span>Consultor responsável</span>
                    <Select
                      value={selected.consultant}
                      onValueChange={(value) => updateClient(selected.id, { consultant: value })}
                      options={consultants.map((name) => ({ value: name, label: name }))}
                    />
                  </div>
                </div>

                <div className={selected.nextActionDate < TODAY && selected.stage !== "Fechado" ? "actionCard actionCard--overdue" : "actionCard"}>
                  <div className="actionIcon"><Clock3 size={17} /></div>
                  <div>
                    <span>Próxima ação</span>
                    <strong>{selected.nextAction}</strong>
                    <small>{shortDate(selected.nextActionDate)} · {selected.nextActionDate < TODAY && selected.stage !== "Fechado" ? "Vencida" : "Programada"}</small>
                  </div>
                  <Button variant="ghost">
                    Concluir
                    <CheckCircle2 size={15} />
                  </Button>
                </div>

                <div className="noteCard">
                  <span>Observações comerciais</span>
                  <p>{selected.notes || "Nenhuma observação registrada."}</p>
                </div>
              </div>

              <div className="detailSection">
                <div className="detailSectionHeader">
                  <div><span className="sectionEyebrow">RELACIONAMENTO</span><h3>Registrar interação</h3></div>
                </div>

                <form className="activityComposer" onSubmit={addActivity}>
                  <div className="activityTypes">
                    {(["Ligação", "WhatsApp", "E-mail", "Reunião", "Observação"] as ActivityType[]).map((type) => {
                      const Icon = activityIcons[type];
                      return (
                        <button
                          type="button"
                          key={type}
                          className={activityType === type ? "activityType activityType--active" : "activityType"}
                          onClick={() => setActivityType(type)}
                        >
                          <Icon size={14} />
                          {type}
                        </button>
                      );
                    })}
                  </div>
                  <textarea
                    required
                    rows={3}
                    value={activityContent}
                    onChange={(event) => setActivityContent(event.target.value)}
                    placeholder="Registre o que foi conversado, objeções e informações relevantes..."
                  />
                  <div className="composerFooter">
                    <input
                      value={activityResult}
                      onChange={(event) => setActivityResult(event.target.value)}
                      placeholder="Resultado / próximo passo"
                    />
                    <Button type="submit">
                      Registrar
                      <ArrowRight size={15} />
                    </Button>
                  </div>
                </form>
              </div>
            </section>

            <aside className="historyPanel">
              <div className="historyHeader">
                <div><span className="sectionEyebrow">TIMELINE</span><h3>Histórico</h3></div>
                <Badge>{selected.activities.length} registros</Badge>
              </div>

              <div className="timeline">
                {selected.activities.length === 0 ? (
                  <div className="timelineEmpty">
                    <BriefcaseBusiness size={20} />
                    <strong>Sem interações ainda</strong>
                    <span>Registre a primeira conversa com este cliente.</span>
                  </div>
                ) : null}

                {selected.activities.map((activity) => {
                  const Icon = activityIcons[activity.type];
                  return (
                    <div className="timelineItem" key={activity.id}>
                      <div className="timelineIcon"><Icon size={15} /></div>
                      <div className="timelineBody">
                        <div className="timelineTop">
                          <strong>{activity.type}</strong>
                          <span>{activity.date}</span>
                        </div>
                        <p>{activity.content}</p>
                        <div className="timelineResult">
                          <CheckCircle2 size={13} />
                          {activity.result}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </aside>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}
