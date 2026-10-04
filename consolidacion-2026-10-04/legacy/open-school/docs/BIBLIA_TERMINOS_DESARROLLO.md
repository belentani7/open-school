# BIBLIA DE TÉRMINOS DE DESARROLLO SOFTWARE

> **UNIVERSAL · OBLIGATORIA, AUTOMÁTICA, PERSISTENTE E INDISCUTIBLE**
> VIGENTE DESDE: 2026-09-28 · REVISIÓN UNIVERSAL: 2026-10-01
>
> Fuente única de vocabulario técnico. Si dos personas discrepan y no comparten
> estas siglas, la discusión no es técnica: es de vocabulario.

---

## TÉRMINOS FUNDAMENTALES

| Abreviatura | Nombre completo | Significado |
|-------------|-----------------|-------------|
| **PRD** | Product Requirements Document | Documento de requisitos del producto. Define QUÉ se construye y POR QUÉ. |
| **TRD** | Technical Requirements Document | Documento de requisitos técnicos. Define CÓMO se construye. |
| **SDD** | Software Design Document | Documento de diseño de software: arquitectura, módulos e interfaces. |
| **ADR** | Architecture Decision Record | Registro de decisiones de arquitectura: el POR QUÉ de cada decisión y sus alternativas. |
| **BDD** | Behavior-Driven Development | Desarrollo guiado por comportamiento, especificado en lenguaje natural (Gherkin). |
| **TDD** | Test-Driven Development | Desarrollo guiado por pruebas: primero el test, después el código. |
| **CI** | Continuous Integration | Integración continua: fusionar y verificar cambios con frecuencia. |
| **CD** | Continuous Delivery / Deployment | Entrega o despliegue continuo: el software siempre está listo para producción. |
| **CI/CD** | Continuous Integration / Continuous Delivery | Integración continua y entrega continua como cadena. |
| **MVP** | Minimum Viable Product | Producto mínimo viable: lo mínimo que valida una hipótesis con usuarios reales. |
| **SLA** | Service Level Agreement | Acuerdo de nivel de servicio con métricas comprometidas. |
| **SLO** | Service Level Objective | Objetivo interno de nivel de servicio (más exigente que el SLA). |
| **SLI** | Service Level Indicator | Indicador medido que alimenta un SLO. |
| **API** | Application Programming Interface | Interfaz de programación: contrato entre sistemas. |
| **ABI** | Application Binary Interface | Interfaz binaria entre un programa y el sistema o una librería. |
| **App Flow** | Application Flow | Flujo de la aplicación: secuencia de pantallas y acciones. |
| **UI** | User Interface | Interfaz de usuario: lo que se ve y se toca. |
| **UX** | User Experience | Experiencia de usuario: percepción completa al usar el producto. |
| **DX** | Developer Experience | Experiencia de quien desarrolla: fricción al construir y mantener. |
| **Design** | Design | Diseño: decisiones visuales y funcionales. |
| **Schema** | Schema | Estructura de datos: modelos, campos y relaciones. |
| **Backend** | Backend | Servidor y lógica que el usuario no ve. |
| **Frontend** | Frontend | Cliente e interfaz con la que el usuario interactúa. |
| **Full Stack** | Full Stack | Capacidad de trabajar en backend y frontend. |
| **Stack** | Stack | Conjunto de tecnologías de un proyecto. |
| **Tech Stack** | Technology Stack | Stack tecnológico concreto de un equipo o producto. |
| **Legacy** | Legacy System | Sistema heredado, difícil de mantener o actualizar. |
| **Technical Debt** | Technical Debt | Deuda técnica: coste futuro de una solución rápida. |
| **Refactoring** | Refactoring | Mejorar la estructura sin cambiar el comportamiento. |
| **Code Smell** | Code Smell | Señal de un problema potencial en el código. |
| **Boilerplate** | Boilerplate | Código repetitivo que se repite en muchos sitios. |
| **Glue Code** | Glue Code | Código que conecta componentes sin lógica de negocio. |
| **Dead Code** | Dead Code | Código que nunca se ejecuta. |
| **Zombie Code** | Zombie Code | Código comentado o inalcanzable que nadie elimina. |
| **Spike** | Spike | Experimento corto para reducir incertidumbre antes de decidir. |
| **Scope Creep** | Scope Creep | Crecimiento no controlado del alcance de un proyecto. |
| **Greenfield** | Greenfield Project | Proyecto nuevo, sin código previo. |
| **Brownfield** | Brownfield Project | Proyecto sobre código existente. |
| **SME** | Subject Matter Expert | Persona experta en la materia del dominio. |
| **RTM** | Requirements Traceability Matrix | Matriz que enlaza requisitos con pruebas y entregables. |

---

## DOCUMENTOS DE PRODUCTO

| Abreviatura | Nombre completo | Significado |
|-------------|-----------------|-------------|
| **MRD** | Market Requirements Document | Requisitos de mercado y oportunidad. |
| **BRD** | Business Requirements Document | Requisitos de negocio que el producto debe cumplir. |
| **URS** | User Requirements Specification | Qué necesita el usuario final. |
| **SRS** | Software Requirements Specification | Especificación formal y verificable de requisitos. |
| **NFR** | Non-Functional Requirements | Requisitos de calidad: rendimiento, seguridad, usabilidad. |
| **FR** | Functional Requirements | Requisitos funcionales: qué hace el sistema. |
| **UC** | Use Case | Caso de uso: interacción actor-sistema con valor. |
| **User Story** | User Story | Historia de usuario en formato Como/Quiero/Para. |
| **Epic** | Epic | Épica: agrupación grande de historias de usuario. |
| **Feature** | Feature | Característica o funcionalidad entregable. |
| **POC** | Proof of Concept | Prueba de concepto. |
| **Prototype** | Prototype | Prototipo navegable, desechable o evolutivo. |
| **Mockup** | Mockup | Maqueta visual de alta fidelidad sin interacción. |
| **Wireframe** | Wireframe | Boceto estructural sin estilo visual. |
| **RFC** | Request for Comments | Propuesta abierta a comentarios antes de decidir. |
| **Roadmap** | Roadmap | Hoja de ruta temporal del producto. |
| **Backlog** | Backlog | Lista priorizada de trabajo pendiente. |
| **Sprint** | Sprint | Iteración con duración fija. |
| **OKR** | Objectives and Key Results | Objetivos y resultados clave medibles. |
| **KPI** | Key Performance Indicator | Indicador clave de rendimiento. |
| **GTM** | Go-To-Market | Estrategia de lanzamiento y adopción. |
| **TAM** | Total Addressable Market | Mercado total direccionable. |
| **SAM** | Serviceable Addressable Market | Mercado direccionable al que puedes servir. |
| **SOM** | Serviceable Obtainable Market | Porción de mercado realmente obtenible. |
| **BRD/FRD** | Functional Requirements Document | Documento de requisitos funcionales con detalle. |
| **PRFAQ** | Press Release / FAQ | Documento tipo Amazon que fuerza a definir el valor. |
| **MoSCoW** | Must, Should, Could, Won't | Priorización de requisitos por obligatoriedad. |
| **RICE** | Reach, Impact, Confidence, Effort | Puntuación para priorizar iniciativas. |
| **JTBD** | Jobs To Be Done | Trabajos que el usuario quiere resolver. |
| **Persona** | Persona | Arquetipo de usuario basado en investigación. |
| **Journey Map** | User Journey Map | Mapa del recorrido del usuario por el servicio. |
| **A/B Test** | A/B Test | Experimento con dos variantes y una métrica. |
| **Cohort** | Cohort | Grupo de usuarios con una característica común. |
| **Funnel** | Funnel | Embudo de conversión por etapas. |

