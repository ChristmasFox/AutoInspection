import TabsView from '@/layouts/tabs/TabsView'
import BlankView from '@/layouts/BlankView'
// import PageView from '@/layouts/PageView'

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
      path: '/detail',
      name: '详情页',
      component: TabsView,
      children: [
        {
          path: 'executedetail/:planName',
          name: '执行详情',
          component: () => import('@/components/detail/ExecuteDetail'),
        },
        {
          path: 'reportdetail/:planName',
          name: '报告',
          component: () => import('@/components/detail/ReportDetail'),
        },
      ]
    },
    {
      path: '/',
      name: '首页',
      component: TabsView,
      redirect: '/login',
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
            }
          ]
        },
      ]
    }
  ]
}

export default options
