import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useRef, useState } from "react";
import { FileUpload } from "primereact/fileupload";
import { InputMask } from "primereact/inputmask";
import { Toast } from "primereact/toast";
import Card from "../../../components/Card";
import Text from "../../../components/Text";
import Button from "../../../components/Button";
import InputText from "../../../components/InputText";
import { tutoresService } from "../services/tutores.service";
import type { CreateTutorRequest } from "../types/tutores.types";

// Schema de validação com Zod
const tutorFormSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
  email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
  telefone: z.string().min(1, "Telefone é obrigatório"),
  endereco: z.string().min(1, "Endereço é obrigatório").max(200, "Endereço muito longo"),
  cpf: z.string().min(1, "CPF é obrigatório"),
});

type TutorFormData = z.infer<typeof tutorFormSchema>;

export default function TutorForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id && id !== "novo";

  const [isLoadingData, setIsLoadingData] = useState(isEditing);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentFoto, setCurrentFoto] = useState<{ id: number; url: string } | null>(null);
  const toast = useRef<Toast>(null);
  const fileUploadRef = useRef<FileUpload>(null);

  // Função para ajudar a exibir InputMask com validação de erro
  const getInputMaskClasses = (hasError: boolean) =>
    `h-10 w-full px-4 py-2 text-base border rounded-md bg-white outline-none transition-all duration-200 placeholder:text-slate-400 ${
      hasError
        ? "border-red-600 focus:border-red-600 focus:ring-2 focus:ring-red-600/20"
        : "border-slate-300 focus:border-transparent focus:ring-2 focus:ring-yellow-400"
    }`;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TutorFormData>({
    resolver: zodResolver(tutorFormSchema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      endereco: "",
      cpf: "",
    },
  });

  // Carregar dados do tutor se for edição
  useEffect(() => {
    const loadData = async () => {
      try {
        if (isEditing) {
          const tutor = await tutoresService.getTutorById(Number(id));
          
          // Formatar telefone para exibição no InputMask
          const telefoneFormatado = tutor.telefone.replace(/\D/g, "");
          const telefoneComMascara = telefoneFormatado.length === 11
            ? `(${telefoneFormatado.slice(0, 2)}) ${telefoneFormatado.slice(2, 7)}-${telefoneFormatado.slice(7)}`
            : tutor.telefone;
          
          // Formatar CPF para exibição no InputMask
          const cpfNumero = String(tutor.cpf).padStart(11, '0');
          const cpfComMascara = `${cpfNumero.slice(0, 3)}.${cpfNumero.slice(3, 6)}.${cpfNumero.slice(6, 9)}-${cpfNumero.slice(9)}`;
          
          reset({
            nome: tutor.nome,
            email: tutor.email,
            telefone: telefoneComMascara,
            endereco: tutor.endereco,
            cpf: cpfComMascara,
          });
          // Carregar foto atual se existir
          if (tutor.foto) {
            setCurrentFoto({ id: tutor.foto.id, url: tutor.foto.url });
          }
        }
      } catch (err) {
        setError("Erro ao carregar dados");
        console.error(err);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
  }, [id, isEditing, reset]);

  const onSubmit = async (data: TutorFormData) => {
    setError(null);

    try {
      const tutorData: CreateTutorRequest = {
        nome: data.nome,
        email: data.email,
        telefone: data.telefone.replace(/\D/g, ""), // Remove formatação
        endereco: data.endereco,
        cpf: Number(data.cpf.replace(/\D/g, "")), // Remove formatação e converte para número
      };

      let tutorId: number;

      if (isEditing) {
        await tutoresService.updateTutor(Number(id), tutorData);
        tutorId = Number(id);
      } else {
        const novoTutor = await tutoresService.createTutor(tutorData);
        tutorId = novoTutor.id;
      }

      // Se tiver foto selecionada, fazer upload
      if (selectedFile) {
        try {
          await tutoresService.uploadFotoTutor(tutorId, selectedFile);

        } catch (uploadErr) {
          console.error("Erro ao fazer upload da foto:", uploadErr);
          toast.current?.show({
            severity: "warn",
            summary: "Aviso",
            detail: "Tutor salvo, mas houve erro ao enviar a foto.",
            life: 3000,
          });
        }
      }

      // Redirecionar para a página de detalhes se for novo cadastro
      if (isEditing) {
        navigate(`/tutores/${tutorId}`);
      } else {
        navigate(`/tutores/${tutorId}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao salvar tutor");
      console.error(err);
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: err.response?.data?.message || "Erro ao salvar pet",
        life: 3000,
      });
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

    if (window.confirm("Tem certeza que deseja excluir esta foto?")) {
      try {
        await tutoresService.deleteFotoTutor(Number(id), currentFoto.id);
        setCurrentFoto(null);
        toast.current?.show({
          severity: "success",
          summary: "Sucesso",
          detail: "Foto excluída com sucesso!",
          life: 3000,
        });
      } catch (err) {
        console.error("Erro ao excluir foto:", err);
        toast.current?.show({
          severity: "error",
          summary: "Erro",
          detail: "Erro ao excluir foto. Tente novamente.",
          life: 3000,
        });
      }
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
    <div className="min-h-screen p-6 bg-slate-50">
      <Toast ref={toast} />
      <div className="max-w-7xl mx-auto">

        <div className="mb-6">
          <Button
            icon="pi pi-arrow-left"
            onClick={() => navigate(isEditing ? `/tutores/${id}` : "/tutores")}
            variant="ghost"
          >
            {isEditing ? "Voltar para detalhes" : "Voltar para lista de tutores"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 mt-4">
          {/* Foto do Tutor */}
          <div className="space-y-0">
            <Card variant="default" padding="none" className="shadow-xl border-none overflow-hidden h-fit">
              <div className="bg-slate-900 text-white px-5 py-4 flex items-center gap-2">
                <i className="pi pi-user text-sm" />
                <Text variant="body-sm" className="font-medium text-white">
                  Foto do Tutor
                </Text>
              </div>

              {/* Área de Preview da Foto */}
              <div className="bg-slate-100 p-6 flex items-center justify-center relative">
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
                        onClick={handleDeleteFoto}
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
              <div className="px-6 pb-4 pt-4">
                <div className="border-2 border-dashed border-slate-300 rounded-md py-3 px-3 text-center bg-white">
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
            <div className="bg-slate-900 text-white px-8 py-6 rounded-t-lg">
              <Text as="h1" variant="heading-xl" className="text-white mb-2">
                {isEditing ? "Editar Tutor" : "Cadastrar Novo Tutor"}
              </Text>
              <Text variant="body-base" className="text-slate-300">
                Preencha as informações do tutor responsável
              </Text>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
              <InputText
                label="Nome Completo"
                placeholder="Digite o nome completo"
                className="w-full"
                error={errors.nome?.message}
                required
                {...register("nome")}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputText
                  label="E-mail"
                  type="email"
                  placeholder="email@exemplo.com"
                  required
                  error={errors.email?.message}
                  className="w-full"
                  {...register("email")}
                />

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700">
                    Telefone <span className="text-red-500">*</span>
                  </label>
                  <InputMask
                    mask="(99) 99999-9999"
                    placeholder="(00) 00000-0000"
                    className={getInputMaskClasses(!!errors.telefone)}
                    {...register("telefone")}
                  />
                  {errors.telefone?.message && (
                    <span className="text-sm text-red-600">{errors.telefone.message}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700">
                    CPF <span className="text-red-500">*</span>
                  </label>
                  <InputMask
                    mask="999.999.999-99"
                    placeholder="000.000.000-00"
                    className={getInputMaskClasses(!!errors.cpf)}
                    {...register("cpf")}
                  />
                  {errors.cpf?.message && (
                    <span className="text-sm text-red-600">{errors.cpf.message}</span>
                  )}
                </div>

                <InputText
                  label="Endereço"
                  placeholder="Rua, número, bairro, cidade - UF"
                  required
                  error={errors.endereco?.message}
                  className="w-full"
                  {...register("endereco")}
                />
              </div>

              <hr className="my-6" />

              <div className="flex gap-4">
                <Button
                  type="submit"
                  variant="warning"
                  className="flex-1"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {isEditing ? "Salvar Alterações" : "Cadastrar Tutor"}
                </Button>
                <Button
                  type="button"
                  variant="cancel"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