---

## DOCUMENTOS TÉCNICOS

| Abreviatura | Nombre completo | Significado |
|-------------|-----------------|-------------|
| **HDD** | Hardware Design Document | Diseño de hardware. |
| **FSD** | Functional Specification Document | Especificación funcional detallada. |
| **TDD** | Technical Design Document | Diseño técnico detallado: cómo se implementa. |
| **DDD** | Domain-Driven Design | Diseño guiado por el dominio: el lenguaje del negocio manda. |
| **SDK** | Software Development Kit | Kit de desarrollo de software. |
| **CLI** | Command Line Interface | Interfaz de línea de comandos. |
| **GUI** | Graphical User Interface | Interfaz gráfica de usuario. |
| **TUI** | Text User Interface | Interfaz de usuario en terminal. |
| **IxD** | Interaction Design | Diseño de la interacción. |
| **IA** | Information Architecture | Arquitectura de la información (no confundir con inteligencia artificial). |
| **DBD** | Database Design Document | Diseño de base de datos. |
| **ERD** | Entity-Relationship Diagram | Diagrama entidad-relación. |
| **DFD** | Data Flow Diagram | Diagrama de flujo de datos. |
| **UML** | Unified Modeling Language | Lenguaje unificado de modelado. |
| **C4 Model** | C4 Model | Notación de arquitectura en cuatro niveles: contexto, contenedores, componentes, código. |
| **Sequence Diagram** | Sequence Diagram | Diagrama de secuencia de mensajes entre actores. |
| **State Machine** | State Machine | Modelo de estados y transiciones. |
| **OpenAPI** | OpenAPI Specification | Especificación estándar de APIs (antes Swagger). |
| **Swagger** | Swagger | Conjunto de herramientas para documentar APIs (hoy OpenAPI). |
| **AsyncAPI** | AsyncAPI Specification | Especificación para APIs asíncronas y de eventos. |
| **Runbook** | Runbook | Procedimiento operativo para una tarea o incidente. |
| **Playbook** | Playbook | Guía de respuesta ante situaciones conocidas. |

---

## ARQUITECTURA

| Abreviatura | Nombre completo | Significado |
|-------------|-----------------|-------------|
| **MVC** | Model-View-Controller | Modelo-Vista-Controlador. |
| **MVVM** | Model-View-ViewModel | Modelo-Vista-ViewModel. |
| **MVP** | Model-View-Presenter | Modelo-Vista-Presentador. |
| **MVI** | Model-View-Intent | Modelo-Vista-Intención. |
| **Clean Architecture** | Clean Architecture | Arquitectura limpia: reglas de negocio aisladas del framework. |
| **Hexagonal Architecture** | Hexagonal Architecture | Puertos y adaptadores alrededor del dominio. |
| **Layered** | Layered Architecture | Arquitectura por capas con dependencias dirigidas. |
| **Modular Monolith** | Modular Monolith | Un solo despliegue con módulos bien separados. |
| **Microservices** | Microservices | Servicios pequeños, independientes y desplegables por separado. |
| **Microfrontend** | Microfrontend | Descomposición del frontend en piezas independientes. |
| **SOA** | Service-Oriented Architecture | Arquitectura orientada a servicios. |
| **EDA** | Event-Driven Architecture | Arquitectura orientada a eventos. |
| **CQRS** | Command Query Responsibility Segregation | Separar escritura de lectura. |
| **Event Sourcing** | Event Sourcing | El estado se deriva de la secuencia de eventos. |
| **Saga** | Saga | Transacción distribuida por pasos compensables. |
| **Outbox** | Transactional Outbox | Garantiza publicar eventos sin perderlos ni duplicarlos. |
| **Circuit Breaker** | Circuit Breaker | Corta llamadas a un servicio que falla para no propagar el fallo. |
| **Bulkhead** | Bulkhead | Aislar recursos para que un fallo no hunda todo. |
| **API Gateway** | API Gateway | Punto único de entrada a los servicios. |
| **BFF** | Backend For Frontend | Backend específico por cliente. |
| **Service Mesh** | Service Mesh | Capa de infraestructura para comunicación entre servicios. |
| **Sidecar** | Sidecar | Proceso auxiliar que acompaña a un servicio. |
| **Idempotency** | Idempotency | Repetir la operación no cambia el resultado. |
| **Rate Limiting** | Rate Limiting | Limitar peticiones por cliente o ventana de tiempo. |
| **Backpressure** | Backpressure | Mecanismo para no ahogar a quien consume más lento. |
| **12-Factor App** | Twelve-Factor App | Doce principios para aplicaciones portables y operables. |
| **CAP Theorem** | CAP Theorem | Ante una partición, se elige consistencia o disponibilidad. |
| **SOLID** | Single, Open-Closed, Liskov, Interface, Dependency | Cinco principios de diseño orientado a objetos. |
| **SoC** | Separation of Concerns | Separación de responsabilidades. |
| **LoD** | Law of Demeter | Un objeto habla con sus vecinos, no con los vecinos de sus vecinos. |

---

## PATRONES DE DISEÑO

| Abreviatura | Nombre completo | Significado |
|-------------|-----------------|-------------|
| **Singleton** | Singleton | Una única instancia accesible globalmente. |
| **Factory Method** | Factory Method | Delegar la creación a subclases. |
| **Abstract Factory** | Abstract Factory | Crear familias de objetos relacionados. |
| **Builder** | Builder | Construir objetos complejos paso a paso. |
| **Prototype** | Prototype | Crear objetos clonando un prototipo. |
| **Adapter** | Adapter | Traducir una interfaz a otra esperada. |
| **Bridge** | Bridge | Separar abstracción de implementación. |
| **Composite** | Composite | Tratar árbol y hojas de forma uniforme. |
| **Decorator** | Decorator | Añadir responsabilidades sin modificar el objeto. |
| **Facade** | Facade | Interfaz simple para un subsistema complejo. |
| **Flyweight** | Flyweight | Compartir estado para ahorrar memoria. |
| **Proxy** | Proxy | Intermediario que controla el acceso a un objeto. |
| **Chain of Responsibility** | Chain of Responsibility | Pasar la petición por manejadores en cadena. |
| **Command** | Command | Encapsular una petición como objeto. |
| **Iterator** | Iterator | Recorrer una colección sin exponer su estructura. |
| **Mediator** | Mediator | Centralizar la comunicación entre objetos. |
| **Memento** | Memento | Capturar y restaurar el estado interno. |
| **Observer** | Observer | Notificar a suscriptores ante cambios. |
| **State Pattern** | State | Cambiar comportamiento según el estado. |
| **Strategy** | Strategy | Intercambiar algoritmos en tiempo de ejecución. |
| **Template Method** | Template Method | Esqueleto fijo con pasos sobrescribibles. |
| **Visitor** | Visitor | Añadir operaciones a una jerarquía sin tocarla. |
| **Repository** | Repository Pattern | Abstraer el acceso a datos tras una colección. |
| **Unit of Work** | Unit of Work | Agrupar cambios y confirmarlos juntos. |
| **DTO** | Data Transfer Object | Objeto plano para transportar datos entre capas. |
| **VO** | Value Object | Objeto inmutable definido por sus valores. |
| **DAO** | Data Access Object | Encapsular el acceso a una fuente de datos. |
| **DI** | Dependency Injection | Inyectar dependencias en lugar de crearlas dentro. |
| **IoC** | Inversion of Control | El contenedor controla el ciclo de vida, no el código. |
| **AOP** | Aspect-Oriented Programming | Separar preocupaciones transversales (logs, seguridad). |

