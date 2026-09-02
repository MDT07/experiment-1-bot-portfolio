"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import type { LabLocale, LabMode, LabResponse } from "@/lib/ai-lab";
import styles from "./AiSystemsLab.module.css";

type Capability = {
  configured: boolean;
  public: boolean;
  provider: string;
  model: string;
  limits: { requests: number; windowMinutes: number };
};

const copy = {
  en: {
    back: "Portfolio",
    locale: "RU",
    eyebrow: "EXPERIMENT 01 / LIVE SYSTEMS LAB",
    title: "Design the operator before writing the bot.",
    intro:
      "A bounded NVIDIA-powered architecture lab for Telegram bots, web assistants, service agents, and visual-reference operators. It proposes a system; it never performs external actions.",
    provider: "Inference core",
    boundary: "Execution boundary",
    boundaryValue: "Architecture only · no write tools",
    statusReady: "Live endpoint ready",
    statusClosed: "Controlled preview",
    formTitle: "Describe a real task",
    mode: "System type",
    modes: {
      bot: "Channel bot",
      assistant: "Agent assistant",
      reference: "Visual reference operator",
    },
    channel: "Demo surface",
    channelPlaceholder: "Web AI Lab",
    surfaceNote: "The browser lab works on its own. Telegram, dashboards, and external channels are optional extensions.",
    autonomy: "Action policy",
    advisory: "Advisory only",
    approval: "Human approval for every write action",
    brief: "Brief",
    briefPlaceholder:
      "Example: qualify incoming website requests, retrieve verified service information, draft the next action, and escalate uncertain cases to a human.",
    submit: "Generate system architecture",
    working: "Architecting…",
    limit: "Public demo limit: 3 generations per 10 minutes. No account data is requested or retained by this interface.",
    result: "Generated architecture",
    journey: "User journey",
    loop: "Agent loop",
    tools: "Tools and permissions",
    guardrails: "Operational guardrails",
    script: "Portfolio demo script",
    evaluation: "Evaluation contract",
    noActions: "Architecture generated server-side. No message, tool, or external write action was executed.",
    standalone: "Open focused lab",
    errors: {
      demo_not_open: "The live endpoint is intentionally closed until production rate controls are enabled.",
      provider_not_configured: "The NVIDIA provider has not been configured on the server yet.",
      rate_limited: "The public demo limit has been reached. Try again after the reset window.",
      invalid_request: "Add a more specific brief of at least 24 characters.",
      origin_not_allowed: "This request origin is not allowed.",
      provider_auth_error: "The NVIDIA credential was rejected by the provider. The owner needs to replace it.",
      provider_request_rejected: "NVIDIA rejected this model request. The owner needs to review the selected model.",
      model_unavailable: "The selected NVIDIA model is unavailable for this account.",
      provider_unavailable: "NVIDIA is temporarily unavailable for this model. Try again later or select another model.",
      provider_timeout: "NVIDIA did not complete the request within the demo timeout.",
      provider_error: "The inference provider could not complete this run. Try again later.",
      invalid_response: "The provider returned an incomplete architecture.",
      request_too_large: "The submitted brief is too large.",
      unknown: "The architecture could not be generated.",
    },
  },
  ru: {
    back: "Портфолио",
    locale: "EN",
    eyebrow: "EXPERIMENT 01 / LIVE SYSTEMS LAB",
    title: "Сначала проектируем оператора. Затем пишем бота.",
    intro:
      "Ограниченная NVIDIA-лаборатория архитектуры для Telegram-ботов, web-ассистентов, сервисных агентов и операторов визуальных референсов. Она проектирует систему, но не выполняет внешние действия.",
    provider: "Inference-ядро",
    boundary: "Граница выполнения",
    boundaryValue: "Только архитектура · без write tools",
    statusReady: "Live endpoint готов",
    statusClosed: "Контролируемый preview",
    formTitle: "Опишите реальную задачу",
    mode: "Тип системы",
    modes: {
      bot: "Канальный бот",
      assistant: "Агент-ассистент",
      reference: "Оператор визуальных референсов",
    },
    channel: "Среда демонстрации",
    channelPlaceholder: "Web AI Lab",
    surfaceNote: "Лаборатория работает прямо в браузере. Telegram, dashboard и внешние каналы подключаются только при необходимости.",
    autonomy: "Политика действий",
    advisory: "Только рекомендации",
    approval: "Подтверждение человеком для каждого write-действия",
    brief: "Задача",
    briefPlaceholder:
      "Например: квалифицировать заявки на разработку сайта, находить проверенную информацию об услугах, готовить следующее действие и передавать сложные случаи человеку.",
    submit: "Собрать архитектуру системы",
    working: "Проектирование…",
    limit: "Лимит публичного demo: 3 генерации за 10 минут. Интерфейс не запрашивает и не сохраняет данные аккаунтов.",
    result: "Архитектура системы",
    journey: "Путь пользователя",
    loop: "Цикл агента",
    tools: "Инструменты и разрешения",
    guardrails: "Операционные ограничения",
    script: "Сценарий portfolio-demo",
    evaluation: "Контракт оценки",
    noActions: "Архитектура создана на сервере. Сообщения, инструменты и внешние write-действия не выполнялись.",
    standalone: "Открыть отдельную лабораторию",
    errors: {
      demo_not_open: "Live endpoint намеренно закрыт до подключения production rate controls.",
      provider_not_configured: "NVIDIA provider пока не настроен на сервере.",
      rate_limited: "Лимит публичного demo исчерпан. Повторите после окончания окна.",
      invalid_request: "Добавьте более конкретное описание длиной не менее 24 символов.",
      origin_not_allowed: "Источник запроса не разрешён.",
      provider_auth_error: "NVIDIA отклонил credential. Владельцу необходимо заменить API key.",
      provider_request_rejected: "NVIDIA отклонил запрос к модели. Владельцу нужно проверить выбранную модель.",
      model_unavailable: "Выбранная NVIDIA-модель недоступна для этого аккаунта.",
      provider_unavailable: "NVIDIA временно недоступен для этой модели. Повторите позднее или выберите другую модель.",
      provider_timeout: "NVIDIA не завершил запрос в пределах demo-timeout.",
      provider_error: "Inference provider не завершил запрос. Повторите позднее.",
      invalid_response: "Provider вернул неполную архитектуру.",
      request_too_large: "Описание превышает допустимый размер.",
      unknown: "Не удалось создать архитектуру.",
    },
  },
} as const;

