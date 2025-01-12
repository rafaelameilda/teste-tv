const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        name: 'home',
        path: '',
        component: () => import('pages/IndexPage.vue'),
      },
      {
        path: 'register',
        component: () => import('pages/register/index.vue'),
        children: [
          {
            name: 'register-midia',
            path: 'midia',
            component: () => import('pages/register/RegisterMidia.vue'),
            meta: { title: 'Cadastrar Mídias', color: 'bg-light-blue' },
          },
          {
            name: 'register-playlist',
            path: 'playlist',
            component: () => import('pages/register/RegisterPlayList.vue'),
            meta: { title: 'Cadastrar PlayList', color: 'bg-blue-grey' },
          },
        ],
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
