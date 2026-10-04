# Laboratorios guiados y requisitos técnicos

Los laboratorios de D.I.C.T. son itinerarios de práctica documentada. Cada entrega exige instrucciones de reproducción, evidencia del resultado, reflexión de riesgos y declaración de herramientas utilizadas. Los ejercicios de seguridad se ejecutan solo contra objetivos locales, aislados y autorizados; no se incluyen prácticas contra terceros ni servicios públicos.

| Laboratorio | Resultados de aprendizaje | Ruta CPU o bajo coste | Ruta estándar | Límite de uso |
| --- | --- | --- | --- | --- |
| ML aplicado | Preparar datos, comparar modelos, evaluar métricas y explicar límites. | Python, scikit-learn, datasets pequeños, 8 GB RAM. | 16 GB RAM y almacenamiento SSD para experimentos mayores. | No usar datos personales sin base legal y evaluación de privacidad. |
| LLM y RAG | Indexar un corpus permitido, recuperar evidencia y evaluar respuestas. | Modelos cuantizados locales, embeddings pequeños o APIs declaradas. | GPU de 8–16 GB VRAM para fine-tuning experimental. | No cargar secretos, datos sensibles o materiales sin permiso. |
| Visión por computador | Construir y evaluar un clasificador o detector con trazabilidad del dataset. | Transfer learning limitado en CPU o notebooks gratuitos, resolución reducida. | GPU de 8 GB VRAM y PyTorch. | Revisar licencia, consentimiento y sesgos del conjunto de datos. |
| Cloud y entrega | Contenerizar, automatizar pruebas, desplegar y observar un servicio. | Docker local, compose, emuladores y cuentas gratuitas con control de costes. | Entorno cloud aislado con presupuesto y alertas. | No exponer claves; destruir recursos de práctica al finalizar. |
| Ciberseguridad defensiva | Identificar, registrar y corregir debilidades en una aplicación de laboratorio. | OWASP Juice Shop local, navegador, proxy local y 8 GB RAM. | Máquina virtual o red de laboratorio aislada. | Solo aplicaciones deliberadamente vulnerables y entornos autorizados. |

Los requisitos no determinan el nivel académico. Cuando la capacidad de hardware sea limitada, la evaluación se centra en la corrección metodológica, trazabilidad, interpretación y documentación del experimento. El alumnado debe indicar de forma transparente las limitaciones de cómputo que afecten a sus resultados.
