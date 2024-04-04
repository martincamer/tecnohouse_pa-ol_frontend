//imports
import { createContext, useContext, useEffect, useState } from "react";
import { obtenerProductos } from "../api/apis";
import client from "../api/axios";

//context
export const ProductosContext = createContext();

//use context
export const useProductosContext = () => {
  const context = useContext(ProductosContext);
  if (!context) {
    throw new Error("Use Productos Propvider");
  }
  return context;
};

//
export const ProductosProvider = ({ children }) => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [salidas, setSalidas] = useState([]);
  const [entradas, setEntradas] = useState([]);

  useEffect(() => {
    async function loadData() {
      const respuesta = await obtenerProductos();
      setProductos(respuesta.data);
    }

    loadData();
  }, []);

  useEffect(() => {
    async function loadData() {
      const respuesta = await client.get("/categorias");
      setCategorias(respuesta.data);
    }

    loadData();
  }, []);

  useEffect(() => {
    async function loadData() {
      const respuesta = await client.get("/empleados");
      setEmpleados(respuesta.data);
    }

    loadData();
  }, []);

  useEffect(() => {
    async function loadData() {
      const respuesta = await client.get("/salidas");
      setSalidas(respuesta.data);
    }

    loadData();
  }, []);

  useEffect(() => {
    async function loadData() {
      const respuesta = await client.get("/entradas");
      setEntradas(respuesta.data);
    }

    loadData();
  }, []);

  return (
    <ProductosContext.Provider
      value={{
        productos,
        setProductos,
        categorias,
        setCategorias,
        setSalidas,
        salidas,
        empleados,
        setEmpleados,
        setEntradas,
        entradas,
      }}
    >
      {children}
    </ProductosContext.Provider>
  );
};
