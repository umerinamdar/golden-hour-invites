import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import sealed from "@/assets/sealed-backdrop.jpg";
import hero from "@/assets/hero-backdrop.jpg";
import seal from "@/assets/wax-seal.png";
import paper from "@/assets/paper-texture.jpg";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aarav & Anaya — Wedding Invitation" },
      { name: "description", content: "You are invited to the wedding of Aarav & Anaya, 14 February 2027 at The Grand Pavilion." },
      { property: "og:title", content: "Aarav & Anaya — Wedding Invitation" },
      { property: "og:description", content: "Join us on 14 February 2027 at The Grand Pavilion." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Invite,
});

const WEDDING = new Date("2027-02-14T18:00:00+05:30");
const IST = { timeZone: "Asia/Kolkata" } as const;
const EVENTS = [
  { name: "Mehendi", at: "2027-02-12T16:00:00+05:30", place: "Garden Courtyard" },
  { name: "Haldi", at: "2027-02-13T10:00:00+05:30", place: "Lotus Terrace" },
  { name: "Wedding", at: "2027-02-14T18:00:00+05:30", place: "The Grand Pavilion" },
  { name: "Reception", at: "2027-02-15T20:00:00+05:30", place: "The Grand Ballroom" },
];
const fmtDate = (d: Date) => d.toLocaleDateString("en-IN", { ...IST, weekday: "long", day: "numeric", month: "long", year: "numeric" });
const fmtTime = (d: Date) => d.toLocaleTimeString("en-IN", { ...IST, hour: "numeric", minute: "2-digit" }) + " IST";