---

## TESTING

| Abreviatura | Nombre completo | Significado |
|-------------|-----------------|-------------|
| **Unit Test** | Unit Test | Prueba de una unidad aislada. |
| **Integration Test** | Integration Test | Prueba de la integración entre componentes. |
| **E2E** | End-to-End Test | Prueba del flujo completo de extremo a extremo. |
| **UAT** | User Acceptance Testing | Pruebas de aceptación por el usuario. |
| **SIT** | System Integration Testing | Pruebas de integración del sistema completo. |
| **FAT** | Factory Acceptance Testing | Pruebas de aceptación en fábrica. |
| **SAT** | Site Acceptance Testing | Pruebas de aceptación en el sitio de despliegue. |
| **Load Test** | Load Test | Prueba con carga esperada. |
| **Stress Test** | Stress Test | Prueba por encima de los límites para ver dónde rompe. |
| **PenTest** | Penetration Test | Prueba de penetración controlada. |
| **Smoke Test** | Smoke Test | Prueba mínima para saber si merece la pena seguir. |
| **Regression Test** | Regression Test | Verifica que nada antes funcionaba dejó de funcionar. |
| **Snapshot Test** | Snapshot Test | Compara la salida actual con una captura previa. |
| **Fuzz Test** | Fuzz Testing | Entradas aleatorias para encontrar fallos. |
| **Mutation Testing** | Mutation Testing | Introduce fallos y comprueba si los tests los detectan. |
| **Contract Testing** | Contract Testing | Verifica que dos servicios respetan su contrato. |
| **AAA** | Arrange, Act, Assert | Estructura de un test: preparar, actuar, comprobar. |
| **GWT** | Given, When, Then | Estructura de escenario BDD. |
| **Mock** | Mock | Objeto que simula comportamiento y registra llamadas. |
| **Stub** | Stub | Objeto que devuelve respuestas prefijadas. |
| **Spy** | Spy | Envoltorio que observa llamadas a un objeto real. |
| **Fixture** | Fixture | Datos o estado preparado para un test. |
| **Coverage** | Code Coverage | Porcentaje de código ejecutado por los tests. |
| **Test Pyramid** | Test Pyramid | Muchos unitarios, algunos de integración, pocos E2E. |
| **Flaky Test** | Flaky Test | Test que falla y pasa sin cambios: no es fiable. |
| **Chaos Engineering** | Chaos Engineering | Provocar fallos a propósito para probar la resiliencia. |
| **Selenium** | Selenium | Automatización de navegadores. |
| **Cypress** | Cypress | Framework de pruebas E2E de frontend. |
| **Playwright** | Playwright | Automatización y pruebas en varios navegadores. |
| **Jest** | Jest | Framework de pruebas de JavaScript. |
| **Vitest** | Vitest | Framework de pruebas de JavaScript sobre Vite. |
| **Pytest** | pytest | Framework de pruebas de Python. |

---

## SEGURIDAD

| Abreviatura | Nombre completo | Significado |
|-------------|-----------------|-------------|
| **SAST** | Static Application Security Testing | Análisis estático de seguridad en el código. |
| **DAST** | Dynamic Application Security Testing | Análisis dinámico en ejecución. |
| **IAST** | Interactive Application Security Testing | Análisis interactivo combinando ejecución e instrumentación. |
| **SCA** | Software Composition Analysis | Análisis de dependencias y licencias. |
| **SBOM** | Software Bill of Materials | Inventario de componentes del software. |
| **SDLC** | Software Development Life Cycle | Ciclo de vida del desarrollo de software. |
| **SSDLC** | Secure Software Development Life Cycle | Ciclo de vida con seguridad integrada. |
| **SLSA** | Supply-chain Levels for Software Artifacts | Niveles de integridad de la cadena de suministro. |
| **SSDF** | Secure Software Development Framework | Marco de desarrollo seguro (NIST). |
| **ZTA** | Zero Trust Architecture | Confianza cero: verificar siempre, nunca confiar por defecto. |
| **CSPM** | Cloud Security Posture Management | Gestión de la postura de seguridad en la nube. |
| **CWPP** | Cloud Workload Protection Platform | Protección de cargas de trabajo en la nube. |
| **SIEM** | Security Information and Event Management | Correlación de eventos de seguridad. |
| **SOAR** | Security Orchestration, Automation and Response | Orquestación y respuesta automatizada. |
| **XDR** | Extended Detection and Response | Detección y respuesta extendida en varias capas. |
| **EDR** | Endpoint Detection and Response | Detección y respuesta en el endpoint. |
| **XSS** | Cross-Site Scripting | Inyección de scripts en páginas vistas por otros. |
| **CSRF** | Cross-Site Request Forgery | Envío de peticiones no deseadas en nombre del usuario. |
| **SQLi** | SQL Injection | Inyección de SQL malicioso. |
| **SSRF** | Server-Side Request Forgery | Forzar al servidor a pedir recursos internos. |
| **RCE** | Remote Code Execution | Ejecución de código en remoto. |
| **RFI** | Remote File Inclusion | Inclusión de ficheros remotos maliciosos. |
| **IDOR** | Insecure Direct Object Reference | Acceso a objetos de otro usuario sin autorización. |
| **CORS** | Cross-Origin Resource Sharing | Política que controla peticiones entre orígenes. |
| **CSP** | Content Security Policy | Cabecera que restringe orígenes de contenido. |
| **HSTS** | HTTP Strict Transport Security | Fuerza el uso de HTTPS. |
| **JWT** | JSON Web Token | Token firmado para autenticación o intercambio. |
| **OAuth** | Open Authorization | Marco de autorización delegada. |
| **OIDC** | OpenID Connect | Capa de identidad sobre OAuth 2.0. |
| **SAML** | Security Assertion Markup Language | Estándar de federación de identidad. |
| **MFA** | Multi-Factor Authentication | Autenticación con varios factores. |
| **2FA** | Two-Factor Authentication | Autenticación con dos factores. |
| **SSO** | Single Sign-On | Un inicio de sesión para varios sistemas. |
| **RBAC** | Role-Based Access Control | Permisos por rol. |
| **ABAC** | Attribute-Based Access Control | Permisos por atributos. |
| **PAM** | Privileged Access Management | Gestión de cuentas privilegiadas. |
| **CVE** | Common Vulnerabilities and Exposures | Identificador público de una vulnerabilidad. |
| **CVSS** | Common Vulnerability Scoring System | Puntuación de severidad de una vulnerabilidad. |
| **CWE** | Common Weakness Enumeration | Catálogo de tipos de debilidad. |
| **Bug Bounty** | Bug Bounty | Programa que recompensa el hallazgo responsable de fallos. |
| **Honeypot** | Honeypot | Señuelo para detectar y estudiar ataques. |
| **WAF** | Web Application Firewall | Firewall de aplicaciones web. |
| **VPN** | Virtual Private Network | Red privada virtual. |

---

## INFRAESTRUCTURA

