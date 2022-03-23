import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom';
import Alerta from '../components/Alerta';
import clienteAxios from '../config/axios';

const NuevoPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [tokenValido, setTokenValido] = useState(false);
  const [passwordModificado, setPasswordModificado] = useState(false);
  const [confirmarCuenta, setConfirmarCuenta] = useState(false);
	const [cargando, setCargando] = useState(false);
	const [cuentaConfirmada, setCuentaConfirmada] = useState(false);

	const [alerta, setAlerta] = useState({});

  const params = useParams();
  const { token } = params;

  useEffect(() => {
    const comprobarToken = async () =>{
      try {
        await clienteAxios(`/veterinarios/olvide-password/${token}`);
        setAlerta({
          msg: 'Coloca tu Nuevo Password'
        });
        setTokenValido(true);
      } catch (error) {
        if(error.response.status === 403){
          setConfirmarCuenta(true);
          setAlerta({
            msg: error.response.data.msg,
            error: true
          });
        }else{
          setAlerta({
            msg: 'Hubo un error con el enlace',
            error: true
          });
        }
      }
    }
    comprobarToken();
  }, []);

  const handleSubmit = async (e) =>{
    e.preventDefault();

    if ([password, confirmarPassword].includes('')) {
			setAlerta({ msg: 'Todos los campos son obligatorios', error: true });
			return;
		}

    if (password !== confirmarPassword) {
			setAlerta({ msg: 'Los passwords no son iguales', error: true });
			return;
		}

		if (password.length < 6) {
			setAlerta({
				msg: 'El password debe contener al menos 6 caracteres',
				error: true,
			});
			return;
		}

		setAlerta({});

    try {
      const url = `/veterinarios/olvide-password/${token}`;
      const { data } = await clienteAxios.post(url, { password });

      setTokenValido(false);
      setPasswordModificado(true);

      setAlerta({
        msg: data.msg
      });
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      });
    }
  }

  const confirmarCuentaFunc = async () =>{
    setCargando(true);
    try {
      const url = `/veterinarios/confirmar/${token}`;
      const { data } = await clienteAxios(url);
      setCuentaConfirmada(true);
      setConfirmarCuenta(false);
      setAlerta({
        msg: data.msg
      });
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }
    setCargando(false);
  }

	const { msg } = alerta;

  return (
    <>
			<div>
				<h1 className="text-indigo-600 font-black text-6xl">
					Reestablece tu Password y no Pierdas {''}
					<span className="text-black">tus Pacientes</span>
				</h1>
			</div>

			<div className="mt-20 md:mt-5 shadow-lg px-8 py-10 rounded-xl bg-white flex flex-col">
        {(msg && !cargando) && <Alerta alerta={alerta} />}
        { tokenValido && (
          <form onSubmit={handleSubmit}>
            <div className="my-5">
              <label
                className="uppercase text-gray-600 block text-xl font-bold"
                htmlFor="nuevoPassword"
              >
                Nuevo Password
              </label>
              <input
                name="nuevoPassword"
                id="nuevoPassword"
                type="password"
                placeholder="Tu Nuevo Password"
                className="border w-full p-3 mt-3 bg-gray-50 rounded-xl"
                value={password}
                onChange={ e => setPassword(e.target.value)}
              />
            </div>

            <div className="my-5">
              <label
                className="uppercase text-gray-600 block text-xl font-bold"
                htmlFor="confirmarPassword"
              >
                Confirma tu password
              </label>
              <input
                name="confirmarPassword"
                id="confirmarPassword"
                type="password"
                placeholder="Confirma tu Nuevo Password"
                className="border w-full p-3 mt-3 bg-gray-50 rounded-xl"
                value={confirmarPassword}
                onChange={ e => setConfirmarPassword(e.target.value)}
              />
            </div>

            <input
              type="submit"
              value="Guardar Cambios"
              className="bg-indigo-700 w-full py-3 px-10 rounded-xl text-white uppercase font-bold mt-5 hover:cursor-pointer hover:bg-indigo-800 md:w-auto"
            />
          </form>
        )}
        { confirmarCuenta && (
          <button 
            className="block py-1 w-full text-center text-gray-500" 
            onClick={confirmarCuentaFunc}
          >
            Confirma tu cuenta
          </button>
        )}
        { (cuentaConfirmada || passwordModificado) && (
          <Link className="block text-center my-5 text-indigo-600 font-bold text-xl hover:cursor-pointer" to="/">
            Iniciar Sesión
          </Link>
        )}
			</div>
		</>
  );
};

export default NuevoPassword;
