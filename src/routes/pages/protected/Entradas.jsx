import { useState } from "react";
import { useProductosContext } from "../../../context/ProductosProvider";
import { ToastContainer } from "react-toastify";
import { SyncLoader } from "react-spinners";
import { Link } from "react-router-dom";
import client from "../../../api/axios";

export const Entradas = () => {
  const fechaActual = new Date();
  const numeroDiaActual = fechaActual.getDay(); // Obtener el día del mes actual

  const { categorias } = useProductosContext();

  const [ordenesBuscadas, setOrdenesBuscadas] = useState([]);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [loading, setLoading] = useState(false);

  const obtenerOrdenesRangoFechas = async (fechaInicio, fechaFin) => {
    try {
      // Setea el estado de loading a true para mostrar el spinner
      setLoading(true);

      // Validación de fechas
      if (!fechaInicio || !fechaFin) {
        console.error("Fechas no proporcionadas");
        return;
      }

      // Verifica y formatea las fechas
      fechaInicio = new Date(fechaInicio).toISOString().split("T")[0];
      fechaFin = new Date(fechaFin).toISOString().split("T")[0];

      const response = await client.post("/entradas-rango-fechas", {
        fechaInicio,
        fechaFin,
      });

      setOrdenesBuscadas(response.data); // Maneja la respuesta según tus necesidades
    } catch (error) {
      console.error("Error al obtener salidas:", error);
      // Maneja el error según tus necesidades
    } finally {
      // Independientemente de si la solicitud es exitosa o falla, establece el estado de loading a false
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
  };

  const buscarIngresosPorFecha = () => {
    obtenerOrdenesRangoFechas(fechaInicio, fechaFin);
  };

  const nombresDias = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  const numeroMesActual = fechaActual.getMonth() + 1; // Obtener el mes actual
  const nombresMeses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  const nombreMesActual = nombresMeses[numeroMesActual - 1]; // Obtener el nombre del mes actual

  const nombreDiaActual = nombresDias[numeroDiaActual]; // Obtener el nombre del día actual

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(9);

  const filteredProducts = ordenesBuscadas.filter((order) => {
    // Verificar si el detalle del producto o el empleado coinciden con el criterio de búsqueda
    return (
      order.detalle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.proveedor.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Lógica de paginación
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const precioTotal = filteredProducts.reduce(
    (total, orden) => total + Number(orden.cantidad),
    0
  );

  const calculateCategoryTotals = () => {
    const categoryTotals = {};

    // Iterar a través de las órdenes buscadas
    ordenesBuscadas.forEach((orden) => {
      const categoria = orden.categoria;
      const cantidad = parseInt(orden.cantidad);

      // Actualizar el total de la categoría
      if (categoria in categoryTotals) {
        categoryTotals[categoria] += cantidad;
      } else {
        categoryTotals[categoria] = cantidad;
      }
    });

    // Convertir categoryTotals a un array
    const categoryTotalsArray = Object.keys(categoryTotals).map(
      (categoria) => ({
        categoria,
        total: categoryTotals[categoria],
      })
    );

    return categoryTotalsArray;
  };

  // Llamar a la función para obtener los totales de categoría
  const categoryTotalsData = calculateCategoryTotals();

  return (
    <section className="w-full h-full px-5 max-md:px-4 flex flex-col gap-2 py-20 max-md:gap-5">
      <ToastContainer />
      <nav aria-label="Breadcrumb" className="flex px-5">
        <ol className="flex overflow-hidden rounded-xl border bg-slate-300 text-gray-600 shadow">
          <li className="flex items-center">
            <Link
              to={"/"}
              className="flex h-10 items-center gap-1.5 bg-gray-100 px-4 transition hover:text-gray-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>

              <span className="ms-1.5 text-xs font-medium"> INICIO </span>
            </Link>
          </li>

          <li className="relative flex items-center">
            <span className="absolute inset-y-0 -start-px h-10 w-4 bg-gray-100 [clip-path:_polygon(0_0,_0%_100%,_100%_50%)] rtl:rotate-180"></span>

            <Link
              to={"/productos"}
              href="#"
              className="flex h-10 items-center bg-white pe-4 ps-8 text-xs font-medium transition hover:text-gray-900"
            >
              PRODUCTOS
            </Link>
          </li>
        </ol>
      </nav>
      <div className="py-5 px-5 rounded-xl grid grid-cols-3 gap-3 mb-2 max-md:grid-cols-1 max-md:border-none max-md:shadow-none max-md:py-0 max-md:px-0">
        <article className="flex flex-col gap-4 rounded-xl border border-slate-200 shadow bg-white p-6 max-md:p-3">
          <div className="inline-flex gap-2 self-end rounded bg-green-100 p-1 text-green-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>

            <span className="text-xs font-medium max-md:text-xs">
              {Number(precioTotal / 100000).toFixed(2)} %
            </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-xs uppercase">
              Total entradas del mes
            </strong>

            <p>
              <span className="text-xl font-medium text-green-600 max-md:text-base">
                + {precioTotal}
              </span>

              <span className="text-xs text-gray-500 uppercase">
                {" "}
                total final de entradas al stock{" "}
                <span className="font-bold text-slate-700">
                  {Number(precioTotal)}
                </span>
              </span>
            </p>
          </div>
        </article>

        <article className="flex flex-col gap-4 rounded-xl border border-slate-200 shadow bg-white p-6 max-md:p-3">
          <div className="inline-flex gap-2 self-end rounded bg-green-100 p-1 text-green-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
              />
            </svg>

            <span className="text-xs font-medium uppercase">
              {nombreMesActual}
            </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-xs uppercase">
              Fecha Actual
            </strong>

            <p>
              <span className="text-xl max-md:text-base font-medium text-gray-900 uppercase">
                {nombreMesActual}
              </span>

              <span className="text-xs text-gray-500 uppercase">
                {" "}
                Dia {nombreDiaActual}
              </span>
            </p>
          </div>
        </article>

        <article className="flex flex-col gap-4 rounded-xl border border-slate-200 shadow bg-white p-6 max-md:p-3">
          {/* <div className="inline-flex gap-2 self-end rounded bg-green-100 p-1 text-green-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>

            <span className="text-xs font-medium"> </span>
          </div> */}

          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-sm uppercase">
              Materiales/categorias Total entradas
            </strong>

            <p className="mt-2 h-[50px] overflow-y-scroll">
              <span className="text-2xl font-medium text-gray-900 max-md:text-base">
                <ul className="flex flex-col gap-1">
                  {categoryTotalsData.map((category) => (
                    <li
                      className="uppercase text-sm text-slate-600"
                      key={category.categoria}
                    >
                      <span className="font-bold">{category.categoria}:</span>{" "}
                      <span className="text-green-600">
                        {" "}
                        {Number(category.total)}
                      </span>
                    </li>
                  ))}
                </ul>
              </span>
            </p>
          </div>
        </article>
      </div>

      <div className="mx-6 max-md:mx-0">
        <div className="flex gap-6 items-center  max-md:overflow-x-scroll ">
          <div className="flex gap-2 items-center">
            <label className="text-base uppercase text-slate-700 max-md:text-xs">
              Fecha de inicio
            </label>
            <input
              className="text-sm bg-white py-2 px-3 rounded-xl shadow border-slate-300 border-[1px] cursor-pointer text-slate-700 outline-none max-md:text-xs"
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
          </div>
          <div className="flex gap-2 items-center">
            <label className="text-base uppercase text-slate-700 max-md:text-xs">
              Fecha fin
            </label>
            <input
              className="text-sm bg-white py-2 px-3 rounded-xl shadow border-slate-300 border-[1px] cursor-pointer text-slate-700 outline-none max-md:text-xs"
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
            />

            <button
              onClick={buscarIngresosPorFecha}
              className="bg-white border-slate-300 border-[1px] rounded-xl px-2 py-2 shadow flex gap-3 text-slate-700 hover:shadow-md transtion-all ease-in-out duration-200 max-md:py-1 max-md:text-xs"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-slate-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="max-md:mt-2 mt-4 px-6 max-md:px-0">
        <div className="px-10 max-md:px-2">
          <p className="uppercase text-orange-500 font-semibold text-sm underline">
            ENTRADAS REGISTRADAS DEL MES
          </p>
        </div>

        <div className="mt-5 px-8 flex gap-2 max-md:flex-col max-md:px-0">
          <input
            type="text"
            placeholder="BUSCAR POR EL EMPLEADO O DETALLE.."
            className="w-1/4 rounded-xl py-2 px-5 border-slate-300 bg-white text-slate-700 border-[1px] uppercase max-md:text-xs max-md:w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="py-1 px-4 text-slate-700 rounded-xl shadow bg-white border-slate-300 border-[1px] uppercase max-md:text-xs max-md:py-2.5"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">Todas las categorías</option>
            {categorias.map((c) => (
              <option>{c?.detalle}</option>
            ))}
          </select>
        </div>
      </div>
      <div
        className={`py-3 px-4 rounded-xl mx-8 max-md:mx-0 mt-2 ${
          loading ? "animate-pulse" : ""
        }`}
      >
        {loading ? (
          <div className="grid grid-cols-4 h-full w-full gap-4">
            {[...Array(9)].map((_, index) => (
              <div
                key={index}
                className="bg-slate-100 border-slate-300 rounded-xl shadow border-[1px] py-20 px-10"
              >
                {/* <div className="bg-slate-300 rounded-xl shadow border-[1px] py- px-5"></div> */}
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-4 h-full w-full gap-4 max-md:grid-cols-1">
            {currentProducts.map((o) => (
              <div
                className="shadow border-slate-200 border-[1px] rounded-xl py-5 px-5 flex justify-between items-center relative"
                key={o.id}
              >
                <article>
                  <p className="uppercase flex gap-1">
                    <span className="font-semibold text-sm text-slate-700 max-md:text-xs underline">
                      Numero
                    </span>
                    <span className="text-normal text-sm text-slate-700 max-md:text-xs">
                      {o.id}
                    </span>
                  </p>
                  <p className="uppercase flex gap-1">
                    <span className="font-semibold text-sm text-slate-700 max-md:text-xs underline">
                      Proveedor
                    </span>
                    <span className="text-normal text-sm text-slate-700 max-md:text-xs">
                      {o.proveedor}
                    </span>
                  </p>
                  <p className="uppercase flex gap-1">
                    <span className="font-semibold text-sm text-slate-700 max-md:text-xs underline">
                      Numero Factura
                    </span>
                    <span className="text-normal text-sm text-slate-700 max-md:text-xs">
                      {o.numero}
                    </span>
                  </p>
                  <p className="uppercase flex gap-1">
                    <span className="font-semibold text-sm text-slate-700 max-md:text-xs underline">
                      Detalle/Producto
                    </span>
                    <span className="text-normal text-sm text-slate-700 max-md:text-xs">
                      {o.detalle}
                    </span>
                  </p>
                  <p className="uppercase flex gap-1 items-center mt-2">
                    <span className="font-semibold text-sm text-slate-700 max-md:text-xs underline">
                      Cantidad
                    </span>
                    <span className="text-normal text-sm text-green-700 max-md:text-xs font-bold bg-green-100 rounded-xl py-1 px-3 border-green-200 border-[1px]">
                      {o.cantidad}
                    </span>
                  </p>
                </article>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex justify-center mt-4">
        {filteredProducts.length > productsPerPage && (
          <nav className="pagination">
            <ul className="pagination-list flex gap-2">
              {Array.from({
                length: Math.ceil(filteredProducts.length / productsPerPage),
              }).map(
                (_, index) =>
                  index >= currentPage - 2 &&
                  index <= currentPage + 2 && ( // Mostrar solo 5 páginas a la vez
                    <li key={index} className="pagination-item">
                      <button
                        onClick={() => paginate(index + 1)}
                        className={`pagination-link ${
                          currentPage === index + 1
                            ? "text-white bg-green-500 px-3 py-1 rounded-xl max-md:text-xs"
                            : "text-slate-600 bg-white border-[1px] border-slate-300 px-2 py-1 rounded-xl max-md:text-xs"
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
    </section>
  );
};