| Abreviatura | Nombre completo | Significado |
|-------------|-----------------|-------------|
| **IaC** | Infrastructure as Code | Infraestructura definida como código. |
| **Docker** | Docker | Plataforma de contenedores. |
| **Kubernetes (K8s)** | Kubernetes | Orquestador de contenedores. |
| **Terraform** | Terraform | Infraestructura como código declarativa. |
| **Ansible** | Ansible | Automatización de configuración sin agentes. |
| **Pulumi** | Pulumi | Infraestructura como código con lenguajes generales. |
| **Helm** | Helm | Gestor de paquetes para Kubernetes. |
| **Istio** | Istio | Service mesh. |
| **Consul** | Consul | Descubrimiento de servicios y service mesh. |
| **Vault** | Vault | Gestión de secretos. |
| **Argo CD** | Argo CD | Entrega continua declarativa para Kubernetes. |
| **EKS** | Elastic Kubernetes Service | Kubernetes gestionado en AWS. |
| **AKS** | Azure Kubernetes Service | Kubernetes gestionado en Azure. |
| **GKE** | Google Kubernetes Engine | Kubernetes gestionado en Google Cloud. |
| **Fargate** | Fargate | Cómputo serverless para contenedores en AWS. |
| **Lambda** | AWS Lambda | Cómputo serverless por eventos. |
| **VPC** | Virtual Private Cloud | Red privada virtual dentro de la nube. |
| **Subnet** | Subnet | Subred dentro de una red mayor. |
| **Load Balancer** | Load Balancer | Reparte tráfico entre instancias. |
| **Reverse Proxy** | Reverse Proxy | Intermediario que recibe y enruta peticiones. |
| **Ingress** | Ingress | Punto de entrada HTTP a servicios en Kubernetes. |
| **Auto Scaling** | Auto Scaling | Ajuste automático de recursos según demanda. |
| **Serverless** | Serverless | Modelo sin gestionar servidores. |
| **Edge Computing** | Edge Computing | Cómputo cerca del usuario para reducir latencia. |
| **Bare Metal** | Bare Metal | Hardware dedicado sin virtualización. |
| **VM** | Virtual Machine | Máquina virtual. |
| **Hypervisor** | Hypervisor | Capa que gestiona máquinas virtuales. |
| **PaaS** | Platform as a Service | Plataforma como servicio. |
| **IaaS** | Infrastructure as a Service | Infraestructura como servicio. |
| **SaaS** | Software as a Service | Software como servicio. |
| **FaaS** | Function as a Service | Funciones como servicio. |
| **CaaS** | Containers as a Service | Contenedores como servicio. |
| **DBaaS** | Database as a Service | Base de datos como servicio. |
| **SRE** | Site Reliability Engineering | Ingeniería de fiabilidad del servicio. |
| **On-Premise** | On-Premise | Instalado en infraestructura propia. |

---

## PROTOCOLOS

| Abreviatura | Nombre completo | Significado |
|-------------|-----------------|-------------|
| **REST** | Representational State Transfer | Estilo arquitectónico para APIs sobre HTTP. |
| **RESTful** | RESTful | Que cumple los principios REST. |
| **GraphQL** | Graph Query Language | Lenguaje de consulta tipado para APIs. |
| **gRPC** | Google Remote Procedure Call | Llamada a procedimiento remoto sobre HTTP/2. |
| **SOAP** | Simple Object Access Protocol | Protocolo XML de servicios web; el acrónimo ya no es oficial. |
| **RPC** | Remote Procedure Call | Llamada a un procedimiento que se ejecuta en otro proceso o equipo. |
| **JSON-RPC** | JSON Remote Procedure Call | RPC codificado en JSON. |
| **OpenAPI/REST** | REST sobre OpenAPI | API REST descrita con OpenAPI. |
| **HATEOAS** | Hypermedia as the Engine of Application State | Los enlaces guían las acciones disponibles. |
| **JSON** | JavaScript Object Notation | Notación de objetos de JavaScript. |
| **XML** | Extensible Markup Language | Lenguaje de marcado extensible. |
| **YAML** | YAML Ain't Markup Language | Formato de serialización legible. |
| **TOML** | Tom's Obvious Minimal Language | Formato de configuración legible. |
| **HTTP** | Hypertext Transfer Protocol | Protocolo de transferencia de hipertexto. |
| **HTTPS** | HTTP Secure | HTTP sobre TLS. |
| **HTTP/2** | HTTP version 2 | Versión binaria y multiplexada de HTTP. |
| **HTTP/3** | HTTP version 3 | HTTP sobre QUIC (UDP). |
| **QUIC** | Quick UDP Internet Connections | Transporte moderno sobre UDP con TLS integrado. |
| **WebSocket** | WebSocket | Canal bidireccional persistente. |
| **SSE** | Server-Sent Events | Eventos enviados por el servidor en un canal unidireccional. |
| **WebRTC** | Web Real-Time Communication | Comunicación en tiempo real entre navegadores. |
| **MQTT** | Message Queuing Telemetry Transport | Protocolo ligero de publicación/suscripción para IoT. |
| **AMQP** | Advanced Message Queuing Protocol | Protocolo de mensajería de colas. |
| **DNS** | Domain Name System | Sistema de nombres de dominio. |
| **DHCP** | Dynamic Host Configuration Protocol | Asignación dinámica de direcciones de red. |
| **FTP** | File Transfer Protocol | Transferencia de archivos. |
| **SFTP** | SSH File Transfer Protocol | Transferencia de archivos sobre SSH. |
| **SMTP** | Simple Mail Transfer Protocol | Envío de correo. |
| **IMAP** | Internet Message Access Protocol | Acceso al correo del servidor. |
| **POP3** | Post Office Protocol 3 | Descarga de correo. |
| **SSH** | Secure Shell | Acceso remoto cifrado. |
| **SSL** | Secure Sockets Layer | Antecesor de TLS; en desuso. |
| **TLS** | Transport Layer Security | Seguridad de la capa de transporte. |
| **TCP** | Transmission Control Protocol | Protocolo de transporte fiable y orientado a conexión. |
| **UDP** | User Datagram Protocol | Protocolo de transporte sin conexión. |
| **IP** | Internet Protocol | Protocolo de direccionamiento en red. |
| **IPv4** | Internet Protocol version 4 | Direcciones de 32 bits. |
| **IPv6** | Internet Protocol version 6 | Direcciones de 128 bits. |
| **MAC** | Media Access Control | Dirección física de una interfaz de red. |
| **NAT** | Network Address Translation | Traducción de direcciones de red. |
| **CDN** | Content Delivery Network | Red de entrega de contenido. |
| **CORS/HTTP** | Cross-Origin Resource Sharing | Cabeceras que autorizan peticiones entre orígenes. |
| **mTLS** | Mutual TLS | TLS mutuo: ambas partes presentan certificado. |
| **SNI** | Server Name Indication | Indica el nombre del servidor al negociar TLS. |

---

## BASES DE DATOS

