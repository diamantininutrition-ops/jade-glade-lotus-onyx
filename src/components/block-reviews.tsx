import { useEffect, useRef, useState } from "react";

const GOOGLE_LISTING = "https://www.google.com/maps?cid=3171788461368867703";

const reviews = [
  {
    quote:
      "Un grand merci à Valentin Diamantini pour son excellent accompagnement dans mes préparations sportives, aussi bien en trail qu’en course sur route. Ses conseils m’ont permis d’optimiser mon alimentation, aussi bien sur les courtes que sur les longues distances, tout en travaillant sur la gestion de mon poids. Un professionnel passionné, à l’écoute, disponible et toujours de bon conseil. Un suivi personnalisé et de qualité que je recommande les yeux fermés !",
    name: "Benjamin P.",
    sport: "trail et course sur route, ex champion d’Europe de kick boxing",
  },
  {
    quote:
      "On m’a recommandé Valentin pour mon suivi diététique dans le sport de haut niveau (Championnat d’Europe, Championnats du monde, Jeux Olympiques). Je peux le recommander à mon tour ! C’est un professionnel qui est à l’écoute et donne beaucoup d’explications et de recommandations concrètes pour s’améliorer. Le suivi est très complet ! J’ai vu l’évolution et de réels résultats. Merci !",
    name: "Auriana L.",
    sport: "athlète olympique",
  },
  {
    quote:
      "J’avais besoin de revoir mon alimentation pour des épreuves sportives et notamment du marathon VTT en format long. Je suis pleinement satisfait des conseils de Valentin car j’ai réellement senti une énorme différence durant les compétitions. Je recommande à tous les sportifs et non sportifs car l’accompagnement et le suivi sont au top.",
    name: "Olivier B.",
    sport: "marathon VTT",
  },
  {
    quote:
      "J’ai été accompagné par Valentin dans le cadre de la préparation de mon Half Ironman et je ne peux que le recommander ! Il a parfaitement compris mes attentes et mes objectifs, tout en prenant le temps de m’expliquer clairement sa démarche. Grâce à sa préparation, j’ai pu aborder mon Half Ironman dans les meilleures conditions, sans connaître la moindre baisse de régime ni faiblesse pendant l’épreuve !",
    name: "Nicolas R.",
    sport: "triathlon Half Ironman",
  },
  {
    quote:
      "Apporte de très bons conseils pour un suivi d’activité sportive, je recommande vivement !",
    name: "LaRoche",
    sport: "suivi sportif",
  },
] as const;

function Stars() {
  return (
    <p className="flex gap-1 text-gold" aria-label="5 sur 5">
      {Array.from({ length: 5 }, (_, index) => (
        <svg key={index} viewBox="0 0 20 20" className="size-4" aria-hidden="true">
          <path
            fill="currentColor"
            d="M10 1.6 12.3 6.3l5.2.8-3.8 3.7.9 5.2L10 13.5 5.4 16l.9-5.2L2.5 7.1l5.2-.8L10 1.6z"
          />
        </svg>
      ))}
    </p>
  );
}

function Arrow({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path
        d={dir === "left" ? "M14.5 5.5 8 12l6.5 6.5" : "M9.5 5.5 16 12l-6.5 6.5"}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function metrics(el: HTMLElement) {
  const card = el.querySelector("li");
  if (!card) return { step: 0, visible: 1 };
  const gap = parseFloat(getComputedStyle(el).columnGap || "0") || 0;
  const step = card.getBoundingClientRect().width + gap;
  const visible = step > 0 ? Math.max(1, Math.round((el.clientWidth + gap) / step)) : 1;
  return { step, visible };
}

export function BlockReviews() {
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(1);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const sync = () => {
      const { step, visible: count } = metrics(el);
      if (!step) return;
      const maxStart = Math.max(0, reviews.length - count);
      const start = Math.max(0, Math.min(Math.round(el.scrollLeft / step), maxStart));
      setActive(start);
      setVisible(count);
    };

    sync();
    el.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      el.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);

  function go(index: number) {
    const el = scrollerRef.current;
    if (!el) return;
    const { step, visible: count } = metrics(el);
    if (!step) return;
    const maxStart = Math.max(0, reviews.length - count);
    const next = Math.max(0, Math.min(index, maxStart));
    el.scrollTo({ left: next * step, behavior: "smooth" });
    setActive(next);
  }

  const maxStart = Math.max(0, reviews.length - visible);

  return (
    <section className="bg-paper px-5 py-16 text-ink-fg sm:px-8 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center font-display text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
          Ils m’ont fait confiance
        </h2>
        <div className="mx-auto mt-6 h-px w-16 bg-gold lg:w-36" aria-hidden="true" />

        <div className="relative mt-10 lg:px-14">
          <button
            type="button"
            className="absolute left-0 top-1/2 hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-gold bg-snow text-ink disabled:opacity-30 lg:grid"
            aria-label="Avis précédent"
            disabled={active === 0}
            onClick={() => go(active - 1)}
          >
            <Arrow dir="left" />
          </button>

          <ul
            ref={scrollerRef}
            className="flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] lg:gap-5 [&::-webkit-scrollbar]:hidden"
            aria-label="Avis de sportifs"
          >
            {reviews.map((review) => (
              <li
                key={review.name}
                className="flex w-[calc(100%-2.75rem)] shrink-0 snap-always snap-start lg:w-[calc((100%-2.5rem)/3)]"
              >
                <article className="flex h-full w-full flex-col rounded-2xl border border-hairline-dark bg-snow p-6">
                  <Stars />
                  <p className="mt-4 text-sm leading-relaxed sm:text-base">{review.quote}</p>
                  <p className="mt-auto pt-5 text-xs text-muted sm:text-sm">
                    <span className="font-semibold text-ink-fg">{review.name}</span>
                    <span aria-hidden="true"> · </span>
                    {review.sport}
                  </p>
                </article>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="absolute right-0 top-1/2 hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-gold bg-snow text-ink disabled:opacity-30 lg:grid"
            aria-label="Avis suivant"
            disabled={active >= maxStart}
            onClick={() => go(active + 1)}
          >
            <Arrow dir="right" />
          </button>
        </div>

        <div className="mt-6 flex justify-center gap-2">
          {reviews.map((review, index) => {
            const shown = index >= active && index < active + visible;
            return (
              <button
                key={review.name}
                type="button"
                className={
                  shown
                    ? "size-2.5 rounded-full bg-gold"
                    : "size-2 rounded-full bg-ink/20"
                }
                aria-label={`Afficher l’avis de ${review.name}`}
                aria-current={index === active ? "true" : undefined}
                onClick={() => go(index)}
              />
            );
          })}
        </div>

        <p className="mt-10 text-center">
          <a
            href={GOOGLE_LISTING}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full bg-gold px-6 py-3 text-center font-display text-sm font-semibold text-ink sm:text-base"
          >
            Voir tous les avis sur Google – 4,9★ (63 avis)
          </a>
        </p>
      </div>
    </section>
  );
}
