import { Dialog, Menu, Transition } from "@headlessui/react";
import { useProductosContext } from "../../context/ProductosProvider";
import { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import client from "../../api/axios";
import io from "socket.io-client";

export const ModalCrearSalida = ({ isOpen, closeModal, OBTENERID }) => {
  //useContext
  const { categorias, setProductos, empleados, setSalidas } =
    useProductosContext();

  //register form datos
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  //estados
  const [socket, setSocket] = useState(null);

  //efectos
  useEffect(() => {
    async function loadData() {
      const res = await client.get(`/producto/${OBTENERID}`);

      // setDetalle(res.data.detalle);
      // setCategoria(res.data.categoria);

      setValue("detalle", res.data.detalle);
      setValue("id", res.data.id);
      setValue("categoria", res.data.categoria);
      setValue("role_id", res.data.role_id);
      setValue("usuario", res.data.usuario);
      setValue("stock", res.data.stock);
      setValue("stock_minimo", res.data.stock_minimo);
    }

    loadData();
  }, [OBTENERID]);

  useEffect(() => {
    const newSocket = io(
      "https://tecnohousebackendpanol-production.up.railway.app",
      // "http://localhost:4000",
      {
        withCredentials: true,
      }
    );

    setSocket(newSocket);

    newSocket.on("editar-producto-salida", (nuevaSalida) => {
      // Actualizar el estado de los productos solo cuando se reciba un evento "editar-producto"
      setProductos((prevProductos) => {
        return prevProductos.map((producto) => {
          if (producto.detalle === nuevaSalida?.detalle) {
            return {
              ...producto,
              stock: Number(producto.stock) - Number(nuevaSalida.cantidad),
            };
          }
          return producto;
        });
      });
    });

    newSocket.on("crear-salida", (nuevaSalida) => {
      setSalidas((prevTipos) => [...prevTipos, nuevaSalida]);
    });

    return () => newSocket.close();
  }, []);

  //submit crear salida
  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await client.post("/crear-salida", data);
      const salidaData = res.data; // Datos de la salida realizada

      if (socket) {
        socket.emit("crear-salida", salidaData);
      }

      if (socket) {
        socket.emit("editar-producto-salida", salidaData);
      }

      toast.success("¡Salida finalizada completaste la entrega!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        style: {
          padding: "10px",
          background: "#b8ffb8",
          color: "#009900",
        },
      });
      setTimeout(() => {
        closeModal();
      }, 1500);
    } catch (error) {
      toast.error("¡Stock insuficiente para hacer la salida!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        style: {
          padding: "10px",
          background: "#ffe3e3",
          color: "#de0202",
          borderRadius: "15px",
        },
      });
    }
  });

  return (
    <Menu as="div" className="z-50">
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModal}
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
                <div className="text-sm text-slate-700 mb-3 border-b-[1px] uppercase">
                  Crear nueva salida del producto
                </div>
                <form onSubmit={onSubmit} className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-slate-700 uppercase">
                      Detalle del producto
                    </label>
                    <input
                      {...register("detalle", { required: true })}
                      // onChange={(e) => setDetalle(e.target.value)}
                      // value={detalle}
                      type="text"
                      className="py-2 px-4 rounded-xl uppercase border-slate-300 border-[1px] shadow placeholder:text-slate-300 text-sm"
                      placeholder="DETALLE DEL PRODUCTO"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-slate-700 uppercase">
                      Seleccionar categoria
                    </label>
                    <select
                      {...register("categoria", { required: true })}
                      type="text"
                      className="py-2 px-4 rounded-xl border-slate-300 border-[1px] shadow bg-white placeholder:text-slate-300 text-sm uppercase"
                      // onChange={(e) => setCategoria(e.target.value)}
                      // value={categoria}
                    >
                      <option className="uppercase" value="">
                        Seleccionar la categoria
                      </option>
                      {categorias.map((c) => (
                        <option key={c.id}>{c.detalle}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-slate-700 uppercase">
                      Cantidad
                    </label>
                    <input
                      {...register("cantidad", { required: true })}
                      // onChange={(e) => setCantidad(e.target.value)}
                      // value={cantidad}
                      type="text"
                      className="py-2 px-4 rounded-xl uppercase border-slate-300 border-[1px] shadow placeholder:text-slate-300 text-sm"
                      placeholder="100 ETC"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-slate-700 uppercase">
                      Empleado
                    </label>
                    <select
                      {...register("empleado", { required: true })}
                      className="py-2 px-4 rounded-xl uppercase bg-white border-slate-300 border-[1px] shadow placeholder:text-slate-300 text-sm"
                      placeholder="EMPLEAOD"
                    >
                      <option value="">SELECCIONAR</option>
                      {empleados.map((c) => (
                        <option key={c.id}>{c.detalle}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-slate-700 uppercase">
                      Fabrica
                    </label>
                    <select
                      {...register("fabrica", { required: true })}
                      // onChange={(e) => setFabrica(e.target.value)}
                      // value={fabrica}
                      type="text"
                      className="py-2 px-4 rounded-xl uppercase border-slate-300 border-[1px] shadow placeholder:text-slate-300 text-sm bg-white"
                      placeholder="100 ETC"
                    >
                      <option value="">SELECCIONAR</option>
                      <option value="parque industrial">
                        PARQUE INDUSTRIAL
                      </option>{" "}
                      <option value="long">LONG</option>{" "}
                    </select>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="bg-blue-500 py-2 px-6 shadow rounded-xl text-white uppercase text-sm"
                    >
                      Crear nueva salida
                    </button>
                  </div>
                </form>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm text-red-900 bg-red-100 border border-transparent rounded-xl hover:bg-red-200 duration-300 cursor-pointer max-md:text-xs"
                    onClick={closeModal}
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
