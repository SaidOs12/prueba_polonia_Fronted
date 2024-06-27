import Login from "./view/Inicio/Login";
import Recuperar from "./view/Inicio/Recuperar";
import Registrar from "./view/Inicio/Registrar";

import IndexUser from "./view/Admin/Index/Index";

import ServiciosMecanico from "./view/Mecanico/Servicios/Servicios";
import ServiciosOperador from "./view/Operador/Servicios/Operador";
import Perfil from "./view/Perfil/Perfil";
import Citas from "./view/Admin/Citas/Citas";

import CitasMecanico from "./view/Mecanico/Citas/Citas";
import Historial from "./view/Admin/Historial/Historial";

import HistorialOperador from "./view/Operador/Historial/Historial";
import CajaOperador from "./view/Operador/Caja/Caja";
import Tareas from "./view/Admin/Tareas/Tareas";
import Maicol from "./view/Admin/Maicol/Maicol";
var routes = [
  // {
  //   path: "/index",
  //   name: "Index",
  //   icon: "fas fa-heart",
  //   component: <Index />,
  //   layout: "/auth",
  // },
  {
    path: "/login",
    name: "Login",
    icon: "fas fa-heart",
    component: <Login />,
    layout: "/auth",
  },
  {
    path: "/recuperar",
    name: "Recuperar",
    icon: "fas fa-heart",
    component: <Recuperar />,
    layout: "/auth",
  },
  {
    path: "/registrar",
    name: "Resgistrar",
    icon: "fas fa-heart",
    component: <Registrar />,
    layout: "/auth",
  },
  {
    path: "/index",
    name: "Inicio",
    icon: "fas  fa-home text-dark",
    component: <IndexUser />,
    layout: "/admin",
  },
  {
    path: "/servicios",
    name: "Servicios",
    icon: "fa-solid fa-gears text-info",
    component: <ServiciosOperador />,
    layout: "/admin",
  },
  {
    path: "/caja",
    name: "Caja",
    icon: "fa-solid fa-money-bill text-green",
    component: <CajaOperador />,
    layout: "/admin",
  },

  {
    path: "/citas",
    name: "Citas",
    icon: "fa fa-users text-primary",
    component: <Citas />,
    layout: "/admin",
  },

  {
    path: "/tareas",
    name: "Tareas",
    icon: "fa fa-male text-gris",
    component: <Tareas />,
    layout: "/admin",
  },
  // {
  //   path: "/maicol",
  //   name: "Maicol",
  //   icon: "fa fa-male text-gris",
  //   component: <Maicol />,
  //   layout: "/admin",
  // },

  {
    path: "/historial",
    name: "Historial",
    icon: "fa fa-list text-blue",
    component: <Historial />,
    layout: "/admin",
  },

  {
    path: "/perfil",
    name: "Perfil",
    icon: "",
    component: <Perfil />,
    layout: "/admin",
  },
  {
    path: "/index",
    name: "Index",
    icon: "fas  fa-home text-dark",
    component: <ServiciosMecanico />,
    layout: "/mecanico",
  },
  {
    path: "/citas",
    name: "Citas",
    icon: "fa fa-users text-primary",
    component: <CitasMecanico />,
    layout: "/mecanico",
  },
  {
    path: "/perfil",
    name: "Perfil",
    icon: "",
    component: <Perfil />,
    layout: "/mecanico",
  },
  // {
  //   path: "/servicios",
  //   name: "Servicios",
  //   icon: "fa-solid fa-gears text-warning",
  //   component: <ServiciosMecanico  />,
  //   layout: "/mecanico",
  // },
  {
    path: "/index",
    name: "Index",
    icon: "fas  fa-home text-dark",
    component: <ServiciosOperador />,
    layout: "/operador",
  },
  {
    path: "/caja",
    name: "Caja",
    icon: "fa-solid fa-money-bill text-green",
    component: <CajaOperador />,
    layout: "/operador",
  },
  {
    path: "/citas",
    name: "Citas",
    icon: "fa fa-users text-primary",
    component: <Citas />,
    layout: "/operador",
  },
  {
    path: "/historial",
    name: "Historial",
    icon: "fa fa-list text-blue",
    component: <HistorialOperador />,
    layout: "/operador",
  },

  // {
  //   path: "/servicios-mecanico",
  //   name: "Servicios Mecanico",
  //   icon: "fa-solid fa-gears text-warning",
  //   component: <OperadorServiciosMecanico />,
  //   layout: "/operador",
  // },
  {
    path: "/perfil",
    name: "Perfil",
    icon: "",
    component: <Perfil />,
    layout: "/operador",
  },

  // {
  //   path: "/entrenamientos/:id/registrar",
  //   name: "Entrenamientos",
  //   icon: "",
  //   component: < />,
  //   layout: "/cliente",
  // },
];

export default routes;
