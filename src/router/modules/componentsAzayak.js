/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const componentsRouterAzayak = {
	path: '/componentsAzayak',
	component: Layout,
	redirect: 'noRedirect',
	name: 'ComponentDemoAzayak',
	meta: {
		title: '组件-Azayak',
		icon: 'component',
	},
	children: [
		{
			path: 'scrollWrapper',
			component: () => import('@/views/components-azayak/scroll-wrapper'),
			name: 'ScrollWrapper',
			meta: { title: '自动滚动框' },
		},
		{
			path: 'elSelectPlus',
			component: () => import('@/views/components-azayak/el-select-plus'),
			name: 'ElSelectPlus',
			meta: { title: 'ElSelect增强版' },
		},
	],
}

export default componentsRouterAzayak
