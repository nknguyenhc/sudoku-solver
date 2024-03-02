import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "../App";

const router = createBrowserRouter([
  {
    path: '',
    element: <App />,
    children: [
      {
        path: '',
      },
      {
        path: '/normal',
      },
      {
        path: '/killer',
      },
    ],
  },
]);

const AppRouterProvider = (): JSX.Element => <RouterProvider router={router} />

export default AppRouterProvider;
