import { RecoilRoot } from "recoil";
import { Suspense, lazy } from "react";
import { TbFidgetSpinner } from "react-icons/tb";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { useEffect } from "react";
import { config } from "./constants/config";

const HomePage = lazy(() => import("./pages/home"))
const AdminPage = lazy(() => import("./pages/admin"))

const queryClient = new QueryClient()

const App = () => {
  useEffect(() => {
    if (document.title !== config.html.title) {
      document.title = config.html.title;
    }
  }, []);

  const routes = [
    {
      path: "/",
      component: <HomePage />,
    },
    {
      path: "/admin",
      component: <AdminPage />,
    },
  ]

  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter basename='/'>
          <Routes>
            {routes.map(({ path, component }) => {
              return (
                <Route
                  key={path}
                  path={path}
                  element={<Suspense
                    fallback={<div className="w-full h-screen flex justify-center items-center">
                      <TbFidgetSpinner className="animate-spin !text-5xl text-white" />
                    </div>}
                  >
                    {component}
                  </Suspense>}
                />
              );
            })}
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </RecoilRoot>
  );
};

export default App;
