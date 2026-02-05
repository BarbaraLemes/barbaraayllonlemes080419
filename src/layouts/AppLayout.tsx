import { Outlet } from "react-router-dom";
import Header from "../shared/components/layout/Header";
import ScrollToTop from "../shared/components/navigation/ScrollToTop";

export default function AppLayout() {
  return (
    <div className="min-h-screen">
      <ScrollToTop />
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
