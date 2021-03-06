import React from 'react';
import { renderRoutes, RouteConfig } from 'react-router-config';
import layout from '../components/layout/default';
/**
 *  react-router-config 配置文档  https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
 *  react-router 配置文档 https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/Route.md
 *  path 配置文档 https://github.com/pillarjs/path-to-regexp/tree/v1.7.0
 */
const router: RouteConfig[] = [
    {
        path: "/",
        component: layout,
        routes: [
            {
                path: "/",
                exact: true,
                component: React.lazy(() => import("pages/demo"))
            },
            {
                path: "/dataprivilege",
                exact: true,
                component: React.lazy(() => import("pages/dataprivilege"))
            }
        ]
    }
]
export default renderRoutes(router) 
