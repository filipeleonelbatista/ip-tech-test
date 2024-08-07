import { BrowserRouter, Route, Routes as RoutesComponent } from "react-router-dom";
import Login from "./pages/Login";
import Patients from "./pages/Patients";
import NotFound from "./pages/NotFound";
import Attendances from "./pages/Attendances";

export default function Routes() {
  return (
    <BrowserRouter>
      <RoutesComponent>
        <Route path="/" element={<Login />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/attendances" element={<Attendances />} />

        <Route path="*" element={<NotFound />} />
      </RoutesComponent>
    </BrowserRouter>
  )
}


