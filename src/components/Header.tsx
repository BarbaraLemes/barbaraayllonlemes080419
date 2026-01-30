import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../modules/auth/hooks/useAuth";
import Button from "./Button";
import Text from "./Text";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Verifica se a rota atual está ativa para aplicar estilo
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <header className="bg-slate-900 shadow-xl sticky top-0 z-50">
      <div className="max-w-8xl mx-auto sm:px-5 lg:py-2">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="flex justify-center items-center">
              <img src="/Pata.svg" alt="Pata" className="h-14" />
            </div>

            <Text
              as="h1"
              variant="heading-2xl"
              className="text-white font-bold text-base sm:text-xl md:text-2xl"
            >
              Sistema de Gestão de Pets
            </Text>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <nav className="flex gap-1 md:gap-2">
              <Button
                variant={isActive("/pets") ? "primary" : "ghost"}
                onClick={() => navigate("/pets")}
                className={`
                  px-3 py-2 md:px-5 rounded-lg font-medium transition-all text-sm md:text-base
                  ${
                    isActive("/pets")
                      ? "text-yellow-400"
                      : "text-white hover:text-white hover:bg-slate-700"
                  }
                `}
              >
                <span className="sm:inline">Pets</span>
              </Button>

              <Button
                variant={isActive("/tutores") ? "primary" : "ghost"}
                onClick={() => navigate("/tutores")}
                className={`
                  px-3 py-2 md:px-5 rounded-lg font-medium transition-all text-sm md:text-base
                  ${
                    isActive("/tutores")
                      ? "text-yellow-400"
                      : "text-white hover:text-white hover:bg-slate-700"
                  }
                `}
              >
                <span className="sm:inline">Tutores</span>
              </Button>
            </nav>

            <div className="h-9 w-px bg-slate-700"></div>

            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="flex items-center gap-2 text-white hover:bg-slate-700 px-3 py-2 md:px-5 rounded-lg text-sm md:text-base"
              >
                <i className="pi pi-sign-out" />
                <span className="hidden md:inline">Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
