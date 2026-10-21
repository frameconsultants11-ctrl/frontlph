'use client';

import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';

/* horizontal row that bleeds off the right edge, optional arrows + footer text */
export function ScrollRow({ children, footer, arrows = true, className = '' }) {
  const ref = useRef(null);
  const scroll = (dir) =>
    ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.6, behavior: 'smooth' });

  return (
    <div>
      <div
        ref={ref}
        className={`flex gap-3 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}
      >
        {children}
      </div>

      {(footer || arrows) && (
        <div className="mt-6 flex items-end justify-between gap-6">
          <div className="max-w-md">{footer}</div>
          {arrows && (
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                aria-label="Previous"
                onClick={() => scroll(-1)}
                className="grid h-8 w-12 place-items-center rounded-full border border-[#dbe6ff] bg-white text-slate-400 hover:text-[#0039bd]"
              >
                <ArrowLeft size={14} />
              </button>
              <button
                type="button"
                aria-label="Next"
                onClick={() => scroll(1)}
                className="grid h-8 w-12 place-items-center rounded-full bg-[#0039bd] text-white hover:bg-[#060B1F]"
              >
                <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* "1/10" card + arrows + quote text */
export function TestimonialSlider({ items }) {
  const [i, setI] = useState(0);
  if (!items?.length) return null;
  const t = items[i];
  const go = (d) => setI((i + d + items.length) % items.length);

  return (
    <div>
      <Quote size={56} strokeWidth={0} fill="#c4d6ff" className="mb-6" aria-hidden="true" />
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="flex w-full shrink-0 flex-col justify-between gap-6 rounded-2xl bg-[#dbe6ff] p-4 sm:h-36 sm:w-40">
          <p className="text-2xl font-medium tabular-nums text-[#060B1F]">
            {i + 1}/{items.length}
          </p>
          <div className="flex items-center gap-2">
            {t.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={t.image} alt={t.name} className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#0039bd] text-xs font-bold text-white">
                {t.name[0]}
              </span>
            )}
            <span className="leading-tight">
              <span className="block text-xs font-semibold text-[#060B1F]">{t.name}</span>
              <span className="block text-[10px] text-slate-500">{t.role}</span>
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button type="button" aria-label="Next" onClick={() => go(1)}
            className="grid h-8 w-8 place-items-center rounded-full bg-[#dbe6ff] text-[#0039bd] hover:bg-[#0039bd] hover:text-white">
            <ArrowRight size={14} />
          </button>
          <button type="button" aria-label="Previous" onClick={() => go(-1)}
            className="grid h-8 w-8 place-items-center rounded-full border border-[#dbe6ff] text-slate-400 hover:text-[#0039bd]">
            <ArrowLeft size={14} />
          </button>
        </div>

        <p className="max-w-md text-sm leading-relaxed text-[#060B1F]">{t.text}</p>
      </div>
    </div>
  );
}