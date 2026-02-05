import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../modules/auth/hooks/useAuth";
import Button from "../ui/Button";
import Text from "../ui/Text";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleNavigateToPets = () => {
    sessionStorage.removeItem('pets-current-page');
    navigate("/pets");
  };

  const handleNavigateToTutores = () => {
    sessionStorage.removeItem('tutores-current-page');
    navigate("/tutores");
  };

  // Verifica se a rota atual está ativa para aplicar estilo
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <header className="bg-slate-900 shadow-xl sticky top-0 z-50">
      <div className="max-w-8xl mx-auto px-3 sm:px-5 py-1 sm:py-0 lg:py-2">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center gap-2 sm:gap-3 cursor-pointer" onClick={handleNavigateToPets}>
            <div className="flex justify-center items-center">
              <img src="/Pata.svg" alt="Pata" className="h-10 sm:h-14" />
            </div>

            <Text
              as="h1"
              variant="heading-2xl"
              className="text-white font-bold text-sm sm:text-base md:text-xl lg:text-2xl"
            >
              Sistema de Gestão de Pets
            </Text>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
            <nav className="flex gap-1 md:gap-2">
              <Button
                variant={isActive("/pets") ? "primary" : "ghost"}
                onClick={handleNavigateToPets}
                className={`
                  px-3 py-2 sm:px-3 sm:py-2 md:px-5 rounded-lg font-medium transition-all text-xs sm:text-sm md:text-base
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
                onClick={handleNavigateToTutores}
                className={`
                  px-2 py-1.5 sm:px-3 sm:py-2 md:px-5 rounded-lg font-medium transition-all text-xs sm:text-sm md:text-base
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

            <div className="h-7 sm:h-9 w-px bg-slate-700"></div>

            <div className="flex items-center gap-1 sm:gap-2">
              <div className="bg-yellow-400 rounded-full h-7 w-7 sm:h-9 sm:w-9 flex items-center justify-center">
                <i className="pi pi-user text-slate-900 text-xs sm:text-sm" />
              </div>
              <Text className="text-white text-xs sm:text-sm font-medium hidden sm:inline">admin</Text>
            </div>

            <div className="h-7 sm:h-9 w-px bg-slate-700"></div>

            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="flex items-center gap-1 sm:gap-2 text-white hover:bg-slate-700 px-2 py-1.5 sm:px-3 sm:py-2 md:px-5 rounded-lg text-xs sm:text-sm md:text-base"
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
