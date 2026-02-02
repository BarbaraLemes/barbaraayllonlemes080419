import Text from "../../../components/Text";
import Card from "../../../components/Card";
import Button from "../../../components/Button";

interface InfoTutorDetailProps {
  nome: string;
  telefone: string;
  email: string;
  endereco: string;
  cpf: string | number;
  onEdit: () => void;
  onDelete: () => void;
}

// Funções de formatação
const formatTelefone = (telefone: string) => {
  const numero = telefone.replace(/\D/g, "");
  if (numero.length === 11) {
    return `(${numero.slice(0, 2)}) ${numero.slice(2, 7)}-${numero.slice(7)}`;
  }
  return telefone;
};

const formatCPF = (cpf: string | number) => {
  const numero = String(cpf).padStart(11, '0').replace(/\D/g, "");
  if (numero.length === 11) {
    return `${numero.slice(0, 3)}.${numero.slice(3, 6)}.${numero.slice(6, 9)}-${numero.slice(9)}`;
  }
  return String(cpf);
};

export default function InfoTutorDetail({
  nome,
  telefone,
  email,
  endereco,
  cpf,
  onEdit,
  onDelete,
}: InfoTutorDetailProps) {
  return (
    <Card
      variant="default"
      padding="none"
      className="shadow-lg overflow-hidden"
    >
      <div className="bg-slate-900 text-white px-6 py-5 shadow-inner">
        <div className="flex items-center gap-2">
          <i className="pi pi-tag text-yellow-400 text-xl" />
          <Text variant="label-base" className="font-medium text-white">
            Informações completas do tutor
          </Text>
        </div>
      </div>

      {/* Container de informações */}
      <div className="px-6 pt-4 pb-6">
        <div className="mb-6 flex items-center justify-between">
          <Text
            as="h2"
            variant="heading-lg"
            className="text-slate-900 font-semibold"
          >
            {nome}
          </Text>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={onEdit}
              className="flex items-center gap-2"
            >
              <i className="pi pi-pencil" />
              Editar
            </Button>
            <Button
              variant="danger"
              onClick={onDelete}
              className="flex items-center gap-2"
            >
              <i className="pi pi-trash" />
              Excluir
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-l-4 border-yellow-400 pl-4">
            <div className="flex items-center gap-2 mb-2">
              <i className="pi pi-phone text-slate-400" />
              <Text variant="body-sm" className="text-slate-600">
                Telefone
              </Text>
            </div>
            <Text variant="body-base" className="text-slate-900 font-medium">
              {formatTelefone(telefone)}
            </Text>
          </div>

          <div className="border-l-4 border-yellow-400 pl-4">
            <div className="flex items-center gap-2 mb-2">
              <i className="pi pi-envelope text-slate-400" />
              <Text variant="body-sm" className="text-slate-600">
                E-mail
              </Text>
            </div>
            <Text variant="body-base" className="text-slate-900 font-medium">
              {email}
            </Text>
          </div>

          <div className="border-l-4 border-yellow-400 pl-4">
            <div className="flex items-center gap-2 mb-2">
              <i className="pi pi-map-marker text-slate-400" />
              <Text variant="body-sm" className="text-slate-600">
                Endereço
              </Text>
            </div>
            <Text variant="body-base" className="text-slate-900 font-medium">
              {endereco}
            </Text>
          </div>

          <div className="border-l-4 border-yellow-400 pl-4">
            <div className="flex items-center gap-2 mb-2">
              <i className="pi pi-id-card text-slate-400" />
              <Text variant="body-sm" className="text-slate-600">
                CPF
              </Text>
            </div>
            <Text variant="body-base" className="text-slate-900 font-medium">
              {formatCPF(cpf)}
            </Text>
          </div>
        </div>
      </div>
    </Card>
  );
}
