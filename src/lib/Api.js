const BASE_URL = "https://dwf-m9.vercel.app/api";

export async function getData(query, filter, page) {
	let datos = await fetch(
		BASE_URL + "/personas?q=" + query + "&filter=" + filter + "&page=" + page,
		{
			method: "GET",
		}
	);
	let array = datos.json();

	return array;
}

export async function addData(persona) {
	let newBody = JSON.stringify(persona);

	let datos = await fetch(BASE_URL + "/personas", {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: newBody,
	});
	return datos;
}
