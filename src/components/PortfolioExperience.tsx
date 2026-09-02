"use client";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import AiSystemsLab from "@/components/AiSystemsLab";
import type { PortfolioContent, PortfolioScene } from "@/lib/content";

const contactEmail = "emirsemenov@yahoo.com";
const githubUrl = "https://github.com/MDT07";
const boardUrl = "https://mdt07-visual-reference.vercel.app/boards/1134062818608879387";
const kaggleUrl = "https://www.kaggle.com/emirsemenov";
const telegramUrl = "https://t.me/EMIR_000";

function SceneMedia({ scene, eager }: { scene: PortfolioScene; eager: boolean }) {
  const mediaName = scene.media.slice(scene.media.lastIndexOf("/") + 1);

  return (
    <div className="scene-media" aria-hidden="true">
      <picture>
        <source
          media="(prefers-reduced-motion: reduce)"
          srcSet={`/media/stills/${mediaName}.png`}
        />
        <img
          src={`${scene.media}.gif`}
          alt=""
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "auto"}
          decoding="async"
        />
      </picture>
    </div>
  );
}

export default function PortfolioExperience({ content }: { content: PortfolioContent }) {
  const [activeSection, setActiveSection] = useState(0);
  const languageHref = content.locale === "en" ? "/ru" : "/";
  const navigationItems = content.scenes.flatMap((scene) =>
    scene.id === "concepts"
      ? [
          { id: scene.id, index: scene.index, kicker: scene.kicker },
          {
            id: "live-lab",
            index: "LAB",
            kicker: content.locale === "ru" ? "ЖИВАЯ AI-ЛАБОРАТОРИЯ" : "LIVE AI SYSTEMS",
          },
        ]
      : [{ id: scene.id, index: scene.index, kicker: scene.kicker }],
  );

  useEffect(() => {
    document.documentElement.lang = content.locale;
    document.documentElement.dataset.experience = "nine-signals";

    const sections = [...document.querySelectorAll<HTMLElement>("[data-portfolio-section]")];
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          const index = sections.indexOf(entry.target as HTMLElement);
          if (index >= 0) setActiveSection(index);
        });
      },
      { threshold: 0.25 },
    );

    sections.forEach((section) => revealObserver.observe(section));

    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      document.documentElement.style.setProperty("--scroll-progress", progress.toString());
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      revealObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      delete document.documentElement.dataset.experience;
    };
  }, [content.locale]);

  const currentSection = navigationItems[activeSection] ?? navigationItems[0];

  return (
    <div className={`experience experience--${content.locale}`}>
      <a className="skip-link" href="#vision">
        {content.locale === "ru" ? "Перейти к первой сцене" : "Skip to the first scene"}
      </a>

      <div className="progress-line" aria-hidden="true" />

      <header className="site-header">
        <a className="identity-mark" href="#vision" aria-label="Emir Semenov — top">
          <span>E/S</span>
          <b>EMIR SEMENOV</b>
        </a>

        <p className="now-playing mono" aria-live="polite">
          <span>{content.header.work}</span>
          <b>{currentSection.index} / {currentSection.kicker}</b>
        </p>

        <div className="header-actions">
          <a className="language-link mono" href="#live-lab">
            LIVE LAB
          </a>
          <Link className="language-link mono" href={languageHref} hrefLang={content.locale === "en" ? "ru" : "en"}>
            {content.languageLabel}
          </Link>
          <a className="header-mail" href={`mailto:${contactEmail}`}>
            {content.header.contact}
          </a>
        </div>
      </header>

      <nav className="signal-rail" aria-label={content.header.work}>
        {navigationItems.map((section, index) => (
          <a
            className={index === activeSection ? "is-active" : ""}
            href={`#${section.id}`}
            aria-label={`${content.labels.chapter} ${section.index}: ${section.kicker}`}
            key={section.id}
          >
            <span />
            <i className="mono">{section.index}</i>
          </a>
        ))}
      </nav>

      <main>
        {content.scenes.map((scene, index) => (
          <Fragment key={scene.id}>
            <section
              className={`scene scene--${scene.layout} scene--${scene.id}`}
              id={scene.id}
              aria-labelledby={`${scene.id}-title`}
              data-portfolio-section
            >
              <SceneMedia scene={scene} eager={index === 0} />
              <div className="scene-shade" aria-hidden="true" />

              <span className="scene-index mono" aria-hidden="true">
                {scene.index}
              </span>

              <div className="scene-copy">
                <p className="scene-kicker mono">{scene.kicker}</p>
                <h1 id={`${scene.id}-title`}>{scene.title}</h1>
                <p className="scene-body">{scene.body}</p>
              </div>

              <p className="scene-aside mono">{scene.aside}</p>

            {scene.id === "vision" && (
              <>
                <div className="hero-tags" aria-label={content.labels.channels}>
                  {scene.tags.map((tag) => <span className="mono" key={tag}>{tag}</span>)}
                </div>
                <a className="scroll-cue mono" href="#identity">
                  <span /> {content.labels.scroll}
                </a>
              </>
            )}

            {scene.id === "identity" && (
              <div className="loose-notes loose-notes--identity" aria-label={content.labels.principles}>
                {scene.tags.map((tag, tagIndex) => (
                  <span className="mono" data-order={tagIndex + 1} key={tag}>{tag}</span>
                ))}
              </div>
            )}

            {scene.id === "conversation" && (
              <div className="conversation-route" aria-label={content.labels.principles}>
                {scene.tags.map((tag, tagIndex) => (
                  <span key={tag}>
                    <i className="mono">0{tagIndex + 1}</i>
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {scene.id === "intelligence" && (
              <div className="core-orbit" aria-label={content.labels.principles}>
                {scene.tags.map((tag, tagIndex) => (
                  <span className={`core-orbit__item core-orbit__item--${tagIndex + 1} mono`} key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {scene.id === "channels" && (
              <div className="platform-scatter" aria-label={content.labels.channels}>
                {scene.tags.map((tag, tagIndex) => (
                  <span className={`platform-scatter__item platform-scatter__item--${tagIndex + 1}`} key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {scene.id === "network" && (
              <div className="integration-cloud" aria-label={content.labels.integrations}>
                {scene.tags.map((tag, tagIndex) => (
                  <span className={`integration-cloud__item integration-cloud__item--${tagIndex + 1} mono`} key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {scene.id === "control" && (
              <div className="control-notes" aria-label={content.labels.principles}>
                {scene.tags.map((tag, tagIndex) => (
                  <span className="mono" key={tag}>
                    <i>{String(tagIndex + 1).padStart(2, "0")}</i> {tag}
                  </span>
                ))}
              </div>
            )}

            {scene.id === "concepts" && (
              <div className="concept-field">
                <p className="concept-disclosure mono">
                  <span>{content.concepts.label}</span>
                  {content.concepts.disclosure}
                </p>
                {content.concepts.studies.map((study, studyIndex) => (
                  <article className={`concept-note concept-note--${studyIndex + 1}`} key={study.code}>
                    <header>
                      <span className="mono">{study.code}</span>
                      <b>{study.channel}</b>
                    </header>
                    <h2>{study.title}</h2>
                    <dl>
                      <div>
                        <dt className="mono">{content.labels.purpose}</dt>
                        <dd>{study.purpose}</dd>
                      </div>
                      <div>
                        <dt className="mono">{content.labels.core}</dt>
                        <dd>{study.core}</dd>
                      </div>
                      <div>
                        <dt className="mono">{content.labels.designedResult}</dt>
                        <dd>{study.result}</dd>
                      </div>
                    </dl>
                  </article>
                ))}
              </div>
            )}

              {scene.id === "contact" && (
                <div className="contact-field">
                <a className="contact-link contact-email" href={`mailto:${contactEmail}`}>
                  <span>{content.labels.email}</span>
                  {contactEmail}
                  <i>↗</i>
                </a>
                <a className="contact-link contact-github" href={githubUrl} target="_blank" rel="noreferrer">
                  <span>{content.labels.github}</span>
                  github.com/MDT07
                  <i>↗</i>
                </a>
                <a className="contact-link contact-board" href={boardUrl} target="_blank" rel="noreferrer">
                  <span>Reference board</span>
                  WEB REFERENCES #1
                  <i>↗</i>
                </a>
                <a className="contact-link contact-kaggle" href={kaggleUrl} target="_blank" rel="noreferrer">
                  <span>Kaggle</span>
                  kaggle.com/emirsemenov
                  <i>↗</i>
                </a>
                <a className="contact-link contact-telegram" href={telegramUrl} target="_blank" rel="noreferrer">
                  <span>Telegram</span>
                  @EMIR_000
                  <i>↗</i>
                </a>
                <p className="contact-location mono">
                  {content.labels.location}<br />
                  <span>{content.labels.availability}</span>
                </p>
                </div>
              )}
            </section>

            {scene.id === "concepts" && <AiSystemsLab locale={content.locale} embedded />}
          </Fragment>
        ))}
      </main>

      <footer className="micro-footer mono">
        <span>EMIR SEMENOV © 2026</span>
        <span><Link href="/privacy">PRIVACY</Link> / <Link href="/terms">TERMS</Link></span>
        <a href="#vision">TOP ↑</a>
      </footer>
    </div>
  );
}
