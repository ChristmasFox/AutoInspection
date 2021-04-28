import TabsView from '@/layouts/tabs/TabsView'
import BlankView from '@/layouts/BlankView'
// import PageView from '@/layouts/PageView's

// 路由配置
const options = {
  routes: [
    {
      path: '/login',
      name: '登录页',
      component: () => import('@/pages/login')
    },
    {
      path: '*',
      name: '404',
      component: () => import('@/pages/exception/404'),
    },
    {
      path: '/403',
      name: '403',
      component: () => import('@/pages/exception/403'),
    },
    {
      path: '/',
      name: '首页',
      component: TabsView,
      redirect: '/inspection/home',
      children: [
        {
          path: 'inspection',
          name: '自动化巡检',
          meta: {
            icon: 'dashboard'
          },
          component: BlankView,
          children: [
            {
              path: 'home',
              name: '首页',
              component: () => import('@/pages/inspection/home'),
            },
            {
              path: 'plan',
              name: '计划管理',
              component: () => import('@/pages/inspection/plan'),
            },
            {
              path: 'templateManagement',
              name: '模板管理',
              component: () => import('@/pages/inspection/templateManagement'),
            },
            {
              path: 'history',
              name: '执行历史',
              component: () => import('@/pages/inspection/history'),
            },
            {
              path: 'details',
              name: '详情',
              component: BlankView,
              meta: {
                invisible: true
              },
              children: [
                {
                  path: 'executedetail/:planName',
                  name: '执行详情',
                  meta: {
                    invisible: true
                  },
                  component: () => import('@/pages/inspection/details/ExecuteDetail'),
                },
                {
                  path: 'reportdetail/:planName',
                  name: '报告',
                  meta: {
                    invisible: true
                  },
                  component: () => import('@/pages/inspection/details/ReportDetail'),
                },
              ]
            }
          ]
        },
      ]
    }
  ]
}

export default options
