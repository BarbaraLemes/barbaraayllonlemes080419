import Card from "../../../../../shared/components/ui/Card";
import Text from "../../../../../shared/components/ui/Text";

interface TutorCardProps {
  id: number;
  nome: string;
  telefone: string;
  email: string;
  endereco: string;
  imageUrl?: string;
  onClick: (id: number) => void;
}

// Função de formatação de telefone
const formatTelefone = (telefone: string) => {
  const numero = telefone.replace(/\D/g, "");
  if (numero.length === 11) {
    return `(${numero.slice(0, 2)}) ${numero.slice(2, 7)}-${numero.slice(7)}`;
  }
  return telefone;
};

export default function TutorCard({
  id,
  nome,
  telefone,
  email,
  endereco,
  imageUrl,
  onClick,
}: TutorCardProps) {
  const handleClick = () => {
    onClick(id);
  };

  return (
    <Card
      variant="default"
      padding="none"
      className="overflow-hidden relative shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
      onClick={handleClick}
    >
      <div className="p-4 sm:p-6 pointer-events-none">
        <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full border-4 border-yellow-100 bg-slate-200 flex items-center justify-center overflow-hidden">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={nome}
                  className="w-full h-full object-cover"
                />
              ) : (
                <i className="pi pi-user text-slate-400 text-2xl sm:text-4xl" />
              )}
            </div>
          </div>

          <div className="flex-1 space-y-1 sm:space-y-2">
            <Text variant="heading-lg" className="text-slate-900 font-semibold">
              {nome}
            </Text>

            {telefone && (
              <div className="flex items-center gap-2 text-slate-600">
                <i className="pi pi-phone text-sm" />
                <Text variant="body-sm" className="text-slate-600">
                  {formatTelefone(telefone)}
                </Text>
              </div>
            )}

            {email && (
              <div className="flex items-center gap-2 text-slate-600">
                <i className="pi pi-envelope text-sm" />
                <Text variant="body-sm" className="text-slate-600">
                  {email}
                </Text>
              </div>
            )}
          </div>
        </div>

        {endereco && (
          <div className="flex items-start gap-2 text-slate-600">
            <i className="pi pi-map-marker text-sm mt-0.5" />
            <Text variant="body-sm" className="text-slate-600">
              {endereco}
            </Text>
          </div>
        )}
      </div>
    </Card>
  );
}
