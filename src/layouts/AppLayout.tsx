import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import ScrollToTop from "../components/ScrollToTop";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <ScrollToTop />
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