| Abreviatura | Nombre completo | Significado |
|-------------|-----------------|-------------|
| **SQL** | Structured Query Language | Lenguaje de consulta estructurado. |
| **NoSQL** | Not Only SQL | Bases no relacionales. |
| **RDBMS** | Relational Database Management System | Sistema gestor de bases relacionales. |
| **ORM** | Object-Relational Mapping | Mapeo objeto-relacional. |
| **ODM** | Object-Document Mapping | Mapeo objeto-documento. |
| **ACID** | Atomicity, Consistency, Isolation, Durability | Propiedades de una transacción fiable. |
| **BASE** | Basically Available, Soft state, Eventually consistent | Modelo opuesto a ACID: disponibilidad ante todo. |
| **CRUD** | Create, Read, Update, Delete | Las cuatro operaciones básicas. |
| **DDL** | Data Definition Language | Lenguaje de definición de estructura. |
| **DML** | Data Manipulation Language | Lenguaje de manipulación de datos. |
| **DQL** | Data Query Language | Lenguaje de consulta. |
| **DCL** | Data Control Language | Lenguaje de control de permisos. |
| **TCL** | Transaction Control Language | Lenguaje de control de transacciones. |
| **PK** | Primary Key | Clave primaria. |
| **FK** | Foreign Key | Clave foránea. |
| **Index** | Index | Estructura que acelera búsquedas. |
| **View** | View | Consulta almacenada como tabla virtual. |
| **Materialized View** | Materialized View | Vista con resultado persistido. |
| **Transaction** | Transaction | Unidad atómica de trabajo. |
| **Isolation Level** | Isolation Level | Grado de aislamiento entre transacciones. |
| **MVCC** | Multi-Version Concurrency Control | Control de concurrencia por versiones. |
| **WAL** | Write-Ahead Logging | Registro previo a la escritura. |
| **Sharding** | Sharding | Fragmentación horizontal de datos. |
| **Replication** | Replication | Copia de datos entre nodos. |
| **Failover** | Failover | Conmutación automática a un nodo de respaldo. |
| **Partitioning** | Partitioning | División lógica de una tabla grande. |
| **Normalization** | Normalization | Reducir redundancia organizando tablas. |
| **Denormalization** | Denormalization | Duplicar datos a propósito para acelerar lecturas. |
| **OLAP** | Online Analytical Processing | Procesamiento analítico sobre grandes volúmenes. |
| **OLTP** | Online Transaction Processing | Procesamiento transaccional en línea. |
| **CAP** | Consistency, Availability, Partition tolerance | Solo dos de las tres ante particiones. |
| **Stored Procedure** | Stored Procedure | Procedimiento almacenado en el motor. |
| **Trigger** | Trigger | Acción automática ante un evento de datos. |
| **Deadlock** | Deadlock | Dos transacciones se bloquean mutuamente sin poder avanzar. |

---

## DATOS Y ANALÍTICA

| Abreviatura | Nombre completo | Significado |
|-------------|-----------------|-------------|
| **ETL** | Extract, Transform, Load | Extraer, transformar y cargar datos. |
| **ELT** | Extract, Load, Transform | Cargar primero y transformar en destino. |
| **CDC** | Change Data Capture | Capturar cambios de una fuente en tiempo real. |
| **DWH** | Data Warehouse | Almacén centralizado para analítica. |
| **Data Lake** | Data Lake | Repositorio de datos crudos en su formato original. |
| **Lakehouse** | Data Lakehouse | Combina lo mejor del data lake y el warehouse. |
| **Data Mart** | Data Mart | Subconjunto del warehouse para un área. |
| **Batch** | Batch Processing | Procesamiento por lotes. |
| **Stream** | Stream Processing | Procesamiento continuo de eventos. |
| **Kafka** | Apache Kafka | Plataforma distribuida de eventos. |
| **Spark** | Apache Spark | Motor de procesamiento distribuido de datos. |
| **Airflow** | Apache Airflow | Orquestación de flujos de datos. |
| **dbt** | data build tool | Transformaciones de datos versionadas en SQL. |
| **Pandas** | pandas | Librería de análisis de datos en Python. |
| **NumPy** | NumPy | Librería de cálculo numérico en Python. |
| **Parquet** | Apache Parquet | Formato columnar comprimido. |
| **Data Mesh** | Data Mesh | Datos como producto, descentralizados por dominio. |
| **Lineage** | Data Lineage | Trazabilidad del origen y transformación de los datos. |
| **Cardinality** | Cardinality | Número de valores distintos de un conjunto. |

---

## DESARROLLO WEB

| Abreviatura | Nombre completo | Significado |
|-------------|-----------------|-------------|
| **HTML** | HyperText Markup Language | Lenguaje de marcado de hipertexto. |
| **CSS** | Cascading Style Sheets | Hojas de estilo en cascada. |
| **JS** | JavaScript | Lenguaje de programación del navegador. |
| **TS** | TypeScript | JavaScript con tipos estáticos. |
| **JSX** | JavaScript XML | Sintaxis de JavaScript con marcado. |
| **TSX** | TypeScript XML | JSX con tipos en TypeScript. |
| **DOM** | Document Object Model | Modelo de objetos del documento. |
| **VDOM** | Virtual DOM | Representación en memoria para minimizar cambios reales. |
| **SPA** | Single Page Application | Aplicación de página única. |
| **MPA** | Multi-Page Application | Aplicación de múltiples páginas. |
| **PWA** | Progressive Web App | Aplicación web instalable y offline. |
| **SSR** | Server-Side Rendering | Renderizado en el servidor. |
| **SSG** | Static Site Generation | Generación de sitios estáticos. |
| **ISR** | Incremental Static Regeneration | Regeneración estática incremental. |
| **CSR** | Client-Side Rendering | Renderizado en el cliente. |
| **Hydration** | Hydration | Adoptar el HTML del servidor en el cliente. |
| **Code Splitting** | Code Splitting | División del código en fragmentos cargables. |
| **Tree Shaking** | Tree Shaking | Eliminar código no usado del bundle. |
| **Lazy Loading** | Lazy Loading | Cargar recursos solo cuando se necesitan. |
| **HMR** | Hot Module Replacement | Reemplazar módulos en caliente sin recargar. |
| **Component** | Component | Unidad reutilizable de interfaz. |
| **Props** | Properties | Datos que un componente recibe. |
| **State** | State | Datos internos que cambian con el tiempo. |
| **Hook** | Hook | Función que añade estado y ciclo de vida (React). |
| **Context** | Context | Estado compartido sin pasar props en cada nivel. |
| **Reducer** | Reducer | Función pura que calcula el nuevo estado. |
| **Memoization** | Memoization | Cachear resultados para no recalcular. |
| **Responsive** | Responsive Design | Diseño que se adapta al tamaño de pantalla. |
| **Media Query** | Media Query | Regla CSS condicionada por características del dispositivo. |
| **Viewport** | Viewport | Área visible del navegador. |
| **Grid** | CSS Grid | Sistema de maquetación bidimensional. |
| **Flexbox** | Flexbox | Modelo de maquetación en una dimensión. |
| **Design Token** | Design Token | Valor de diseño atómico y reutilizable. |
| **SEO** | Search Engine Optimization | Optimización para buscadores. |
| **CWV** | Core Web Vitals | Métricas clave de experiencia de carga. |
| **Storybook** | Storybook | Catálogo aislado de componentes. |
| **Figma** | Figma | Herramienta de diseño colaborativo. |

---

## LENGUAJES Y ECOSISTEMA

| Abreviatura | Nombre completo | Significado |
|-------------|-----------------|-------------|
| **npm** | Node Package Manager | Gestor de paquetes de Node. |
| **yarn** | Yarn | Gestor de paquetes alternativo. |
| **pnpm** | Performant npm | Gestor de paquetes eficiente en disco. |
| **Bundler** | Bundler | Empaquetador de módulos. |
| **Webpack** | Webpack | Empaquetador de aplicaciones web. |
| **Vite** | Vite | Servidor de desarrollo y empaquetador moderno. |
| **Rollup** | Rollup | Empaquetador optimizado para librerías. |
| **esbuild** | esbuild | Empaquetador muy rápido en Go. |
| **SWC** | Speedy Web Compiler | Compilador rápido en Rust. |
| **Babel** | Babel | Transpilador de JavaScript. |
| **Transpiler** | Transpiler | Compila de un lenguaje o versión a otro. |
| **Polyfill** | Polyfill | Código que aporta funciones no nativas. |
| **ESM** | ECMAScript Modules | Módulos estándar de JavaScript. |
| **CJS** | CommonJS | Sistema de módulos clásico de Node. |
| **UMD** | Universal Module Definition | Formato de módulo universal. |
| **SemVer** | Semantic Versioning | Versionado mayor.menor.parche. |
| **Lockfile** | Lockfile | Fija versiones exactas de dependencias. |
| **Monorepo** | Monorepo | Varios proyectos en un solo repositorio. |
| **Workspace** | Workspace | Conjunto de paquetes gestionados juntos. |
| **Linter** | Linter | Analiza el código en busca de problemas. |
| **Formatter** | Formatter | Aplica formato automático al código. |

