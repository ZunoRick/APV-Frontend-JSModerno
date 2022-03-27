import AdminNav from "../components/AdminNav";
import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import Alerta from "../components/Alerta";

const CambiarPassword = () => {
  const { auth, guardarPassword } = useAuth();
  const [password, setPassword] = useState({
    passwordActual: '',
    nuevoPassword: ''
  });
  const [alerta, setAlerta] = useState({});

  const handleSubmit = async e =>{
    e.preventDefault();

    if(Object.values(password).some( campo => campo === '')){
      setAlerta({
        msg: 'Todos los campos son obligatorios',
        error: true
      });
      return;
    }

    if(password.nuevoPassword.length < 6){
      setAlerta({
        msg: 'El password debe tener mínimo 6 caracteres',
        error: true
      });
      return;
    }

    setAlerta(await guardarPassword(password));
  }

  const { msg } = alerta;

  return (
    <>
      <AdminNav />
      <h2
        className="font-black text-3xl text-center mt-10"
      >Cambiar Password</h2>
      <p
        className="text-xl mt-5 mb-10 text-center"
      >Modifica tu {''}
        <span
          className="text-indigo-600 font-bold"
        >Password aquí</span>
      </p>

      <div className="flex justify-center">
        <div className="w-full md:w-1/2 bg-white shadow rounded-lg p-5">
          { msg && <Alerta alerta={alerta} />}
          <form
            onSubmit={handleSubmit}
          >
            <div className="my-3">
              <label 
                htmlFor="passwordActual"
                className="uppercase font-bold text-gray-600"
              >Password Actual
              </label>

              <input 
                id="passwordActual"
                type="password" 
                className="border bg-gray-50 w-full p-2 mt-5 rounded-lg"
                name="passwordActual"
                placeholder="Escribe tu password actual"
                onChange={ e => setPassword({
                  ...password,
                  [e.target.name] : e.target.value
                })}
              />
            </div>

            <div className="my-3">
              <label 
                htmlFor="nuevoPassword"
                className="uppercase font-bold text-gray-600"
              >Password Nuevo
              </label>

              <input 
                id="nuevoPassword"
                type="password" 
                className="border bg-gray-50 w-full p-2 mt-5 rounded-lg"
                name="nuevoPassword"
                placeholder="Escribe tu nuevo password"
                onChange={ e => setPassword({
                  ...password,
                  [e.target.name] : e.target.value
                })}
              />
            </div>

            <input 
              type="submit" 
              value="Actualizar Password" 
              className="bg-indigo-700 px-10 py-3 font-bold text-white rounded-lg uppercase w-full mt-5 hover:bg-indigo-800"
            />
          </form>
        </div>
      </div>
    </>
  )
}

export default CambiarPassword;