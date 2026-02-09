
import EventComparisonTable from "../components/EventComparisonTable";
import OrganizerPanel from "../components/OrganizerPanel";
import { useState } from "react";

const Index = () => {
  const [curatorMode, setCuratorMode] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background/90 flex flex-col items-center justify-start py-4 sm:py-10 w-full">
      <div className="w-full max-w-7xl px-4 sm:px-8">
        <header className="flex flex-col gap-3 mb-4 sm:mb-6">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-1">
              Event Compare & Analytics
            </h1>
            <p className="text-sm sm:text-lg text-muted-foreground">
              Compare ticketed events by live crowd, guest enjoyment, and cost.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <a
              href="/"
              className="px-3 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-base rounded-lg font-semibold transition-colors shadow border bg-secondary text-secondary-foreground hover:bg-secondary/80"
            >
              ← Discover
            </a>
            <button
              onClick={() => setCuratorMode((v) => !v)}
              className="px-3 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-base rounded-lg font-semibold transition-colors shadow border bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {curatorMode ? "Compare" : "Organizer"}
            </button>
            <a
              href="/venue-events"
              className="px-3 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-base rounded-lg font-semibold transition-colors shadow border bg-secondary text-secondary-foreground hover:bg-secondary/80"
            >
              Venues
            </a>
          </div>
        </header>
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <section className={`${curatorMode ? "hidden" : "block"} col-span-1 lg:col-span-8`}>
            <EventComparisonTable />
          </section>
          <section className={`${curatorMode ? "block" : "hidden"} col-span-1 lg:col-span-12`}>
            <OrganizerPanel />
          </section>
          <aside className={`hidden lg:block col-span-4`}>
            <div className="sticky top-10 space-y-6">
              <div className="bg-card rounded-xl shadow-lg p-6 border border-border">
                <h2 className="font-bold text-lg mb-2">How it works</h2>
                <ul className="list-disc list-inside text-sm text-muted-foreground pl-2 space-y-1">
                  <li>Compare crowd & enjoyment levels before buying.</li>
                  <li>Enjoyment rating is based on guest feedback.</li>
                  <li>Organizers can manage event stats & boost ranking.</li>
                </ul>
              </div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
};

export default Index;
