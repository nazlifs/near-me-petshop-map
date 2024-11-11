import { createBrowserRouter } from "react-router-dom";
import { Info, Tambah } from "../pages";


const Router = createBrowserRouter([
    {
      path: "/",
      element: <Info/>,
    },

    {
      path: "/tambah",
      element: <Tambah/>,
    },


  ]);

export default Router