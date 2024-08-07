import { useAuth } from '@/hooks/useAuth';
import { LogOutIcon, MountainIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  return (
    <div className={`container mx-auto py-4`}>
      <header className="mb-6 flex items-center justify-between">
        <nav className="flex items-center space-x-4">
          <Link to="/patients" title="Acme Corp" className="flex items-center">
            <MountainIcon className="h-6 w-6" />
            <span className="sr-only">Acme Corp</span>
          </Link>
          <Link to="/patients" title="Pacientes" className="text-muted-foreground hover:text-foreground">
            Pacientes
          </Link>
          <Link to="/attendances" title="Atendimentos" className="text-muted-foreground hover:text-foreground">
            Atendimentos
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Avatar title={user?.username || "Usuário"} className="h-8 w-8 cursor-pointer">
            <AvatarImage src="/placeholder-user.jpg" alt={user?.username || "Usuário"} />
            <AvatarFallback>{user?.username?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <Button
            title="Sair"
            variant="ghost"
            size="icon"
            onClick={() => {
              if (logout()) {
                navigate("/")
              }
            }}
          >
            <LogOutIcon className="h-5 w-5" />
            <span className="sr-only">Sair</span>
          </Button>
        </div>
      </header>
    </div>
  );
}
