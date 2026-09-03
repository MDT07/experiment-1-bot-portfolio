"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import type {
  BotBlueprint,
  StudioBrief,
  StudioLocale,
  StudioProject,
  StudioStatus,
} from "@/lib/bot-studio";
import styles from "./AiSystemsLab.module.css";

type AiSystemsLabProps = {
  locale: StudioLocale;
  embedded?: boolean;
};

type ChatMessage = { role: "user" | "assistant"; content: string };

const capabilityOptions = {
  en: [
    "Answer service questions",
    "Collect structured requirements",
    "Recommend the next action",
    "Qualify incoming leads",
    "Search an approved knowledge base",
    "Escalate to a human",
  ],
  ru: [
    "Отвечать на вопросы об услугах",
    "Собирать требования по структуре",
    "Рекомендовать следующий шаг",
    "Квалифицировать обращения",
    "Искать в одобренной базе знаний",
    "Передавать диалог человеку",
  ],
};

const copy = {
  en: {
    eyebrow: "EXPERIMENT 01 / BOT CONSTRUCTION SYSTEM",
    title: "Describe one job. Leave with one working bot blueprint.",
    intro: "A verified visitor gets one successful construction run and five preview messages. The result is a bounded studio artifact—not a claim that external channels are already connected.",
    status: "System state",
    ready: "Ready",
    closed: "Closed",
    signIn: "Verify identity",
    signOut: "Sign out",
    owner: "Owner / unlimited",
    guest: "Guest / one build",
    used: "Generation already used",
    setup: "Studio is closed while the OpenClaw Gateway and exact Kimi Code model are being reviewed.",
    steps: ["Purpose", "Behavior", "Boundaries"],
    purpose: "What exact job should the bot perform?",
    purposePlaceholder: "Qualify leads for a creative web studio, explain services, collect a clear project brief, and prepare a human handoff.",
    audience: "Primary audience",
    audiencePlaceholder: "Founders and product teams",
    channel: "Target surface",
    aiCore: "AI core",
    aiOn: "Enabled / grounded generation",
    aiOff: "Disabled / deterministic rules",
    language: "Conversation language",
    tone: "Voice and tone",
    capabilities: "Required capabilities",
    knowledge: "Approved knowledge",
    knowledgePlaceholder: "Products, policies, FAQs, constraints, or facts this preview may use. Do not paste secrets or personal data.",
    escalation: "Human handoff rule",
    escalationPlaceholder: "Escalate pricing commitments, legal questions, and requests outside the supplied knowledge.",
    autonomy: "Operating boundary",
    advisory: "Advisory only",
    approval: "Approval before external action",
    back: "Back",
    next: "Continue",
    generate: "Construct bot studio",
    generating: "Model is constructing the system…",
    oneShot: "A failed provider run does not consume your generation.",
    studio: "Generated studio",
    newBuild: "New owner build",
    chat: "Preview channel",
    graph: "Capability graph",
    send: "Send",
    messagePlaceholder: "Test one realistic user message",
    messagesLeft: "preview messages left",
    mode: "Runtime mode",
    capabilitiesLabel: "Capabilities",
    knowledgeLabel: "Knowledge",
    guardrails: "Controls",
    limitations: "Honest limits",
    evaluations: "Evaluation contract",
    graphEdges: "Relationships",
    noKnowledge: "No external knowledge source was supplied.",
    providerNote: "No external action is executed by this preview.",
    usage: "Measured usage",
    inputTokens: "Input",
    outputTokens: "Output",
    totalTokens: "Total",
    cachedTokens: "Cached input",
    cashCost: "Cash charge",
    includedQuota: "Included membership quota / not itemized per request",
    usageUnavailable: "The provider did not report token usage.",
    chatClosed: "Preview chat is disabled for the one-request test.",
    standalone: "Open focused studio",
    home: "Back to portfolio",
    locale: "RU",
    errors: {
      authentication_required: "Verify your identity before generating the studio.",
      already_used: "This identity has already used its one successful generation.",
      generation_in_progress: "A generation is already in progress for this identity.",
      preview_limit_reached: "The five-message preview limit has been reached.",
      studio_storage_not_configured: "Studio identity and storage are not configured yet.",
      demo_not_open: "Studio generation is temporarily closed while the runtime is being prepared.",
      provider_not_configured: "The OpenClaw runtime and reviewed model are not connected yet.",
      provider_auth_error: "The private Studio Bridge could not authenticate to its runtime.",
      provider_network_error: "The private Studio Bridge is temporarily unreachable.",
      studio_storage_error: "The studio could not persist this run. Your generation remains available.",
      provider_timeout: "The model did not finish in the demo timeout. Your generation remains available.",
      provider_unavailable: "The model is temporarily unavailable. Your generation remains available.",
      provider_request_rejected: "The selected model rejected this request. Your generation remains available.",
      invalid_response: "The model returned an invalid blueprint. Your generation remains available.",
      rate_limited: "The model or demo budget is temporarily rate-limited.",
      owner_test_only: "The first measured test is restricted to the owner account.",
      test_budget_exhausted: "The single-request test budget has already been used.",
      chat_not_open: "Preview chat is disabled for the single-request test.",
      unknown: "The studio could not complete the request. Try again later.",
    },
  },
  ru: {
    eyebrow: "ЭКСПЕРИМЕНТ 01 / СИСТЕМА КОНСТРУИРОВАНИЯ БОТОВ",
    title: "Опишите одну задачу. Получите рабочий blueprint бота.",
    intro: "Подтверждённый посетитель получает одну успешную сборку и пять сообщений для проверки. Результат — ограниченный Studio-артефакт, а не заявление о подключённых внешних каналах.",
    status: "Состояние системы",
    ready: "Готово",
    closed: "Закрыто",
    signIn: "Подтвердить личность",
    signOut: "Выйти",
    owner: "Владелец / без лимита",
    guest: "Гость / одна сборка",
    used: "Генерация уже использована",
    setup: "Studio закрыта, пока мы проверяем OpenClaw Gateway и выбираем точную модель Kimi Code.",
    steps: ["Назначение", "Поведение", "Границы"],
    purpose: "Какую точную задачу должен выполнять бот?",
    purposePlaceholder: "Квалифицировать заявки web-студии, объяснять услуги, собирать понятный бриф и готовить передачу специалисту.",
    audience: "Основная аудитория",
    audiencePlaceholder: "Основатели и продуктовые команды",
    channel: "Целевая среда",
    aiCore: "ИИ-ядро",
    aiOn: "Включено / grounded generation",
    aiOff: "Выключено / детерминированные правила",
    language: "Язык диалога",
    tone: "Голос и тон",
    capabilities: "Необходимые возможности",
    knowledge: "Разрешённые знания",
    knowledgePlaceholder: "Продукты, правила, FAQ, ограничения и факты, которые может использовать preview. Не добавляйте секреты или персональные данные.",
    escalation: "Правило передачи человеку",
    escalationPlaceholder: "Передавать вопросы о цене, юридические запросы и темы вне предоставленных знаний.",
    autonomy: "Граница действий",
    advisory: "Только рекомендации",
    approval: "Подтверждение перед внешним действием",
    back: "Назад",
    next: "Продолжить",
    generate: "Создать Bot Studio",
    generating: "Модель конструирует систему…",
    oneShot: "Ошибка provider не расходует вашу генерацию.",
    studio: "Созданная студия",
    newBuild: "Новая owner-сборка",
    chat: "Preview-канал",
    graph: "Граф возможностей",
    send: "Отправить",
    messagePlaceholder: "Проверьте одно реалистичное сообщение",
    messagesLeft: "сообщений осталось",
    mode: "Режим runtime",
    capabilitiesLabel: "Возможности",
    knowledgeLabel: "Знания",
    guardrails: "Контроли",
    limitations: "Честные ограничения",
    evaluations: "Контракт проверки",
    graphEdges: "Связи",
    noKnowledge: "Внешний источник знаний не был предоставлен.",
    providerNote: "Preview не выполняет внешних действий.",
    usage: "Измеренный расход",
    inputTokens: "Вход",
    outputTokens: "Выход",
    totalTokens: "Всего",
    cachedTokens: "Из кэша",
    cashCost: "Денежное списание",
    includedQuota: "Включено в membership-квоту / цена запроса не детализируется",
    usageUnavailable: "Provider не вернул данные о токенах.",
    chatClosed: "Preview-чат отключён на время теста с одним запросом.",
    standalone: "Открыть отдельную Studio",
    home: "Вернуться в портфолио",
    locale: "EN",
    errors: {
      authentication_required: "Подтвердите личность перед созданием Studio.",
      already_used: "Эта личность уже использовала одну успешную генерацию.",
      generation_in_progress: "Для этой личности уже выполняется генерация.",
      preview_limit_reached: "Лимит из пяти preview-сообщений исчерпан.",
      studio_storage_not_configured: "Identity и storage Studio пока не настроены.",
      demo_not_open: "Генерация временно закрыта на время подготовки runtime.",
      provider_not_configured: "OpenClaw runtime и проверенная модель пока не подключены.",
      provider_auth_error: "Закрытый Studio Bridge не смог авторизоваться в runtime.",
      provider_network_error: "Закрытый Studio Bridge временно недоступен.",
      studio_storage_error: "Studio не смогла сохранить запуск. Генерация остаётся доступной.",
      provider_timeout: "Модель не завершила запрос вовремя. Генерация остаётся доступной.",
      provider_unavailable: "Модель временно недоступна. Генерация остаётся доступной.",
      provider_request_rejected: "Выбранная модель отклонила запрос. Генерация остаётся доступной.",
      invalid_response: "Модель вернула некорректный blueprint. Генерация остаётся доступной.",
      rate_limited: "Временный rate limit модели или demo-бюджета.",
      owner_test_only: "Первый измеренный тест доступен только аккаунту владельца.",
      test_budget_exhausted: "Лимит теста из одного запроса уже использован.",
      chat_not_open: "Preview-чат отключён для теста с одним запросом.",
      unknown: "Studio не смогла завершить запрос. Повторите позднее.",
    },
  },
};

