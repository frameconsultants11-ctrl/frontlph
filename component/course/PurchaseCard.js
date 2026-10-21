import { auth } from "@/lib/auth";
import { MonitorCheck } from "lucide-react";
import Link from "next/link";
import FreeSessionModal from "../FreeSessionModal";

export default async function PurchaseCard({
  course,
  discountLabel,
  type,
  money,
  perks,
}) {
  const session = await auth();

  const off = discountLabel(course);
  const saving = course.price - course.actualPrice;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-blue-950/20">
      {course.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={course.image}
          alt={course.name}
          className="aspect-video h-36 w-full object-cover"
        />
      )}

      <div className="py-4 px-6">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <span className="text-xl font-bold leading-tight text-[#060B1F]">
            {money(course.actualPrice)}
            <span className="ml-1 text-xs font-normal text-slate-500">
              /Hourly
            </span>
          </span>

          {saving > 0 && (
            <span className="text-xs text-slate-400 line-through">
              {money(course.price)}
            </span>
          )}

          {off && (
            <span className="rounded-full bg-[#ccfc3b] px-2 py-0.5 text-[10px] font-bold text-[#00206b]">
              {off}
            </span>
          )}
        </div>

        {saving > 0 && (
          <p className="mt-1 text-xs text-slate-500">
            You save {money(saving)} on this course
          </p>
        )}

        {session?.user?.id ? (
          <FreeSessionModal
            course={{
              type:type,
              id: String(course._id ?? course.id),
              slug: course.slug,
              name: course.name,
            }}
          />
        ) : (
          <Link
            href={`/auth?callbackUrl=${encodeURIComponent(
              `/learning/${type.slice(0, -1)}/${course.slug}`
            )}`}
            className="mt-4 flex items-center justify-center gap-2 rounded-full bg-[#0039bd] py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[#ccfc3b] hover:text-black"
          >
            Book A Free Session <MonitorCheck size={15} />
          </Link>
        )}

        {perks.length > 0 && (
          <div className="mt-4 border-t border-slate-200 pt-4">
            <h2 className="text-sm font-semibold text-[#060B1F]">
              This course includes
            </h2>

            <ul className="mt-3 space-y-2.5">
              {perks.map(({ Icon, text }) => (
                <li
                  key={text}
                  className="flex items-center gap-2.5 text-xs text-slate-600"
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-blue-50 text-[#0039bd]">
                    <Icon size={14} aria-hidden="true" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 border-t border-slate-200 bg-white px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] lg:hidden">
        <div>
          <p className="text-xl font-bold text-[#060B1F]">{money(course.actualPrice)}</p>
          {course.actualPrice < course.price && <p className="text-xs text-slate-400 line-through">{money(course.price)}</p>}
        </div>
          {session?.user?.id ? (
          <FreeSessionModal
            course={{
              type:type,
              id: String(course._id ?? course.id),
              slug: course.slug,
              name: course.name,
            }}
          />
        ) : (
          <Link
            href={`/auth?callbackUrl=${encodeURIComponent(
              `/learning/${type.slice(0, -1)}/${course.slug}`
            )}`}
            className="mt-0 flex items-center justify-center gap-2 px-5 rounded-full bg-[#0039bd] py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[#ccfc3b] hover:text-black"
          >
            Book A Free Session <MonitorCheck size={15} />
          </Link>
        )}
      </div>
    </div>
  );
}