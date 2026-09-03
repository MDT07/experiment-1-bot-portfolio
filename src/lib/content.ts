export type Locale = "en" | "ru";

export type SceneLayout =
  | "full"
  | "portrait-right"
  | "object-left"
  | "portrait-center"
  | "background"
  | "wide"
  | "room"
  | "contact";

export type PortfolioScene = {
  id: string;
  index: string;
  media: string;
  layout: SceneLayout;
  kicker: string;
  title: string;
  body: string;
  aside: string;
  tags: string[];
};

export type ConceptStudy = {
  code: string;
  title: string;
  channel: string;
  purpose: string;
  core: string;
  result: string;
};

export type PortfolioContent = {
  locale: Locale;
  languageLabel: string;
  meta: { title: string; description: string };
  header: { work: string; contact: string };
  scenes: PortfolioScene[];
  concepts: {
    label: string;
    disclosure: string;
    studies: ConceptStudy[];
  };
  labels: {
    scroll: string;
    chapter: string;
    channels: string;
    integrations: string;
    principles: string;
    purpose: string;
    core: string;
    designedResult: string;
    email: string;
    github: string;
    availability: string;
    location: string;
    reduceMotion: string;
  };
};

const english: PortfolioContent = {
  locale: "en",
  languageLabel: "RU",
  meta: {
    title: "Emir Semenov — Bot & Agent Systems",
    description:
      "Experimental portfolio and implementation catalog for bot and AI-ready agent systems across Telegram, Instagram, WhatsApp, web, and connected services.",
  },
  header: { work: "Nine signals", contact: "Open channel" },
  scenes: [
    {
      id: "vision",
      index: "01",
      media: "/media/original/animation8",
      layout: "full",
      kicker: "EMIR SEMENOV / AI BOT SYSTEMS",
      title: "I build digital operators.",
      body:
        "Bots that communicate, reason, and take controlled action across social platforms and service systems.",
      aside: "Experimental portfolio · Istanbul / remote",
      tags: ["Telegram", "Instagram", "WhatsApp", "AI cores"],
    },
    {
      id: "identity",
      index: "02",
      media: "/media/original/animation2",
      layout: "portrait-right",
      kicker: "HUMAN / SYSTEM",
      title: "Human intent stays at the center.",
      body:
        "I design the conversation around a real need first. The model, memory, tools, and automation follow that need—not the other way around.",
      aside: "Conversation design · product logic · technical architecture",
      tags: ["Intent", "Context", "Tone", "Handoff"],
    },
    {
      id: "conversation",
      index: "03",
      media: "/media/original/animation3",
      layout: "object-left",
      kicker: "CONVERSATION / INTERFACE",
      title: "A message can become an interface.",
      body:
        "The bot turns an unstructured request into clear states: understand, verify, ask, retrieve, propose, confirm, and only then act.",
      aside: "Useful dialogue has structure without feeling mechanical.",
      tags: ["Multilingual", "State", "Retrieval", "Confirmation"],
    },
    {
      id: "intelligence",
      index: "04",
      media: "/media/original/animation4",
      layout: "portrait-center",
      kicker: "INTELLIGENCE / ORCHESTRATION",
      title: "The model is one part. Not the product.",
      body:
        "Production intelligence needs routing, grounded knowledge, permissions, memory boundaries, fallbacks, observability, and an honest path to a human.",
      aside: "Provider-agnostic by design",
      tags: ["LLM routing", "RAG", "Tool use", "Memory"],
    },
    {
      id: "channels",
      index: "05",
      media: "/media/original/animation5",
      layout: "background",
      kicker: "CHANNEL FLOW",
      title: "One logic. Every channel speaks differently.",
      body:
        "Telegram can feel like an operating console. Instagram begins inside a social moment. WhatsApp carries service expectations. The core can be shared; the behavior cannot be copied blindly.",
      aside: "The platform is part of the experience.",
      tags: ["Telegram bots", "Instagram messaging", "WhatsApp services", "Web chat"],
    },
    {
      id: "network",
      index: "06",
      media: "/media/original/animation6",
      layout: "background",
      kicker: "CONNECTED ACTION",
      title: "Useful when it can act. Safe when it knows the limit.",
      body:
        "A bot becomes operational through calendars, CRM, catalogs, payments, knowledge stores, and internal tools. Write actions remain explicit, reversible, and observable.",
      aside: "Automation needs boundaries before it needs scale.",
      tags: ["CRM", "Calendar", "Catalog", "Payments", "Human approval"],
    },
    {
      id: "control",
      index: "07",
      media: "/media/original/animation7",
      layout: "wide",
      kicker: "CONTROL / VISIBILITY",
      title: "No black boxes in production.",
      body:
        "Every important route should explain what it read, what it decided, what tool it called, and why it stopped. The interface can feel magical; the operation should remain inspectable.",
      aside: "Confidence · sources · audit · escalation",
      tags: ["Least privilege", "Rate limits", "Audit trail", "Source citations"],
    },
    {
      id: "concepts",
      index: "08",
      media: "/media/original/animation",
      layout: "room",
      kicker: "SYSTEMS CATALOG",
      title: "Eight architectures, ready to scope.",
      body:
        "The catalog turns the visual thesis into concrete business systems: functions, operating routes, stacks, optional model choices, safeguards, and build packages. No live AI connection is implied.",
      aside: "Prepared blueprints, not client claims",
      tags: ["Sales", "Service", "Commerce", "Operations", "Knowledge"],
    },
    {
      id: "contact",
      index: "09",
      media: "/media/original/animation9",
      layout: "contact",
      kicker: "OPEN CHANNEL",
      title: "Let’s create the next signal.",
      body:
        "I am interested in experimental bot products, demanding service automation, and AI interfaces where reliability matters as much as the idea.",
      aside: "Available for selected experiments",
      tags: ["Istanbul", "Remote", "English", "Russian"],
    },
  ],
  concepts: {
    label: "Selected architecture preview",
    disclosure: "Three entries from the eight-system catalog below. No fabricated clients, metrics, or production results.",
    studies: [
      {
        code: "ORBIT / 01",
        title: "AI service concierge",
        channel: "Telegram + WhatsApp",
        purpose: "Qualify a service request, retrieve verified information, and prepare a booking or human handoff.",
        core: "LLM routing · cited retrieval · structured tool calls · conversation state",
        result: "A controlled route from first message to a verified next step.",
      },
      {
        code: "PULSE / 02",
        title: "Social commerce operator",
        channel: "Instagram + WhatsApp",
        purpose: "Answer grounded product questions, qualify intent, and route exceptions without inventing availability.",
        core: "Intent classification · catalog retrieval · confidence policy · escalation",
        result: "Faster product discovery with human control over promises and exceptions.",
      },
      {
        code: "SIGNAL / 03",
        title: "Private knowledge operator",
        channel: "Telegram + private web",
        purpose: "Find internal knowledge, expose sources, and draft actions within role-based permissions.",
        core: "Private RAG · access checks · citations · approval-gated tools",
        result: "An auditable path from a question to a grounded answer or explicit abstention.",
      },
    ],
  },
  labels: {
    scroll: "Scroll through the signals",
    chapter: "Signal",
    channels: "Channels",
    integrations: "Connected tools",
    principles: "Operating principles",
    purpose: "Purpose",
    core: "AI core / integrations",
    designedResult: "Designed result",
    email: "Email",
    github: "GitHub",
    availability: "Available for selected experiments",
    location: "Istanbul · working remotely",
    reduceMotion: "Motion follows your system preference",
  },
};