function initialBrief(locale: StudioLocale): StudioBrief {
  return {
    locale,
    purpose: "",
    audience: locale === "ru" ? "Основатели и продуктовые команды" : "Founders and product teams",
    channel: "web",
    aiCore: true,
    language: locale === "ru" ? "Русский" : "English",
    tone: locale === "ru" ? "Спокойный, точный, профессиональный" : "Calm, precise, professional",
    autonomy: "approval-gated",
    capabilities: capabilityOptions[locale].slice(0, 2),
    knowledge: "",
    escalation: "",
  };
}

function BlueprintList({ title, items }: { title: string; items: string[] }) {
  return (
    <section className={styles.dataGroup}>
      <h3>{title}</h3>
      <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
    </section>
  );
}

function StudioGraph({ blueprint, labels }: { blueprint: BotBlueprint; labels: typeof copy.en }) {
  const grouped = useMemo(() => {
    return blueprint.graph.nodes.reduce<Record<string, typeof blueprint.graph.nodes>>((acc, node) => {
      (acc[node.kind] ||= []).push(node);
      return acc;
    }, {});
  }, [blueprint]);

  return (
    <div className={styles.graphPanel}>
      <div className={styles.graphGrid}>
        {Object.entries(grouped).map(([kind, nodes], groupIndex) => (
          <div className={styles.graphLane} key={kind}>
            <span>{String(groupIndex + 1).padStart(2, "0")} / {kind}</span>
            {nodes.map((node) => (
              <article key={node.id} data-kind={node.kind}>
                <b>{node.label}</b>
                <p>{node.detail}</p>
              </article>
            ))}
          </div>
        ))}
      </div>
      <details className={styles.edgeList}>
        <summary>{labels.graphEdges} / {blueprint.graph.edges.length}</summary>
        <ul>
          {blueprint.graph.edges.map((edge, index) => (
            <li key={`${edge.source}-${edge.target}-${index}`}>
              <code>{edge.source}</code><span>→ {edge.label} →</span><code>{edge.target}</code>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}

export default function AiSystemsLab({ locale, embedded = false }: AiSystemsLabProps) {
  const text = copy[locale];
  const [step, setStep] = useState(0);
  const [brief, setBrief] = useState<StudioBrief>(() => initialBrief(locale));
  const [status, setStatus] = useState<StudioStatus | null>(null);
  const [project, setProject] = useState<StudioProject | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    let active = true;
    fetch("/api/labs/architect", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: StudioStatus) => {
        if (!active) return;
        setStatus(data);
        if (data.project) {
          setProject(data.project);
          setMessages([{ role: "assistant", content: data.project.blueprint.greeting }]);
          setRemaining(data.owner ? null : Math.max(0, data.previewMessageLimit - data.project.previewMessagesUsed));
        }
      })
      .catch(() => active && setStatus(null));
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const previous = document.documentElement.lang;
    document.documentElement.lang = locale;
    return () => { document.documentElement.lang = previous; };
  }, [locale]);

  function toggleCapability(capability: string) {
    setBrief((current) => ({
      ...current,
      capabilities: current.capabilities.includes(capability)
        ? current.capabilities.filter((item) => item !== capability)
        : [...current.capabilities, capability].slice(0, 8),
    }));
  }

  async function generate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await fetch("/api/labs/architect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(brief),
      });
      const data = await response.json() as { project?: StudioProject; error?: string };
      if (!response.ok || !data.project) {
        const code = data.error || "unknown";
        setError(text.errors[code as keyof typeof text.errors] || text.errors.unknown);
        return;
      }
      setProject(data.project);
      setMessages([{ role: "assistant", content: data.project.blueprint.greeting }]);
      setRemaining(status?.owner ? null : status?.previewMessageLimit ?? 5);
      setStatus((current) => current ? { ...current, generationAvailable: current.owner, project: data.project! } : current);
    } catch {
      setError(text.errors.unknown);
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!project || !chatInput.trim()) return;
    const message = chatInput.trim();
    setChatInput("");
    setError(null);
    setMessages((current) => [...current, { role: "user", content: message }]);
    setChatLoading(true);
    try {
      const response = await fetch("/api/labs/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: project.id, message }),
      });
      const data = await response.json() as { answer?: string; remaining?: number | null; error?: string };
      if (!response.ok || !data.answer) {
        const code = data.error || "unknown";
        setError(text.errors[code as keyof typeof text.errors] || text.errors.unknown);
        return;
      }
      setMessages((current) => [...current, { role: "assistant", content: data.answer! }]);
      if (typeof data.remaining === "number") setRemaining(data.remaining);
    } catch {
      setError(text.errors.unknown);
    } finally {
      setChatLoading(false);
    }
  }

  const live = Boolean(status?.configured && status?.public);
  const standaloneHref = locale === "ru" ? "/ru/labs" : "/labs";
  const localeHref = locale === "ru" ? "/labs" : "/ru/labs";
  const signInHref = `/auth/sign-in?next=${encodeURIComponent(standaloneHref)}`;

  return (
    <div
      className={`${styles.shell} ${embedded ? styles.embedded : ""}`}
      id={embedded ? "live-lab" : undefined}
      data-portfolio-section={embedded ? "true" : undefined}
    >
      <header className={styles.header}>
        <Link href={locale === "ru" ? "/ru" : "/"} className={styles.identity}>
          <span>E/S</span><b>{embedded ? text.standalone : text.home}</b>
        </Link>
        <div className={styles.headerState}>
          <span className={live ? styles.live : styles.closed}>{live ? text.ready : text.closed}</span>
          <Link href={localeHref} hrefLang={locale === "ru" ? "en" : "ru"}>{text.locale}</Link>
        </div>
      </header>

      {!project ? (
        <main className={styles.builder}>
          <section className={styles.builderIntro}>
            <p>{text.eyebrow}</p>
            <h1>{text.title}</h1>
            <div className={styles.introMeta}>
              <p>{text.intro}</p>
              <dl>
                <div><dt>{text.status}</dt><dd>{live ? text.ready : text.closed}</dd></div>
                <div><dt>ACCESS</dt><dd>{status?.owner ? text.owner : status?.signedIn ? text.guest : "UNVERIFIED"}</dd></div>
                <div><dt>MODEL</dt><dd>{status?.model || "—"}</dd></div>
              </dl>
            </div>
          </section>

          <form className={styles.builderForm} onSubmit={generate}>
            <nav className={styles.stepNav} aria-label="Studio setup steps">
              {text.steps.map((label, index) => (
                <button key={label} type="button" onClick={() => setStep(index)} aria-current={step === index ? "step" : undefined}>
                  <span>0{index + 1}</span>{label}
                </button>
              ))}
            </nav>

            <div className={styles.formCanvas}>
              {step === 0 && (
                <div className={styles.formStage}>
                  <label className={styles.wideField}>
                    <span>{text.purpose}</span>
                    <textarea required minLength={24} maxLength={1200} value={brief.purpose} onChange={(event) => setBrief({ ...brief, purpose: event.target.value })} placeholder={text.purposePlaceholder} />
                    <small>{brief.purpose.length} / 1200</small>
                  </label>
                  <label>
                    <span>{text.audience}</span>
                    <input required value={brief.audience} onChange={(event) => setBrief({ ...brief, audience: event.target.value })} placeholder={text.audiencePlaceholder} />
                  </label>
                  <label>
                    <span>{text.channel}</span>
                    <select value={brief.channel} onChange={(event) => setBrief({ ...brief, channel: event.target.value as StudioBrief["channel"] })}>
                      <option value="web">Web</option><option value="telegram">Telegram</option><option value="whatsapp">WhatsApp</option><option value="instagram">Instagram</option><option value="concept">Concept only</option>
                    </select>
                  </label>
                </div>
              )}

              {step === 1 && (
                <div className={styles.formStage}>
                  <fieldset className={styles.modeSwitch}>
                    <legend>{text.aiCore}</legend>
                    <button type="button" aria-pressed={brief.aiCore} onClick={() => setBrief({ ...brief, aiCore: true })}>{text.aiOn}</button>
                    <button type="button" aria-pressed={!brief.aiCore} onClick={() => setBrief({ ...brief, aiCore: false })}>{text.aiOff}</button>
                  </fieldset>
                  <label><span>{text.language}</span><input value={brief.language} onChange={(event) => setBrief({ ...brief, language: event.target.value })} /></label>
                  <label><span>{text.tone}</span><input value={brief.tone} onChange={(event) => setBrief({ ...brief, tone: event.target.value })} /></label>
                  <fieldset className={styles.capabilityPicker}>
                    <legend>{text.capabilities}</legend>
                    {capabilityOptions[locale].map((capability) => (
                      <button type="button" key={capability} aria-pressed={brief.capabilities.includes(capability)} onClick={() => toggleCapability(capability)}>
                        <span>{brief.capabilities.includes(capability) ? "×" : "+"}</span>{capability}
                      </button>
                    ))}
                  </fieldset>
                </div>
              )}

              {step === 2 && (
                <div className={styles.formStage}>
                  <label className={styles.wideField}><span>{text.knowledge}</span><textarea maxLength={1200} value={brief.knowledge} onChange={(event) => setBrief({ ...brief, knowledge: event.target.value })} placeholder={text.knowledgePlaceholder} /></label>
                  <label className={styles.wideField}><span>{text.escalation}</span><textarea maxLength={500} value={brief.escalation} onChange={(event) => setBrief({ ...brief, escalation: event.target.value })} placeholder={text.escalationPlaceholder} /></label>
                  <fieldset className={styles.autonomy}><legend>{text.autonomy}</legend>
                    <label><input type="radio" checked={brief.autonomy === "advisory"} onChange={() => setBrief({ ...brief, autonomy: "advisory" })} />{text.advisory}</label>
                    <label><input type="radio" checked={brief.autonomy === "approval-gated"} onChange={() => setBrief({ ...brief, autonomy: "approval-gated" })} />{text.approval}</label>
                  </fieldset>
                </div>
              )}
            </div>

            {!status?.configured && <p className={styles.setupNotice}>{text.setup}</p>}
            {status?.signedIn && !status.generationAvailable && <p className={styles.setupNotice}>{text.used}</p>}
            {error && <p className={styles.error} role="alert">{error}</p>}

            <footer className={styles.formFooter}>
              <p>{text.oneShot}</p>
              <div>
                {step > 0 && <button type="button" onClick={() => setStep((current) => current - 1)}>{text.back}</button>}
                {!status?.signedIn ? (
                  <Link href={signInHref}>{text.signIn} ↗</Link>
                ) : step < 2 ? (
                  <button type="button" onClick={() => setStep((current) => current + 1)}>{text.next} →</button>
                ) : (
                  <button type="submit" disabled={loading || !live || !status.generationAvailable || brief.capabilities.length === 0 || brief.purpose.trim().length < 24}>
                    {loading ? text.generating : text.generate}
                  </button>
                )}
              </div>
            </footer>
          </form>
        </main>
      ) : (
        <main className={styles.studio}>
          <header className={styles.studioTitle}>
            <div><p>{text.studio} / {project.id.slice(0, 8)}</p><h1>{project.blueprint.name}</h1></div>
            <p>{project.blueprint.oneLine}</p>
            <div className={styles.studioActions}>
              {status?.owner && <button type="button" onClick={() => { setProject(null); setMessages([]); setStep(0); }}>{text.newBuild}</button>}
              <form action="/auth/sign-out" method="post"><button type="submit">{text.signOut}</button></form>
            </div>
          </header>

          <section className={styles.studioGrid}>
            <aside className={styles.blueprintRail}>
              <div className={styles.modeCard}><span>{text.mode}</span><b>{project.blueprint.mode === "ai" ? "AI / GROUNDED" : "RULES / DETERMINISTIC"}</b><p>{project.blueprint.identity}</p></div>
              <section className={styles.usageCard} aria-label={text.usage}>
                <h3>{text.usage}</h3>
                {project.generationUsage?.reported ? (
                  <>
                    <dl>
                      <div><dt>{text.inputTokens}</dt><dd>{project.generationUsage.inputTokens.toLocaleString()}</dd></div>
                      <div><dt>{text.outputTokens}</dt><dd>{project.generationUsage.outputTokens.toLocaleString()}</dd></div>
                      <div><dt>{text.totalTokens}</dt><dd>{project.generationUsage.totalTokens.toLocaleString()}</dd></div>
                      <div><dt>{text.cachedTokens}</dt><dd>{project.generationUsage.cachedInputTokens.toLocaleString()}</dd></div>
                    </dl>
                    <p><span>{text.cashCost}</span>{project.generationUsage.estimatedCostUsd === null
                      ? text.includedQuota
                      : `$${project.generationUsage.estimatedCostUsd.toFixed(6)} USD`}</p>
                  </>
                ) : <p>{text.usageUnavailable}</p>}
              </section>
              <BlueprintList title={text.capabilitiesLabel} items={project.blueprint.capabilities} />
              <BlueprintList title={text.knowledgeLabel} items={project.blueprint.knowledgeDomains.length ? project.blueprint.knowledgeDomains : [text.noKnowledge]} />
              <BlueprintList title={text.limitations} items={project.blueprint.limitations} />
            </aside>

            <section className={styles.chatPanel} aria-label={text.chat}>
              <header><span>{text.chat}</span><b>{remaining === null ? "∞" : remaining} {text.messagesLeft}</b></header>
              <div className={styles.transcript} aria-live="polite">
                {messages.map((message, index) => (
                  <article key={`${message.role}-${index}`} data-role={message.role}>
                    <span>{message.role === "assistant" ? project.blueprint.name : "YOU"}</span>
                    <p>{message.content}</p>
                  </article>
                ))}
                {chatLoading && <article data-role="assistant"><span>{project.blueprint.name}</span><p>…</p></article>}
              </div>
              <form onSubmit={sendMessage} className={styles.chatComposer}>
                <label htmlFor="studio-chat" className="sr-only">{text.messagePlaceholder}</label>
                <textarea id="studio-chat" required maxLength={1000} value={chatInput} onChange={(event) => setChatInput(event.target.value)} placeholder={status?.chatAvailable ? text.messagePlaceholder : text.chatClosed} disabled={chatLoading || remaining === 0 || !status?.chatAvailable} />
                <button type="submit" disabled={chatLoading || !chatInput.trim() || remaining === 0 || !status?.chatAvailable}>{text.send} ↑</button>
              </form>
              {error && <p className={styles.error} role="alert">{error}</p>}
              <footer>{text.providerNote}</footer>
            </section>

            <aside className={styles.intelligenceRail}>
              <header><span>{text.graph}</span><b>{project.blueprint.graph.nodes.length} NODES</b></header>
              <StudioGraph blueprint={project.blueprint} labels={text} />
              <BlueprintList title={text.guardrails} items={project.blueprint.guardrails} />
              <BlueprintList title={text.evaluations} items={project.blueprint.evaluationScenarios} />
            </aside>
          </section>
        </main>
      )}
      <footer className={styles.legalFooter}>
        <span>EMIR SEMENOV / BOT STUDIO</span>
        <nav aria-label="Legal">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <a href="mailto:emirsemenov@yahoo.com">Contact</a>
        </nav>
      </footer>
    </div>
  );
}
