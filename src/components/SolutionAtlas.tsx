"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  catalogByLocale,
  solutionCategories,
  type CatalogLocale,
  type SolutionCategory,
} from "@/lib/solution-catalog";
import styles from "./SolutionAtlas.module.css";

type SolutionAtlasProps = {
  locale: CatalogLocale;
  embedded?: boolean;
};

const copy = {
  en: {
    eyebrow: "EXPERIMENT 01 / IMPLEMENTATION CATALOG",
    title: "Choose the system before choosing the model.",
    intro:
      "Eight prepared architectures for real business workflows. Each blueprint separates channel behavior, business state, data, optional intelligence, controls, and delivery work.",
    status: "STATIC / NO MODEL CALLS",
    count: "solution blueprints",
    category: "Filter by business task",
    channel: "Channel",
    allChannels: "All channels",
    directory: "System directory",
    selected: "Selected architecture",
    audience: "Designed for",
    result: "Designed outcome",
    route: "Operating route",
    functions: "Functional scope",
    stack: "Delivery stack",
    models: "Optional intelligence layer",
    modelNote:
      "Architecture options only. No provider is connected and no request is sent. Exact availability, pricing, data controls, and regional access must be verified before implementation.",
    provider: "Provider",
    model: "Model / runtime",
    use: "Assigned role",
    fit: "Use when",
    integrations: "Integration surface",
    controls: "Production controls",
    delivery: "Build package",
    deterministic: "The business workflow remains usable without a model. AI is added only where evaluation proves a measurable benefit.",
    cta: "Discuss this architecture",
    standalone: "Open systems catalog",
    home: "Back to portfolio",
    language: "RU",
    referenceDate: "MODEL REFERENCE / 03 SEP 2026",
    legal: "Concept architecture — not a live third-party integration",
  },
  ru: {
    eyebrow: "ЭКСПЕРИМЕНТ 01 / КАТАЛОГ РЕАЛИЗАЦИЙ",
    title: "Сначала система. Затем модель.",
    intro:
      "Восемь подготовленных архитектур для реальных бизнес-процессов. Каждый blueprint разделяет поведение канала, бизнес-состояние, данные, опциональный интеллект, контроль и этапы реализации.",
    status: "STATIC / БЕЗ ВЫЗОВОВ МОДЕЛИ",
    count: "готовых архитектур",
    category: "Фильтр по бизнес-задаче",
    channel: "Канал",
    allChannels: "Все каналы",
    directory: "Каталог систем",
    selected: "Выбранная архитектура",
    audience: "Для кого",
    result: "Проектный результат",
    route: "Рабочий маршрут",
    functions: "Функциональный контур",
    stack: "Технологический стек",
    models: "Опциональный интеллектуальный слой",
    modelNote:
      "Это варианты архитектуры. Ни один provider не подключён, запросы не отправляются. Доступность, стоимость, data controls и региональные ограничения проверяются перед реализацией.",
    provider: "Provider",
    model: "Модель / runtime",
    use: "Назначенная роль",
    fit: "Когда применять",
    integrations: "Контур интеграций",
    controls: "Production-контроли",
    delivery: "Состав разработки",
    deterministic: "Бизнес-процесс остаётся работоспособным без модели. AI добавляется только там, где evaluation подтверждает измеримую пользу.",
    cta: "Обсудить эту архитектуру",
    standalone: "Открыть каталог систем",
    home: "Вернуться в портфолио",
    language: "EN",
    referenceDate: "MODEL REFERENCE / 03 SEP 2026",
    legal: "Концептуальная архитектура — не активная интеграция с третьими сторонами",
  },
};

