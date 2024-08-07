import { BrowserRouter, Route, Routes as RoutesComponent } from "react-router-dom";
import Login from "./pages/Login";
import Patients from "./pages/Patients";
import Attendances from "./pages/Attendances";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/protected-route";

export default function Routes() {
  return (
    <BrowserRouter>
      <RoutesComponent>
        <Route path="/" element={<Login />} />
        <Route path="/patients" element={<ProtectedRoute element={<Patients />} />} />
        <Route path="/attendances" element={<ProtectedRoute element={<Attendances />} />} />

        <Route path="*" element={<NotFound />} />
      </RoutesComponent>
    </BrowserRouter>
  )
}


