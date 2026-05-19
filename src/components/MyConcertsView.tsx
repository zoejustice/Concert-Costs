"use client";

import { useMemo, useState } from "react";
import {
  FunnelIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import type { Concert } from "@/lib/types";
import { getTotalCost } from "@/lib/concert-math";
import { ConcertList } from "./ConcertList";

type SortKey = "date" | "cost" | "fun";

function concertYear(dateStr: string) {
  return dateStr.slice(0, 4);
}

function matchesSearch(concert: Concert, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const setlistText = (concert.setlist ?? []).join(" ").toLowerCase();
  const haystack = [
    concert.concert_name,
    concert.artist,
    concert.venue,
    concert.city,
    concert.state,
    concert.notes ?? "",
    setlistText,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(q);
}

export function MyConcertsView({ concerts }: { concerts: Concert[] }) {
  const [search, setSearch] = useState("");
  const [artistFilter, setArtistFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("date");
  const [sortAsc, setSortAsc] = useState(false);

  const artists = useMemo(() => {
    const names = new Set(concerts.map((c) => c.artist));
    return [...names].sort((a, b) => a.localeCompare(b));
  }, [concerts]);

  const years = useMemo(() => {
    const ys = new Set(concerts.map((c) => concertYear(c.concert_date)));
    return [...ys].sort((a, b) => Number(b) - Number(a));
  }, [concerts]);

  const hasActiveFilters =
    search.trim() !== "" || artistFilter !== "" || yearFilter !== "";

  const filteredConcerts = useMemo(() => {
    let list = concerts.filter((c) => {
      if (!matchesSearch(c, search)) return false;
      if (artistFilter && c.artist !== artistFilter) return false;
      if (yearFilter && concertYear(c.concert_date) !== yearFilter) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortBy === "date") {
        cmp =
          new Date(a.concert_date).getTime() -
          new Date(b.concert_date).getTime();
      } else if (sortBy === "cost") {
        cmp = getTotalCost(a) - getTotalCost(b);
      } else {
        cmp = a.fun_rating - b.fun_rating;
      }
      return sortAsc ? cmp : -cmp;
    });

    return list;
  }, [concerts, search, artistFilter, yearFilter, sortBy, sortAsc]);

  function clearFilters() {
    setSearch("");
    setArtistFilter("");
    setYearFilter("");
  }

  if (concerts.length === 0) {
    return <ConcertList concerts={[]} />;
  }

  return (
    <div className="space-y-6">
      <div className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body gap-4">
          <div className="flex items-center gap-2">
            <FunnelIcon className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Search, filter & sort</h3>
          </div>

          <label className="form-control w-full">
            <span className="label-text font-medium">Search</span>
            <label className="input input-bordered flex items-center gap-2 w-full">
              <MagnifyingGlassIcon className="h-5 w-5 text-base-content/50 shrink-0" />
              <input
                type="search"
                className="grow min-w-0"
                placeholder="Concert, artist, venue, city, notes, setlist…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search ? (
                <button
                  type="button"
                  className="btn btn-ghost btn-xs btn-square"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              ) : null}
            </label>
          </label>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="form-control w-full">
              <span className="label-text font-medium">Artist</span>
              <select
                className="select select-bordered w-full"
                value={artistFilter}
                onChange={(e) => setArtistFilter(e.target.value)}
              >
                <option value="">All artists</option>
                {artists.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-control w-full">
              <span className="label-text font-medium">Year</span>
              <select
                className="select select-bordered w-full"
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
              >
                <option value="">All years</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-control w-full">
              <span className="label-text font-medium">Sort by</span>
              <select
                className="select select-bordered w-full"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
              >
                <option value="date">Date</option>
                <option value="cost">Total cost</option>
                <option value="fun">Fun rating</option>
              </select>
            </label>

            <label className="form-control w-full">
              <span className="label-text font-medium">Order</span>
              <select
                className="select select-bordered w-full"
                value={sortAsc ? "asc" : "desc"}
                onChange={(e) => setSortAsc(e.target.value === "asc")}
              >
                <option value="desc">
                  {sortBy === "date"
                    ? "Newest first"
                    : sortBy === "cost"
                      ? "Highest cost"
                      : "Highest fun"}
                </option>
                <option value="asc">
                  {sortBy === "date"
                    ? "Oldest first"
                    : sortBy === "cost"
                      ? "Lowest cost"
                      : "Lowest fun"}
                </option>
              </select>
            </label>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <p className="text-base-content/70">
              Showing {filteredConcerts.length} of {concerts.length} concert
              {concerts.length === 1 ? "" : "s"}
            </p>
            {hasActiveFilters ? (
              <button
                type="button"
                className="btn btn-ghost btn-sm gap-1"
                onClick={clearFilters}
              >
                <XMarkIcon className="h-4 w-4" />
                Clear filters
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {filteredConcerts.length === 0 ? (
        <div className="card bg-base-100 border border-dashed border-base-300">
          <div className="card-body items-center text-center py-12">
            <p className="font-medium">No concerts match</p>
            <p className="text-sm text-base-content/70 mt-1 max-w-md">
              Try a different search, artist, or year — or clear your filters.
            </p>
            <button
              type="button"
              className="btn btn-primary btn-sm mt-4"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          </div>
        </div>
      ) : (
        <ConcertList concerts={filteredConcerts} hideEmptyState />
      )}
    </div>
  );
}
