import Vue from 'vue';
import VueRouter from 'vue-router';

import Buefy from "buefy";
import "buefy/dist/buefy.css";

Vue.use(Buefy);

import App from './App.vue';
import routes from './routes';

Vue.use(VueRouter);

// Configure router
const router = new VueRouter({
    routes,
    linkActiveClass: 'active',
    mode: 'history'
});

new Vue({
    el: '#app',
    render: h => h(App),
    router
});