---

## CONCURRENCIA Y ASINCRONÍA

| Abreviatura | Nombre completo | Significado |
|-------------|-----------------|-------------|
| **Thread** | Thread | Hilo de ejecución dentro de un proceso. |
| **Process** | Process | Instancia en ejecución con su propia memoria. |
| **Coroutine** | Coroutine | Función suspensiva cooperativa. |
| **Promise** | Promise | Representa un resultado futuro. |
| **Future** | Future | Valor que estará disponible más adelante. |
| **async/await** | Asynchronous / Await | Sintaxis para escribir asincronía secuencial. |
| **Event Loop** | Event Loop | Bucle que despacha tareas y callbacks. |
| **Callback** | Callback | Función que se ejecuta al terminar una tarea. |
| **Mutex** | Mutual Exclusion | Cerradura que protege una sección crítica. |
| **Semaphore** | Semaphore | Contador que limita el acceso concurrente. |
| **Race Condition** | Race Condition | Resultado depende del orden impredecible de accesos. |
| **Atomic** | Atomic Operation | Operación indivisible y segura ante concurrencia. |
| **Critical Section** | Critical Section | Región que solo un hilo puede ejecutar a la vez. |
| **Non-blocking** | Non-blocking | No espera bloqueando el hilo. |
| **Parallelism** | Parallelism | Ejecución simultánea real. |
| **Concurrency** | Concurrency | Progreso intercalado de varias tareas. |
| **Debounce** | Debounce | Ejecuta solo tras un periodo sin nuevos eventos. |
| **Throttle** | Throttle | Limita la frecuencia de ejecución. |

---

## CALIDAD Y PROCESO

| Abreviatura | Nombre completo | Significado |
|-------------|-----------------|-------------|
| **QA** | Quality Assurance | Aseguramiento de la calidad. |
| **QC** | Quality Control | Control de calidad. |
| **TQM** | Total Quality Management | Gestión de la calidad total. |
| **Six Sigma** | Six Sigma | Metodología de reducción de defectos. |
| **Lean** | Lean | Eliminar lo que no aporta valor. |
| **Kaizen** | Kaizen | Mejora continua. |
| **PDCA** | Plan-Do-Check-Act | Ciclo de mejora continua. |
| **DMAIC** | Define, Measure, Analyze, Improve, Control | Ciclo Six Sigma. |
| **FMEA** | Failure Mode and Effects Analysis | Análisis de modos de fallo y efectos. |
| **RCA** | Root Cause Analysis | Análisis de causa raíz. |
| **5 Whys** | Five Whys | Preguntar por qué cinco veces para llegar a la causa. |
| **SIPOC** | Suppliers, Inputs, Process, Outputs, Customers | Vista de proceso de alto nivel. |
| **VOC** | Voice of the Customer | Voz del cliente. |
| **CTQ** | Critical to Quality | Crítico para la calidad. |
| **SWOT** | Strengths, Weaknesses, Opportunities, Threats | Análisis interno y externo. |
| **PEST** | Political, Economic, Social, Technological | Análisis del entorno. |
| **PESTLE** | Political, Economic, Social, Technological, Legal, Environmental | PEST ampliado. |
| **SMART** | Specific, Measurable, Achievable, Relevant, Time-bound | Criterios de un buen objetivo. |
| **DoD** | Definition of Done | Criterios para considerar algo terminado. |
| **DoR** | Definition of Ready | Criterios para empezar una tarea. |
| **Burndown** | Burndown Chart | Gráfico de trabajo restante en el tiempo. |
| **Velocity** | Velocity | Trabajo completado por iteración. |
| **WIP** | Work In Progress | Trabajo en curso. |
| **Postmortem** | Postmortem | Análisis sin culpa tras un incidente. |

---

## METODOLOGÍAS

| Abreviatura | Nombre completo | Significado |
|-------------|-----------------|-------------|
| **Agile** | Agile | Metodología ágil e iterativa. |
| **Scrum** | Scrum | Marco ágil con sprints y roles definidos. |
| **XP** | Extreme Programming | Prácticas extremas de ingeniería. |
| **Kanban** | Kanban | Flujo visual con límite de trabajo en curso. |
| **Lean Startup** | Lean Startup | Validar con el mínimo y aprender rápido. |
| **Design Thinking** | Design Thinking | Empatizar, definir, idear, prototipar, probar. |
| **DevOps** | Development Operations | Cultura y herramientas de desarrollo y operaciones. |
| **DevSecOps** | Development Security Operations | DevOps con seguridad integrada. |
| **MLOps** | Machine Learning Operations | Operaciones de machine learning. |
| **AIOps** | Artificial Intelligence Operations | Operaciones asistidas por IA. |
| **DataOps** | Data Operations | Operaciones de datos. |
| **Platform Engineering** | Platform Engineering | Construir plataformas internas para desarrolladores. |
| **GitOps** | GitOps | Git como fuente de verdad del despliegue. |
| **DORA** | DevOps Research and Assessment | Métricas de rendimiento de entrega. |
| **Waterfall** | Waterfall | Modelo en cascada secuencial. |
| **RUP** | Rational Unified Process | Proceso iterativo clásico. |
| **CMMI** | Capability Maturity Model Integration | Modelo de madurez de procesos. |
| **ITIL** | Information Technology Infrastructure Library | Buenas prácticas de servicios TI. |
| **SAFe** | Scaled Agile Framework | Agile a escala organizativa. |
| **Shape Up** | Shape Up | Método de ciclos y apetito de tiempo. |
| **Pair Programming** | Pair Programming | Dos personas, un teclado. |
| **Mob Programming** | Mob Programming | Todo el equipo en una sola tarea. |

---

## TÉRMINOS DE CÓDIGO

