"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ShowcaseSheet } from "../content/showcase";

type Origin = { x: number; y: number; a: number; b: number; c: number; d: number; width: number; height: number };
const wrap = (value: number, length: number) => length ? ((value % length) + length) % length : 0;

export default function ShowcaseGallery({ sheets }: { sheets: ShowcaseSheet[] }) {
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const sourceButton = useRef<HTMLButtonElement | null>(null);
  const sourceOrigin = useRef<Origin | null>(null);
  const phase = useRef(0);
  const period = useRef(0);
  const pitch = useRef(0);
  const initialized = useRef(false);
  const velocity = useRef(0);
  const closing = useRef(false);
  const keyboardIndex = useRef(0);
  const drag = useRef<{ id: number; x: number; y: number; lastX: number; moved: boolean } | null>(null);
  const suppressClickUntil = useRef(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [selected, setSelected] = useState<ShowcaseSheet | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const [copies, setCopies] = useState(3);
  const [keyboardFocused, setKeyboardFocused] = useState(false);

  const paint = () => {
    // Keep a complete predecessor cycle to the left even immediately before a
    // wrap, because that left-hand sheet overlaps the first visible sheet.
    if (track.current) track.current.style.transform = `translate3d(${phase.current - period.current * 2}px,0,0)`;
  };

  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useLayoutEffect(() => {
    const measure = () => {
      const slot = track.current?.querySelector<HTMLElement>(".showcase-slot");
      if (!slot) return;
      const nextPitch = slot.getBoundingClientRect().width;
      const nextPeriod = nextPitch * sheets.length;
      phase.current = initialized.current && period.current ? phase.current / period.current * nextPeriod : nextPitch * .38;
      initialized.current = true;
      pitch.current = nextPitch;
      period.current = nextPeriod;
      setCopies(Math.max(2, Math.ceil((stage.current?.clientWidth ?? 0) / nextPeriod) + 2));
      paint();
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (stage.current) observer.observe(stage.current);
    return () => observer.disconnect();
  }, [sheets.length]);

  useEffect(() => {
    let frame: number | undefined;
    let last = 0;
    let visible = false;
    const tick = (time: number) => {
      const dt = last ? Math.min((time - last) / 1000, .05) : 0;
      last = time;
      const target = paused || active || selected || dragging || keyboardFocused ? 0 : pitch.current * .22;
      velocity.current += (target - velocity.current) * (1 - Math.exp(-dt * 9));
      if (!dragging && Math.abs(velocity.current) > .02) {
        phase.current = wrap(phase.current + velocity.current * dt, period.current);
        paint();
      }
      if (target === 0 && Math.abs(velocity.current) < .02) {
        velocity.current = 0;
        frame = undefined;
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    const refresh = () => {
      if (frame !== undefined) cancelAnimationFrame(frame);
      frame = undefined;
      last = 0;
      if (visible && !document.hidden && !reducedMotion) frame = requestAnimationFrame(tick);
      else velocity.current = 0;
    };
    const observer = new IntersectionObserver(entries => { visible = entries[0]?.isIntersecting ?? false; refresh(); }, { threshold: .01 });
    if (stage.current) observer.observe(stage.current);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", refresh);
      if (frame !== undefined) cancelAnimationFrame(frame);
    };
  }, [paused, active, selected, dragging, reducedMotion, keyboardFocused]);

  function originFor(element: HTMLButtonElement): Origin {
    const rect = element.getBoundingClientRect();
    const matrix = new DOMMatrix(getComputedStyle(element).transform);
    return { x: rect.left, y: rect.top, a: matrix.a, b: matrix.b, c: matrix.c, d: matrix.d, width: element.offsetWidth, height: element.offsetHeight };
  }

  function openPreview(sheet: ShowcaseSheet, element: HTMLButtonElement) {
    if (performance.now() < suppressClickUntil.current) return;
    sourceButton.current = element;
    keyboardIndex.current = Math.max(0, sheets.findIndex(item => item.id === sheet.id));
    sourceOrigin.current = originFor(element);
    closing.current = false;
    setSelected(sheet);
  }

  useLayoutEffect(() => {
    if (!selected || !dialog.current || !panel.current) return;
    const modal = dialog.current;
    const preview = panel.current;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    modal.showModal();
    closeButton.current?.focus({ preventScroll: true });
    const bounds = panel.current.getBoundingClientRect();
    const origin = sourceOrigin.current;
    if (origin && !reducedMotion) {
      const from = `matrix(${origin.a * origin.width / bounds.width},${origin.b * origin.width / bounds.width},${origin.c * origin.height / bounds.height},${origin.d * origin.height / bounds.height},${origin.x - bounds.x},${origin.y - bounds.y})`;
      panel.current.animate([{ transform: from }, { transform: "matrix(1,0,0,1,0,0)" }], { duration: 650, easing: "cubic-bezier(.22,1,.36,1)", fill: "both" });
    }
    return () => {
      preview.getAnimations().forEach(animation => animation.cancel());
      modal.close();
      root.style.overflow = previousOverflow;
    };
  }, [selected, reducedMotion]);

  async function closePreview() {
    if (closing.current) return;
    closing.current = true;
    if (panel.current && sourceButton.current?.isConnected && !reducedMotion) {
      const origin = originFor(sourceButton.current);
      const currentTransform = getComputedStyle(panel.current).transform;
      panel.current.getAnimations().forEach(animation => animation.cancel());
      const bounds = panel.current.getBoundingClientRect();
      const target = `matrix(${origin.a * origin.width / bounds.width},${origin.b * origin.width / bounds.width},${origin.c * origin.height / bounds.height},${origin.d * origin.height / bounds.height},${origin.x - bounds.x},${origin.y - bounds.y})`;
      try {
        await panel.current.animate([{ transform: currentTransform }, { transform: target, opacity: .7 }], { duration: 450, easing: "cubic-bezier(.4,0,.2,1)", fill: "both" }).finished;
      } catch { /* Unmount or a changed motion preference cancels the animation. */ }
    }
    dialog.current?.close();
    setSelected(null);
    setActive(null);
    closing.current = false;
    // Keyboard users return to the gallery control, not an offscreen loop copy.
    stage.current?.focus({ preventScroll: true });
  }

  function keyboardSelect(index: number) {
    keyboardIndex.current = wrap(index, sheets.length);
    const sheet = sheets[keyboardIndex.current];
    const width = stage.current?.clientWidth ?? 0;
    const nativeWidth = track.current?.querySelector<HTMLElement>(".showcase-sheet")?.offsetWidth ?? 0;
    phase.current = wrap(width / 2 - nativeWidth * .707106 / 2 - keyboardIndex.current * pitch.current, period.current);
    velocity.current = 0;
    paint();
    setActive(sheet.id);
    setAnnouncement(`${sheet.title}. Press Enter to open the preview.`);
  }

  return (
    <section id="showcase" className="prometheus-showcase" aria-labelledby="showcase-title">
      <h2 id="showcase-title">#MadeByPrometheus</h2>
      <p id="showcase-instructions" className="showcase-sr-only">Angled concept gallery. Drag horizontally, or use the left and right arrow keys. Press Enter to preview a sheet and Escape to close it.</p>
      <div ref={stage} className="showcase-stage" tabIndex={0} role="group" aria-label="Concept gallery" aria-describedby="showcase-instructions" data-active={active ?? ""} data-dragging={dragging} data-preview={selected?.id ?? ""}
        onFocus={event => {
          if (event.target !== event.currentTarget) return;
          const keyboard = event.currentTarget.matches(":focus-visible");
          setKeyboardFocused(keyboard);
          if (keyboard && !selected) keyboardSelect(keyboardIndex.current);
        }}
        onPointerLeave={() => {
          if (drag.current && !drag.current.moved) drag.current = null;
          if (!drag.current) setActive(null);
        }}
        onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node)) { setActive(null); setKeyboardFocused(false); } }}
        onKeyDown={event => {
          if (event.target !== event.currentTarget) return;
          if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); keyboardSelect(keyboardIndex.current + (event.key === "ArrowRight" ? 1 : -1)); }
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            keyboardSelect(keyboardIndex.current);
            const candidates = Array.from(track.current?.querySelectorAll<HTMLButtonElement>(`[data-sheet-id="${sheets[keyboardIndex.current].id}"]`) ?? []);
            const width = stage.current?.clientWidth ?? 0;
            const left = stage.current?.getBoundingClientRect().left ?? 0;
            candidates.sort((a, b) => Math.abs(a.getBoundingClientRect().left - left - width / 2) - Math.abs(b.getBoundingClientRect().left - left - width / 2));
            if (candidates[0]) openPreview(sheets[keyboardIndex.current], candidates[0]);
          }
          if (event.key === "Escape") setActive(null);
        }}
        onPointerDown={event => { if (event.isPrimary && event.button === 0) drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, lastX: event.clientX, moved: false }; }}
        onPointerMove={event => {
          const pointer = drag.current;
          if (!pointer || pointer.id !== event.pointerId) return;
          const dx = event.clientX - pointer.x;
          if (!pointer.moved && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(event.clientY - pointer.y)) {
            pointer.moved = true;
            event.currentTarget.setPointerCapture(event.pointerId);
            velocity.current = 0;
            setDragging(true);
          }
          if (pointer.moved) {
            if (event.cancelable) event.preventDefault();
            phase.current = wrap(phase.current + event.clientX - pointer.lastX, period.current);
            paint();
          }
          pointer.lastX = event.clientX;
        }}
        onPointerUp={event => {
          if (drag.current?.moved) suppressClickUntil.current = performance.now() + 250;
          drag.current = null;
          setDragging(false);
          setActive(null);
          if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        onPointerCancel={() => { drag.current = null; setDragging(false); setActive(null); }}
        onLostPointerCapture={() => { drag.current = null; setDragging(false); }}>
        <div ref={track} className="showcase-track" aria-hidden="true">
          {Array.from({ length: copies }, (_, copy) => sheets.map((sheet, index) => (
            <div className="showcase-slot" key={`${copy}-${sheet.id}`} style={{ zIndex: sheets.length * copies - (copy * sheets.length + index) }}>
              <button type="button" tabIndex={-1} data-sheet-id={sheet.id} data-lit={active === sheet.id} className={`showcase-sheet tone-${sheet.tone}`} onPointerDown={event => { if (event.pointerType === "mouse") event.preventDefault(); }} onPointerEnter={event => { if (event.pointerType !== "touch" && !drag.current?.moved) setActive(sheet.id); }} onPointerLeave={() => { if (!drag.current?.moved) setActive(null); }} onClick={event => openPreview(sheet, event.currentTarget)}>
                <SheetContent sheet={sheet} />
              </button>
            </div>
          )))}
        </div>
      </div>
      <div className="showcase-toolbar">
        <p>{sheets.some(sheet => sheet.image) ? "Concept explorations" : "Blank concept sheets"}</p>
        <button type="button" onClick={() => setPaused(value => !value)} aria-pressed={paused} disabled={reducedMotion}>{reducedMotion ? "Motion reduced" : paused ? "Play motion" : "Pause motion"}</button>
      </div>
      <p className="showcase-sr-only" role="status" aria-live="polite">{announcement}</p>
      <dialog ref={dialog} className="showcase-dialog" aria-labelledby="showcase-preview-title" data-lenis-prevent="" onCancel={event => { event.preventDefault(); void closePreview(); }} onClick={event => { if (event.target === event.currentTarget) void closePreview(); }}>
        {selected && <>
          <div ref={panel} className={`showcase-preview-panel tone-${selected.tone}`}>
            <SheetContent sheet={selected} />
          </div>
          <div className="showcase-preview-caption"><h3 id="showcase-preview-title">{selected.title}</h3><p>{selected.image ? "Concept exploration" : "Image placeholder"}</p></div>
          <button ref={closeButton} type="button" className="showcase-preview-close" aria-label="Close preview" onClick={() => void closePreview()}><svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="m4 4 12 12M16 4 4 16" stroke="currentColor" strokeWidth="1.8" /></svg></button>
        </>}
      </dialog>
    </section>
  );
}

function SheetContent({ sheet }: { sheet: ShowcaseSheet }) {
  return sheet.image ? <img src={sheet.image} alt="" draggable={false} className="showcase-image" /> : <div className="showcase-blank"><span>{sheet.title}</span><span aria-hidden="true">{sheet.id.slice(-2)}</span></div>;
}
