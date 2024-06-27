import { urlBackend } from "../urlBackend";

async function apiSaveCliente(diagnostico) {
  const token = localStorage.getItem("token");
  const result = await fetch(urlBackend + "cliente/save", {
    method: "POST",
    body: JSON.stringify(diagnostico),
    headers: {
      Authorization: "Bearer " + token,
      "Content-type": "application/json",
    },
  });
  return result;
}

export { apiSaveCliente };
