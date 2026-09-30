import { COUNTRIES } from "@/lib/data/countries";
import { getFlagEmoji } from "@/lib/flag";
import { useState } from "react";

export default function PhoneInput({
  country,
  setCountry,
  mobile,
  setMobile,
  error,
  onBlur,
  selectedCountry,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredCountries = COUNTRIES.filter((item) =>
    `${item.name} ${item.dial}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleSelect = (item) => {
    setCountry(item.code);
    setOpen(false);
    setSearch("");
  };

  return (
    <div className="relative">

      <label className="mb-1.5 block text-[12px] font-medium text-[#303a35]">
        Mobile number
      </label>

      {/* PHONE FIELD */}

      <div
        className={`flex h-[42px] overflow-visible rounded-[8px] border bg-white transition ${
          error
            ? "border-red-400"
            : open
              ? "border-[#173f32]"
              : "border-gray-200"
        }`}
      >

        {/* COUNTRY SELECTOR */}

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex h-full w-[82px] shrink-0 items-center gap-1.5 border-r border-gray-200 px-2.5 text-left transition hover:bg-gray-50"
        >

          {/* FLAG */}

          <span className="text-[15px] leading-none mb-1">
            {getFlagEmoji(selectedCountry.code)}
          </span>

          {/* CODE */}

          <span className="text-[12px] font-medium text-[#303a35]">
            {selectedCountry.dial}
          </span>

          {/* ARROW */}

          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            className={`ml-auto transition-transform ${
              open ? "rotate-180" : ""
            }`}
          >
            <path
              d="m6 9 6 6 6-6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

        </button>

        {/* MOBILE */}

        <input
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          maxLength={10}
          placeholder="10 digit mobile number"
          value={mobile}
          onChange={(e) => {
            const value = e.target.value
              .replace(/\D/g, "")
              .slice(0, 10);

            setMobile(value);
          }}
          onBlur={onBlur}
          className="min-w-0 flex-1 rounded-r-[8px] px-3 text-[13px] outline-none placeholder:text-gray-400"
        />

      </div>

      {/* PREMIUM COUNTRY DROPDOWN */}

      {open && (
        <>

          {/* Click outside layer */}

          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setOpen(false);
              setSearch("");
            }}
          />

          <div className="absolute left-0 top-[72px] z-50 w-[270px] overflow-hidden rounded-[12px] border border-gray-200 bg-white shadow-[0_12px_35px_rgba(23,63,50,0.14)]">

            {/* SEARCH */}

            <div className="border-b border-gray-100 p-2">

              <div className="flex h-[34px] items-center gap-2 rounded-[7px] bg-[#f7f8f7] px-2.5">

                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="shrink-0 text-gray-400"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="7"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />

                  <path
                    d="m20 20-4-4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>

                <input
                  autoFocus
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search country..."
                  className="w-full bg-transparent text-[11px] outline-none placeholder:text-gray-400"
                  onClick={(e) =>
                    e.stopPropagation()
                  }
                />

              </div>

            </div>

            {/* COUNTRY LIST */}

            <div className="max-h-[230px] overflow-y-auto p-1.5 scrollbar-thin">

              {filteredCountries.length > 0 ? (
                filteredCountries.map((item) => {

                  const active =
                    item.code === country;

                  return (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() =>
                        handleSelect(item)
                      }
                      className={`flex w-full items-center gap-2 rounded-[8px] px-2.5 py-2 text-left transition ${
                        active
                          ? "bg-[#e9f5ed]"
                          : "hover:bg-[#f7f9f7]"
                      }`}
                    >

                      {/* FLAG */}

                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-50 text-[15px]">
                        {getFlagEmoji(item.code)}
                      </span>

                      {/* NAME */}

                      <span
                        className={`min-w-0 flex-1 truncate text-[11px] ${
                          active
                            ? "font-medium text-[#173f32]"
                            : "text-gray-600"
                        }`}
                      >
                        {item.name}
                      </span>

                      {/* DIAL */}

                      <span
                        className={`text-[10px] ${
                          active
                            ? "font-medium text-[#173f32]"
                            : "text-gray-400"
                        }`}
                      >
                        {item.dial}
                      </span>

                      {/* CHECK */}

                      {active && (
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          className="text-[#173f32]"
                        >
                          <path
                            d="m5 12 4 4L19 6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}

                    </button>
                  );
                })
              ) : (
                <div className="px-3 py-6 text-center text-[11px] text-gray-400">
                  No country found
                </div>
              )}

            </div>

          </div>
        </>
      )}

      {/* VALIDATION */}

      {!error && mobile.length === 10 && (
        <p className="mt-1 text-[11px] text-green-600">
          Valid mobile number
        </p>
      )}

      {error && (
        <p className="mt-1 text-[11px] text-red-500">
          {error}
        </p>
      )}

    </div>
  );
}