import { createBrowserRouter, Navigate, type RouteObject } from "react-router-dom"
import Main from "../pages/main"
import Home from "../pages/home"
import Mall from "../pages/mall"
import User from "../pages/user"
import pageOne from "../pages/other/pageOne"
import pageTwo from "../pages/other/pageTwo"

const routes: RouteObject[] = [
    {
        path: "/",
        Component: Main,
        children: [
            //用于重定向
            { path: "/", element: <Navigate to="home" replace /> },
            { path: "home", Component: Home },
            { path: "mall", Component: Mall },
            { path: "user", Component: User },
            {
                path: "other",
                children: [
                    { path: "pageOne", Component: pageOne },
                    { path: "pageTwo", Component: pageTwo }
                ]
            }
        ]
    }
];

export default createBrowserRouter(routes)