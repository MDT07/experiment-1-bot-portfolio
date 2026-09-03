export type CatalogLocale = "en" | "ru";
export type SolutionCategory = "sales" | "service" | "commerce" | "operations" | "knowledge";

type Localized = Record<CatalogLocale, string>;

export type AiProfile = {
  tier: Localized;
  provider: string;
  model: string;
  role: Localized;
  fit: Localized;
};

type StackGroup = {
  label: Localized;
  items: string[];
};

type SolutionDefinition = {
  id: string;
  code: string;
  category: SolutionCategory;
  title: Localized;
  shortTitle: Localized;
  summary: Localized;
  audience: Localized;
  outcome: Localized;
  channels: string[];
  functions: Localized[];
  flow: Localized[];
  stack: StackGroup[];
  aiProfiles: AiProfile[];
  integrations: string[];
  controls: Localized[];
  delivery: Localized[];
};

export type SolutionCatalogEntry = {
  id: string;
  code: string;
  category: SolutionCategory;
  title: string;
  shortTitle: string;
  summary: string;
  audience: string;
  outcome: string;
  channels: string[];
  functions: string[];
  flow: string[];
  stack: Array<{ label: string; items: string[] }>;
  aiProfiles: Array<{ tier: string; provider: string; model: string; role: string; fit: string }>;
  integrations: string[];
  controls: string[];
  delivery: string[];
};

