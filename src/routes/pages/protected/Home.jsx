import OrdenesColumnChart from "../../../components/charts/OrdenesColumnChart";
import PogressBar from "../../../components/charts/PogressBar";
import { useProductosContext } from "../../../context/ProductosProvider";

export const Home = () => {
  const { salidas, entradas, productos } = useProductosContext();

  const fechaActual = new Date();
  const numeroDiaActual = fechaActual.getDay(); // Obtener el día del mes actual

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

  const calculateCategoryTotals = () => {
    const categoryTotals = {};

    // Iterar a través de las órdenes buscadas
    entradas.forEach((orden) => {
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
  // Calcular el total del stock en todas las categorías
  const totalStock = productos.reduce((total, producto) => {
    return total + parseInt(producto.stock);
  }, 0);

  const calculateCategoryTotalsSalidas = () => {
    const categoryTotals = {};

    // Iterar a través de las órdenes buscadas
    salidas.forEach((orden) => {
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
  const categoryTotalsDataSalidas = calculateCategoryTotalsSalidas();

  return (
    <section className="w-full h-full min-h-full max-h-full px-12 max-md:px-4 flex flex-col gap-12 max-md:gap-8 py-24 max-md:py-20">
      <div className="rounded-xl bg-white grid grid-cols-4 gap-3 max-md:grid-cols-1 max-md:border-none max-md:shadow-none max-md:py-2 max-md:px-0">
        <article className="flex flex-col gap-4 rounded-xl border border-slate-200 shadow bg-white p-6 max-md:p-3 max-md:rounded-xl">
          <div className="inline-flex gap-2 self-end rounded bg-green-100 p-1 text-green-600">
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

            <span className="text-xs font-medium">
              {" "}
              {Number(totalStock / 100000).toFixed(2)} %{" "}
            </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-xs uppercase">
              Total en stock anual cargado
            </strong>

            <p className="text-slate-500">
              <span className="text-2xl max-md:text-base font-medium text-green-500">
                + {totalStock}{" "}
              </span>{" "}
              <span
                className={`text-xs
                 `}
              ></span>
            </p>
          </div>
        </article>

        <article className="flex flex-col gap-4 rounded-xl border border-slate-200 shadow bg-white p-6 max-md:p-3 max-md:rounded-xl">
          <div className="inline-flex gap-2 self-end rounded bg-orange-100 p-1 text-orange-600">
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

            <span className="text-xs font-medium">
              {" "}
              {Number(entradas.length / 10).toFixed(2)} %{" "}
            </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-xs uppercase">
              Total de entradas geranadas
            </strong>

            <p className="text-slate-500">
              <span className="text-2xl max-md:text-base font-medium text-orange-500">
                {Number(entradas.length)}{" "}
              </span>{" "}
              <span
                className={`text-xs
                 `}
              ></span>
            </p>
          </div>
        </article>

        <article className="flex flex-col gap-4 rounded-xl border border-slate-200 shadow bg-white p-6 max-md:p-3 max-md:rounded-xl">
          <div className="inline-flex gap-2 self-end rounded bg-red-100 p-1 text-red-600">
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

            <span className="text-xs font-medium">
              {" "}
              {Number(salidas.length / 10).toFixed(2)} %{" "}
            </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-xs uppercase">
              Total de salidas geranadas
            </strong>

            <p className="text-slate-500">
              <span className="text-2xl max-md:text-base font-medium text-red-500">
                {Number(salidas.length)}{" "}
              </span>{" "}
              <span
                className={`text-xs
                 `}
              ></span>
            </p>
          </div>
        </article>

        <article className="flex flex-col gap-4 rounded-xl border border-slate-200 shadow bg-white p-6 max-md:p-3">
          <div className="mt-2 h-[100px] overflow-y-scroll">
            <strong className="block text-sm font-medium text-gray-500 max-md:text-sm uppercase mb-2">
              Entradas Materiales/categorias gastos totales
            </strong>

            <p className="">
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
                        {Number(category.total)} unds
                      </span>
                    </li>
                  ))}
                </ul>
              </span>
            </p>
          </div>
        </article>

        <article className="flex flex-col gap-4 rounded-xl border border-slate-200 shadow bg-white p-6 max-md:p-3">
          <div className="mt-2 h-[100px] overflow-y-scroll">
            <strong className="block text-sm font-medium text-gray-500 max-md:text-sm uppercase mb-2">
              Salidas Materiales/categorias gastos totales
            </strong>

            <p className="">
              <span className="text-2xl font-medium text-gray-900 max-md:text-base">
                <ul className="flex flex-col gap-1">
                  {categoryTotalsDataSalidas.map((category) => (
                    <li
                      className="uppercase text-sm text-slate-600"
                      key={category.categoria}
                    >
                      <span className="font-bold">{category.categoria}:</span>{" "}
                      <span className="text-red-600">
                        {" "}
                        {Number(category.total)} unds
                      </span>
                    </li>
                  ))}
                </ul>
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
      </div>

      <div className="grid grid-cols-2 items-start gap-5 overflow-y-scroll max-md:grid-cols-1">
        <div className="h-[300px] border-slate-200 border-[1px] shadow py-5 px-5 rounded-xl flex flex-col gap-2">
          <div>
            <h4 className="underline font-bold text-slate-700">
              TOTAN EN ENTRADAS GRAFICO
            </h4>
          </div>
          <div className="text-2xl font-medium text-gray-900 max-md:text-base flex flex-col gap-5">
            {categoryTotalsData.map((category) => (
              <div key={category.categoria}>
                <p className="uppercase text-sm text-slate-600">
                  {category.categoria}:
                </p>
                <div className="bg-gray-200 rounded-xl h-3 relative">
                  <div
                    className="bg-orange-500 h-full rounded-xl"
                    style={{
                      width: `${(category.total / 100000) * 100}%`,
                    }}
                  ></div>
                </div>
                <div>
                  <p className=" text-xs text-slate-700 px-2 py-1 font-semibold">
                    {`${category.total} unds (${(
                      (category.total / 100000) *
                      100
                    ).toFixed(2)}%)`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="h-[300px] border-slate-200 border-[1px] shadow py-5 px-5 rounded-xl flex flex-col gap-2">
          <div>
            <h4 className="underline font-bold text-slate-700">
              TOTAN EN SALIDAS GRAFICO
            </h4>
          </div>
          <div className="text-2xl font-medium text-gray-900 max-md:text-base flex flex-col gap-5">
            {categoryTotalsDataSalidas.map((category) => (
              <div key={category.categoria}>
                <p className="uppercase text-sm text-slate-600">
                  {category.categoria}:
                </p>
                <div className="bg-gray-200 rounded-xl h-3 relative">
                  <div
                    className="bg-red-500 h-full rounded-xl"
                    style={{
                      width: `${(category.total / 100000) * 100}%`,
                    }}
                  ></div>
                </div>
                <div>
                  <p className=" text-xs text-slate-700 px-2 py-1 font-semibold">
                    {`${category.total} unds (${(
                      (category.total / 100000) *
                      100
                    ).toFixed(2)}%)`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* <div className="border-slate-200 border-[1px] shadow rounded-xl py-5 px-5 flex flex-col gap-5">
        <div className="px-5">
          <p className="text-lg text-slate-600 underline">
            ORDENES ESTADISTICA SEMANAL
          </p>
        </div>
        <OrdenesColumnChart ordenesMensuales={ordenesMensuales} />
      </div> */}
    </section>
  );
};
