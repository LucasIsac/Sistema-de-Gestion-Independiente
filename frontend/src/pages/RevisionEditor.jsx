import { useEffect, useState, useContext, useCallback, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { useCategorias } from "../context/CategoriasContext.jsx";
import "../assets/styles/articulos-revision.css";

function RevisionEditor() {
  const [articulos, setArticulos] = useState([]);
  const [articulosFiltrados, setArticulosFiltrados] = useState([]);
  const [comentarios, setComentarios] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { token } = useContext(AuthContext);
  const { categorias } = useCategorias();
  const carruselRef = useRef(null);

  // 🔹 Obtener artículos
  const fetchArticulosEnRevision = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/articles/editor/review", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al cargar artículos en revisión");
      const data = await res.json();
      setArticulos(data);
      setArticulosFiltrados(data);
    } catch (err) {
      console.error(err);
      setError("Error al cargar artículos en revisión");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchArticulosEnRevision();
  }, [fetchArticulosEnRevision]);

  // 🔹 Filtros dinámicos
  useEffect(() => {
    let filtrados = [...articulos];
    if (categoriaFiltro)
      filtrados = filtrados.filter(
        (art) => art.categoria_id.toString() === categoriaFiltro
      );
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtrados = filtrados.filter(
        (art) =>
          art.titulo.toLowerCase().includes(term) ||
          (art.periodista_nombre &&
            art.periodista_nombre.toLowerCase().includes(term)) ||
          (art.periodista_apellido &&
            art.periodista_apellido.toLowerCase().includes(term))
      );
    }
    setArticulosFiltrados(filtrados);
  }, [articulos, categoriaFiltro, searchTerm]);

  // 🔹 Comentarios y decisiones
  const handleComentarioChange = (id, texto) =>
    setComentarios({ ...comentarios, [id]: texto });

  const manejarDecision = async (articuloId, decision) => {
    try {
      const comentario = comentarios[articuloId] || "";
      const endpoint =
        decision === "approve"
          ? `http://localhost:5000/api/articles/${articuloId}/approve`
          : `http://localhost:5000/api/articles/${articuloId}/reject`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comentario }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al procesar decisión");

      alert(
        data.message ||
          `Artículo ${
            decision === "approve" ? "aprobado" : "rechazado"
          } correctamente`
      );
      fetchArticulosEnRevision();
    } catch (err) {
      alert(err.message);
    }
  };

  // 🔹 Ver y descargar archivos
  const verArchivo = async (id) => {
    const res = await fetch(`http://localhost:5000/api/articles/view/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  const descargarArchivo = async (id, nombreOriginal) => {
    const res = await fetch(`http://localhost:5000/api/articles/download/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = nombreOriginal || `articulo_${id}.pdf`;
    link.click();
  };

  // 🔹 Navegación del carrusel
  const scrollIzquierda = () => {
    carruselRef.current.scrollBy({ left: -1100, behavior: "smooth" });
  };
  const scrollDerecha = () => {
    carruselRef.current.scrollBy({ left: 1100, behavior: "smooth" });
  };

  if (loading) return <div className="loading">Cargando artículos...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="revisiones-container">
      <div className="encabezado">
        <h2 className="titulo-seccion">Artículos en Revisión</h2>
      </div>

      <div className="filtros">
        <div className="campo">
          <label>Categoría:</label>
          <select
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categorias.map((cat) => (
              <option key={cat.id_categoria} value={cat.id_categoria}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="campo">
          <label>Buscar:</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por título o periodista..."
          />
        </div>
      </div>

      <div className="carrusel-container">
        <button className="flecha izquierda" onClick={scrollIzquierda}>
          ‹
        </button>

        <div className="carrusel-flechas" ref={carruselRef}>
          {articulosFiltrados.map((art) => (
            <div key={art.id_articulo} className="tarjeta">
              <h3>{art.titulo}</h3>
              <p className="autor">
                🖋 {art.periodista_nombre} {art.periodista_apellido}
              </p>
              <p className="fecha">
                📅{" "}
                {new Date(art.fecha_modificacion).toLocaleDateString("es-AR")}
              </p>
              <textarea
                placeholder="Comentario del editor..."
                value={comentarios[art.id_articulo] || ""}
                onChange={(e) =>
                  handleComentarioChange(art.id_articulo, e.target.value)
                }
              />
              <div className="acciones">
                <button
                  className="btn aprobar"
                  onClick={() => manejarDecision(art.id_articulo, "approve")}
                >
                  ✓ Aprobar
                </button>
                <button
                  className="btn rechazar"
                  onClick={() => manejarDecision(art.id_articulo, "reject")}
                >
                  ✗ Rechazar
                </button>
              </div>
              <div className="archivos">
                <button onClick={() => verArchivo(art.id_articulo)}>
                  👁 Ver
                </button>
                <button
                  onClick={() =>
                    descargarArchivo(art.id_articulo, art.nombre_original)
                  }
                >
                  📥 Descargar
                </button>
              </div>
            </div>
          ))}
        </div>

        <button className="flecha derecha" onClick={scrollDerecha}>
          ›
        </button>
      </div>
    </div>
  );
}

export default RevisionEditor;