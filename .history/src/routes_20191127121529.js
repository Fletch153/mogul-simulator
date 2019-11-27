import AppHome from '@/components/AppHome';
const AppMedium = () => import('@/components/AppMedium');


const routes = [
    {
        path: '/',
        name: 'Home',
        component: Simulator
    }
];

export default routes;
