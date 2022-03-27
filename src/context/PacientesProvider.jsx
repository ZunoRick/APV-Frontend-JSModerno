import { createContext, useState,useEffect } from "react";
import clienteAxios from "../config/axios";

const PacientesContext = createContext();

export const PacientesProvider = ({children}) =>{
  const [pacientes, setPacientes] = useState([]);
  const [paciente, setPaciente] = useState({});

  useEffect(() => {
    const obtenerPacientes = async ()=>{
      try {
        const token = localStorage.getItem('apv_token');
        if (!token) {
          return;
        }

        const config = {
          headers:{
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }

        const { data } = await clienteAxios('/pacientes', config);
        setPacientes(data);
      } catch (error) {
        console.log(error);
      }
    }
    obtenerPacientes();
  }, []);

  const guardarPaciente = async paciente =>{
    const token = localStorage.getItem('apv_token');
    const config = {
      headers:{
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }

    if (paciente.id) {
      try {
        const { data } = await clienteAxios.put(`/pacientes/${paciente.id}`, paciente, config);
        const pacientesActualizado = pacientes.map( pacienteState => pacienteState._id === data._id ? data : pacienteState);
        setPacientes(pacientesActualizado);
      } catch (error) {
        console.log(error);
      }
    }else{
      try {
        const { data } = await clienteAxios.post('/pacientes', paciente, config);
  
        //Crea un nuevo objeto sin los datos especificados
        const { createdAt, updatedAt, __v, ...pacienteAlmacenado } = data;
        setPacientes([pacienteAlmacenado, ...pacientes]);
      } catch (error) {
        console.log(error.response.data.msg);
      }
    }
  }

  const setEdicion = paciente =>{
    setPaciente(paciente);
  }

  const eliminarPaciente = async id =>{
    const confirmar = confirm('¿Eliminar paciente?');
    if(confirmar){
      try {
        const token = localStorage.getItem('apv_token');
        const config = {
          headers:{
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
        const { data } = await clienteAxios.delete(`/pacientes/${id}`, config);
        const pacientesActualizado = pacientes.filter( pacienteState => pacienteState._id !== id);
        setPacientes(pacientesActualizado);
      } catch (error) {
        console.log(error);
      }
    }
  }

  return(
    <PacientesContext.Provider
      value={{
        pacientes,
        guardarPaciente,
        setEdicion,
        paciente,
        eliminarPaciente
      }}
    >
      {children}
    </PacientesContext.Provider>
  )
}

export default PacientesContext;
