import Card from "../../../components/Card";
import Text from "../../../components/Text";
import type { Tutor } from "../../tutores/types/tutores.types";

interface PetTutorInfoProps {
  tutores: Tutor[];
}

// Função para formatar telefone
const formatTelefone = (telefone: string): string => {
  const cleaned = telefone.replace(/\D/g, "");
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }
  return telefone;
};

export default function PetTutorInfo({ tutores }: PetTutorInfoProps) {
  if (!tutores || tutores.length === 0) return null;

  return (
    <Card variant="default" padding="none" className="shadow-lg overflow-hidden">

      <div className="bg-slate-900 text-white px-6 py-5 shadow-lg">
        <div className="flex items-center gap-2">
          <i className="pi pi-id-card text-yellow-400 text-xl" />
          <Text as="h2" variant="label-base" className="text-white">
            Tutores Responsáveis
          </Text>
        </div>
      </div>

      {/* Container de informações */}
      <div className="px-6 pt-4 pb-6">
        {tutores.map((tutor, index) => (
          <div key={tutor.id}>
            <div className="space-y-4">
            <div className="flex items-start gap-3">
              <i className="pi pi-user text-yellow-400 mt-0.5" />
              <div className="flex flex-col">
                <Text variant="body-sm" className="text-slate-600 mb-1">
                  Nome
                </Text>
                <Text variant="body-base" className="text-slate-900 font-medium">
                  {tutor.nome}
                </Text>
              </div>
            </div>

            {tutor.telefone && (
              <div className="flex items-start gap-3">
                <i className="pi pi-phone text-yellow-400 mt-0.5" />
                <div className="flex flex-col">
                  <Text variant="body-sm" className="text-slate-600 mb-1">
                    Telefone
                  </Text>
                  <Text variant="body-base" className="text-slate-900">
                    {formatTelefone(tutor.telefone)}
                  </Text>
                </div>
              </div>
            )}

            {tutor.email && (
              <div className="flex items-start gap-3">
                <i className="pi pi-envelope text-yellow-400 mt-0.5" />
                <div className="flex flex-col">
                  <Text variant="body-sm" className="text-slate-600 mb-1">
                    E-mail
                  </Text>
                  <Text variant="body-base" className="text-slate-900">
                    {tutor.email}
                  </Text>
                </div>
              </div>
            )}
          </div>

          {/* Separador entre tutores */}
          {index < tutores.length - 1 && (
            <hr className="my-6 border-slate-200" />
          )}
        </div>
      ))}
      </div>
    </Card>
  );
}