const solutions: SolutionDefinition[] = [
  {
    id: "lead-qualifier",
    code: "SQ-01",
    category: "sales",
    title: { en: "Lead qualification concierge", ru: "Консьерж квалификации лидов" },
    shortTitle: { en: "Lead concierge", ru: "Лид-консьерж" },
    summary: {
      en: "Turns an unstructured first message into a complete sales brief, a scored opportunity, and a controlled handoff.",
      ru: "Превращает первое неструктурированное сообщение в полный sales-бриф, оценённую возможность и контролируемую передачу менеджеру.",
    },
    audience: {
      en: "Creative studios, agencies, B2B services, integrators, consultancies",
      ru: "Креативные студии, агентства, B2B-сервисы, интеграторы, консалтинг",
    },
    outcome: {
      en: "A qualified request reaches the right person with context, urgency, budget range, and next action already structured.",
      ru: "К нужному специалисту приходит квалифицированная заявка с контекстом, срочностью, диапазоном бюджета и следующим действием.",
    },
    channels: ["Telegram", "WhatsApp", "Web"],
    functions: [
      { en: "Intent and service-line detection", ru: "Определение намерения и направления услуги" },
      { en: "Adaptive discovery questions", ru: "Адаптивные уточняющие вопросы" },
      { en: "Budget, deadline, fit, and urgency capture", ru: "Сбор бюджета, срока, соответствия и срочности" },
      { en: "Lead scoring with an explainable rule set", ru: "Lead scoring по объяснимому набору правил" },
      { en: "CRM draft and owner notification", ru: "Черновик CRM-карточки и уведомление владельца" },
      { en: "Calendar proposal after explicit confirmation", ru: "Предложение слота календаря после явного подтверждения" },
    ],
    flow: [
      { en: "Receive", ru: "Принять" },
      { en: "Qualify", ru: "Уточнить" },
      { en: "Score", ru: "Оценить" },
      { en: "Confirm", ru: "Подтвердить" },
      { en: "Handoff", ru: "Передать" },
    ],
    stack: [
      { label: { en: "Application", ru: "Приложение" }, items: ["Next.js", "TypeScript", "Node.js", "Webhook adapter"] },
      { label: { en: "Data", ru: "Данные" }, items: ["PostgreSQL / Supabase", "Redis rate limits", "Consent log"] },
      { label: { en: "Operations", ru: "Операции" }, items: ["CRM adapter", "Calendar adapter", "OpenTelemetry", "Vercel / Docker"] },
    ],
    aiProfiles: [
      {
        tier: { en: "Economy", ru: "Экономичный" },
        provider: "Google",
        model: "Gemini 3.5 Flash-Lite",
        role: { en: "Intent classification, field extraction, short summaries", ru: "Классификация намерения, извлечение полей, короткие сводки" },
        fit: { en: "High-volume, latency-sensitive intake", ru: "Большой поток заявок и низкая задержка" },
      },
      {
        tier: { en: "Balanced", ru: "Сбалансированный" },
        provider: "OpenAI",
        model: "GPT-5 mini",
        role: { en: "Adaptive questioning and schema-constrained brief generation", ru: "Адаптивные вопросы и создание брифа по строгой схеме" },
        fit: { en: "Complex services with varied customer language", ru: "Сложные услуги и разнообразный язык клиентов" },
      },
    ],
    integrations: ["HubSpot / amoCRM", "Cal.com / Google Calendar", "Email", "Slack / Telegram alerts"],
    controls: [
      { en: "No CRM write before user confirmation", ru: "Нет записи в CRM до подтверждения пользователя" },
      { en: "Deterministic scoring remains the source of truth", ru: "Детерминированный scoring остаётся источником истины" },
      { en: "Sensitive fields are minimized and retention is configurable", ru: "Чувствительные поля минимизируются, срок хранения настраивается" },
    ],
    delivery: [
      { en: "Conversation map and qualification schema", ru: "Карта диалога и схема квалификации" },
      { en: "Channel bot, CRM adapter, and human inbox", ru: "Канальный бот, CRM-адаптер и human inbox" },
      { en: "Golden test set, analytics events, and release runbook", ru: "Golden test set, события аналитики и release runbook" },
    ],
  },
  {
    id: "support-desk",
    code: "SD-02",
    category: "service",
    title: { en: "Grounded support desk", ru: "Support desk с проверенными знаниями" },
    shortTitle: { en: "Support desk", ru: "Support desk" },
    summary: {
      en: "Resolves repeat questions from approved sources, exposes what it used, and routes uncertainty to a human queue.",
      ru: "Закрывает повторяющиеся вопросы по одобренным источникам, показывает основание ответа и отправляет неопределённость человеку.",
    },
    audience: {
      en: "SaaS products, online services, education, member communities",
      ru: "SaaS-продукты, онлайн-сервисы, образование, закрытые сообщества",
    },
    outcome: {
      en: "Routine issues are answered consistently; exceptions arrive in the support queue with the full dialogue and retrieved sources.",
      ru: "Типовые вопросы получают единообразный ответ; исключения попадают в поддержку с полным диалогом и найденными источниками.",
    },
    channels: ["Telegram", "WhatsApp", "Web", "Discord"],
    functions: [
      { en: "FAQ and policy retrieval with citations", ru: "Поиск FAQ и правил с указанием источников" },
      { en: "Issue classification and priority routing", ru: "Классификация проблемы и маршрутизация приоритета" },
      { en: "Known-issue and service-status responses", ru: "Ответы по известным проблемам и статусу сервиса" },
      { en: "Ticket draft with conversation summary", ru: "Черновик тикета со сводкой диалога" },
      { en: "Confidence threshold and explicit abstention", ru: "Порог уверенности и явный отказ от догадки" },
      { en: "Human takeover without restarting context", ru: "Подключение человека без потери контекста" },
    ],
    flow: [
      { en: "Identify", ru: "Определить" },
      { en: "Retrieve", ru: "Найти" },
      { en: "Answer", ru: "Ответить" },
      { en: "Verify", ru: "Проверить" },
      { en: "Escalate", ru: "Передать" },
    ],
    stack: [
      { label: { en: "Application", ru: "Приложение" }, items: ["FastAPI or Node.js", "Channel adapters", "State machine", "SSE streaming"] },
      { label: { en: "Knowledge", ru: "Знания" }, items: ["PostgreSQL", "pgvector", "Object storage", "Document pipeline"] },
      { label: { en: "Reliability", ru: "Надёжность" }, items: ["Redis", "OpenTelemetry", "Sentry", "Evaluation dataset"] },
    ],
    aiProfiles: [
      {
        tier: { en: "Efficient RAG", ru: "Экономичный RAG" },
        provider: "Mistral AI",
        model: "Mistral Small 4",
        role: { en: "Grounded answers, tool selection, multilingual support", ru: "Ответы по источникам, выбор инструмента, мультиязычность" },
        fit: { en: "Controllable general support workloads", ru: "Контролируемые типовые support-нагрузки" },
      },
      {
        tier: { en: "Complex support", ru: "Сложная поддержка" },
        provider: "Anthropic",
        model: "Claude Sonnet 4.6",
        role: { en: "Long-context diagnosis and careful policy interpretation", ru: "Диагностика в длинном контексте и осторожная интерпретация правил" },
        fit: { en: "Products with nuanced documentation and exceptions", ru: "Продукты со сложной документацией и исключениями" },
      },
    ],
    integrations: ["Zendesk / Intercom", "Statuspage", "Notion / Confluence", "Email"],
    controls: [
      { en: "Answers require retrieved evidence above a set threshold", ru: "Ответ требует найденного основания выше заданного порога" },
      { en: "Account changes and refunds always move to a human", ru: "Изменения аккаунта и возвраты всегда передаются человеку" },
      { en: "Every answer stores source IDs, policy version, and trace ID", ru: "Каждый ответ сохраняет ID источников, версию правил и trace ID" },
    ],
    delivery: [
      { en: "Knowledge ingestion and citation contract", ru: "Контракт загрузки знаний и цитирования" },
      { en: "Support bot, agent inbox, and escalation states", ru: "Support-бот, agent inbox и состояния эскалации" },
      { en: "Retrieval evaluation and unsupported-answer tests", ru: "Оценка retrieval и тесты неподтверждённых ответов" },
    ],
  },
  {
    id: "commerce-guide",
    code: "CM-03",
    category: "commerce",
    title: { en: "Social commerce guide", ru: "Гид по social commerce" },
    shortTitle: { en: "Commerce guide", ru: "Commerce-гид" },
    summary: {
      en: "Guides product discovery across social messages without inventing price, stock, delivery, or compatibility.",
      ru: "Помогает выбрать товар в социальных сообщениях, не выдумывая цену, остатки, доставку или совместимость.",
    },
    audience: {
      en: "Retail, DTC brands, showrooms, catalog businesses",
      ru: "Retail, DTC-бренды, шоурумы, бизнесы с каталогом",
    },
    outcome: {
      en: "A customer reaches a verified shortlist or a human seller while commercial facts continue to come from the catalog.",
      ru: "Клиент получает проверенный shortlist или переходит к продавцу, а коммерческие факты всегда приходят из каталога.",
    },
    channels: ["Instagram", "WhatsApp", "Web"],
    functions: [
      { en: "Natural-language and visual product discovery", ru: "Текстовый и визуальный поиск товаров" },
      { en: "Preference and compatibility questions", ru: "Уточнение предпочтений и совместимости" },
      { en: "Live catalog, price, and inventory lookup", ru: "Проверка каталога, цены и остатка в реальном времени" },
      { en: "Comparison table and grounded recommendation", ru: "Таблица сравнения и обоснованная рекомендация" },
      { en: "Cart or checkout link only after confirmation", ru: "Ссылка на корзину или checkout только после подтверждения" },
      { en: "Seller handoff for exceptions", ru: "Передача продавцу для исключений" },
    ],
    flow: [
      { en: "Discover", ru: "Найти" },
      { en: "Filter", ru: "Отобрать" },
      { en: "Verify", ru: "Проверить" },
      { en: "Compare", ru: "Сравнить" },
      { en: "Convert", ru: "Конвертировать" },
    ],
    stack: [
      { label: { en: "Experience", ru: "Интерфейс" }, items: ["Next.js storefront", "Instagram adapter", "WhatsApp Cloud API", "Rich product cards"] },
      { label: { en: "Commerce", ru: "Коммерция" }, items: ["Shopify / custom catalog API", "PostgreSQL", "Search index", "Webhook sync"] },
      { label: { en: "Operations", ru: "Операции" }, items: ["Inventory cache", "Queue worker", "Product analytics", "Audit trail"] },
    ],
    aiProfiles: [
      {
        tier: { en: "Multimodal", ru: "Мультимодальный" },
        provider: "Google",
        model: "Gemini 3.6 Flash",
        role: { en: "Image-aware discovery and fast multi-turn comparison", ru: "Поиск по изображению и быстрое сравнение в диалоге" },
        fit: { en: "Visual catalogs and high interaction volume", ru: "Визуальные каталоги и большой объём диалогов" },
      },
      {
        tier: { en: "Structured", ru: "Структурный" },
        provider: "OpenAI",
        model: "GPT-5 mini",
        role: { en: "Preference extraction and schema-bound recommendations", ru: "Извлечение предпочтений и рекомендации по строгой схеме" },
        fit: { en: "Catalogs with compatibility or configuration logic", ru: "Каталоги с логикой совместимости или конфигурации" },
      },
    ],
    integrations: ["Shopify / WooCommerce", "ERP / inventory", "Payment links", "Meta webhooks"],
    controls: [
      { en: "Price and stock can only come from live commerce APIs", ru: "Цена и остаток берутся только из live commerce API" },
      { en: "Recommendations show the attributes that produced the match", ru: "Рекомендация показывает атрибуты, по которым найдено совпадение" },
      { en: "No autonomous purchase, refund, or substitution", ru: "Нет автономной покупки, возврата или замены товара" },
    ],
    delivery: [
      { en: "Catalog contract and recommendation states", ru: "Контракт каталога и состояния рекомендации" },
      { en: "Channel experience with verified product cards", ru: "Канальный интерфейс с проверенными карточками" },
      { en: "Freshness monitors and commercial-fact tests", ru: "Мониторинг актуальности и тесты коммерческих фактов" },
    ],
  },
  {
    id: "booking-coordinator",
    code: "BK-04",
    category: "operations",
    title: { en: "Booking and schedule coordinator", ru: "Координатор записи и расписания" },
    shortTitle: { en: "Booking coordinator", ru: "Координатор записи" },
    summary: {
      en: "Collects booking constraints, offers valid slots, confirms terms, and performs one idempotent calendar action.",
      ru: "Собирает ограничения записи, предлагает допустимые слоты, подтверждает условия и выполняет одно идемпотентное действие в календаре.",
    },
    audience: {
      en: "Clinics, beauty services, tutors, consultants, field teams",
      ru: "Клиники, beauty-сервисы, преподаватели, консультанты, выездные команды",
    },
    outcome: {
      en: "Scheduling becomes conversational while availability, time zones, cancellation rules, and writes remain deterministic.",
      ru: "Запись становится разговорной, а доступность, часовые пояса, отмены и запись данных остаются детерминированными.",
    },
    channels: ["Telegram", "WhatsApp", "Web"],
    functions: [
      { en: "Service, specialist, location, and time-zone capture", ru: "Сбор услуги, специалиста, места и часового пояса" },
      { en: "Real-time availability lookup", ru: "Проверка свободных слотов в реальном времени" },
      { en: "Reschedule and cancellation policy handling", ru: "Обработка правил переноса и отмены" },
      { en: "Explicit final confirmation", ru: "Явное финальное подтверждение" },
      { en: "Idempotent booking write and receipt", ru: "Идемпотентная запись и подтверждение результата" },
      { en: "Reminder and no-show workflow", ru: "Напоминания и сценарий no-show" },
    ],
    flow: [
      { en: "Collect", ru: "Собрать" },
      { en: "Check", ru: "Проверить" },
      { en: "Offer", ru: "Предложить" },
      { en: "Confirm", ru: "Подтвердить" },
      { en: "Write", ru: "Записать" },
    ],
    stack: [
      { label: { en: "Workflow", ru: "Процесс" }, items: ["TypeScript state machine", "REST adapters", "Webhook signatures", "Idempotency keys"] },
      { label: { en: "Data", ru: "Данные" }, items: ["PostgreSQL", "Redis locks", "Event outbox", "Consent records"] },
      { label: { en: "Delivery", ru: "Доставка" }, items: ["Background worker", "Calendar provider", "SMS / channel reminders", "Trace dashboard"] },
    ],
    aiProfiles: [
      {
        tier: { en: "Recommended baseline", ru: "Рекомендуемая база" },
        provider: "No provider",
        model: "Deterministic state machine",
        role: { en: "All availability, policy, confirmation, and write decisions", ru: "Все решения о слотах, правилах, подтверждении и записи" },
        fit: { en: "Reliable booking with the smallest operational surface", ru: "Надёжная запись с минимальной операционной поверхностью" },
      },
      {
        tier: { en: "Language layer", ru: "Языковой слой" },
        provider: "Anthropic",
        model: "Claude Haiku 4.5",
        role: { en: "Parse informal requests and draft clear confirmations", ru: "Разбор свободной речи и подготовка понятного подтверждения" },
        fit: { en: "Multilingual or ambiguous inbound messages", ru: "Мультиязычные или неоднозначные запросы" },
      },
    ],
    integrations: ["Cal.com", "Google Calendar", "Microsoft 365", "CRM / reminders"],
    controls: [
      { en: "The model never decides that a slot is available", ru: "Модель никогда не решает, что слот свободен" },
      { en: "Every write uses an idempotency key and transaction log", ru: "Каждая запись использует idempotency key и журнал транзакций" },
      { en: "Health, payment, and policy exceptions require staff", ru: "Медицинские, платёжные и policy-исключения требуют сотрудника" },
    ],
    delivery: [
      { en: "Booking state machine and calendar contract", ru: "State machine записи и контракт календаря" },
      { en: "Channel flows, confirmation UI, and staff takeover", ru: "Канальные сценарии, подтверждение и перехват сотрудником" },
      { en: "Concurrency, duplicate-write, and time-zone tests", ru: "Тесты конкуренции, дублей и часовых поясов" },
    ],
  },
  {
    id: "knowledge-operator",
    code: "KN-05",
    category: "knowledge",
    title: { en: "Private knowledge operator", ru: "Приватный оператор знаний" },
    shortTitle: { en: "Knowledge operator", ru: "Оператор знаний" },
    summary: {
      en: "Searches internal knowledge within role boundaries, cites evidence, and drafts—not executes—the next operation.",
      ru: "Ищет внутренние знания в границах роли, цитирует доказательства и готовит, но не выполняет следующее действие.",
    },
    audience: {
      en: "Operations teams, agencies, internal support, distributed companies",
      ru: "Операционные команды, агентства, внутренняя поддержка, распределённые компании",
    },
    outcome: {
      en: "Employees find the right answer and source faster without giving the assistant broader access than the requesting user.",
      ru: "Сотрудники быстрее находят правильный ответ и источник, не передавая ассистенту больше прав, чем есть у пользователя.",
    },
    channels: ["Telegram", "Web", "Slack"],
    functions: [
      { en: "Role-aware semantic and keyword search", ru: "Семантический и keyword-поиск с учётом роли" },
      { en: "Answer with paragraph-level citations", ru: "Ответ с цитированием на уровне абзацев" },
      { en: "Policy version and document freshness checks", ru: "Проверка версии политики и актуальности документа" },
      { en: "Comparison and decision brief generation", ru: "Создание сравнений и decision brief" },
      { en: "Draft task, email, or ticket for approval", ru: "Черновик задачи, письма или тикета на подтверждение" },
      { en: "Feedback loop for retrieval quality", ru: "Feedback loop для качества поиска" },
    ],
    flow: [
      { en: "Authorize", ru: "Авторизовать" },
      { en: "Retrieve", ru: "Найти" },
      { en: "Cite", ru: "Сослаться" },
      { en: "Draft", ru: "Подготовить" },
      { en: "Approve", ru: "Одобрить" },
    ],
    stack: [
      { label: { en: "Retrieval", ru: "Поиск" }, items: ["FastAPI", "Hybrid search", "pgvector", "Reranking"] },
      { label: { en: "Identity", ru: "Доступ" }, items: ["SSO / OAuth", "Row-level permissions", "Document ACL sync", "Audit events"] },
      { label: { en: "Operations", ru: "Операции" }, items: ["Ingestion queue", "Object storage", "OpenTelemetry", "Evaluation harness"] },
    ],
    aiProfiles: [
      {
        tier: { en: "Focused", ru: "Прикладной" },
        provider: "Mistral AI",
        model: "Mistral Medium 3.5",
        role: { en: "Document synthesis, structured tool plans, multilingual answers", ru: "Синтез документов, структурные планы инструментов, мультиязычные ответы" },
        fit: { en: "Knowledge-heavy workflows with tool use", ru: "Насыщенные знаниями процессы с tool use" },
      },
      {
        tier: { en: "Deep context", ru: "Глубокий контекст" },
        provider: "Anthropic",
        model: "Claude Sonnet 4.6",
        role: { en: "Long policy comparison and ambiguous internal research", ru: "Сравнение длинных политик и неоднозначный внутренний research" },
        fit: { en: "High-value questions where source interpretation matters", ru: "Ценные запросы, где критична интерпретация источников" },
      },
    ],
    integrations: ["Notion", "Google Drive", "Confluence", "Linear / Jira", "Slack"],
    controls: [
      { en: "Retrieval applies the requester's document permissions", ru: "Поиск использует права пользователя на документы" },
      { en: "Prompt text never overrides ACL or tool policy", ru: "Текст запроса не может изменить ACL или tool policy" },
      { en: "Consequential tools produce an approval card, not an action", ru: "Значимые инструменты создают карточку подтверждения, а не действие" },
    ],
    delivery: [
      { en: "Source inventory, ACL model, and ingestion pipeline", ru: "Инвентаризация источников, модель ACL и ingestion pipeline" },
      { en: "Search interface, citation renderer, and approval inbox", ru: "Поиск, отображение цитат и approval inbox" },
      { en: "Permission leakage, retrieval, and faithfulness evaluations", ru: "Тесты утечки прав, retrieval и faithfulness" },
    ],
  },
  {
    id: "document-intake",
    code: "DC-06",
    category: "operations",
    title: { en: "Document intake and onboarding", ru: "Приём документов и onboarding" },
    shortTitle: { en: "Document intake", ru: "Приём документов" },
    summary: {
      en: "Collects files, extracts an agreed schema, validates completeness, and routes exceptions without making regulated decisions.",
      ru: "Принимает файлы, извлекает согласованную схему, проверяет комплектность и маршрутизирует исключения без регулируемых решений.",
    },
    audience: {
      en: "Education, HR, insurance intake, property and service onboarding",
      ru: "Образование, HR, страховой intake, недвижимость и onboarding услуг",
    },
    outcome: {
      en: "A specialist receives a clean case packet, missing-field list, source links, and extraction confidence instead of raw attachments.",
      ru: "Специалист получает собранное дело, список пропусков, ссылки на источники и уверенность извлечения вместо набора вложений.",
    },
    channels: ["Web", "Telegram", "Email"],
    functions: [
      { en: "Secure upload and file-type validation", ru: "Безопасная загрузка и проверка типа файла" },
      { en: "OCR, layout, and table extraction", ru: "OCR, извлечение структуры и таблиц" },
      { en: "Schema validation and missing-field checklist", ru: "Проверка схемы и список недостающих полей" },
      { en: "Human review for low-confidence fields", ru: "Human review полей с низкой уверенностью" },
      { en: "Case assembly with source coordinates", ru: "Сборка дела с координатами источника" },
      { en: "Retention and deletion workflow", ru: "Сценарий хранения и удаления" },
    ],
    flow: [
      { en: "Upload", ru: "Загрузить" },
      { en: "Extract", ru: "Извлечь" },
      { en: "Validate", ru: "Проверить" },
      { en: "Review", ru: "Просмотреть" },
      { en: "Assemble", ru: "Собрать" },
    ],
    stack: [
      { label: { en: "Intake", ru: "Приём" }, items: ["Next.js", "Signed uploads", "Malware scan", "Queue worker"] },
      { label: { en: "Processing", ru: "Обработка" }, items: ["Mistral OCR 4.1", "Python / FastAPI", "Schema validators", "PostgreSQL"] },
      { label: { en: "Governance", ru: "Управление" }, items: ["Encrypted object storage", "Field provenance", "Retention jobs", "Audit log"] },
    ],
    aiProfiles: [
      {
        tier: { en: "Document pipeline", ru: "Документный pipeline" },
        provider: "Mistral AI",
        model: "OCR 4.1 + Mistral Small 4",
        role: { en: "Layout extraction followed by schema-constrained normalization", ru: "Извлечение структуры и нормализация по строгой схеме" },
        fit: { en: "Mixed forms, tables, scans, and multilingual packets", ru: "Смешанные формы, таблицы, сканы и мультиязычные пакеты" },
      },
      {
        tier: { en: "Multimodal review", ru: "Мультимодальная проверка" },
        provider: "Google",
        model: "Gemini 3.6 Flash",
        role: { en: "Cross-page completeness checks and visual field reasoning", ru: "Проверка комплектности между страницами и визуальный разбор полей" },
        fit: { en: "Image-heavy onboarding with varied layouts", ru: "Onboarding с большим числом изображений и разной вёрсткой" },
      },
    ],
    integrations: ["S3-compatible storage", "CRM / case system", "Email", "E-signature provider"],
    controls: [
      { en: "Extraction is a draft until reviewed at the configured threshold", ru: "Извлечение остаётся черновиком до проверки по заданному порогу" },
      { en: "Every field retains page and bounding-box provenance", ru: "Каждое поле хранит страницу и координаты источника" },
      { en: "The system does not approve eligibility or legal status", ru: "Система не одобряет eligibility или юридический статус" },
    ],
    delivery: [
      { en: "Document taxonomy and extraction schema", ru: "Таксономия документов и схема извлечения" },
      { en: "Upload portal, review queue, and case export", ru: "Upload portal, очередь проверки и экспорт дела" },
      { en: "Field accuracy, completeness, and deletion tests", ru: "Тесты точности полей, комплектности и удаления" },
    ],
  },
  {
    id: "community-operator",
    code: "CO-07",
    category: "service",
    title: { en: "Community and content operator", ru: "Оператор сообщества и контента" },
    shortTitle: { en: "Community operator", ru: "Community-оператор" },
    summary: {
      en: "Routes community questions, prepares source-backed drafts, and protects publishing behind editorial approval.",
      ru: "Маршрутизирует вопросы сообщества, готовит черновики по источникам и оставляет публикацию за редакционным подтверждением.",
    },
    audience: {
      en: "Creators, courses, professional communities, product communities",
      ru: "Авторы, курсы, профессиональные и продуктовые сообщества",
    },
    outcome: {
      en: "Members receive faster orientation while community voice, moderation decisions, and publication remain human-owned.",
      ru: "Участники быстрее ориентируются, а голос сообщества, модерация и публикация остаются под контролем человека.",
    },
    channels: ["Telegram", "Discord", "Instagram"],
    functions: [
      { en: "Onboarding and rules navigation", ru: "Onboarding и навигация по правилам" },
      { en: "Topic routing and duplicate-question detection", ru: "Маршрутизация тем и поиск повторных вопросов" },
      { en: "Source-backed answer and announcement drafts", ru: "Черновики ответов и анонсов по источникам" },
      { en: "Moderation queue with reason codes", ru: "Очередь модерации с кодами причин" },
      { en: "Editorial calendar suggestions", ru: "Предложения для редакционного календаря" },
      { en: "Human approval before publish, ban, or removal", ru: "Подтверждение перед публикацией, баном или удалением" },
    ],
    flow: [
      { en: "Observe", ru: "Наблюдать" },
      { en: "Classify", ru: "Классифицировать" },
      { en: "Draft", ru: "Подготовить" },
      { en: "Review", ru: "Проверить" },
      { en: "Publish", ru: "Опубликовать" },
    ],
    stack: [
      { label: { en: "Channels", ru: "Каналы" }, items: ["Telegram Bot API", "Discord interactions", "Instagram Messaging API", "Webhook gateway"] },
      { label: { en: "Editorial", ru: "Редакция" }, items: ["PostgreSQL", "Content queue", "Policy knowledge base", "Approval UI"] },
      { label: { en: "Insight", ru: "Аналитика" }, items: ["Event stream", "Topic clustering", "Moderation audit", "Weekly digest"] },
    ],
    aiProfiles: [
      {
        tier: { en: "High-volume", ru: "Высокий объём" },
        provider: "Anthropic",
        model: "Claude Haiku 4.5",
        role: { en: "Fast routing, summarization, and policy-aware first drafts", ru: "Быстрая маршрутизация, сводки и черновики с учётом правил" },
        fit: { en: "Frequent short community interactions", ru: "Частые короткие взаимодействия в сообществе" },
      },
      {
        tier: { en: "Brand voice", ru: "Голос бренда" },
        provider: "OpenAI",
        model: "GPT-5 mini",
        role: { en: "Structured content variants and context-aware member guidance", ru: "Структурные варианты контента и помощь с учётом контекста" },
        fit: { en: "Editorial workflows with multiple formats", ru: "Редакционные процессы с несколькими форматами" },
      },
    ],
    integrations: ["Notion / CMS", "Moderation inbox", "Analytics warehouse", "Scheduling tools"],
    controls: [
      { en: "No autonomous publishing or member sanctions", ru: "Нет автономной публикации или санкций участникам" },
      { en: "Moderation reasons are explicit and appealable", ru: "Причины модерации явные и допускают апелляцию" },
      { en: "Private messages are excluded from analytics by default", ru: "Личные сообщения по умолчанию исключены из аналитики" },
    ],
    delivery: [
      { en: "Community intent map and policy taxonomy", ru: "Карта намерений сообщества и таксономия правил" },
      { en: "Routing bot, editorial queue, and approval states", ru: "Routing-бот, редакционная очередь и состояния подтверждения" },
      { en: "Tone, moderation consistency, and safety evaluations", ru: "Тесты тона, согласованности модерации и безопасности" },
    ],
  },
  {
    id: "analytics-copilot",
    code: "AN-08",
    category: "knowledge",
    title: { en: "Executive analytics copilot", ru: "Executive analytics copilot" },
    shortTitle: { en: "Analytics copilot", ru: "Analytics copilot" },
    summary: {
      en: "Translates a business question into governed metrics, an inspectable query plan, and a concise decision brief.",
      ru: "Переводит бизнес-вопрос в управляемые метрики, проверяемый план запроса и компактный decision brief.",
    },
    audience: {
      en: "Founders, product leaders, operations and revenue teams",
      ru: "Основатели, product-лидеры, операционные и revenue-команды",
    },
    outcome: {
      en: "Decision-makers receive an answer tied to metric definitions, query evidence, freshness, and uncertainty—not a plausible guess.",
      ru: "Руководитель получает ответ, связанный с определением метрики, запросом, актуальностью и неопределённостью, а не правдоподобную догадку.",
    },
    channels: ["Web", "Telegram", "Slack"],
    functions: [
      { en: "Question-to-metric resolution through a semantic layer", ru: "Связь вопроса с метрикой через semantic layer" },
      { en: "Read-only query planning and validation", ru: "Read-only планирование и проверка запроса" },
      { en: "Chart and narrative brief generation", ru: "Создание графика и текстового brief" },
      { en: "Anomaly explanation with evidence links", ru: "Объяснение аномалий со ссылками на данные" },
      { en: "Scheduled digest with freshness state", ru: "Плановый digest со статусом актуальности" },
      { en: "Analyst handoff for ambiguous definitions", ru: "Передача аналитику при неоднозначных определениях" },
    ],
    flow: [
      { en: "Resolve", ru: "Определить" },
      { en: "Plan", ru: "Спланировать" },
      { en: "Query", ru: "Запросить" },
      { en: "Explain", ru: "Объяснить" },
      { en: "Decide", ru: "Решить" },
    ],
    stack: [
      { label: { en: "Analytics", ru: "Аналитика" }, items: ["dbt semantic layer", "PostgreSQL / warehouse", "Read-only SQL proxy", "DuckDB for files"] },
      { label: { en: "Application", ru: "Приложение" }, items: ["Next.js", "FastAPI", "Chart renderer", "Saved investigations"] },
      { label: { en: "Governance", ru: "Управление" }, items: ["Metric contracts", "Query allowlists", "Row-level access", "Trace + cost logs"] },
    ],
    aiProfiles: [
      {
        tier: { en: "Operational", ru: "Операционный" },
        provider: "Google",
        model: "Gemini 3.6 Flash",
        role: { en: "High-volume metric routing, chart commentary, digest drafts", ru: "Маршрутизация метрик, комментарии к графикам и черновики digest" },
        fit: { en: "Frequent dashboard questions and multimodal reports", ru: "Частые вопросы к dashboard и мультимодальные отчёты" },
      },
      {
        tier: { en: "Reasoning", ru: "Аналитический" },
        provider: "Anthropic",
        model: "Claude Sonnet 4.6",
        role: { en: "Ambiguous metric analysis and long multi-source decision briefs", ru: "Анализ неоднозначных метрик и длинные multi-source decision brief" },
        fit: { en: "Low-volume, high-value executive investigations", ru: "Редкие, но ценные исследования для руководителей" },
      },
    ],
    integrations: ["BigQuery / Snowflake", "dbt", "Metabase / Superset", "Slack / Telegram"],
    controls: [
      { en: "The model never receives unrestricted database credentials", ru: "Модель никогда не получает неограниченные данные доступа к БД" },
      { en: "Only approved metrics and read-only query templates can execute", ru: "Выполняются только одобренные метрики и read-only шаблоны" },
      { en: "Every number links to definition, query, time window, and freshness", ru: "Каждое число связано с определением, запросом, периодом и актуальностью" },
    ],
    delivery: [
      { en: "Metric catalog and question-routing contract", ru: "Каталог метрик и контракт маршрутизации вопросов" },
      { en: "Read-only copilot, evidence panel, and saved briefs", ru: "Read-only copilot, evidence panel и сохранённые brief" },
      { en: "SQL safety, metric accuracy, and regression suite", ru: "Набор тестов SQL-безопасности, точности метрик и регрессий" },
    ],
  },
];