const russian: PortfolioContent = {
  locale: "ru",
  languageLabel: "EN",
  meta: {
    title: "Эмир Семенов — системы ботов и AI-агентов",
    description:
      "Экспериментальное портфолио и каталог реализаций ботов и AI-ready агентов для Telegram, Instagram, WhatsApp, web и подключённых сервисов.",
  },
  header: { work: "Девять сигналов", contact: "Открытый канал" },
  scenes: [
    {
      id: "vision",
      index: "01",
      media: "/media/original/animation8",
      layout: "full",
      kicker: "EMIR SEMENOV / AI BOT SYSTEMS",
      title: "Я создаю цифровых операторов.",
      body:
        "Ботов, которые общаются, рассуждают и выполняют контролируемые действия в социальных платформах и сервисных системах.",
      aside: "Экспериментальное портфолио · Стамбул / remote",
      tags: ["Telegram", "Instagram", "WhatsApp", "AI-ядра"],
    },
    {
      id: "identity",
      index: "02",
      media: "/media/original/animation2",
      layout: "portrait-right",
      kicker: "ЧЕЛОВЕК / СИСТЕМА",
      title: "В центре остаётся намерение человека.",
      body:
        "Сначала я проектирую диалог вокруг реальной потребности. Модель, память, инструменты и автоматизация следуют за этой потребностью, а не наоборот.",
      aside: "Разговорный дизайн · продуктовая логика · техническая архитектура",
      tags: ["Намерение", "Контекст", "Тон", "Handoff"],
    },
    {
      id: "conversation",
      index: "03",
      media: "/media/original/animation3",
      layout: "object-left",
      kicker: "ДИАЛОГ / ИНТЕРФЕЙС",
      title: "Сообщение может стать интерфейсом.",
      body:
        "Бот превращает неструктурированный запрос в ясные состояния: понять, проверить, спросить, найти, предложить, подтвердить — и только затем действовать.",
      aside: "Полезный диалог структурирован, но не ощущается механическим.",
      tags: ["Мультиязычность", "Состояние", "Retrieval", "Подтверждение"],
    },
    {
      id: "intelligence",
      index: "04",
      media: "/media/original/animation4",
      layout: "portrait-center",
      kicker: "ИНТЕЛЛЕКТ / ОРКЕСТРАЦИЯ",
      title: "Модель — только часть системы. Не сам продукт.",
      body:
        "Production-интеллекту нужны routing, проверенные знания, разрешения, границы памяти, fallback, наблюдаемость и честный путь передачи человеку.",
      aside: "Архитектура не привязана к одному провайдеру",
      tags: ["LLM routing", "RAG", "Tool use", "Память"],
    },
    {
      id: "channels",
      index: "05",
      media: "/media/original/animation5",
      layout: "background",
      kicker: "ПОТОК КАНАЛОВ",
      title: "Одна логика. Каждый канал говорит по-своему.",
      body:
        "Telegram может ощущаться как операционная консоль. Instagram начинается внутри социального момента. WhatsApp несёт ожидания от сервиса. Ядро можно разделить, поведение нельзя копировать вслепую.",
      aside: "Платформа — часть пользовательского опыта.",
      tags: ["Telegram bots", "Instagram messaging", "WhatsApp services", "Web chat"],
    },
    {
      id: "network",
      index: "06",
      media: "/media/original/animation6",
      layout: "background",
      kicker: "СВЯЗАННОЕ ДЕЙСТВИЕ",
      title: "Полезен, когда действует. Безопасен, когда знает границу.",
      body:
        "Бот становится оператором через календарь, CRM, каталоги, платежи, базы знаний и внутренние инструменты. Write-действия остаются явными, обратимыми и наблюдаемыми.",
      aside: "Автоматизации нужны границы раньше, чем масштаб.",
      tags: ["CRM", "Календарь", "Каталог", "Платежи", "Подтверждение человеком"],
    },
    {
      id: "control",
      index: "07",
      media: "/media/original/animation7",
      layout: "wide",
      kicker: "КОНТРОЛЬ / НАБЛЮДАЕМОСТЬ",
      title: "Никаких чёрных ящиков в production.",
      body:
        "Каждый важный маршрут должен показывать, что система прочитала, что решила, какой инструмент вызвала и почему остановилась. Интерфейс может казаться магией; работа должна оставаться проверяемой.",
      aside: "Уверенность · источники · audit · эскалация",
      tags: ["Минимальные права", "Rate limits", "Audit trail", "Источники"],
    },
    {
      id: "concepts",
      index: "08",
      media: "/media/original/animation",
      layout: "room",
      kicker: "КАТАЛОГ СИСТЕМ",
      title: "Восемь архитектур, готовых к проработке.",
      body:
        "Каталог превращает визуальную идею в конкретные бизнес-системы: функции, рабочие маршруты, стек, опциональные модели, защитные границы и состав разработки. Активное AI-подключение не подразумевается.",
      aside: "Подготовленные blueprints, не клиентские заявления",
      tags: ["Продажи", "Сервис", "Коммерция", "Операции", "Знания"],
    },
    {
      id: "contact",
      index: "09",
      media: "/media/original/animation9",
      layout: "contact",
      kicker: "ОТКРЫТЫЙ КАНАЛ",
      title: "Создадим следующий сигнал.",
      body:
        "Мне интересны экспериментальные бот-продукты, сложная сервисная автоматизация и AI-интерфейсы, где надёжность так же важна, как идея.",
      aside: "Открыт для избранных экспериментов",
      tags: ["Стамбул", "Remote", "English", "Русский"],
    },
  ],
  concepts: {
    label: "Превью выбранной архитектуры",
    disclosure: "Три позиции из каталога восьми систем ниже. Без выдуманных клиентов, метрик или production-результатов.",
    studies: [
      {
        code: "ORBIT / 01",
        title: "AI-консьерж сервиса",
        channel: "Telegram + WhatsApp",
        purpose: "Уточнить сервисный запрос, найти проверенную информацию и подготовить запись или передачу человеку.",
        core: "LLM routing · retrieval с источниками · tool calls · состояние диалога",
        result: "Контролируемый маршрут от первого сообщения до проверенного следующего шага.",
      },
      {
        code: "PULSE / 02",
        title: "Оператор social commerce",
        channel: "Instagram + WhatsApp",
        purpose: "Отвечать на grounded-вопросы о продукте, определять намерение и передавать исключения без выдуманного наличия.",
        core: "Классификация намерения · поиск по каталогу · confidence policy · эскалация",
        result: "Быстрый поиск продукта с человеческим контролем обещаний и исключений.",
      },
      {
        code: "SIGNAL / 03",
        title: "Приватный оператор знаний",
        channel: "Telegram + private web",
        purpose: "Находить внутренние знания, показывать источники и готовить действия в рамках ролевых разрешений.",
        core: "Private RAG · проверка доступа · citations · инструменты после подтверждения",
        result: "Проверяемый путь от вопроса к grounded-ответу или явному отказу.",
      },
    ],
  },
  labels: {
    scroll: "Листайте сигналы",
    chapter: "Сигнал",
    channels: "Каналы",
    integrations: "Подключённые инструменты",
    principles: "Принципы работы",
    purpose: "Задача",
    core: "AI-ядро / интеграции",
    designedResult: "Задуманный результат",
    email: "Почта",
    github: "GitHub",
    availability: "Открыт для избранных экспериментов",
    location: "Стамбул · работаю удалённо",
    reduceMotion: "Анимация следует системным настройкам",
  },
};

export const contentByLocale: Record<Locale, PortfolioContent> = {
  en: english,
  ru: russian,
};
