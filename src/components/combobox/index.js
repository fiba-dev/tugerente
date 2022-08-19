import React, { useState, useEffect } from "react";
import "./index.css";
import { getData, addData } from "../../lib/Api";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import InfiniteScroll from "react-infinite-scroll-component";
import swal from "sweetalert";
export function Dropdowns() {
	let filter = [
		{ value: "nombre", filter: "Nombre" },
		{ value: "razón social", filter: "Razón Social" },
		{ value: "nit", filter: "NIT" },
		{ value: "telefono", filter: "Telefono" },
		{ value: "codigo", filter: "Codigo" },
	];

	let [isLoading, setIsLoading] = useState(false);
	let [useFilter = filter[0].value, setFilter] = useState();
	let [results, setResults] = useState();
	let [useObject, setObject] = useState({
		nombre: "",
		razonSocial: "",
		nit: "",
		telefono: "",
		codigo: "",
	});
	let [useQuery, setQuery] = useState("");
	let [usepopUp, setPopUp] = useState(false);
	let [useButton, setUseButton] = useState(false);
	let [usePage, setUsePage] = useState(1);
	const { register, handleSubmit } = useForm();
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

	const onSubmit = (data) => {
		setResults([]);
		setUsePage(1);
		setQuery(data.q);
	};

	useEffect(() => {
		setIsLoading(true);

		getData(useQuery, useFilter, usePage).then((res) => {
			if (results?.length === 0 || results === undefined) {
				console.log("PRIMER IF");
				setUseButton(true);
				setResults(res.results);
				return true;
			}
			if (res.total_pages >= usePage) {
				setResults((results) => results.concat(res.results));
			}

			setIsLoading(false);
		});
	}, [usePage, useQuery, useFilter]);

	function openPopUp() {
		setObject({ [useFilter]: useQuery });
	}
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

			<InfiniteScroll
				dataLength={71}
				hasMore={true}
				loader={isLoading === true ? "Cargando" : "FIN"}
				className={"resultsContenedor"}
				next={() => setUsePage((prevPage) => prevPage + 1)}
			>
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
				{results?.map((i) => (
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
			</InfiniteScroll>
		</div>
	);
}