export const solutionCategories: Array<{ id: "all" | SolutionCategory; label: Localized }> = [
  { id: "all", label: { en: "All systems", ru: "Все системы" } },
  { id: "sales", label: { en: "Sales", ru: "Продажи" } },
  { id: "service", label: { en: "Service", ru: "Сервис" } },
  { id: "commerce", label: { en: "Commerce", ru: "Коммерция" } },
  { id: "operations", label: { en: "Operations", ru: "Операции" } },
  { id: "knowledge", label: { en: "Knowledge", ru: "Знания" } },
];

export const catalogByLocale: Record<CatalogLocale, SolutionCatalogEntry[]> = {
  en: solutions.map((solution) => ({
    ...solution,
    title: solution.title.en,
    shortTitle: solution.shortTitle.en,
    summary: solution.summary.en,
    audience: solution.audience.en,
    outcome: solution.outcome.en,
    functions: solution.functions.map((item) => item.en),
    flow: solution.flow.map((item) => item.en),
    stack: solution.stack.map((group) => ({ label: group.label.en, items: group.items })),
    aiProfiles: solution.aiProfiles.map((profile) => ({
      tier: profile.tier.en,
      provider: profile.provider,
      model: profile.model,
      role: profile.role.en,
      fit: profile.fit.en,
    })),
    controls: solution.controls.map((item) => item.en),
    delivery: solution.delivery.map((item) => item.en),
  })),
  ru: solutions.map((solution) => ({
    ...solution,
    title: solution.title.ru,
    shortTitle: solution.shortTitle.ru,
    summary: solution.summary.ru,
    audience: solution.audience.ru,
    outcome: solution.outcome.ru,
    functions: solution.functions.map((item) => item.ru),
    flow: solution.flow.map((item) => item.ru),
    stack: solution.stack.map((group) => ({ label: group.label.ru, items: group.items })),
    aiProfiles: solution.aiProfiles.map((profile) => ({
      tier: profile.tier.ru,
      provider: profile.provider,
      model: profile.model,
      role: profile.role.ru,
      fit: profile.fit.ru,
    })),
    controls: solution.controls.map((item) => item.ru),
    delivery: solution.delivery.map((item) => item.ru),
  })),
};
