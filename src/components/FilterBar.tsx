"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Filter, ChevronDown, Wallet, Hash, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropdownProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
  placeholder: string;
}

function CustomDropdown({ options, value, onChange, icon, placeholder }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative min-w-[180px]" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between pl-5 pr-4 py-3 bg-white border rounded-full transition-all duration-300 shadow-sm hover:shadow-md",
          isOpen ? "border-lime-400 ring-4 ring-lime-400/10" : "border-gray-200/50"
        )}
      >
        <div className="flex items-center gap-2.5">
          {icon && <span className="text-black scale-90">{icon}</span>}
          <span className={cn("text-sm font-bold", value ? "text-black" : "text-gray-500")}>
            {value || placeholder}
          </span>
        </div>
        <ChevronDown className={cn("h-3.5 w-3.5 text-gray-400 transition-transform duration-300", isOpen && "rotate-180 text-black")} />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+6px)] left-0 w-full bg-white/95 backdrop-blur-xl border border-gray-100 rounded-3xl shadow-2xl p-1 z-[60] animate-in fade-in zoom-in-95 duration-200 origin-top overflow-hidden">
          <div className="max-h-[240px] overflow-y-auto no-scrollbar py-0.5">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-2.5 rounded-2xl text-sm font-bold transition-all duration-200 text-left",
                  value === option 
                    ? "bg-black text-white" 
                    : "text-gray-700 hover:bg-lime-400 hover:text-black"
                )}
              >
                {option}
                {value === option && <Check className="h-3.5 w-3.5" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function FilterBar() {
  const [category, setCategory] = useState("");
  const [payment, setPayment] = useState("");

  const categories = ["Gaming", "Talk Show", "Lifestyle", "Tech", "Beauty", "Finance"];
  const paymentMethods = ["Telebirr", "Chapa", "CBE Birr", "Safaricom M-Pesa"];

  return (
    <div className="bg-[#F3F4F6]/80 backdrop-blur-md border-b border-white/50 py-6 sticky top-20 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
          
          {/* Main Search/Amount */}
          <div className="relative w-full md:w-96 group">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none border-r border-gray-100 my-3">
              <span className="text-xs font-black text-black pr-3">ETB</span>
            </div>
            <input
              type="text"
              placeholder="Filter by Amount..."
              className="block w-full pl-16 pr-6 py-4 bg-white border border-gray-200/50 rounded-full text-black placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-lime-400/10 focus:border-lime-400 transition-all font-bold text-sm shadow-sm group-hover:shadow-md"
            />
          </div>

          {/* Filters Group */}
          <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto md:overflow-visible pb-2 md:pb-0 no-scrollbar">
            <CustomDropdown 
              options={categories}
              value={category}
              onChange={setCategory}
              icon={<Hash className="h-4 w-4" />}
              placeholder="All Categories"
            />

            <CustomDropdown 
              options={paymentMethods}
              value={payment}
              onChange={setPayment}
              icon={<Wallet className="h-4 w-4" />}
              placeholder="Payment Method"
            />
            
            <button className="flex-shrink-0 flex items-center justify-center h-[56px] w-[56px] rounded-full bg-black text-white hover:bg-lime-400 hover:text-black transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95 group">
               <span className="sr-only">More Filters</span>
               <Filter className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
