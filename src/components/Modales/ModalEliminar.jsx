import { Dialog, Menu, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { useOrdenesContext } from "../../context/OrdenesProvider";
import { toast } from "react-toastify";
import client from "../../api/axios";
import io from "socket.io-client";

export const ModalEliminar = ({ eliminarModal, closeEliminar, obtenerId }) => {
  const { setOrdenesMensuales } = useOrdenesContext();

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(
      "https://tecnohousebackendpanol-production.up.railway.app",
      // "http://localhost:4000",
      // import.meta.env.BACKEND_URL,
      {
        withCredentials: true,
      }
    );

    setSocket(newSocket);

    newSocket.on("eliminar-orden", (salidaEliminada) => {
      setOrdenesMensuales((prevSalidas) =>
        prevSalidas.filter((salida) => salida.id !== salidaEliminada.id)
      );
    });

    return () => newSocket.close();
  }, []);

  const handleEliminarOrden = async (id) => {
    try {
      await client.delete(`/eliminar-orden/${id}`);

      if (socket) {
        socket.emit("eliminar-orden", { id });
      }

      toast.error("¡Orden eliminada correctamente!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        style: {
          padding: "10px",
          background: "#ffd1d1",
          color: "#de0202",
        },
      });

      closeEliminar();
    } catch (error) {
      console.error("Error al eliminar la orden:", error);
    }
  };

  return (
    <Menu as="div" className="z-50">
      <Transition appear show={eliminarModal} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeEliminar}
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
              className="inline-block h-screen align-middle"
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
              <div className="inline-block w-1/3 max-md:w-full p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <div className="text-lg text-slate-700 mb-3 border-b-[1px] capitalize max-md:text-sm max-md:uppercase">
                  ELIMINAR LA ORDEN
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEliminarOrden(obtenerId)}
                    className="bg-red-100 text-red-800 py-2 px-4 rounded-xl w-full max-md:py-1 max-md:text-sm"
                    type="button"
                  >
                    ELIMINAR
                  </button>
                  <button
                    onClick={closeEliminar}
                    className="bg-green-500 text-white py-2 px-4 rounded-xl w-full max-md:py-1 max-md:text-sm"
                    type="button"
                  >
                    CERRAR
                  </button>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm text-red-900 bg-red-100 border border-transparent rounded-xl hover:bg-red-200 duration-300 cursor-pointer max-md:text-xs"
                    onClick={closeEliminar}
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
