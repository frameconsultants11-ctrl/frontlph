"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  MapPin,
  Clock3,
  X,
  Check,
  ChevronDown,
  VerifiedIcon,
} from "lucide-react";
import Link from "next/link";
import CompareButton from "./utils/CompareButton";

const EXPERIENCE_OPTIONS = [
  {
    value: "0-2",
    label: "0 - 2 years",
  },
  {
    value: "3-5",
    label: "3 - 5 years",
  },
  {
    value: "5-10",
    label: "5 - 10 years",
  },
  {
    value: "10+",
    label: "10+ years",
  },
];

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function getInitials(name = "") {
  return name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function getDesignation(trainer) {
  const current = trainer.experience?.find(
    (item) => item.isCurrent
  );

  return (
    current?.designation ||
    trainer.experience?.[0]?.designation ||
    "Professional Trainer"
  );
}

function getExperienceText(years) {
  if (!years) return "Less than 1 year";

  return `${years}+ ${
    years === 1 ? "year" : "years"
  } experience`;
}

export default function TrainersPage({session}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [trainers, setTrainers] = useState([]);
  const [filters, setFilters] = useState({
    skills: [],
    tools: [],
    certifications: [],
    education: [],
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const [loading, setLoading] = useState(true);

  const [mobileFiltersOpen, setMobileFiltersOpen] =
    useState(false);

  /*
  |--------------------------------------------------------------------------
  | Current query values
  |--------------------------------------------------------------------------
  */

  const currentSearch =
    searchParams.get("search") || "";

  const currentLimit = Number(
    searchParams.get("limit") || 20
  );

  const currentPage = Number(
    searchParams.get("page") || 1
  );

  const currentSort =
    searchParams.get("sort") || "newest";

  const selectedSkills =
    searchParams.getAll("skill");

  const selectedTools =
    searchParams.getAll("tool");

  const selectedCertifications =
    searchParams.getAll("certification");

  const selectedEducation =
    searchParams.getAll("education");

  const selectedExperience =
    searchParams.getAll("experience");

  const available =
    searchParams.get("available") || "";

  const minRate =
    searchParams.get("minRate") || "";

  const maxRate =
    searchParams.get("maxRate") || "";

  /*
  |--------------------------------------------------------------------------
  | Fetch
  |--------------------------------------------------------------------------
  */

  const fetchTrainers = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `/api/trainers?${searchParams.toString()}`,
        {
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to load trainers"
        );
      }

      setTrainers(result.data || []);

      setPagination(result.pagination);

      setFilters(
        result.filters || {
          skills: [],
          tools: [],
          certifications: [],
          education: [],
        }
      );
    } catch (error) {
      console.error(error);
      setTrainers([]);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchTrainers();
  }, [fetchTrainers]);

  /*
  |--------------------------------------------------------------------------
  | URL helper
  |--------------------------------------------------------------------------
  */

  function updateParams(callback) {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    callback(params);

    params.set("page", "1");

    router.push(`/one-on-one-mentorship?${params.toString()}`);
  }

  /*
  |--------------------------------------------------------------------------
  | Search
  |--------------------------------------------------------------------------
  */

  function handleSearch(value) {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    if (value.trim()) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    params.set("page", "1");

    router.replace(`/one-on-one-mentorship?${params.toString()}`);
  }

  /*
  |--------------------------------------------------------------------------
  | Checkbox
  |--------------------------------------------------------------------------
  */

  function toggleArrayFilter(
    key,
    value,
    checked
  ) {
    updateParams((params) => {
      const values = params.getAll(key);

      params.delete(key);

      const nextValues = checked
        ? [...new Set([...values, value])]
        : values.filter(
            (item) => item !== value
          );

      nextValues.forEach((item) =>
        params.append(key, item)
      );
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Clear filters
  |--------------------------------------------------------------------------
  */

  function clearFilters() {
    const params = new URLSearchParams();

    if (currentSearch) {
      params.set("search", currentSearch);
    }

    params.set("page", "1");
    params.set("limit", currentLimit.toString());

    router.push(
      `/one-on-one-mentorship?${params.toString()}`
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Pagination
  |--------------------------------------------------------------------------
  */

  function goToPage(page) {
    if (
      page < 1 ||
      page > pagination.totalPages
    ) {
      return;
    }

    const params = new URLSearchParams(
      searchParams.toString()
    );

    params.set("page", page.toString());

    router.push(`/one-on-one-mentorship?${params.toString()}`);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Limit
  |--------------------------------------------------------------------------
  */

  function changeLimit(limit) {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    params.set("limit", limit.toString());
    params.set("page", "1");

    router.push(`/one-on-one-mentorship?${params.toString()}`);
  }

  /*
  |--------------------------------------------------------------------------
  | Sort
  |--------------------------------------------------------------------------
  */

  function changeSort(value) {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    params.set("sort", value);
    params.set("page", "1");

    router.push(`/one-on-one-mentorship?${params.toString()}`);
  }

  const activeFilterCount =
    selectedSkills.length +
    selectedTools.length +
    selectedCertifications.length +
    selectedEducation.length +
    selectedExperience.length +
    (available ? 1 : 0) +
    (minRate ? 1 : 0) +
    (maxRate ? 1 : 0);

  return (
    <main className="min-h-screen bg-[#f7f7f5] font-sans">
      {/* HEADER */}

      <section className="border-b border-black/5 bg-white">
        <div className="mx-auto max-w-[1500px] px-5 pt-24 pb-8 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>

              <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
                Expert Trainers
              </h1>

              <p className="mt-2 max-w-xl text-sm text-neutral-500">
                Learn from experienced professionals
                across technology, cloud, DevOps and
                other practical skills.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  setMobileFiltersOpen(true)
                }
                className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium lg:hidden"
              >
                <SlidersHorizontal size={17} />

                Filters

                {activeFilterCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1.5 text-[11px] text-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <select
                value={currentSort}
                onChange={(e) =>
                  changeSort(e.target.value)
                }
                className="rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none"
              >
                <option value="newest">
                  Newest
                </option>

                <option value="name_asc">
                  Name A-Z
                </option>

                <option value="name_desc">
                  Name Z-A
                </option>

                <option value="rate_low">
                  Rate: Low to High
                </option>

                <option value="rate_high">
                  Rate: High to Low
                </option>

                <option value="experience">
                  Most Experienced
                </option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}

      <div className="mx-auto max-w-[1500px] px-5 py-7 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-[300px_minmax(0,1fr)]">
          {/* DESKTOP SIDEBAR */}

          <aside className="hidden lg:block">
            <FilterSidebar
              filters={filters}
              selectedSkills={selectedSkills}
              selectedTools={selectedTools}
              selectedCertifications={
                selectedCertifications
              }
              selectedEducation={
                selectedEducation
              }
              selectedExperience={
                selectedExperience
              }
              available={available}
              minRate={minRate}
              maxRate={maxRate}
              toggleArrayFilter={
                toggleArrayFilter
              }
              updateParams={updateParams}
              clearFilters={clearFilters}
              activeFilterCount={
                activeFilterCount
              }
            />
          </aside>

          {/* MOBILE SIDEBAR */}

          {mobileFiltersOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-black/40"
                onClick={() =>
                  setMobileFiltersOpen(false)
                }
              />

              <div className="absolute right-0 top-0 h-full w-[90%] max-w-[380px] overflow-y-auto bg-white p-5">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">
                    Filters
                  </h2>

                  <button
                    onClick={() =>
                      setMobileFiltersOpen(false)
                    }
                    className="rounded-full bg-neutral-100 p-2"
                  >
                    <X size={18} />
                  </button>
                </div>

                <FilterSidebar
                  filters={filters}
                  selectedSkills={
                    selectedSkills
                  }
                  selectedTools={
                    selectedTools
                  }
                  selectedCertifications={
                    selectedCertifications
                  }
                  selectedEducation={
                    selectedEducation
                  }
                  selectedExperience={
                    selectedExperience
                  }
                  available={available}
                  minRate={minRate}
                  maxRate={maxRate}
                  toggleArrayFilter={
                    toggleArrayFilter
                  }
                  updateParams={updateParams}
                  clearFilters={
                    clearFilters
                  }
                  activeFilterCount={
                    activeFilterCount
                  }
                />
              </div>
            </div>
          )}

          {/* TRAINERS */}

          <section>
            {/* SEARCH */}

            <div className="mb-6 flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                />

                <input
                  key={currentSearch}
                  defaultValue={currentSearch}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch(
                        e.currentTarget.value
                      );
                    }
                  }}
                  placeholder="Search trainers, skills, companies..."
                  className="h-12 w-full rounded-xl border border-neutral-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-violet-500"
                />
              </div>

              <button
                onClick={() => {
                  const input =
                    document.querySelector(
                      "input[placeholder*='Search trainers']"
                    );

                  handleSearch(
                    input?.value || ""
                  );
                }}
                className="h-12 rounded-xl bg-neutral-950 px-6 text-sm font-medium text-white flex items-center justify-center gap-2 hover:bg-neutral-800 transition"
              >
                <Search size={16} />Search 
              </button>
            </div>

            {/* RESULT INFO */}

            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm text-neutral-500">
                {loading
                  ? "Loading trainers..."
                  : `${pagination.total} trainers found`}
              </p>

              <div className="flex items-center gap-2">
                <span className="hidden text-sm text-neutral-500 sm:inline">
                  Show
                </span>

                {[10, 20, 50, 100].map(
                  (value) => (
                    <button
                      key={value}
                      onClick={() =>
                        changeLimit(value)
                      }
                      className={`rounded-lg px-2.5 py-1.5 text-xs font-medium ${
                        currentLimit === value
                          ? "bg-black text-white"
                          : "bg-white text-neutral-500"
                      }`}
                    >
                      {value}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* GRID */}

            {loading ? (
              <TrainerSkeletonGrid />
            ) : trainers.length === 0 ? (
              <EmptyState
                clearFilters={clearFilters}
              />
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
                {trainers.map((trainer) => (
                  <TrainerCard
                    key={trainer._id}
                    trainer={trainer}
                  />
                ))}
              </div>
            )}

            {/* PAGINATION */}

            {!loading &&
              pagination.totalPages > 1 && (
                <Pagination
                  page={currentPage}
                  totalPages={
                    pagination.totalPages
                  }
                  goToPage={goToPage}
                />
              )}
          </section>
        </div>
      </div>
    </main>
  );
}
function RateButton({
  label,
  active,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        rounded-md
        px-2
        py-1
        text-[9px]
        font-medium
        transition
        ${
          active
            ? "bg-emerald-600 text-white"
            : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
        }
      `}
    >
      {label}
    </button>
  );
}
function CompactFilterSection({
  title,
  section,
  openSections,
  toggleSection,
  count = 0,
  children,
}) {
  const isOpen = Boolean(
    openSections[section]
  );

  return (
    <div className="border-t border-neutral-100">
      <button
        type="button"
        onClick={() =>
          toggleSection(section)
        }
        className="
          flex
          w-full
          items-center
          justify-between
          py-3
          text-left
        "
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-neutral-800">
            {title}
          </span>

          {count > 0 && (
            <span
              className="
                flex
                h-4.5
                min-w-4.5
                items-center
                justify-center
                rounded-full
                bg-emerald-50
                px-1.5
                text-[10px]
                font-medium
                text-emerald-700
              "
            >
              {count}
            </span>
          )}
        </div>

        <ChevronDown
          size={15}
          className={`
            text-neutral-400
            transition-transform
            duration-200
            ${isOpen ? "rotate-180" : ""}
          `}
        />
      </button>

      {isOpen && (
        <div className="pb-3">
          {children}
        </div>
      )}
    </div>
  );
}
function SearchableCheckboxList({
  items,
  selected,
  filterKey,
  toggleArrayFilter,
  placeholder,
}) {
  const [search, setSearch] =
    useState("");

  const filteredItems = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return items;
    }

    return items.filter((item) =>
      item.name
        ?.toLowerCase()
        .includes(query)
    );
  }, [items, search]);

  return (
    <div>
      {/* Search */}

      <div className="relative mb-2.5">
        <Search
          size={13}
          className="
            absolute
            left-2.5
            top-1/2
            -translate-y-1/2
            text-neutral-400
          "
        />

        <input
          type="text"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder={placeholder}
          className="
            h-8
            w-full
            rounded-lg
            border
            border-neutral-200
            bg-neutral-50
            pl-8
            pr-7
            text-[11px]
            outline-none
            transition
            focus:border-emerald-500
            focus:bg-white
          "
        />

        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="
              absolute
              right-2
              top-1/2
              -translate-y-1/2
              text-neutral-400
              hover:text-neutral-700
            "
          >
            <X size={12} />
          </button>
        )}
      </div>

      {/* List */}

      <div
        className="
          max-h-[160px]
          overflow-y-auto
          pr-1
        "
      >
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <Checkbox
              key={item._id}
              label={item.name}
              checked={selected.includes(
                item._id
              )}
              onChange={(checked) =>
                toggleArrayFilter(
                  filterKey,
                  item._id,
                  checked
                )
              }
            />
          ))
        ) : (
          <p className="px-1 py-3 text-center text-[11px] text-neutral-400">
            No results found
          </p>
        )}
      </div>
    </div>
  );
}

function FilterSidebar({
  filters,
  selectedSkills,
  selectedTools,
  selectedCertifications,
  selectedEducation,
  selectedExperience,
  available,
  minRate,
  maxRate,
  toggleArrayFilter,
  updateParams,
  clearFilters,
  activeFilterCount,
}) {
  const [openSections, setOpenSections] =
    useState({});

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div
      className="
        rounded-2xl
        border
        border-neutral-200
        sticky
        top-28
        bg-white
        p-4
      "
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="mb-2 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-neutral-950">
            Filters
          </h2>

          {activeFilterCount > 0 && (
            <p className="mt-0.5 text-[11px] text-neutral-500">
              {activeFilterCount} active
            </p>
          )}
        </div>

        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={clearFilters}
            className="
              text-[11px]
              font-medium
              text-red-600
              hover:text-red-700
            "
          >
            Clear all
          </button>
        )}
      </div>

      {/* =====================================================
          AVAILABILITY
      ====================================================== */}

      <CompactFilterSection
        title="Availability"
        section="availability"
        openSections={openSections}
        toggleSection={toggleSection}
        count={available === "true" ? 1 : 0}
      >
        <label
          className="
            flex
            cursor-pointer
            items-center
            gap-2.5
            rounded-lg
            px-1
            py-1.5
            text-xs
            text-neutral-600
            hover:bg-neutral-50
          "
        >
          <input
            type="checkbox"
            checked={available === "true"}
            onChange={(e) => {
              updateParams((params) => {
                if (e.target.checked) {
                  params.set(
                    "available",
                    "true"
                  );
                } else {
                  params.delete("available");
                }
              });
            }}
            className="
              h-3.5
              w-3.5
              accent-emerald-600
            "
          />

          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />

            Available now
          </span>
        </label>
      </CompactFilterSection>

      {/* =====================================================
          EXPERIENCE
      ====================================================== */}

      <CompactFilterSection
        title="Experience"
        section="experience"
        openSections={openSections}
        toggleSection={toggleSection}
        count={selectedExperience.length}
      >
        <div className="space-y-0.5">
          {EXPERIENCE_OPTIONS.map((item) => (
            <Checkbox
              key={item.value}
              label={item.label}
              checked={selectedExperience.includes(
                item.value
              )}
              onChange={(checked) =>
                toggleArrayFilter(
                  "experience",
                  item.value,
                  checked
                )
              }
            />
          ))}
        </div>
      </CompactFilterSection>

      {/* =====================================================
          HOURLY RATE
      ====================================================== */}

      <CompactFilterSection
        title="Hourly Rate"
        section="rate"
        openSections={openSections}
        toggleSection={toggleSection}
        count={
          minRate || maxRate ? 1 : 0
        }
      >
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <span
                className="
                  absolute
                  left-2.5
                  top-1/2
                  -translate-y-1/2
                  text-[11px]
                  text-neutral-400
                "
              >
                ₹
              </span>

              <input
                type="number"
                min="0"
                placeholder="Min"
                defaultValue={minRate}
                onBlur={(e) => {
                  updateParams((params) => {
                    if (e.target.value) {
                      params.set(
                        "minRate",
                        e.target.value
                      );
                    } else {
                      params.delete(
                        "minRate"
                      );
                    }
                  });
                }}
                className="
                  h-9
                  w-full
                  rounded-lg
                  border
                  border-neutral-200
                  bg-white
                  pl-6
                  pr-2
                  text-xs
                  outline-none
                  focus:border-emerald-500
                "
              />
            </div>

            <div className="relative">
              <span
                className="
                  absolute
                  left-2.5
                  top-1/2
                  -translate-y-1/2
                  text-[11px]
                  text-neutral-400
                "
              >
                ₹
              </span>

              <input
                type="number"
                min="0"
                placeholder="Max"
                defaultValue={maxRate}
                onBlur={(e) => {
                  updateParams((params) => {
                    if (e.target.value) {
                      params.set(
                        "maxRate",
                        e.target.value
                      );
                    } else {
                      params.delete(
                        "maxRate"
                      );
                    }
                  });
                }}
                className="
                  h-9
                  w-full
                  rounded-lg
                  border
                  border-neutral-200
                  bg-white
                  pl-6
                  pr-2
                  text-xs
                  outline-none
                  focus:border-emerald-500
                "
              />
            </div>
          </div>

          {/* Quick ranges */}

          <div className="flex flex-wrap gap-1.5">
            <RateButton
              label="< ₹1k"
              active={
                minRate === "" &&
                maxRate === "1000"
              }
              onClick={() => {
                updateParams((params) => {
                  params.delete("minRate");
                  params.set(
                    "maxRate",
                    "1000"
                  );
                });
              }}
            />

            <RateButton
              label="₹1k - ₹2.5k"
              active={
                minRate === "1000" &&
                maxRate === "2500"
              }
              onClick={() => {
                updateParams((params) => {
                  params.set(
                    "minRate",
                    "1000"
                  );
                  params.set(
                    "maxRate",
                    "2500"
                  );
                });
              }}
            />

            <RateButton
              label="₹2.5k - ₹5k"
              active={
                minRate === "2500" &&
                maxRate === "5000"
              }
              onClick={() => {
                updateParams((params) => {
                  params.set(
                    "minRate",
                    "2500"
                  );
                  params.set(
                    "maxRate",
                    "5000"
                  );
                });
              }}
            />

            <RateButton
              label="₹5k+"
              active={
                minRate === "5000" &&
                maxRate === ""
              }
              onClick={() => {
                updateParams((params) => {
                  params.set(
                    "minRate",
                    "5000"
                  );
                  params.delete("maxRate");
                });
              }}
            />
          </div>
        </div>
      </CompactFilterSection>

      {/* =====================================================
          EDUCATION
      ====================================================== */}

      <CompactFilterSection
        title="Education"
        section="education"
        openSections={openSections}
        toggleSection={toggleSection}
        count={selectedEducation.length}
      >
        <div className="space-y-0.5">
          {filters.education?.map((item) => (
            <Checkbox
              key={item.value}
              label={item.label}
              checked={selectedEducation.includes(
                item.value
              )}
              onChange={(checked) =>
                toggleArrayFilter(
                  "education",
                  item.value,
                  checked
                )
              }
            />
          ))}
        </div>
      </CompactFilterSection>

      {/* =====================================================
          SKILLS
      ====================================================== */}

      <CompactFilterSection
        title="Skills"
        section="skills"
        openSections={openSections}
        toggleSection={toggleSection}
        count={selectedSkills.length}
      >
        <SearchableCheckboxList
          items={filters.skills || []}
          selected={selectedSkills}
          filterKey="skill"
          toggleArrayFilter={
            toggleArrayFilter
          }
          placeholder="Search skills..."
        />
      </CompactFilterSection>

      {/* =====================================================
          TOOLS
      ====================================================== */}

      <CompactFilterSection
        title="Tools & Technologies"
        section="tools"
        openSections={openSections}
        toggleSection={toggleSection}
        count={selectedTools.length}
      >
        <SearchableCheckboxList
          items={filters.tools || []}
          selected={selectedTools}
          filterKey="tool"
          toggleArrayFilter={
            toggleArrayFilter
          }
          placeholder="Search tools..."
        />
      </CompactFilterSection>

      {/* =====================================================
          CERTIFICATIONS
      ====================================================== */}

      <CompactFilterSection
        title="Certifications"
        section="certifications"
        openSections={openSections}
        toggleSection={toggleSection}
        count={selectedCertifications.length}
      >
        <SearchableCheckboxList
          items={
            filters.certifications || []
          }
          selected={selectedCertifications}
          filterKey="certification"
          toggleArrayFilter={
            toggleArrayFilter
          }
          placeholder="Search certifications..."
        />
      </CompactFilterSection>
    </div>
  );
}




/*
|--------------------------------------------------------------------------
| TRAINER CARD
|--------------------------------------------------------------------------
*/

function TrainerCard({ trainer }) {
  const skills = trainer.skillDocs || [];
  const visibleSkills = skills.slice(0, 1);
  const remainingSkills = Math.max(0, skills.length - visibleSkills.length);
  const designation = getDesignation(trainer);

  return (
    <article className="group relative overflow-hidden rounded-[20px] border border-neutral-200 bg-white shadow-[0_6px_20px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_36px_rgba(0,0,0,0.10)]">
      {/* HEADER (soft tint instead of solid green) */}
      <div className="relative h-[60px] overflow-visible border-b border-emerald-100/60 bg-gradient-to-br from-emerald-50 via-emerald-50/60 to-white">
        {/* Availability */}
        <div
          className={`absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${
            trainer.isAvailable
              ? "border-emerald-200 bg-white text-emerald-700"
              : "border-neutral-200 bg-white text-neutral-500"
          }`}
        >
          <span className="relative flex h-1.5 w-1.5">
            {trainer.isAvailable && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            )}
            <span
              className={`relative inline-flex h-1.5 w-1.5 rounded-full ${
                trainer.isAvailable ? "bg-emerald-500" : "bg-neutral-400"
              }`}
            />
          </span>
          {trainer.isAvailable ? "Available now" : "Unavailable"}
        </div>

        {/* Avatar */}
        <div className="absolute bottom-[-32px] left-4 z-20">
          <div className="h-[64px] w-[64px] overflow-hidden rounded-full border-4 border-white bg-neutral-100 shadow-[0_4px_12px_rgba(0,0,0,0.12)]">
            {trainer.image ? (
              <img
                src={trainer.image}
                alt={trainer.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-emerald-100 text-base font-semibold text-emerald-700">
                {getInitials(trainer.name)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="px-4 pb-4 pt-[38px]">
        {/* Name + Compare */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <h3 className="truncate text-[16px] font-semibold tracking-[-0.02em] text-neutral-900">
                {trainer.name}
              </h3>
              <VerifiedIcon size={14} className="shrink-0 text-emerald-600" />
            </div>
            <p className="truncate text-[12px] text-neutral-500">
              {designation}
            </p>
          </div>

          <CompareButton trainerId={trainer._id} isListing={true} />
        </div>

        {/* Skills */}
        <div className="mt-3 flex min-h-[28px] items-center gap-1.5 overflow-hidden">
          {visibleSkills.map((skill) => (
            <span
              key={skill._id}
              className="inline-flex max-w-[160px] items-center gap-1.5 rounded-full bg-[#f5f5f5] px-2.5 py-1 text-[11px] font-medium text-neutral-700"
            >
              <span className="flex h-4 w-4 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-600 text-[8px] text-white">
                {skill.image ? (
                  <img
                    src={skill.image}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  skill.name?.[0]
                )}
              </span>
              <span className="truncate">{skill.name}</span>
            </span>
          ))}

          {remainingSkills > 0 && (
            <span className="rounded-full bg-[#f5f5f5] px-2.5 py-1 text-[11px] font-medium text-neutral-600">
              +{remainingSkills}
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="mt-3 grid grid-cols-3 divide-x divide-neutral-200 border-y border-neutral-100 py-2.5">
          <div className="px-1.5 text-center">
            <p className="text-[15px] font-semibold text-neutral-900">
              {trainer.experienceYears || 0}+
            </p>
            <p className="mt-0.5 text-[10px] text-neutral-500">experience</p>
          </div>

          <div className="px-1.5 text-center">
            <p className="text-[15px] font-semibold text-neutral-900">
              {trainer.certificationDocs?.length || 0}
            </p>
            <p className="mt-0.5 text-[10px] text-neutral-500">
              certifications
            </p>
          </div>

          <div className="px-1.5 text-center">
            <p className="text-[15px] font-semibold text-neutral-900">
              {formatCurrency(trainer.hourlyRate)}
            </p>
            <p className="mt-0.5 text-[10px] text-neutral-500">per hour</p>
          </div>
        </div>

        {/* CTA */}
        <Link
          href={`/one-on-one-mentorship/${trainer._id}`}
          className="mt-3 flex h-10 w-full items-center justify-center rounded-full bg-[#111111] text-[13px] font-medium text-white transition-all duration-200 hover:bg-[#23835c] active:scale-[0.98]"
        >
          Know More
        </Link>
      </div>
    </article>
  );
}

/*
|--------------------------------------------------------------------------
| CHECKBOX
|--------------------------------------------------------------------------
*/

function Checkbox({
  label,
  checked,
  onChange,
}) {
  return (
    <label
      className="
        flex
        cursor-pointer
        items-center
        gap-2.5
        rounded-lg
        px-1
        py-1.5
        text-[11px]
        text-neutral-600
        transition
        hover:bg-neutral-50
      "
    >
      <span
        className={`
          flex
          h-3.5
          w-3.5
          shrink-0
          items-center
          justify-center
          rounded
          border
          transition
          ${
            checked
              ? "border-emerald-600 bg-emerald-600"
              : "border-neutral-300 bg-white"
          }
        `}
      >
        {checked && (
          <svg
            width="9"
            height="9"
            viewBox="0 0 12 12"
            fill="none"
          >
            <path
              d="M2.5 6L5 8.5L9.5 3.5"
              stroke="white"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}

        <input
          type="checkbox"
          checked={checked}
          onChange={(e) =>
            onChange(e.target.checked)
          }
          className="sr-only"
        />
      </span>

      <span className="truncate">
        {label}
      </span>
    </label>
  );
}

/*
|--------------------------------------------------------------------------
| FILTER SECTION
|--------------------------------------------------------------------------
*/

function FilterSection({
  title,
  children,
}) {
  return (
    <div className="border-t border-neutral-100 py-5 first:border-t-0 first:pt-0">
      <h3 className="mb-3 text-sm font-semibold text-neutral-900">
        {title}
      </h3>

      <div className="space-y-0.5">
        {children}
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| SCROLLABLE FILTER
|--------------------------------------------------------------------------
*/

function ScrollableFilterList({
  children,
}) {
  return (
    <div className="max-h-[220px] overflow-y-auto pr-1">
      {children}
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| PAGINATION
|--------------------------------------------------------------------------
*/

function Pagination({
  page,
  totalPages,
  goToPage,
}) {
  const pages = [];

  const start = Math.max(1, page - 2);
  const end = Math.min(
    totalPages,
    page + 2
  );

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
      <button
        disabled={page === 1}
        onClick={() => goToPage(page - 1)}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft size={17} />
      </button>

      {start > 1 && (
        <>
          <button
            onClick={() => goToPage(1)}
            className="h-10 w-10 rounded-xl border border-neutral-200 bg-white text-sm"
          >
            1
          </button>

          {start > 2 && (
            <span className="px-1 text-neutral-400">
              ...
            </span>
          )}
        </>
      )}

      {pages.map((item) => (
        <button
          key={item}
          onClick={() => goToPage(item)}
          className={`h-10 w-10 rounded-xl text-sm font-medium ${
            item === page
              ? "bg-black text-white"
              : "border border-neutral-200 bg-white text-neutral-700"
          }`}
        >
          {item}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && (
            <span className="px-1 text-neutral-400">
              ...
            </span>
          )}

          <button
            onClick={() =>
              goToPage(totalPages)
            }
            className="h-10 w-10 rounded-xl border border-neutral-200 bg-white text-sm"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        disabled={page === totalPages}
        onClick={() => goToPage(page + 1)}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRight size={17} />
      </button>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| SKELETON
|--------------------------------------------------------------------------
*/

function TrainerSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {Array.from({ length: 8 }).map(
        (_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-[24px] border border-neutral-200 bg-white"
          >
            <div className="h-[150px] animate-pulse bg-neutral-200" />

            <div className="space-y-4 p-5">
              <div className="h-5 w-2/3 animate-pulse rounded bg-neutral-200" />

              <div className="h-4 w-1/2 animate-pulse rounded bg-neutral-200" />

              <div className="h-8 animate-pulse rounded bg-neutral-200" />

              <div className="h-16 animate-pulse rounded bg-neutral-200" />

              <div className="h-11 animate-pulse rounded-full bg-neutral-200" />
            </div>
          </div>
        )
      )}
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| EMPTY
|--------------------------------------------------------------------------
*/

function EmptyState({
  clearFilters,
}) {
  return (
    <div className="rounded-2xl border border-dashed border-neutral-300 bg-white py-20 text-center">
      <h3 className="text-lg font-semibold">
        No trainers found
      </h3>

      <p className="mt-2 text-sm text-neutral-500">
        Try changing your search or filters.
      </p>

      <button
        onClick={clearFilters}
        className="mt-5 rounded-full bg-black px-5 py-2.5 text-sm text-white"
      >
        Clear filters
      </button>
    </div>
  );
}