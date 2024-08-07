import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormik } from "formik";
import { EyeIcon, EyeOffIcon, MountainIcon } from "lucide-react";
import { useState } from "react";
import * as Yup from 'yup';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordToggle = () => {
    setShowPassword((prevState) => !prevState);
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Nome de usuário é obrigatório"),
    password: Yup.string().required("Senha é obrigatório"),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {

    },
  });

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md space-y-4">
        <div className="flex items-center justify-center">
          <MountainIcon className="h-8 w-8" />
          <span className="ml-2 text-2xl font-bold">Acme Corp.</span>
        </div>
        <h1 className="text-center text-3xl font-bold tracking-tight text-foreground">Entre em sua conta</h1>
        <form className="space-y-4" onSubmit={formik.handleSubmit}>
          <div>
            <Label htmlFor="username">Nome de usuário</Label>
            <Input
              id="username"
              type="text"
              placeholder="Digite seu nome de usuário"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
            />
          </div>
          <div className="relative">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Digite sua senha"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute bottom-1 right-1 h-7 w-7"
              onClick={handlePasswordToggle}
            >
              {showPassword ? <EyeIcon className="h-4 w-4" /> : <EyeOffIcon className="h-4 w-4" />}
              <span className="sr-only">Mudar visibilidade da senha</span>
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="text-sm font-medium text-primary hover:underline"
              onClick={() => handleForgotUser()}
            >
              Esqueceu a senha?
            </button>
          </div>
          <Button type="submit" className="w-full">
            Entrar
          </Button>
        </form>
      </div>
    </div>
  );
}