| Abreviatura | Nombre completo | Significado |
|-------------|-----------------|-------------|
| **IDE** | Integrated Development Environment | Entorno de desarrollo integrado. |
| **VCS** | Version Control System | Sistema de control de versiones. |
| **Git** | Git | Sistema de control de versiones distribuido. |
| **GitHub** | GitHub | Plataforma de hosting y colaboración. |
| **GitLab** | GitLab | Plataforma DevOps completa. |
| **Bitbucket** | Bitbucket | Plataforma de hosting de código. |
| **LFS** | Large File Storage | Almacenamiento de archivos grandes en Git. |
| **Monorepo/Tool** | Monorepo Tooling | Herramientas para repositorios múltiples. |
| **Branch** | Branch | Rama de desarrollo. |
| **Commit** | Commit | Conjunto de cambios con mensaje. |
| **Push** | Push | Subir cambios al remoto. |
| **Pull** | Pull | Traer cambios del remoto. |
| **Fetch** | Fetch | Descargar referencias sin fusionar. |
| **Merge** | Merge | Fusionar ramas. |
| **Rebase** | Rebase | Reaplicar commits sobre otra base. |
| **Cherry-pick** | Cherry-pick | Aplicar un commit concreto. |
| **Stash** | Stash | Guardar cambios temporalmente. |
| **Clone** | Clone | Copiar un repositorio. |
| **Fork** | Fork | Copiar un repositorio a tu cuenta. |
| **Pull Request** | Pull Request | Propuesta de fusión con revisión. |
| **Merge Request** | Merge Request | Propuesta de fusión en GitLab. |
| **Code Review** | Code Review | Revisión de código por pares. |
| **Refactor** | Refactor | Refactorización. |
| **Debug** | Debug | Depuración. |
| **Breakpoint** | Breakpoint | Punto donde se detiene el depurador. |
| **Stack Trace** | Stack Trace | Traza de la pila de llamadas en un error. |
| **Diff** | Diff | Diferencia entre dos versiones. |
| **Patch** | Patch | Cambio puntual aplicado a código. |
| **Hotfix** | Hotfix | Arreglo urgente sobre producción. |
| **Lint** | Lint | Comprobación automática de estilo y errores. |
| **DRY** | Don't Repeat Yourself | No dupliques conocimiento. |
| **KISS** | Keep It Simple, Stupid | Mantén el diseño simple. |
| **YAGNI** | You Aren't Gonna Need It | No construyas lo que no necesitas. |
| **WET** | Write Everything Twice | Duplicación que invita a abstraer. |
| **Boy Scout Rule** | Boy Scout Rule | Deja el código mejor de como lo encontraste. |
| **Rubber Duck** | Rubber Duck Debugging | Explicar el problema en voz alta para encontrarlo. |
| **PR** | Pull Request | Abreviatura habitual de Pull Request. |
| **Merge Conflict** | Merge Conflict | Cambios incompatibles que hay que resolver a mano. |

---

## INTELIGENCIA ARTIFICIAL

| Abreviatura | Nombre completo | Significado |
|-------------|-----------------|-------------|
| **AI** | Artificial Intelligence | Inteligencia artificial. |
| **ML** | Machine Learning | Aprendizaje automático a partir de datos. |
| **DL** | Deep Learning | Aprendizaje profundo con redes neuronales. |
| **NN** | Neural Network | Red neuronal artificial. |
| **ANN** | Artificial Neural Network | Red neuronal artificial. |
| **CNN** | Convolutional Neural Network | Red neuronal convolucional para imágenes. |
| **RNN** | Recurrent Neural Network | Red neuronal recurrente para secuencias. |
| **LSTM** | Long Short-Term Memory | Arquitectura recurrente con memoria. |
| **GAN** | Generative Adversarial Network | Generador y discriminador que compiten. |
| **Transformer** | Transformer | Arquitectura basada en atención. |
| **Attention** | Attention Mechanism | Pondera qué partes de la entrada importan. |
| **LLM** | Large Language Model | Modelo de lenguaje de gran escala. |
| **SLM** | Small Language Model | Modelo de lenguaje pequeño y eficiente. |
| **GPT** | Generative Pre-trained Transformer | Familia de modelos generativos. |
| **NLP** | Natural Language Processing | Procesamiento de lenguaje natural. |
| **NLU** | Natural Language Understanding | Comprensión del lenguaje natural. |
| **ASR** | Automatic Speech Recognition | Reconocimiento automático del habla. |
| **TTS** | Text-To-Speech | Síntesis de voz. |
| **STT** | Speech-To-Text | Transcripción de voz a texto. |
| **OCR** | Optical Character Recognition | Reconocimiento óptico de caracteres. |
| **CV** | Computer Vision | Visión por computador. |
| **Embedding** | Embedding | Representación vectorial de significado. |
| **Vector DB** | Vector Database | Base de datos para búsqueda por similitud. |
| **RAG** | Retrieval-Augmented Generation | Generar respuestas apoyadas en recuperación de contexto. |
| **Prompt** | Prompt | Instrucción de entrada a un modelo. |
| **Token** | Token | Unidad mínima de texto que procesa el modelo. |
| **Context Window** | Context Window | Máximo de tokens que el modelo atiende a la vez. |
| **Temperature** | Temperature | Aleatoriedad de la salida. |
| **Top-p** | Nucleus Sampling | Muestreo del núcleo de probabilidad. |
| **Zero-shot** | Zero-shot Learning | Resolver sin ejemplos previos. |
| **Few-shot** | Few-shot Learning | Resolver con pocos ejemplos. |
| **CoT** | Chain of Thought | Razonar paso a paso antes de responder. |
| **Fine-tuning** | Fine-tuning | Ajuste de un modelo con datos propios. |
| **LoRA** | Low-Rank Adaptation | Ajuste eficiente con matrices de bajo rango. |
| **QLoRA** | Quantized LoRA | LoRA sobre modelo cuantizado. |
| **RLHF** | Reinforcement Learning from Human Feedback | Ajuste con preferencias humanas. |
| **RLAIF** | Reinforcement Learning from AI Feedback | Ajuste con preferencias de una IA. |
| **SFT** | Supervised Fine-Tuning | Ajuste supervisado. |
| **DPO** | Direct Preference Optimization | Optimización directa con preferencias. |
| **MoE** | Mixture of Experts | Solo una parte del modelo se activa por token. |
| **Inference** | Inference | Ejecución del modelo entrenado. |
| **Training** | Training | Entrenamiento del modelo. |
| **Overfitting** | Overfitting | Memoriza y no generaliza. |
| **Underfitting** | Underfitting | Aprende demasiado poco. |
| **Bias** | Bias | Sesgo sistemático en datos o modelo. |
| **Hallucination** | Hallucination | Contenido plausible pero falso. |
| **Guardrails** | Guardrails | Límites y filtros de seguridad del modelo. |
| **Alignment** | AI Alignment | Alinear el comportamiento con la intención humana. |
| **Agent** | AI Agent | Sistema que planifica y usa herramientas. |
| **Tool Calling** | Tool Calling | El modelo invoca funciones externas. |
| **MCP** | Model Context Protocol | Protocolo abierto para conectar modelos con herramientas y datos. |
| **HITL** | Human In The Loop | Intervención humana en el bucle. |

---

## PRODUCTO Y NEGOCIO

| Abreviatura | Nombre completo | Significado |
|-------------|-----------------|-------------|
| **PM** | Product Manager | Responsable del producto y su valor. |
| **PO** | Product Owner | Representa el valor del producto en Scrum. |
| **EM** | Engineering Manager | Responsable del equipo de ingeniería. |
| **TL** | Tech Lead | Liderazgo técnico del equipo. |
| **NPS** | Net Promoter Score | Probabilidad de recomendación. |
| **CSAT** | Customer Satisfaction Score | Satisfacción del cliente. |
| **CES** | Customer Effort Score | Esfuerzo percibido por el cliente. |
| **LTV** | Lifetime Value | Valor total de un cliente. |
| **CAC** | Customer Acquisition Cost | Coste de adquirir un cliente. |
| **ARR** | Annual Recurring Revenue | Ingresos recurrentes anuales. |
| **MRR** | Monthly Recurring Revenue | Ingresos recurrentes mensuales. |
| **ARPU** | Average Revenue Per User | Ingreso medio por usuario. |
| **DAU** | Daily Active Users | Usuarios activos diarios. |
| **MAU** | Monthly Active Users | Usuarios activos mensuales. |
| **CVR** | Conversion Rate | Tasa de conversión. |
| **AOV** | Average Order Value | Valor medio del pedido. |
| **Churn** | Churn Rate | Tasa de abandono. |
| **Retention** | Retention Rate | Tasa de retención. |
| **GMV** | Gross Merchandise Value | Valor bruto de la mercancía vendida. |
| **TAM/SAM/SOM** | Market Sizing | Tamaños de mercado. |
| **ICP** | Ideal Customer Profile | Perfil de cliente ideal. |
| **PLG** | Product-Led Growth | Crecimiento impulsado por el producto. |
| **SaaS Metrics** | SaaS Metrics | Métricas clave de negocio SaaS. |
| **Burn Rate** | Burn Rate | Ritmo al que se consume caja. |
| **Runway** | Runway | Meses de caja disponible. |

