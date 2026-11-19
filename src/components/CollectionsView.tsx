/**
 * =============================================================================
 * Curated Collections / Custom Lists View
 * =============================================================================
 *
 * Allows users to create and manage personal themed collections
 * (e.g., "A24 Gems", "Mind-Bending Sci-Fi", "Halloween Marathon")
 */

"use client";

import { useState, useEffect } from "react";
import {
  FolderPlus,
  List,
  Plus,
  Trash2,
  Film,
  Star,
  X,
  Sparkles,
  ChevronRight,
  Layers,
} from "lucide-react";
import type { MovieEntry, CustomList } from "@/lib/types";
import { MovieImage } from "./common/MovieImage";

interface CollectionsViewProps {
  entries: MovieEntry[];
  onSelectEntry: (entry: MovieEntry) => void;
}

const STORAGE_KEY = "couch-critics-custom-lists";

export function CollectionsView({ entries, onSelectEntry }: CollectionsViewProps) {
  const [lists, setLists] = useState<CustomList[]>([]);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newListDesc, setNewListDesc] = useState("");
  const [isAddingMovie, setIsAddingMovie] = useState(false);

  // Load lists from storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setLists(parsed);
            setSelectedListId(parsed[0].id);
            return;
          }
        }
      } catch {}
    }

    // Default Starter Collection if empty
    const defaultList: CustomList = {
      id: "starter-collection-1",
      name: "Top Favorites & Masterpieces",
      description: "My personal cinema highlights, unforgettable narratives, and highest rated stories.",
      entryIds: entries.slice(0, 6).map((e) => e.id),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setLists([defaultList]);
    setSelectedListId(defaultList.id);
  }, [entries]);

  // Save lists to storage
  function saveLists(updated: CustomList[]) {
    setLists(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
    }
  }

  function handleCreateList() {
    if (!newListName.trim()) return;
    const newList: CustomList = {
      id: `list-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: newListName.trim(),
      description: newListDesc.trim(),
      entryIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const next = [...lists, newList];
    saveLists(next);
    setSelectedListId(newList.id);
    setNewListName("");
    setNewListDesc("");
    setIsCreatingList(false);
  }

  function handleDeleteList(id: string) {
    const next = lists.filter((l) => l.id !== id);
    saveLists(next);
    if (selectedListId === id) {
      setSelectedListId(next.length > 0 ? next[0].id : null);
    }
  }

  function handleToggleMovieInList(entryId: string) {
    if (!selectedListId) return;
    const currentList = lists.find((l) => l.id === selectedListId);
    if (!currentList) return;

    const exists = currentList.entryIds.includes(entryId);
    const updatedEntryIds = exists
      ? currentList.entryIds.filter((id) => id !== entryId)
      : [...currentList.entryIds, entryId];

    const next = lists.map((l) =>
      l.id === selectedListId ? { ...l, entryIds: updatedEntryIds, updatedAt: new Date().toISOString() } : l
    );
    saveLists(next);
  }

  const activeList = lists.find((l) => l.id === selectedListId) || lists[0];
  const activeListEntries = activeList
    ? entries.filter((e) => activeList.entryIds.includes(e.id))
    : [];

  return (
    <div className="space-y-6">
      {/* ── Header Bar ────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#15151C] border border-[#292932]">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-rose-500" />
          <span className="text-sm font-bold text-white">Curated Film Collections</span>
          <span className="text-xs text-[#A1A1AA]">
            ({lists.length} {lists.length === 1 ? "list" : "lists"})
          </span>
        </div>

        <button
          onClick={() => setIsCreatingList(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#D97706] hover:bg-[#F59E0B] text-white text-xs font-semibold shadow transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Collection</span>
        </button>
      </div>

      {/* ── New List Form Modal / Card ────────────────────────────── */}
      {isCreatingList && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#15151C] border border-[#292932] space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <FolderPlus className="w-4 h-4 text-[#D97706]" />
              Create New Curated Collection
            </h4>
            <button
              onClick={() => setIsCreatingList(false)}
              className="p-1 rounded-lg hover:bg-white/10 text-[#A1A1AA] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-[#A1A1AA] block mb-1">
                Collection Name *
              </label>
              <input
                type="text"
                placeholder="e.g. A24 Favorites, 90s Cyberpunk, Comfort Series"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                className="w-full bg-[#0B0B0F] border border-[#292932] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-[#D97706]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#A1A1AA] block mb-1">
                Description (Optional)
              </label>
              <input
                type="text"
                placeholder="Brief theme or description of this list..."
                value={newListDesc}
                onChange={(e) => setNewListDesc(e.target.value)}
                className="w-full bg-[#0B0B0F] border border-[#292932] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-[#D97706]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsCreatingList(false)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#A1A1AA] hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateList}
              disabled={!newListName.trim()}
              className="px-4 py-1.5 rounded-xl bg-[#D97706] hover:bg-[#F59E0B] text-white text-xs font-semibold shadow disabled:opacity-50 cursor-pointer"
            >
              Create List
            </button>
          </div>
        </div>
      )}

      {/* ── Main Layout: Lists Tabs + Grid ────────────────────────── */}
      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        {/* Left: Lists Menu */}
        <div className="space-y-2">
          <div className="px-1 pb-1 text-[10px] uppercase font-bold text-[#A1A1AA] tracking-wider">
            Your Collections
          </div>
          <div className="space-y-1.5">
            {lists.map((l) => (
              <div
                key={l.id}
                onClick={() => setSelectedListId(l.id)}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer group ${
                  selectedListId === l.id
                    ? "bg-[#D97706]/15 border-[#D97706]/40 text-white"
                    : "bg-[#15151C] border-[#292932] text-[#A1A1AA] hover:text-white hover:border-[#3D3D4C]"
                }`}
              >
                <div className="min-w-0 pr-2">
                  <p className="text-xs font-bold truncate text-white">{l.name}</p>
                  <p className="text-[10px] text-[#A1A1AA] truncate font-mono">
                    {l.entryIds.length} titles
                  </p>
                </div>

                {lists.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteList(l.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-rose-500/20 text-[#A1A1AA] hover:text-rose-400 transition-all"
                    title="Delete collection"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Active Collection Details & Entries */}
        {activeList && (
          <div className="space-y-5">
            <div className="p-4 sm:p-5 rounded-2xl bg-[#15151C] border border-[#292932] flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>{activeList.name}</span>
                  <span className="text-xs font-mono font-normal text-[#A1A1AA] bg-white/5 px-2 py-0.5 rounded-md border border-[#292932]">
                    {activeListEntries.length} items
                  </span>
                </h3>
                {activeList.description && (
                  <p className="text-xs text-[#A1A1AA] mt-1">{activeList.description}</p>
                )}
              </div>

              <button
                onClick={() => setIsAddingMovie(!isAddingMovie)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/10 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAddingMovie ? "Done Adding" : "Manage Titles"}</span>
              </button>
            </div>

            {/* Manage Titles Picker */}
            {isAddingMovie && (
              <div className="p-4 rounded-2xl bg-[#0B0B0F] border border-[#292932] space-y-3">
                <p className="text-xs text-[#A1A1AA]">
                  Click on any title from your journal to toggle its inclusion in &ldquo;{activeList.name}&rdquo;:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-60 overflow-y-auto pr-1">
                  {entries.map((e) => {
                    const isIncluded = activeList.entryIds.includes(e.id);
                    return (
                      <button
                        key={e.id}
                        onClick={() => handleToggleMovieInList(e.id)}
                        className={`p-2 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                          isIncluded
                            ? "bg-[#D97706]/20 border-[#D97706] text-white"
                            : "bg-[#15151C] border-[#292932] text-[#A1A1AA] hover:text-white"
                        }`}
                      >
                        <span className="truncate">{e.tmdb.title}</span>
                        <span className="text-[10px] font-bold ml-1 font-mono">
                          {isIncluded ? "✓" : "+"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Posters Grid */}
            {activeListEntries.length > 0 ? (
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
                {activeListEntries.map((entry) => (
                  <div
                    key={entry.id}
                    onClick={() => onSelectEntry(entry)}
                    className="p-2.5 rounded-xl bg-[#15151C] hover:bg-[#1A1A24] border border-[#292932] hover:border-[#3D3D4C] transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="aspect-[2/3] w-full rounded-lg overflow-hidden bg-[#0B0B0F] border border-[#292932] mb-2 relative">
                      <MovieImage
                        src={entry.tmdb.posterUrl}
                        alt={entry.tmdb.title}
                        title={entry.tmdb.title}
                        mediaType={entry.tmdb.mediaType}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      {entry.review?.rating && (
                        <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-bold font-mono text-[#F5C542] border border-[#F5C542]/30 flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5 fill-[#F5C542]" />
                          <span>{entry.review.rating}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white truncate group-hover:text-[#D97706] transition-colors">
                        {entry.tmdb.title}
                      </h4>
                      <p className="text-[10px] text-[#A1A1AA] truncate mt-0.5">
                        {entry.tmdb.releaseYear} · {entry.tmdb.genres.slice(0, 2).join(", ")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center rounded-2xl bg-[#15151C] border border-[#292932]">
                <p className="text-xs text-[#A1A1AA]">
                  This collection is currently empty. Click &ldquo;Manage Titles&rdquo; to add movies and shows!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