function Invite() {
  const [stage, setStage] = useState<"sealed" | "opening" | "revealed" | "done">("sealed");
  const music = useRef<HTMLAudioElement>(null);
  const tap = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    document.body.classList.toggle("locked", stage !== "done");
    return () => document.body.classList.remove("locked");
  }, [stage]);

  const open = () => {
    if (stage !== "sealed") return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    tap.current?.play().catch(() => {});
    const m = music.current;
    if (m) {
      m.muted = true; m.volume = 0;
      m.play().then(() => {
        m.muted = false;
        const t0 = performance.now();
        const step = (t: number) => { const p = Math.min(1, (t - t0) / 8000); m.volume = 0.6 * p; if (p < 1) requestAnimationFrame(step); };
        requestAnimationFrame(step);
      }).catch(() => {});
    }
    setStage("opening");
    setTimeout(() => setStage("revealed"), reduced ? 50 : 1500);
    setTimeout(() => setStage("done"), reduced ? 100 : 6000);
  };

  return (
    <main style={{ "--paper-img": `url(${paper})` } as CSSProperties} className="font-sans">
      <audio ref={tap} src="/audio/seal-tap.wav" preload="auto" />
      <audio ref={music} src="/audio/music.wav" preload="auto" loop />

      {/* Hero — same page, revealed behind the doors */}
      <section className={`relative h-dvh overflow-hidden ${stage === "revealed" || stage === "done" ? "revealed" : ""}`}>
        <img src={hero} alt="" width={1536} height={1024} className="hero-img absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/70" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          <p className="fade-up text-xs uppercase tracking-[0.4em] text-accent" style={{ transitionDelay: "0.4s" }}>Together with their families</p>
          <h1 className="fade-up mt-4 font-display text-6xl italic leading-none text-accent sm:text-8xl" style={{ transitionDelay: "1.2s" }}>
            Aarav <span className="text-highlight">&amp;</span> Anaya
          </h1>
          <p className="fade-up mt-4 font-display text-xl text-foreground sm:text-2xl" style={{ transitionDelay: "2.2s" }}>request the joy of your presence</p>
          <div className="fade-up mt-8 w-full max-w-sm" style={{ transitionDelay: "3.2s" }}>
            <ScratchCard />
          </div>
        </div>
      </section>

      {/* Doors overlay */}
      {stage !== "done" && (
        <div
          className={`fixed inset-0 z-50 ${stage !== "sealed" ? "doors-open pointer-events-none" : "cursor-pointer"}`}
          onClick={open}
          role="button"
          tabIndex={0}
          aria-label="Tap to open the invitation"
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), open())}
        >
          {(["l", "r"] as const).map((s) => (
            <div key={s} className={`door door-${s} absolute inset-y-0 w-1/2 overflow-hidden ${s === "l" ? "left-0 origin-left" : "right-0 origin-right"}`}>
              <img src={sealed} alt="" width={1536} height={1024}
                className="absolute inset-y-0 h-full w-[200%] max-w-none object-cover"
                style={{ [s === "l" ? "left" : "right"]: 0 }} />
            </div>
          ))}
          <div className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500 ${stage !== "sealed" ? "opacity-0" : ""}`}>
            <div className="seal-pulse relative w-36 sm:w-44">
              <img src={seal} alt="" width={816} height={816} className="w-full drop-shadow-2xl" />
              <span className="absolute inset-0 flex items-center justify-center font-display text-3xl italic text-highlight sm:text-4xl" style={{ textShadow: "0 1px 0 var(--scratch-ink), 0 -1px 0 var(--paper-dark)" }}>A&nbsp;A</span>
            </div>
            <div className="mt-6 rounded-sm border border-highlight bg-background/70 px-5 py-2 text-[0.7rem] uppercase tracking-[0.35em] text-paper-light backdrop-blur-sm">Tap to open</div>
            <p className="gold-text mt-3 font-display text-4xl italic sm:text-5xl">Aarav &amp; Anaya</p>
          </div>
        </div>
      )}

      {stage === "done" && <Sections />}
    </main>
  );
}

function ScratchCard() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const c = canvas.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    const r = c.getBoundingClientRect(); const dpr = devicePixelRatio || 1;
    c.width = r.width * dpr; c.height = r.height * dpr; ctx.scale(dpr, dpr);
    const css = getComputedStyle(document.documentElement);
    const g = ctx.createLinearGradient(0, 0, r.width, r.height);
    g.addColorStop(0, css.getPropertyValue("--paper-dark")); g.addColorStop(0.5, css.getPropertyValue("--scratch-foil")); g.addColorStop(1, css.getPropertyValue("--highlight"));
    ctx.fillStyle = g; ctx.fillRect(0, 0, r.width, r.height);
    for (let i = 0; i < 1400; i++) { ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.25})`; ctx.fillRect(Math.random() * r.width, Math.random() * r.height, 1, 1); }
    ctx.fillStyle = css.getPropertyValue("--scratch-ink"); ctx.font = "500 12px Jost"; ctx.textAlign = "center";
    ctx.fillText("RUB TO REVEAL THE DATE", r.width / 2, r.height / 2 + 4);
    let down = false, n = 0;
    const scratch = (e: PointerEvent) => {
      if (!down) return; const b = c.getBoundingClientRect();
      ctx.globalCompositeOperation = "destination-out"; ctx.beginPath();
      ctx.arc(e.clientX - b.left, e.clientY - b.top, 22, 0, Math.PI * 2); ctx.fill();
      if (++n % 8 === 0) {
        const d = ctx.getImageData(0, 0, c.width, c.height).data; let clear = 0;
        for (let i = 3; i < d.length; i += 64) if (d[i] === 0) clear++;
        if (clear / (d.length / 64) > 0.38) setRevealed(true);
      }
    };
    const dn = (e: PointerEvent) => { down = true; c.setPointerCapture(e.pointerId); scratch(e); };
    const up = () => { down = false; };
    c.addEventListener("pointerdown", dn); c.addEventListener("pointermove", scratch); c.addEventListener("pointerup", up);
    return () => { c.removeEventListener("pointerdown", dn); c.removeEventListener("pointermove", scratch); c.removeEventListener("pointerup", up); };
  }, []);

  useEffect(() => { if (revealed) { const t = setTimeout(() => setGone(true), 700); return () => clearTimeout(t); } }, [revealed]);

  return (
    <div className="card-surface relative h-32 overflow-hidden">
      <div className="flex h-full flex-col items-center justify-center">
        <p className="font-display text-3xl text-accent">{fmtDate(WEDDING).replace(/^\w+, /, "")}</p>
        <p className="mt-1 text-xs uppercase tracking-[0.3em] text-muted-foreground">{fmtDate(WEDDING).split(",")[0]} · {fmtTime(WEDDING)}</p>
      </div>
      {!gone && (
        <canvas ref={canvas} tabIndex={0} role="button" aria-label="Scratch card. Press Enter to reveal the date"
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setRevealed(true))}
          className={`absolute inset-0 h-full w-full touch-none transition-opacity duration-700 ${revealed ? "opacity-0" : ""}`} />
      )}
    </div>
  );
}