---

## PRIVACIDAD Y LEGAL

| Abreviatura | Nombre completo | Significado |
|-------------|-----------------|-------------|
| **GDPR** | General Data Protection Regulation | Reglamento europeo de protección de datos. |
| **RGPD** | Reglamento General de Protección de Datos | Nombre en español del GDPR. |
| **CCPA** | California Consumer Privacy Act | Ley de privacidad de California. |
| **PII** | Personally Identifiable Information | Información que identifica a una persona. |
| **DPA** | Data Processing Agreement | Acuerdo de tratamiento de datos. |
| **DPIA** | Data Protection Impact Assessment | Evaluación de impacto en protección de datos. |
| **DSAR** | Data Subject Access Request | Solicitud de acceso del interesado. |
| **ROPA** | Record of Processing Activities | Registro de actividades de tratamiento. |
| **TOS** | Terms of Service | Términos del servicio. |
| **EULA** | End User License Agreement | Licencia de usuario final. |
| **IP** | Intellectual Property | Propiedad intelectual. |
| **OSS** | Open Source Software | Software de código abierto. |
| **MIT** | MIT License | Licencia permisiva muy común. |
| **Apache-2.0** | Apache License 2.0 | Licencia permisiva con cláusula de patentes. |
| **GPL** | GNU General Public License | Licencia copyleft fuerte. |
| **AGPL** | Affero General Public License | Copyleft que cubre el uso en red. |
| **COPPA** | Children's Online Privacy Protection Act | Protección de menores en internet (EE. UU.). |
| **SOC 2** | System and Organization Controls 2 | Informe de controles de seguridad. |
| **ISO 27001** | ISO/IEC 27001 | Estándar de gestión de seguridad de la información. |

---

## ACCESIBILIDAD E INTERNACIONALIZACIÓN

| Abreviatura | Nombre completo | Significado |
|-------------|-----------------|-------------|
| **a11y** | Accessibility | Accesibilidad (11 letras entre a y y). |
| **WCAG** | Web Content Accessibility Guidelines | Pautas de accesibilidad web. |
| **ARIA** | Accessible Rich Internet Applications | Atributos para mejorar la accesibilidad. |
| **i18n** | Internationalization | Internacionalización (18 letras entre i y n). |
| **l10n** | Localization | Adaptación a un idioma y cultura concretos. |
| **g11n** | Globalization | Globalización: i18n más l10n. |
| **RTL** | Right-To-Left | Idiomas que se escriben de derecha a izquierda. |
| **LTR** | Left-To-Right | Escritura de izquierda a derecha. |
| **CJK** | Chinese, Japanese, Korean | Idiomas que requieren tratamiento tipográfico propio. |
| **SR** | Screen Reader | Lector de pantalla. |
| **Alt Text** | Alternative Text | Texto que describe una imagen. |
| **Contrast Ratio** | Contrast Ratio | Relación de contraste entre colores. |
| **Focus Trap** | Focus Trap | Retener el foco dentro de un diálogo. |
| **Skip Link** | Skip Link | Enlace para saltar a contenido principal. |

---

## RENDIMIENTO Y OBSERVABILIDAD

| Abreviatura | Nombre completo | Significado |
|-------------|-----------------|-------------|
| **LCP** | Largest Contentful Paint | Métrica de cuándo carga el mayor elemento. |
| **FCP** | First Contentful Paint | Cuándo aparece el primer contenido. |
| **CLS** | Cumulative Layout Shift | Estabilidad visual de la página. |
| **INP** | Interaction to Next Paint | Latencia de las interacciones. |
| **TTFB** | Time To First Byte | Tiempo hasta el primer byte. |
| **TTI** | Time To Interactive | Momento en que la página es usable. |
| **APM** | Application Performance Monitoring | Monitorización del rendimiento. |
| **RUM** | Real User Monitoring | Rendimiento medido en usuarios reales. |
| **O11y** | Observability | Capacidad de entender el estado interno por sus salidas. |
| **OTel** | OpenTelemetry | Estándar abierto para métricas, logs y trazas. |
| **Logs** | Logs | Registros de eventos del sistema. |
| **Metrics** | Metrics | Medidas numéricas en el tiempo. |
| **Traces** | Distributed Traces | Seguimiento de una petición entre servicios. |
| **Span** | Span | Unidad de trabajo dentro de una traza. |
| **Prometheus** | Prometheus | Sistema de métricas y alertas. |
| **Grafana** | Grafana | Visualización de métricas y dashboards. |
| **ELK** | Elasticsearch, Logstash, Kibana | Pila de logs y búsqueda. |
| **Sentry** | Sentry | Seguimiento de errores en aplicaciones. |
| **Profiling** | Profiling | Análisis de dónde se consume el tiempo o la memoria. |
| **P95** | 95th Percentile | Latencia que cubre el 95 por ciento de las peticiones. |

---

## RELEASE Y DESPLIEGUE

| Abreviatura | Nombre completo | Significado |
|-------------|-----------------|-------------|
| **Release** | Release | Versión publicada. |
| **RC** | Release Candidate | Candidata a versión final. |
| **GA** | General Availability | Disponibilidad general. |
| **Alpha** | Alpha | Versión temprana e inestable. |
| **Beta** | Beta | Versión en pruebas por usuarios externos. |
| **Canary** | Canary Release | Despliegue a una fracción del tráfico. |
| **Blue-Green** | Blue-Green Deployment | Dos entornos que se intercambian. |
| **Rolling** | Rolling Deployment | Actualización gradual de instancias. |
| **Rollback** | Rollback | Volver a la versión anterior. |
| **Hotfix/Release** | Hotfix Release | Publicación urgente de un arreglo. |
| **Feature Flag** | Feature Flag | Interruptor que activa o desactiva funciones. |
| **Dark Launch** | Dark Launch | Publicar código sin exponer la función. |
| **Changelog** | Changelog | Registro de cambios por versión. |
| **Versioning** | Versioning | Gestión de versiones. |
| **Pinning** | Version Pinning | Fijar versiones exactas de dependencias. |
| **Dependency Lock** | Dependency Lock | Bloquear el árbol de dependencias. |
| **Config as Code** | Configuration as Code | Configuración versionada junto al código. |
| **Secrets Manager** | Secrets Manager | Gestión segura de secretos. |
| **Artifact** | Build Artifact | Resultado empaquetado de una compilación. |
| **Registry** | Registry | Almacén de artefactos e imágenes. |

---

**Total: la fuente única de este vocabulario.**

> Este documento es obligatorio para cualquier agente que cree aplicaciones, páginas web,
> herramientas o código. Se publica navegable y buscable en `/biblia`, y el módulo
> `client/src/lib/biblia.ts` es una proyección suya: nunca se edita a mano.
