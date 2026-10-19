
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock3, Star } from "lucide-react";

function formatPrice(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const amount = Number(value);
  if (!Number.isFinite(amount)) return null;

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDuration(duration) {
  if (typeof duration === "number") {
    return `${duration} hrs`;
  }

  return duration || "Self-paced";
}

export default function CertificationCard({ item }) {
  const price = formatPrice(item.actualPrice);
  const originalPrice = formatPrice(item.price);
  const discounted =
    Number(item.price) > Number(item.actualPrice);

  return (
    <Link
      href={`learning/certification/${item.slug}`}
      className="group flex h-full min-w-0 flex-col rounded-xl border border-slate-200 bg-white p-3 transition duration-300 hover:-translate-y-1 hover:border-[#0039bd]/40 hover:shadow-[0_14px_30px_-18px_rgba(0,57,189,0.3)]"
    >
      {/* Thumbnail */}
      <div className="relative h-[150px] overflow-hidden rounded-lg bg-blue-50">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            fill='true'
            sizes="(max-width: 639px) 85vw, (max-width: 1023px) 45vw, 30vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-50 to-lime-50">
            {item.skills?.[0]?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.skills[0].image}
                alt=""
                className="h-16 w-16 object-contain"
              />
            ) : (
              <span className="text-4xl font-bold text-[#0039bd]">
                {item.name?.[0]?.toUpperCase() || "C"}
              </span>
            )}
          </div>
        )}

        <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-md bg-white/95 px-2 py-1 text-[10px] font-medium text-slate-700 shadow-sm backdrop-blur">
          <Clock3 size={11} className="text-[#0039bd]" />
          {formatDuration(item.duration)}
        </span>
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col pt-3">
        <p className="truncate text-[10px] font-semibold text-[#0039bd]">
          {item.category?.name || item.skills?.[0]?.name || "Certification"}
        </p>

        <div className="mt-1 flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 min-h-10 text-sm font-bold leading-5 text-[#060B1F] transition-colors group-hover:text-[#0039bd]">
            {item.name}
          </h3>

          <ArrowUpRight
            size={16}
            className="mt-0.5 shrink-0 text-slate-500 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#0039bd]"
          />
        </div>

        <p className="mt-1.5 line-clamp-2 min-h-9 text-[11px] leading-[1.15rem] text-slate-500">
          {item.description || "Build practical skills and prepare for your next certification."}
        </p>

        {/* Rating: display only when real data exists */}
        
          <div className="mt-2 flex items-center gap-1.5 text-[10px]">
            <span className="font-semibold text-[#060B1F]">
              {Number(item.rating).toFixed(1)}
            </span>

            <span className="flex items-center text-amber-500">
              {Array.from({ length: 5 }, (_, index) => (
                <Star
                  key={index}
                  size={11}
                  fill={
                    index < Math.round(Number(item.rating))
                      ? "currentColor"
                      : "none"
                  }
                />
              ))}
            </span>

            {item.reviewCount > 0 && (
              <span className="text-slate-400">
                ({item.reviewCount.toLocaleString("en-IN")})
              </span>
            )}
          </div>
        

        {/* Skills and tools */}
        {(item.skills?.length > 0 || item.tools?.length > 0) && (
          <div className="mt-3 flex flex-wrap gap-1">
            {[...(item.skills || []), ...(item.tools || [])]
              .slice(0, 2)
              .map((entry, index) => (
                <span
                  key={entry.id || `${entry.name}-${index}`}
                  className="max-w-full truncate rounded-full bg-blue-50 px-2 py-1 text-[9px] font-medium text-[#0039bd]"
                >
                  {entry.name}
                </span>
              ))}
          </div>
        )}

        {/* Price */}
        <div className="mt-auto flex flex-wrap items-baseline gap-x-2 gap-y-1 border-t border-slate-100 pt-3">
          {price && (
            <span className="text-base font-bold text-[#0039bd]">
              {price}
            </span>
          )}

          {discounted && originalPrice && (
            <span className="text-xs text-slate-400 line-through">
              {originalPrice}
            </span>
          )}

          {!price && (
            <span className="text-sm font-semibold text-[#0039bd]">
              View details
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