function AtlasContent({ locale, embedded }: SolutionAtlasProps) {
  const text = copy[locale];
  const catalog = catalogByLocale[locale];
  const [category, setCategory] = useState<"all" | SolutionCategory>("all");
  const [channel, setChannel] = useState("all");
  const [selectedId, setSelectedId] = useState(catalog[0].id);

  const channels = useMemo(
    () => Array.from(new Set(catalog.flatMap((solution) => solution.channels))).sort(),
    [catalog],
  );

  const filtered = useMemo(
    () => catalog.filter((solution) => {
      const matchesCategory = category === "all" || solution.category === category;
      const matchesChannel = channel === "all" || solution.channels.includes(channel);
      return matchesCategory && matchesChannel;
    }),
    [catalog, category, channel],
  );

  const selected = filtered.find((solution) => solution.id === selectedId) ?? filtered[0] ?? catalog[0];
  const localeHref = locale === "ru" ? "/labs" : "/ru/labs";
  const homeHref = locale === "ru" ? "/ru" : "/";
  const subject = encodeURIComponent(`${selected.code} — ${selected.title}`);

  useEffect(() => {
    const previous = document.documentElement.lang;
    document.documentElement.lang = locale;
    return () => {
      document.documentElement.lang = previous;
    };
  }, [locale]);

  return (
    <>
      <header className={styles.header}>
        <Link href={homeHref} className={styles.identity}>
          <span>E/S</span>
          <b>{embedded ? text.standalone : text.home}</b>
        </Link>
        <div className={styles.headerState}>
          <span>{text.status}</span>
          <Link href={localeHref} hrefLang={locale === "ru" ? "en" : "ru"}>{text.language}</Link>
        </div>
      </header>

      <div className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>{text.eyebrow}</p>
          {embedded ? <h2>{text.title}</h2> : <h1>{text.title}</h1>}
        </div>
        <div className={styles.heroMeta}>
          <p>{text.intro}</p>
          <dl>
            <div><dt>INDEX</dt><dd>{String(catalog.length).padStart(2, "0")} / {text.count}</dd></div>
            <div><dt>RUNTIME</dt><dd>STATIC / CLIENT-SIDE</dd></div>
            <div><dt>AI</dt><dd>OPTIONAL / NOT CONNECTED</dd></div>
          </dl>
        </div>
      </div>

      <section className={styles.filters} aria-label={text.category}>
        <div className={styles.filterGroup}>
          <span>{text.category}</span>
          <div>
            {solutionCategories.map((item) => (
              <button
                type="button"
                key={item.id}
                aria-pressed={category === item.id}
                onClick={() => setCategory(item.id)}
              >
                {item.label[locale]}
              </button>
            ))}
          </div>
        </div>
        <label className={styles.channelFilter}>
          <span>{text.channel}</span>
          <select value={channel} onChange={(event) => setChannel(event.target.value)}>
            <option value="all">{text.allChannels}</option>
            {channels.map((item) => <option value={item} key={item}>{item}</option>)}
          </select>
        </label>
      </section>

      <div className={styles.catalogGrid}>
        <aside className={styles.directory} aria-label={text.directory}>
          <header><span>{text.directory}</span><b>{String(filtered.length).padStart(2, "0")}</b></header>
          <div className={styles.directoryList}>
            {filtered.map((solution) => (
              <button
                type="button"
                className={solution.id === selected.id ? styles.activeCard : ""}
                aria-pressed={solution.id === selected.id}
                onClick={() => setSelectedId(solution.id)}
                key={solution.id}
              >
                <span>{solution.code}</span>
                <b>{solution.shortTitle}</b>
                <small>{solution.channels.join(" · ")}</small>
                <i aria-hidden="true">↗</i>
              </button>
            ))}
          </div>
        </aside>

        <article className={styles.blueprint} key={selected.id} aria-live="polite">
          <header className={styles.blueprintHeader}>
            <div>
              <p><span>{text.selected}</span>{selected.code}</p>
              <h2>{selected.title}</h2>
              <p className={styles.summary}>{selected.summary}</p>
            </div>
            <div className={styles.channelTags} aria-label={text.channel}>
              {selected.channels.map((item) => <span key={item}>{item}</span>)}
            </div>
          </header>

          <div className={styles.definitionGrid}>
            <section><span>{text.audience}</span><p>{selected.audience}</p></section>
            <section><span>{text.result}</span><p>{selected.outcome}</p></section>
          </div>

          <section className={styles.flowSection}>
            <header><span>01</span><h3>{text.route}</h3></header>
            <ol className={styles.flow}>
              {selected.flow.map((item, index) => (
                <li key={item}>
                  <i>{String(index + 1).padStart(2, "0")}</i>
                  <b>{item}</b>
                  {index < selected.flow.length - 1 && <span aria-hidden="true">→</span>}
                </li>
              ))}
            </ol>
          </section>

          <div className={styles.scopeGrid}>
            <section className={styles.listSection}>
              <header><span>02</span><h3>{text.functions}</h3></header>
              <ul>{selected.functions.map((item, index) => <li key={item}><i>{String(index + 1).padStart(2, "0")}</i>{item}</li>)}</ul>
            </section>
            <section className={styles.listSection}>
              <header><span>03</span><h3>{text.controls}</h3></header>
              <ul>{selected.controls.map((item, index) => <li key={item}><i>C{index + 1}</i>{item}</li>)}</ul>
            </section>
          </div>

          <section className={styles.stackSection}>
            <header><span>04</span><h3>{text.stack}</h3></header>
            <div className={styles.stackGrid}>
              {selected.stack.map((group) => (
                <article key={group.label}>
                  <span>{group.label}</span>
                  <ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
                </article>
              ))}
            </div>
            <div className={styles.integrations}>
              <span>{text.integrations}</span>
              <div>{selected.integrations.map((item) => <b key={item}>{item}</b>)}</div>
            </div>
          </section>

          <section className={styles.modelSection}>
            <header>
              <div><span>05</span><h3>{text.models}</h3></div>
              <small>{text.referenceDate}</small>
            </header>
            <p className={styles.deterministic}>{text.deterministic}</p>
            <div className={styles.modelGrid}>
              {selected.aiProfiles.map((profile) => (
                <article key={`${profile.provider}-${profile.model}`}>
                  <header><span>{profile.tier}</span><b>OPTION / NOT CONNECTED</b></header>
                  <dl>
                    <div><dt>{text.provider}</dt><dd>{profile.provider}</dd></div>
                    <div><dt>{text.model}</dt><dd>{profile.model}</dd></div>
                    <div><dt>{text.use}</dt><dd>{profile.role}</dd></div>
                    <div><dt>{text.fit}</dt><dd>{profile.fit}</dd></div>
                  </dl>
                </article>
              ))}
            </div>
            <p className={styles.modelNote}>{text.modelNote}</p>
          </section>

          <section className={styles.deliverySection}>
            <header><span>06</span><h3>{text.delivery}</h3></header>
            <ol>{selected.delivery.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></li>)}</ol>
          </section>

          <footer className={styles.blueprintFooter}>
            <p>{text.legal}</p>
            <a href={`mailto:emirsemenov@yahoo.com?subject=${subject}`}>{text.cta} <span>↗</span></a>
          </footer>
        </article>
      </div>

      <footer className={styles.legalFooter}>
        <span>EMIR SEMENOV / SYSTEMS CATALOG</span>
        <nav aria-label="Legal">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <a href="mailto:emirsemenov@yahoo.com">Contact</a>
        </nav>
      </footer>
    </>
  );
}

export default function SolutionAtlas({ locale, embedded = false }: SolutionAtlasProps) {
  const className = `${styles.shell} ${embedded ? styles.embedded : styles.standalone}`;
  return embedded ? (
    <section className={className} id="solutions" data-portfolio-section>
      <AtlasContent locale={locale} embedded />
    </section>
  ) : (
    <main className={className}>
      <AtlasContent locale={locale} embedded={false} />
    </main>
  );
}
