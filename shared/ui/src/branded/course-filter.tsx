"use client"

import {
  CossUISelect as Select,
  CossUISelectPopup as SelectContent,
  CossUISelectItem as SelectItem,
  CossUISelectTrigger as SelectTrigger,
  CossUISelectValue as SelectValue,
} from "../cossui"
import { useState } from "react"

interface CourseFilterProps {
  className?: string
  onFilterChange?: (filter: string) => void
}

export function CourseFilter({ className, onFilterChange }: CourseFilterProps) {
  const [selectedFilter, setSelectedFilter] = useState("all")

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value)
    onFilterChange?.(value)
  }

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <span className="text-white font-montserrat-alt text-sm">Kategorie:</span>
      <Select value={selectedFilter} onValueChange={handleFilterChange}>
        <SelectTrigger className="w-[180px] bg-card border-border text-white hover:border-primary/50 transition-colors">
          <SelectValue placeholder="Alle Kurse" />
        </SelectTrigger>
        <SelectContent className="bg-card border-border">
          <SelectItem value="all" className="text-white hover:bg-primary/10 focus:bg-primary/10">
            Alle Kurse
          </SelectItem>
          <SelectItem value="lcq" className="text-white hover:bg-primary/10 focus:bg-primary/10">
            LCQ - Channeling Events
          </SelectItem>
          <SelectItem value="basis" className="text-white hover:bg-primary/10 focus:bg-primary/10">
            Basis
          </SelectItem>
          <SelectItem value="aufbau" className="text-white hover:bg-primary/10 focus:bg-primary/10">
            Aufbau
          </SelectItem>
          <SelectItem value="fortgeschritten" className="text-white hover:bg-primary/10 focus:bg-primary/10">
            Fortgeschritten
          </SelectItem>
          <SelectItem value="master" className="text-white hover:bg-primary/10 focus:bg-primary/10">
            Master
          </SelectItem>
          <SelectItem value="interview" className="text-white hover:bg-primary/10 focus:bg-primary/10">
            Interview
          </SelectItem>
          <SelectItem value="q&a" className="text-white hover:bg-primary/10 focus:bg-primary/10">
            Q&A
          </SelectItem>
          <SelectItem value="kostenlos" className="text-white hover:bg-primary/10 focus:bg-primary/10">
            Kostenlos
          </SelectItem>
          <SelectItem value="intensiv" className="text-white hover:bg-primary/10 focus:bg-primary/10">
            Intensiv
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
