import { Search, Filter, ChevronDown, CreditCard, Wallet } from "lucide-react";

export default function FilterBar() {
  return (
    <div className="bg-white border-b border-gray-100 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Main Search/Amount */}
          <div className="relative w-full md:w-96 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
              <span className="text-sm font-medium">ETB</span>
            </div>
            <input
              type="text"
              placeholder="Filter by Amount..."
              className="block w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-sm"
            />
          </div>

          {/* Filters Group */}
          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            {/* Category Filter */}
            <div className="relative min-w-[140px]">
               <select className="appearance-none w-full pl-10 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer">
                 <option>All Categories</option>
                 <option>Gaming</option>
                 <option>Talk Show</option>
                 <option>Lifestyle</option>
                 <option>Tech</option>
               </select>
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                 <Filter className="h-4 w-4" />
               </div>
               <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                 <ChevronDown className="h-4 w-4" />
               </div>
            </div>

            {/* Payment Method */}
             <div className="relative min-w-[160px]">
               <select className="appearance-none w-full pl-10 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer">
                 <option>Payment Method</option>
                 <option>Telebirr</option>
                 <option>Chapa</option>
                 <option>CBE Birr</option>
               </select>
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                 <Wallet className="h-4 w-4" />
               </div>
               <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                 <ChevronDown className="h-4 w-4" />
               </div>
            </div>
            
            <button className="hidden md:flex items-center justify-center p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors">
               <span className="sr-only">More Filters</span>
               <Filter className="h-4 w-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
