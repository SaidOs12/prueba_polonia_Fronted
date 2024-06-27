import Header from "../../../components/Headers/Header";
import "../../../assets/css/spinner.css";
import { useState } from "react";

const Maicol=()=>{
    const [downloading, setDownloading] = useState(false);
    return (
        <div>
              {/* Contenido */}
        {downloading && (
          <div className="overlay">
            <div className="spinner " aria-hidden="true"></div>
          </div>
        )}
            <Header/>
            <h1 className="mt-6 text-xl">Maicol</h1>
        </div>
    )
}

export default Maicol;