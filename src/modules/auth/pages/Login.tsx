import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import InputText from "../../../components/InputText";
import Text from "../../../components/Text";
import Card from "../../../components/Card";
import { useAuth } from "../hooks/useAuth";

const loginSchema = z.object({
  username: z.string().min(1, "Usuário é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const { login, error: authError, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      navigate("/pets");
    } catch (error) {
      console.error("Erro no login:", error);
    }
  };
  

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <Card padding="lg" className="w-full max-w-md border-none shadow-lg">
          <div className="text-center mb-8">
            <Text as="h1" variant="heading-2xl" className="text-slate-800">
              Sistema de Gestão de Pets
            </Text>
            <Text as="p" variant="body-base" className="text-slate-600 mt-2">
              Registro Público de Pets e seus Tutores
            </Text>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <InputText
              label="Usuário"
              placeholder="Digite seu usuário"
              error={errors.username?.message}
              disabled={isLoading}
              {...register("username")}
            />

            <InputText
              label="Senha"
              type="password"
              placeholder="Digite sua senha"
              error={errors.password?.message}
              disabled={isLoading}
              {...register("password")}
            />

            {authError && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-center gap-2">
                <i className="pi pi-exclamation-circle text-red-600" />
                <Text variant="body-sm" className="text-red-800">
                  {authError}
                </Text>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              variant="primary"
              isLoading={isLoading}
              disabled={isLoading}
            >
              Entrar
            </Button>
          </form>
        </Card>
    </div>
  );
}