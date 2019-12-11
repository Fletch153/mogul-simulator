import Simulator from './components/Simulator.vue';


const routes = [
  {
    path: "/",
    name: "Private",
    component: Simulator
  },
  {
    path: "/public",
    name: "Public",
    component: Simulator
  }
];

export default routes;
