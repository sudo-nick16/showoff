import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Filters({ setFilter }: { setFilter: React.Dispatch<React.SetStateAction<string>> }) {
  return (
    <Select onValueChange={(v) => setFilter(v)}>
      <SelectTrigger className="w-[180px] h-12">
        <SelectValue placeholder="Filter By" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem
            value="project"
          >
            Default
          </SelectItem>
          <SelectItem
            value="tech"
          >
            Tech
          </SelectItem>
          <SelectItem
            value="user"
          >
            Username
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
