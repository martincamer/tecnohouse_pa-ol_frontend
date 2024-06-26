import { Dialog, Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { useProductosContext } from "../../context/ProductosProvider";
import { toast } from "react-toastify";
import client from "../../api/axios";
import io from "socket.io-client";

export const ModalEditarProducto = ({ isOpen, closeModal, OBTENERID }) => {
  const { setProductos, productos } = useProductosContext();
  const { categorias } = useProductosContext();

  const [detalle, setDetale] = useState("");
  const [categoria, setCategoria] = useState("");
  const [stock, setStock] = useState("");
  const [stock_minimo, setStockMinimo] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    async function loadData() {
      const res = await client.get(`/producto/${OBTENERID}`);

      setDetale(res.data.detalle);
      setCategoria(res.data.categoria);
      setStock(res.data.stock);
      setStockMinimo(res.data.stock_minimo);
    }
    loadData();
  }, [OBTENERID]);

  useEffect(() => {
    const newSocket = io(
      // "http://localhost:4000", // Cambia la URL del socket según corresponda
      "https://tecnohousebackendpanol-production.up.railway.app",
      {
        withCredentials: true,
      }
    );

    setSocket(newSocket);

    const handleEditarProducto = (editarProducto) => {
      const updateProducto = JSON.parse(editarProducto?.config?.data);

      setProductos((prevProductos) => {
        const newProductos = [...prevProductos];

        const tipoExistenteIndex = newProductos.findIndex(
          (producto) => producto.id === OBTENERID
        );

        if (tipoExistenteIndex !== -1) {
          newProductos[tipoExistenteIndex] = {
            id: newProductos[tipoExistenteIndex].id,
            stock: updateProducto.stock,
            stock_minimo: updateProducto.stock_minimo,
            detalle: updateProducto.detalle,
            categoria: updateProducto.categoria,
            role_id: newProductos[tipoExistenteIndex].role_id,
            usuario: newProductos[tipoExistenteIndex].usuario,
            created_at: newProductos[tipoExistenteIndex].created_at,
            updated_at: newProductos[tipoExistenteIndex].updated_at,
          };
        }

        return newProductos;
      });
    };

    newSocket.on("editar-producto", handleEditarProducto);

    return () => {
      newSocket.off("editar-producto", handleEditarProducto);
      newSocket.close();
    };
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();

    const datosProducto = { stock, stock_minimo, detalle, categoria };

    const res = await client.put(
      `/editar-producto/${OBTENERID}`,
      datosProducto
    );

    socket.emit("editar-producto", res);

    toast.success("¡Producto editado correctamente!", {
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
    }, 500);
  };

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

            {/* This element is to trick the browser into centering the modal contents. */}
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
              <div className="inline-block w-[500px] max-md:w-full p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <div className="text-lg text-slate-700 mb-3 border-b-[1px] uppercase">
                  Editar el producto
                </div>
                <form onSubmit={onSubmit} className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-slate-700 uppercase">
                      Detalle del producto
                    </label>
                    <input
                      onChange={(e) => setDetale(e.target.value)}
                      value={detalle}
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
                      type="text"
                      className="py-2 px-4 rounded-xl border-slate-300 border-[1px] shadow bg-white placeholder:text-slate-300 text-sm uppercase"
                      onChange={(e) => setCategoria(e.target.value)}
                      value={categoria}
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
                      Stock del producto/Cantidad
                    </label>
                    <input
                      onChange={(e) => setStock(e.target.value)}
                      value={stock}
                      type="text"
                      className="py-2 px-4 rounded-xl uppercase border-slate-300 border-[1px] shadow placeholder:text-slate-300 text-sm"
                      placeholder="100 ETC"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-slate-700 uppercase">
                      Stock Minimo del producto
                    </label>
                    <input
                      onChange={(e) => setStockMinimo(e.target.value)}
                      value={stock_minimo}
                      type="text"
                      className="py-2 px-4 rounded-xl uppercase border-slate-300 border-[1px] shadow placeholder:text-slate-300 text-sm"
                      placeholder="100 ETC"
                    />
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="bg-blue-500 py-2 px-6 shadow rounded-xl text-white uppercase text-sm"
                    >
                      Crear nuevo producto
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
