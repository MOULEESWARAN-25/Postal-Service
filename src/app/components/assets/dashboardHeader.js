import Link from "next/link";
import BackButton from "./backButton";
import { Calendar, Search } from "lucide-react";

function DashboardHeader() {
  return (
    <header className="sticky top-0 z-50 shadow-sm border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 md:px-6">
        {/* Back Button */}
        <div className="flex items-center space-x-4">
        <div role="tablist" className="tabs tabs-lifted">
        <a
          role="tab"
          className={`tab ${mapState.activeTab === 1 ? "tab-active" : ""}`}
          onClick={() => setMapState({ activeTab: 1 })}
        >
          Page 1
        </a>
        <a
          role="tab"
          className={`tab ${mapState.activeTab === 2 ? "tab-active" : ""}`}
          onClick={() => setMapState({ activeTab: 2 })}
        >
          Page 2
        </a>
        <a
          role="tab"
          className={`tab ${mapState.activeTab === 3 ? "tab-active" : ""}`}
          onClick={() => setMapState({ activeTab: 3 })}
        >
          Page 3
        </a>
      </div>
        </div>
        {/* Search Form */}
        <form className="flex w-full max-w-sm items-center space-x-2">
          <input
            type="search"
            placeholder="Search here..."
            className="flex-1 h-9 rounded-lg border bg-background px-3 text-sm bg-white text-black shadow-md"
          />
          <button
            type="submit"
            className="flex items-center px-3 py-2 bg-white text-black shadow-md rounded-md"
          >
            <Search className="h-4 w-4" />
          </button>
        </form>
      </div>
    </header>
  );
}

export default DashboardHeader;