type AiSystemsLabProps = {
  locale: LabLocale;
  embedded?: boolean;
};

function OrderedList({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <ol className={styles.orderedList}>
      {items.map((item, index) => (
        <li key={`${index}-${item}`}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <p>{item}</p>
        </li>
      ))}
    </ol>
  );
}

export default function AiSystemsLab({ locale, embedded = false }: AiSystemsLabProps) {
  const text = copy[locale];
  const [mode, setMode] = useState<LabMode>("assistant");
  const [channel, setChannel] = useState("Web AI Lab");
  const [autonomy, setAutonomy] = useState<"advisory" | "approval-gated">("approval-gated");
  const [brief, setBrief] = useState("");
  const [capability, setCapability] = useState<Capability | null>(null);
  const [result, setResult] = useState<LabResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const previousLanguage = document.documentElement.lang;
    document.documentElement.lang = locale;
    return () => {
      document.documentElement.lang = previousLanguage;
    };
  }, [locale]);

  useEffect(() => {
    let active = true;
    fetch("/api/labs/architect", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: Capability) => {
        if (active) setCapability(data);
      })
      .catch(() => {
        if (active) setCapability(null);
      });
    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const response = await fetch("/api/labs/architect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, mode, channel, autonomy, brief }),
      });
      const data = (await response.json()) as LabResponse | { error?: string };

      if (!response.ok || !("architecture" in data)) {
        const code = "error" in data && data.error ? data.error : "unknown";
        setError(text.errors[code as keyof typeof text.errors] || text.errors.unknown);
        return;
      }

      setResult(data);
    } catch {
      setError(text.errors.unknown);
    } finally {
      setLoading(false);
    }
  }

  const live = Boolean(capability?.configured && capability?.public);
  const homeHref = locale === "ru" ? "/ru" : "/";
  const localeHref = locale === "ru" ? "/labs" : "/ru/labs";
  const standaloneHref = locale === "ru" ? "/ru/labs" : "/labs";
  const ContentRoot = embedded ? "div" : "main";

  return (
    <div
      className={`${styles.shell} ${embedded ? styles.embedded : ""}`}
      id={embedded ? "live-lab" : undefined}
      data-portfolio-section={embedded ? "true" : undefined}
    >
      {!embedded && <div className={styles.scanline} aria-hidden="true" />}
      {!embedded && (
        <header className={styles.header}>
          <Link href={homeHref} className={styles.identity}>
            <span>E/S</span>
            <b>{text.back}</b>
          </Link>
          <div className={styles.headerMeta}>
            <span className={live ? styles.live : styles.closed}>{live ? text.statusReady : text.statusClosed}</span>
            <Link href={localeHref} hrefLang={locale === "ru" ? "en" : "ru"}>{text.locale}</Link>
          </div>
        </header>
      )}

      {embedded && (
        <div className={styles.embeddedHeader}>
          <span>LAB / LIVE SYSTEMS</span>
          <Link href={standaloneHref}>{text.standalone} ↗</Link>
        </div>
      )}

      <ContentRoot>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>{text.eyebrow}</p>
            <h1 id={embedded ? "live-lab-title" : undefined}>{text.title}</h1>
            <p className={styles.intro}>{text.intro}</p>
          </div>
          <div className={styles.systemPlate} aria-label="System boundary">
            <div>
              <span>{text.provider}</span>
              <b>{capability?.provider || "NVIDIA NIM"}</b>
              <small>{capability?.model || "server-side model routing"}</small>
            </div>
            <div>
              <span>{text.boundary}</span>
              <b>{text.boundaryValue}</b>
              <small>Server API · constrained output · observable failure</small>
            </div>
          </div>
        </section>

        <section className={styles.workspace}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formHeading}>
              <span>INPUT / 01</span>
              <h2>{text.formTitle}</h2>
            </div>

            <fieldset className={styles.modeField}>
              <legend>{text.mode}</legend>
              {(Object.keys(text.modes) as LabMode[]).map((value) => (
                <label key={value}>
                  <input
                    type="radio"
                    name="mode"
                    value={value}
                    checked={mode === value}
                    onChange={() => setMode(value)}
                  />
                  <span>{text.modes[value]}</span>
                </label>
              ))}
            </fieldset>

            <label className={styles.field}>
              <span>{text.channel}</span>
              <input
                value={channel}
                onChange={(event) => setChannel(event.target.value)}
                placeholder={text.channelPlaceholder}
                minLength={2}
                maxLength={80}
                required
              />
              <em className={styles.fieldHint}>{text.surfaceNote}</em>
            </label>

            <label className={styles.field}>
              <span>{text.autonomy}</span>
              <select value={autonomy} onChange={(event) => setAutonomy(event.target.value as typeof autonomy)}>
                <option value="advisory">{text.advisory}</option>
                <option value="approval-gated">{text.approval}</option>
              </select>
            </label>

            <label className={styles.field}>
              <span>{text.brief}</span>
              <textarea
                value={brief}
                onChange={(event) => setBrief(event.target.value)}
                placeholder={text.briefPlaceholder}
                minLength={24}
                maxLength={2000}
                rows={7}
                required
              />
              <small>{brief.length} / 2000</small>
            </label>

            <button className={styles.submit} type="submit" disabled={loading || !live}>
              <span>{loading ? text.working : text.submit}</span>
              <i aria-hidden="true">↗</i>
            </button>
            <p className={styles.limit}>{text.limit}</p>
            {error && <p className={styles.error} role="alert">{error}</p>}
          </form>

          <section className={styles.output} aria-live="polite" aria-busy={loading}>
            <div className={styles.outputHeading}>
              <span>OUTPUT / 02</span>
              <h2>{text.result}</h2>
            </div>

            {!result && !loading && (
              <div className={styles.idleOutput}>
                <span>01</span><span>02</span><span>03</span>
                <p>{live ? text.submit : text.statusClosed}</p>
              </div>
            )}

            {loading && <div className={styles.loader}><span /><span /><span /></div>}

            {result && (
              <article className={styles.result}>
                <p className={styles.resultModel}>{result.meta.provider} / {result.meta.model}</p>
                <h2>{result.architecture.title}</h2>
                <p className={styles.summary}>{result.architecture.summary}</p>

                <div className={styles.resultGrid}>
                  <section><h3>{text.journey}</h3><OrderedList items={result.architecture.userJourney} /></section>
                  <section><h3>{text.loop}</h3><OrderedList items={result.architecture.agentLoop} /></section>
                  <section className={styles.wideResult}>
                    <h3>{text.tools}</h3>
                    <div className={styles.tools}>
                      {result.architecture.tools.map((tool) => (
                        <div key={`${tool.name}-${tool.purpose}`}>
                          <b>{tool.name}</b><p>{tool.purpose}</p><span>{tool.permission}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                  <section><h3>{text.guardrails}</h3><OrderedList items={result.architecture.guardrails} /></section>
                  <section><h3>{text.script}</h3><OrderedList items={result.architecture.demoScript} /></section>
                  <section className={styles.wideResult}><h3>{text.evaluation}</h3><OrderedList items={result.architecture.evaluation} /></section>
                </div>
                <p className={styles.disclosure}>{text.noActions}</p>
              </article>
            )}
          </section>
        </section>
      </ContentRoot>

      {!embedded && (
        <footer className={styles.footer}>
          <span>EMIR SEMENOV / EXPERIMENT 01</span>
          <span>NVIDIA NIM / OWNER-CONTROLLED</span>
          <Link href={homeHref}>{text.back} ↑</Link>
        </footer>
      )}
    </div>
  );
}
