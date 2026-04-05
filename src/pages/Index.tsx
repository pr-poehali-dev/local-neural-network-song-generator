import { useState } from "react";
import Layout from "@/components/Layout";
import Generator from "@/pages/Generator";
import History from "@/pages/History";
import Settings from "@/pages/Settings";
import Gallery from "@/pages/Gallery";
import Help from "@/pages/Help";
import About from "@/pages/About";

type Page = "generator" | "history" | "settings" | "gallery" | "help" | "about";

export default function Index() {
  const [page, setPage] = useState<Page>("generator");

  const renderPage = () => {
    switch (page) {
      case "generator": return <Generator onGoHistory={() => setPage("history")} />;
      case "history": return <History onGoGenerator={() => setPage("generator")} />;
      case "settings": return <Settings />;
      case "gallery": return <Gallery />;
      case "help": return <Help />;
      case "about": return <About />;
      default: return <Generator onGoHistory={() => setPage("history")} />;
    }
  };

  return (
    <Layout page={page} onNav={setPage}>
      {renderPage()}
    </Layout>
  );
}
