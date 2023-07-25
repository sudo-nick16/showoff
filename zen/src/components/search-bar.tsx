import { useEffect, useState } from "react";
import Filters from "./filters";
import useAxios from "@/hooks/useAxios";
import { Project } from "@/types";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import OutsideClickWrapper from "./outside-click-wrapper";

export default function SearchBar() {
  const [suggestions, setSuggestions] = useState<Project[]>([]);
  const [query, setQuery] = useState<string>("");
  const [filter, setFilter] = useState<string>("project");
  const api = useAxios();
  const router = useRouter();

  useEffect(() => {
    const search = async () => {
      if (query.trim().length < 1) {
        setSuggestions([]);
        return;
      }
      const res = await api.get(
        `/stellar/projects/search?q=${query}&filter=${filter}`
      );
      if (!res.data.error) {
        console.log(res.data.projects);
        setSuggestions(res.data.projects);
      }
    };
    search();
  }, [query]);
  return (
    <OutsideClickWrapper as="div" listenerState={suggestions.length > 0} onOutsideClick={() => setSuggestions([])} className="w-[30rem] flex items-center gap-3">
      <div className="rounded-lg border w-full h-12 relative flex items-center px-3">
        <MagnifyingGlassIcon className="w-6 h-6 text-gray-600" />
        <input
          className="bg-transparent ml-2 outline-none grow h-full"
          value={query}
          onChange={(e) => setQuery(e.target.value.trimStart())}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              router.push(`/search?q=${query}&filter=${filter}`)
            }
          }}
        />
        {suggestions.length > 0 && (
          <div className="absolute top-full left-0 mt-1 p-1 w-full rounded-md overflow-hidden border border-gray-600 bg-popover">
            {suggestions.slice(0, 6).map((suggestion) => (
              <Link key={suggestion.slug} target="_blank" href={`/${suggestion.username}/${suggestion.slug}`}>
                <div
                  className="hover:bg-muted cursor-pointer px-2 py-1 rounded-sm flex items-center gap-3"
                >
                  <Image
                    src={suggestion.img}
                    alt={suggestion.title}
                    className="rounded-lg"
                    width={32}
                    height={32}
                  />
                  <div className="flex flex-col text-sm">
                    <h3 className="font-semibold line-clamp-1">{suggestion.title}</h3>
                    <p className="line-clamp-1 text-muted-foreground">
                      {suggestion.tagline}
                    </p>
                  </div>
                </div>

              </Link>
            ))}
          </div>
        )}
      </div>
      <Filters setFilter={setFilter} />
    </OutsideClickWrapper>
  );
}