function Countdown() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => { setNow(Date.now()); const i = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(i); }, []);
  const ms = Math.max(0, WEDDING.getTime() - (now ?? WEDDING.getTime()));
  const parts = [["Days", ms / 864e5], ["Hours", (ms / 36e5) % 24], ["Minutes", (ms / 6e4) % 60], ["Seconds", (ms / 1e3) % 60]] as const;
  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-4">
      {parts.map(([l, v]) => (
        <div key={l} className="card-surface py-4 text-center">
          <div className="font-display text-3xl text-accent sm:text-5xl">{String(Math.floor(v)).padStart(2, "0")}</div>
          <div className="mt-1 text-[0.6rem] uppercase tracking-[0.25em] text-muted-foreground">{l}</div>
        </div>
      ))}
    </div>
  );
}

const Heading = ({ k, t }: { k: string; t: string }) => (
  <div className="mb-8 text-center">
    <p className="text-[0.7rem] uppercase tracking-[0.4em] text-accent-soft">{k}</p>
    <h2 className="mt-2 font-display text-4xl italic text-accent sm:text-5xl">{t}</h2>
    <div className="mx-auto mt-4 h-px w-24 bg-highlight" />
  </div>
);

function Sections() {
  return (
    <div className="paper-bg">
      <section className="mx-auto max-w-3xl px-5 py-20">
        <Heading k="The Venue" t="The Grand Pavilion" />
        <div className="card-surface p-8 text-center">
          <p className="font-display text-xl">Palace Road, Udaipur, Rajasthan</p>
          <p className="mt-2 text-sm text-muted-foreground">{fmtDate(WEDDING)} · {fmtTime(WEDDING)}</p>
          <a href="https://www.google.com/maps/search/?api=1&query=The+Grand+Pavilion" target="_blank" rel="noreferrer"
            className="mt-6 inline-block bg-accent px-6 py-3 text-xs uppercase tracking-[0.3em] text-paper-light transition hover:bg-accent-soft">Open in Google Maps</a>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-5 pb-20">
        <Heading k="Counting down" t="Until we say I do" />
        <Countdown />
      </section>
      <section className="mx-auto max-w-3xl px-5 pb-20">
        <Heading k="Programme" t="The Celebrations" />
        <div className="grid gap-4 sm:grid-cols-2">
          {EVENTS.map((e) => { const d = new Date(e.at); return (
            <div key={e.name} className="card-surface p-6 text-center">
              <h3 className="font-display text-3xl italic text-accent">{e.name}</h3>
              <p className="mt-2 text-sm">{fmtDate(d)}</p>
              <p className="text-sm text-muted-foreground">{fmtTime(d)} · {e.place}</p>
            </div>); })}
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-5 pb-20">
        <Heading k="Moments" t="Gallery" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[g1, hero, g2].map((s, i) => (
            <img key={i} src={s} alt="Wedding decor" loading="lazy" className={`card-surface h-64 w-full object-cover sm:h-80 ${i === 1 ? "col-span-2 sm:col-span-1" : ""}`} />
          ))}
        </div>
      </section>
      <section className="px-5 pb-20 text-center">
        <blockquote className="mx-auto max-w-2xl font-display text-2xl italic leading-relaxed text-foreground sm:text-3xl">
          “Two souls, one thread — tied by seven vows under the marigold sky.”
        </blockquote>
      </section>
      <section className="relative overflow-hidden py-28 text-center">
        <img src={sealed} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-background/70" />
        <div className="relative px-5">
          <p className="text-[0.7rem] uppercase tracking-[0.4em] text-paper-light">With love & blessings</p>
          <p className="gold-text mt-4 font-display text-5xl italic sm:text-7xl">Aarav &amp; Anaya</p>
          <p className="mt-4 text-sm tracking-[0.3em] text-paper">14 · 02 · 2027</p>
        </div>
      </section>
    </div>
  );
}
