import React, { useState, useEffect } from "react";
import "./index.css";
import { getData, addData } from "../../lib/Api";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import InfiniteScroll from "react-infinite-scroll-component";
import ReactLoading from "react-loading";
import swal from "sweetalert";
let page = 1;
let resultados = [];
let totalPages = 10;
let queryState = "";
let cargando = false;
export function Dropdowns() {
	let filter = [
		{ value: "nombre", filter: "Nombre" },
		{ value: "razón social", filter: "Razón Social" },
		{ value: "nit", filter: "NIT" },
		{ value: "telefono", filter: "Telefono" },
		{ value: "codigo", filter: "Codigo" },
	];

	let [isLoading, setIsLoading] = useState();
	let [useFilter = filter[0].value, setFilter] = useState();
	let [useResults, setUseResults] = useState();
	let [useObject, setObject] = useState({
		nombre: "",
		razonSocial: "",
		nit: "",
		telefono: "",
		codigo: "",
	});
	let [useQuery, setQuery] = useState();
	let [usepopUp, setPopUp] = useState(false);
	let [useButton, setUseButton] = useState(false);

	const { register, handleSubmit } = useForm();

	let count = 0;
	const variants = {
		open: (height = 1000) => ({
			clipPath: `circle(${height * 2 + 200}px at 40px  40px)`,
			transition: {
				delay: 0.1,
				type: "spring",
				stiffness: 20,
				restDelta: 2,
			},
		}),
		closed: {
			clipPath: "circle(30px at  40px  40px)",
			transition: {
				delay: 0.3,
				type: "spring",
				stiffness: 400,
				damping: 40,
			},
		},
	};

	async function onSubmit(data) {
		setIsLoading(true);
		setUseButton(true);
		page = 1;
		queryState = data.q;
		let datos = await getData(data.q, useFilter, page);
		resultados = datos.results;
		totalPages = datos.total_pages;
		page = page + 1;
		setUseResults(resultados);
		setIsLoading(false);
		return true;
	}

	function openPopUp() {
		setObject({ [useFilter]: useQuery });
	}

	async function loadMoreObjects() {
		if (page <= totalPages) {
			let datos = await getData(queryState, useFilter, page).then((res) => {
				console.log("SOY RESULTS", resultados, useResults);

				let newDatos = res;
				if (resultados) {
					setUseButton(true);
					resultados = resultados.concat(...newDatos.results);
					return resultados;
				}

				if (resultados.length === 0) {
					resultados = resultados.concat(res.results);
					return resultados;
				}
			});
			console.log("SOY DATOS", datos);
			setUseResults(datos);
			page = page + 1;
		}
		setIsLoading(false);
	}
	useEffect(() => {
		window.addEventListener("scroll", handleScroll);
	}, []);
	const handleScroll = (e) => {
		setIsLoading(true);
		// console.log("SOY WINDOWSinnerhig", window.innerHeight);
		// console.log(
		// 	"SOY WINDOWSinnerhig scrolltop",
		// 	e.target.documentElement.scrollTop
		// );
		// console.log(
		// 	"SOY WINDOWSinnerhig scrolltop masuno",
		// 	e.target.documentElement.scrollTop + 1
		// );
		// console.log(
		// 	"soy la sunma ",
		// 	window.innerHeight + e.target.documentElement.scrollTop + 1
		// );
		// console.log(
		// 	"Soy docelementscrollheight",
		// 	e.target.documentElement.scrollHeight
		// );
		if (
			window.innerHeight + e.target.documentElement.scrollTop >=
			e.target.documentElement.scrollHeight
		) {
			console.log("Entre al if", cargando);
			loadMoreObjects();
		}
		return true;
	};
	async function addObject(params) {
		params.preventDefault();

		let res = await addData({
			nombre: params.target.nombre.value,
			"razón social": params.target["razón social"].value,
			nit: params.target.nit.value,
			telefono: params.target.telefono.value,
			codigo: params.target.codigo.value,
		});
		if (res.status === 200) {
			swal("Datos Agregados Correctamente!!!", "", "success");
			setPopUp(false);
			return true;
		} else {
			swal("UPS!", "Algo paso", "error");
			setPopUp(false);
			return false;
		}
	}
	function handleChange(e) {
		setFilter(e.target.value);
	}

	return (
		<div className={"mainContainer"}>
			<div className="dropdownContainer">
				<select
					name="filtros"
					id="filter"
					className={"filtros"}
					onChange={handleChange}
				>
					{filter.map((i, index) => (
						<option value={i.value} className={"optionsFilters"} key={index}>
							{i.filter}
						</option>
					))}
				</select>
				<div className={"dropdownContent"}>
					<form onSubmit={handleSubmit(onSubmit)}>
						<input
							{...register("q")}
							type={"text"}
							id="myInput"
							onClick={() => {
								setPopUp(false);
							}}
						></input>{" "}
						<button className="searchButton">buscar</button>
					</form>
					{usepopUp && (
						<div className="backgroundForm">
							<motion.form
								animate={usepopUp === true ? "open" : "closed"}
								variants={variants}
								className="formContainer"
								onSubmit={addObject}
							>
								<h3>Crear Registro</h3>
								<input
									className="inputForm"
									placeholder="Nombre"
									id={"nombre"}
									defaultValue={useObject.nombre}
									type={"text"}
								></input>

								<input
									className="inputForm"
									id={"razón social"}
									placeholder="Razón Social"
									defaultValue={useObject.razonSocial}
									type={"text"}
								></input>

								<input
									className="inputForm"
									placeholder="NIT"
									id={"nit"}
									defaultValue={useObject.nit}
									type={"text"}
								></input>

								<input
									className="inputForm"
									placeholder="Telefono"
									id={"telefono"}
									defaultValue={useObject.telefono}
									type={"text"}
								></input>

								<input
									className="inputForm"
									placeholder="Codigo"
									id={"codigo"}
									defaultValue={useObject.codigo}
									type={"text"}
								></input>
								<div className="divFormButtons">
									<button className="botonAñadir"> Añadir</button>
									<button
										type="cerrar"
										className="buttonCerrar"
										onClick={() => {
											setPopUp(false);
										}}
									>
										cancelar
									</button>{" "}
								</div>
							</motion.form>
						</div>
					)}
				</div>
			</div>

			<div className={"resultsContenedor"}>
				{useButton && (
					<button
						className={"buttonAdd"}
						onClick={() => {
							setPopUp(true);
							openPopUp();
						}}
					>
						Add
					</button>
				)}
				{useResults?.map((i) => (
					<div key={i.nit} className={"resultsInfo"}>
						{" "}
						<p>
							<b>Nombre:</b> {i.nombre}
						</p>
						<p>
							<b>Razón Social:</b> {i["razón social"]}
						</p>
						<p>
							<b>NIT:</b> {i.nit}
						</p>
						<p>
							<b>Telefono: </b>
							{i.telefono}
						</p>
						<p>
							<b>Codigo: </b>
							{i.codigo}
						</p>
					</div>
				))}
			</div>
			{useResults && isLoading && (
				<ReactLoading
					type={"bubbles"}
					color={"red"}
					height={"8%"}
					width={"8%"}
				/>
			)}
		</div>
	);
}
