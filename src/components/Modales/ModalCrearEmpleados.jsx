import { Dialog, Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useProductosContext } from "../../context/ProductosProvider";
import client from "../../api/axios";
import io from "socket.io-client";
import { ModalEditarEmpleado } from "./ModalEditarEmpleado";

export const ModalCrearEmpleados = ({
  isOpenCategorias,
  closeModalCategorias,
}) => {
  const { setEmpleados, empleados } = useProductosContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [socket, setSocket] = useState(null);

  const [OBTENERID, setObtenerId] = useState(null);

  const handleID = (id) => setObtenerId(id);

  // const baseURL = import.meta.env.BACKEND_URL;

  useEffect(() => {
    const newSocket = io(
      // "https://backendcompras-production.up.railway.app",
      "http://localhost:4000",
      // baseURL,
      {
        withCredentials: true,
      }
    );

    setSocket(newSocket);

    newSocket.on("nuevo-empleado", (nuevaSalida) => {
      setEmpleados((prevTipos) => [...prevTipos, nuevaSalida]);
    });

    return () => newSocket.close();
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    const res = await client.post("/crear-empleado", data);

    if (socket) {
      socket.emit("nuevo-empleado", res.data);
    }

    toast.success("¡Empleado creada correctamente!", {
      position: "top-center",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  });

  const [isOpenEditar, setIsOpenEditar] = useState(false);

  const openEditar = () => {
    setIsOpenEditar(true);
  };
  const closeEditar = () => {
    setIsOpenEditar(false);
  };

  useEffect(() => {
    const newSocket = io(
      // "https://backendcompras-production.up.railway.app",
      "http://localhost:4000",
      {
        withCredentials: true,
      }
    );

    setSocket(newSocket);

    newSocket.on("eliminar-empleado", (salidaEliminada) => {
      setEmpleados((prevSalidas) =>
        prevSalidas.filter((salida) => salida.id !== salidaEliminada.id)
      );
    });

    return () => newSocket.close();
  }, []);

  const handleEliminarChofer = async (id) => {
    const res = await client.delete(`/eliminar-empleado/${id}`);

    if (socket) {
      socket.emit("eliminar-empleado", { id });
    }

    toast.error("¡Eliminado correctamente!", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
      style: {
        padding: "10px",
        background: "#fee2e2",
        color: "#991b1b",
      },
    });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);

  // Lógica de paginación
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = empleados.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Menu as="div" className="z-50">
      <Transition appear show={isOpenCategorias} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModalCategorias}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            <span
              className="inline-block h-screen align-middle "
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-1/2 max-md:w-full max-md:px-4 p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <div className="text-sm text-slate-700 mb-3 border-b-[1px] uppercase">
                  Crear un nuevo empleado
                </div>
                <form onSubmit={onSubmit} className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-slate-700 uppercase">
                      Nombre y Apellido
                    </label>
                    <input
                      {...register("detalle")}
                      type="text"
                      className="uppercase py-2 px-4 rounded-xl border-slate-300 border-[1px] shadow placeholder:text-slate-300 text-sm"
                      placeholder="NOMBRE Y APELLIDO"
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="bg-slate-800 text-white font-bold uppercase text-sm py-2 px-4 rounded-xl shadow"
                    >
                      Crear nuevo empleado
                    </button>
                  </div>
                </form>

                <div className="mt-5 px-4 flex flex-col gap-2 max-md:px-0">
                  <div>
                    <p className="uppercase font-bold underline text-slate-600 text-base">
                      EMPLEADOS CREADOS
                    </p>
                  </div>
                  <div className="py-2 px-0 grid grid-cols-3 gap-3 max-md:grid-cols-2">
                    {currentProducts.map((c) => (
                      <div
                        className="border-slate-300 border-[1px] py-3 px-3 rounded-xl flex gap-2 items-center justify-center"
                        key={c.id}
                      >
                        <p className="uppercase font-bold text-sm text-slate-600 max-md:text-xs">
                          {c.detalle}
                        </p>
                        <svg
                          onClick={() => {
                            handleID(c.id), openEditar();
                          }}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5 text-blue-500 cursor-pointer"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                          />
                        </svg>

                        <svg
                          onClick={() => handleEliminarChofer(c.id)}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5 text-red-500 cursor-pointer"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                        </svg>
                      </div>
                    ))}
                  </div>
                </div>

                <ModalEditarEmpleado
                  closeModalEditar={closeEditar}
                  isOpenEditar={isOpenEditar}
                  OBTENERID={OBTENERID}
                />

                <div className="flex justify-center mt-4">
                  {empleados.length > productsPerPage && (
                    <nav className="pagination">
                      <ul className="pagination-list flex gap-2">
                        {Array.from({
                          length: Math.ceil(empleados.length / productsPerPage),
                        }).map(
                          (_, index) =>
                            index >= currentPage - 2 &&
                            index <= currentPage + 2 && ( // Mostrar solo 5 páginas a la vez
                              <li key={index} className="pagination-item">
                                <button
                                  onClick={() => paginate(index + 1)}
                                  className={`pagination-link ${
                                    currentPage === index + 1
                                      ? "text-white bg-green-500 px-3 py-1 rounded-xl"
                                      : "text-slate-600 bg-white border-[1px] border-slate-300 px-2 py-1 rounded-xl"
                                  }`}
                                >
                                  {index + 1}
                                </button>
                              </li>
                            )
                        )}
                      </ul>
                    </nav>
                  )}
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm text-red-900 bg-red-100 border border-transparent rounded-xl hover:bg-red-200 duration-300 cursor-pointer max-md:text-xs"
                    onClick={closeModalCategorias}
                  >
                    Cerrar Ventana
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </Menu>
  );
};
