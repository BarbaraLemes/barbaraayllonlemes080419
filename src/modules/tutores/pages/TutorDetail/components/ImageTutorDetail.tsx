import Card from "../../../../../shared/components/ui/Card";
import Text from "../../../../../shared/components/ui/Text";

interface ImageTutorDetailProps {
  imageUrl?: string;
  nome: string;
  petsCount: number;
}

export default function ImageTutorDetail({ imageUrl, nome, petsCount }: ImageTutorDetailProps) {
  return (
    <div className="lg:sticky lg:top-24">
      {/* Card da Foto */}
      <div className="w-full sm:w-80 h-64 sm:h-80 bg-slate-200 rounded-lg overflow-hidden shadow-lg flex items-center justify-center mb-4 relative">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={nome}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <i className="pi pi-user text-slate-400 text-4xl sm:text-6xl" />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-yellow-400 text-slate-900 font-bold text-center py-2 sm:py-3 text-sm sm:text-base">
          {nome}
        </div>
      </div>

      {/* Card de Pets Vinculados */}
      <Card variant="default" padding="md" className="w-full sm:w-80 h-32 sm:h-40 shadow-lg text-center">
        <div className="flex flex-col items-center gap-1 sm:gap-2">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-yellow-400 flex items-center justify-center">
            <img src="/pata_azul.svg" alt="Pata" className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <Text variant="heading-xl" className="text-slate-900 font-bold">
            {petsCount}
          </Text>
          <Text variant="body-sm" className="text-slate-600">
            Pets vinculados
          </Text>
        </div>
      </Card>
    </div>
  );
}