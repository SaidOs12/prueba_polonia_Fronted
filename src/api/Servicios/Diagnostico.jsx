import { urlBackend } from "../urlBackend";

async function apiSaveDiagnostico(diagnostico) {
  const token = localStorage.getItem("token");
  const result = await fetch(urlBackend + "diagnostico/save", {
    method: "POST",
    body: JSON.stringify(diagnostico),
    headers: {
      Authorization: "Bearer " + token,
      "Content-type": "application/json",
    },
  });
  return result;
}

export { apiSaveDiagnostico };
