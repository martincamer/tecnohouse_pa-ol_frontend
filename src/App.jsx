//imports
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthProvider";
import { NotFound } from "./routes/pages/protected/NotFound";
import { Login } from "./routes/pages/Login";
import { Register } from "./routes/pages/Register";
import { Home } from "./routes/pages/protected/Home";
import { SideBar } from "./components/sidebar/Sidebar";
import { ProductosProvider } from "./context/ProductosProvider";
import { Productos } from "./routes/pages/protected/Productos";
import { NavbarStatick } from "./components/ui/NavbarStatick";
import { OrdenesProvider } from "./context/OrdenesProvider";
import { Salidas } from "./routes/pages/protected/Salidas";
import { Entradas } from "./routes/pages/protected/Entradas";
import { MenuMobile } from "./components/MenuMobile";
//import normales
import RutaProtegida from "./layouts/RutaProtejida";
import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.min.css";

function App() {
  const { isAuth } = useAuth();

  return (
    <>
      <BrowserRouter>
        <NavbarStatick />
        <Routes>
          <Route
            element={<RutaProtegida isAllowed={!isAuth} redirectTo={"/"} />}
          >
            <Route index path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          <Route
            element={<RutaProtegida isAllowed={isAuth} redirectTo={"/login"} />}
          >
            <Route
              element={
                <ProductosProvider>
                  <OrdenesProvider>
                    <SideBar />
                    <MenuMobile />
                    <main className="min-h-full max-h-full h-full">
                      <Outlet />
                    </main>
                  </OrdenesProvider>
                </ProductosProvider>
              }
            >
              <Route index path="/" element={<Home />} />
              <Route index path="/productos" element={<Productos />} />
              <Route index path="/salidas" element={<Salidas />} />
              <Route index path="/entradas" element={<Entradas />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
