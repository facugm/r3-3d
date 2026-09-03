document.addEventListener("DOMContentLoaded", () => {
    // 1. Configuración del Intersection Observer para el Scrollytelling
    const steps = document.querySelectorAll(".step");
    
    // Opciones del observador:
    // rootMargin: dispara el evento un poco antes/después de llegar al centro
    // threshold: porcentaje de visibilidad para activarse
    const observerOptions = {
        root: null,
        rootMargin: "-40% 0px -40% 0px",
        threshold: 0
    };

    const handleIntersect = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Agregar clase activa al texto
                steps.forEach(s => s.classList.remove("is-active"));
                entry.target.classList.add("is-active");

                // Actualizar el estado visual (sticky)
                const stepIndex = entry.target.getAttribute("data-step");
                document.body.setAttribute("data-scenestate", stepIndex);

                // Controlar visibilidad de elementos específicos según la escena
                toggleSceneElements(stepIndex);
            }
        });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    steps.forEach(step => observer.observe(step));

    // Función para mostrar/ocultar contenedores específicos de escenas para no superponer clicks
    function toggleSceneElements(index) {
        const motor = document.getElementById("motor-interactivo");
        const impoexpo = document.getElementById("vis-impoexpo");
        
        // Manejo Escena 3 y 4 (Motor)
        if (index === "3" || index === "4") {
            motor.classList.remove("hidden");
            motor.classList.add("visible");
        } else {
            motor.classList.add("hidden");
            motor.classList.remove("visible");
        }

        // Manejo Escena 7 (Impo/Expo)
        if (index === "7") {
            impoexpo.classList.remove("hidden");
            impoexpo.classList.add("visible");
        } else {
            impoexpo.classList.add("hidden");
            impoexpo.classList.remove("visible");
        }
    }

    // 2. Lógica del Slider interactivo (Escena 4)
    const slider = document.getElementById("kw-slider");
    const kwVal = document.getElementById("kw-val");
    const kwStatus = document.getElementById("kw-status");

    if (slider && kwVal && kwStatus) {
        slider.addEventListener("input", (e) => {
            const val = e.target.value;
            kwVal.textContent = val;

            if (val >= 85) {
                kwStatus.textContent = "INSCRIPCIÓN OBLIGATORIA";
                kwStatus.classList.add("status-obligatoria");
            } else {
                kwStatus.textContent = "INSCRIPCIÓN OPTATIVA";
                kwStatus.classList.remove("status-obligatoria");
            }
        });
    }

    // 3. Lógica de Interacción Impo/Expo (Escena 7)
    const btnArca = document.getElementById("btn-arca");
    const btnDj = document.getElementById("btn-dj");
    const caminoDesc = document.getElementById("camino-desc");

    if (btnArca && btnDj && caminoDesc) {
        btnArca.addEventListener("click", () => {
            btnArca.classList.add("active");
            btnDj.classList.remove("active");
            caminoDesc.textContent = "El certificado es emitido por la Agencia de Recaudación y Control Aduanero (ARCA).";
        });

        btnDj.addEventListener("click", () => {
            btnDj.classList.add("active");
            btnArca.classList.remove("active");
            caminoDesc.textContent = "Se debe presentar una declaración jurada relacionada con el trámite correspondiente.";
        });
    }

    // Inicializar estado en 0
    document.body.setAttribute("data-scenestate", "0");
});
