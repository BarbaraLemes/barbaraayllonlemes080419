import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FileUpload } from "primereact/fileupload";
import Text from "../../../../shared/components/ui/Text";
import Button from "../../../../shared/components/ui/Button";
import Card from "../../../../shared/components/ui/Card";
import InputText from "../../../../shared/components/ui/InputText";
import ConfirmDialog from "../../../../shared/components/feedback/ConfirmDialog";
import { petsService } from "../../services/pets.service";
import type { PetRequest } from "../../types/pets.types";
import { useToast } from "../../../../contexts/ToastContext";

// Schema de validação com Zod
const petFormSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório").max(50, "Nome muito longo"),
  raca: z.string().min(1, "Raça é obrigatória").max(50, "Nome da raça muito longa"),
  idade: z.string().min(1, "Idade é obrigatória"),
});

type PetFormInput = z.infer<typeof petFormSchema>;

export default function PetForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id && id !== "novo";
  const { showToast } = useToast();

  const [isLoadingData, setIsLoadingData] = useState(isEditing);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentFoto, setCurrentFoto] = useState<{ id: number; url: string } | null>(null);
  const [showDeleteFotoDialog, setShowDeleteFotoDialog] = useState(false);
  const fileUploadRef = useRef<FileUpload>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PetFormInput>({
    resolver: zodResolver(petFormSchema),
    defaultValues: {
      nome: "",
      raca: "",
      idade: "",
    },
  });

  // Carregar dados do pet se for edição
  useEffect(() => {
    const loadData = async () => {
      try {
        // Se for edição, carregar dados do pet
        if (isEditing) {
          const pet = await petsService.getPetById(Number(id));
          reset({
            nome: pet.nome,
            raca: pet.raca,
            idade: String(pet.idade),
          });
          // Carregar foto atual se existir
          if (pet.foto) {
            setCurrentFoto({ id: pet.foto.id, url: pet.foto.url });
          }
        }
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
  }, [id, isEditing, reset]);

  const onSubmit = async (data: PetFormInput) => {
    try {
      const idade = Number(data.idade);
      
      // Validar idade
      if (isNaN(idade) || idade < 0 || idade > 60) {
        showToast("error", "Erro", "Idade deve ser um número entre 0 e 60");
        return;
      }

      const petData: PetRequest = {
        nome: data.nome,
        raca: data.raca,
        idade: idade,
      };

      let petId: number;

      if (isEditing) {
        await petsService.updatePet(Number(id), petData);
        petId = Number(id);
      } else {
        const novoPet = await petsService.createPet(petData);
        petId = novoPet.id;
      }

      // Se tiver foto selecionada, fazer upload
      if (selectedFile) {
        try {
          await petsService.uploadFotoPet(petId, selectedFile);
        } catch (uploadErr) {
          console.error("Erro ao fazer upload da foto:", uploadErr);
          showToast("warn", "Aviso", "Pet salvo, mas houve erro ao enviar a foto.");
        }
      }

      // Mostrar toast de sucesso
      if (isEditing) {
        showToast("success", "Sucesso", "Alterações salvas com sucesso!");
      } else {
        showToast("success", "Sucesso", "Pet cadastrado com sucesso!");
      }

      // Redirecionar para a página de detalhes
      navigate(`/pets/${petId}`);
    } catch (err: any) {
      console.error("Erro ao salvar pet:", err);
      showToast("error", "Erro", err.response?.data?.message || "Erro ao salvar pet");
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const onFileSelect = (e: any) => {
    const file = e.files[0];
    if (file) {
      setSelectedFile(file);
      // Criar URL de preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const handleDeleteFoto = async () => {
    if (!currentFoto || !id) return;

    try {
      await petsService.deleteFotoPet(Number(id), currentFoto.id);
      setCurrentFoto(null);
      showToast("success", "Sucesso", "Foto excluída com sucesso!");
    } catch (err) {
      console.error("Erro ao excluir foto:", err);
      showToast("error", "Erro", "Erro ao excluir foto. Tente novamente.");
    }
  };

  if (isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <i className="pi pi-spin pi-spinner text-slate-400 text-4xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">

        <div className="mb-4 sm:mb-6">
          <Button
            icon="pi pi-arrow-left"
            onClick={() => navigate(isEditing ? `/pets/${id}` : "/pets")}
            variant="ghost"
            className="text-xs sm:text-sm md:text-base"
          >
            {isEditing ? "Voltar para detalhes" : "Voltar para lista de pets"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-4 sm:gap-6 mt-4">
          {/* Foto do Pet */}
          <div className="space-y-0">
            <Card variant="default" padding="none" className="shadow-lg border-none overflow-hidden h-fit">
              <div className="bg-slate-900 text-white px-4 sm:px-5 py-3 sm:py-4 flex items-center gap-2">
                <i className="pi pi-user text-xs sm:text-sm" />
                <Text variant="body-sm" className="font-medium text-white">
                  Foto do Pet
                </Text>
              </div>

              {/* Área de Preview da Foto */}
              <div className="bg-slate-100 p-4 sm:p-6 flex items-center justify-center relative">
                {previewUrl || currentFoto ? (
                  <div className="w-full aspect-square rounded-md overflow-hidden relative">
                    <img
                      src={previewUrl || currentFoto?.url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    {isEditing && currentFoto && !previewUrl && (
                      <Button
                        type="button"
                        variant="danger"
                        icon="pi pi-trash"
                        onClick={() => setShowDeleteFotoDialog(true)}
                        className="absolute top-2 right-2 bg-red-500 rounded-full transition-colors shadow-lg"
                        tooltip="Excluir Foto"
                      />
                    )}
                  </div>
                ) : (
                  <div className="w-full aspect-square bg-slate-200 rounded-md flex items-center justify-center">
                    <i className="pi pi-user text-slate-400 text-[90px]" />
                  </div>
                )}
              </div>

              {/* Área de Upload */}
              <div className="px-4 sm:px-6 pb-3 sm:pb-4 pt-3 sm:pt-4">
                <div className="border-2 border-dashed border-slate-300 rounded-md py-2 sm:py-3 px-2 sm:px-3 text-center bg-white">
                  <i className="pi pi-upload text-slate-400 text-lg mb-1 block" />
                  <FileUpload
                    ref={fileUploadRef}
                    mode="basic"
                    name="foto"
                    accept="image/*"
                    maxFileSize={5000000}
                    onSelect={onFileSelect}
                    auto
                    chooseLabel="Adicionar foto"
                    chooseOptions={{
                      className: "bg-transparent hover:bg-slate-50 text-slate-600 border-none px-2 py-1 rounded font-normal text-xs",
                      icon: "",
                    }}
                  />
                  {selectedFile && (
                    <div className="flex items-center justify-center gap-1 text-green-600 mt-1">
                      <i className="pi pi-check-circle text-xs" />
                      <Text variant="body-xs">{selectedFile.name}</Text>
                    </div>
                  )}
                  <Text variant="body-xs" className="text-slate-500 mt-0.5 block">
                    PNG, JPG até 5MB
                  </Text>
                </div>
              </div>
            </Card>
          </div>

          {/* Formulário */}
          <Card variant="default" padding="none" className="shadow-xl border-none h-fit">
            <div className="bg-slate-900 text-white px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 rounded-t-lg">
              <Text as="h1" variant="heading-xl" className="text-white mb-1 sm:mb-2">
                {isEditing ? "Editar Pet" : "Cadastrar Novo Pet"}
              </Text>
              <Text variant="body-base" className="text-slate-300">
                Preencha as informações do pet
              </Text>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
              <InputText
                label="Nome"
                placeholder="Digite o nome do pet"
                className="w-full"
                error={errors.nome?.message}
                required
                {...register("nome")}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputText
                  label="Idade (anos)"
                  type="text"
                  placeholder="Digite a idade"
                  className="w-full"
                  required
                  error={errors.idade?.message}
                  {...register("idade")}
                  onInput={(e: React.FormEvent<HTMLInputElement>) => {
                    e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '');
                  }}
                />

                <InputText
                  label="Raça"
                  placeholder="Digite a raça"
                  required
                  error={errors.raca?.message}
                  className="w-full"
                  {...register("raca")}
                />
              </div>

              <hr className="my-4 sm:my-6" />

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button
                  type="submit"
                  variant="warning"
                  className="flex-1 h-11 sm:h-12 text-sm sm:text-base px-6"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {isEditing ? "Salvar Alterações" : "Cadastrar Pet"}
                </Button>
                <Button
                  type="button"
                  variant="cancel"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="flex-1 h-11 sm:h-12 text-sm sm:text-base px-6"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        visible={showDeleteFotoDialog}
        onHide={() => setShowDeleteFotoDialog(false)}
        onConfirm={handleDeleteFoto}
        title="Excluir Foto"
        message="Tem certeza que deseja excluir esta foto?"
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        severity="danger"
      />
    </div>
  );
}
