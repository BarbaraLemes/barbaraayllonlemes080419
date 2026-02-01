interface ImagePetDetailProps {
  imageUrl?: string;
  nome: string;
}

export default function ImagePetDetail({ imageUrl, nome }: ImagePetDetailProps) {
  return (
    <div className="sticky top-24">
      <div className="w-80 h-80 bg-slate-200 rounded-lg overflow-hidden shadow-lg flex items-center justify-center mb-4 relative">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={nome}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <i className="pi pi-image text-slate-400 text-6xl" />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-yellow-400 text-slate-900 font-bold text-center py-3">
          {nome}
        </div>
      </div>
    </div>
  );
}