# Open Source Computer Course JSON

- Chat ID: `f2be9c6d-8a66-46c2-be83-4ea39f69ab18`
- Mensajes: 2
- Periodo: 2026-08-19 23:52 UTC → 2026-08-19 23:52 UTC
- Exportado por `09_chats_export.py` (consolidación belentani7)

## [USER] 2026-08-19 23:52

banco de datos con curso de informatica open source formato json ia inteligencia cv

## [ASSISTANT] 2026-08-19 23:52 · Qwen3.7-Plus

```json
{
  "banco_datos_curso": {
    "metadatos": {
      "titulo": "Curso Integral de Inteligencia Artificial y Computer Vision — Open Source",
      "version": "2.1.0",
      "fecha_actualizacion": "2025-06-18",
      "licencia": "Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)",
      "idioma_principal": "es",
      "idiomas_disponibles": ["es", "en", "pt"],
      "nivel": ["principiante", "intermedio", "avanzado"],
      "duracion_estimada_horas": 480,
      "requisitos_previos": [
        "Conocimientos básicos de programación en Python",
        "Álgebra lineal a nivel universitario introductorio",
        "Cálculo diferencial e integral básico",
        "Probabilidad y estadística descriptiva",
        "Manejo de terminal/consola Linux o equivalente"
      ],
      "objetivos_generales": [
        "Dominar los fundamentos teóricos y prácticos de la Inteligencia Artificial moderna",
        "Implementar pipelines completos de Computer Vision con frameworks open source",
        "Desarrollar modelos de deep learning para detección, segmentación y clasificación de imágenes",
        "Desplegar modelos de IA/CV en entornos de producción utilizando herramientas de código abierto",
        "Evaluar críticamente arquitecturas de redes neuronales según el problema a resolver"
      ]
    },

    "modulos": [
      {
        "id_modulo": "MOD-01",
        "titulo": "Fundamentos de Inteligencia Artificial y Machine Learning",
        "nivel": "principiante",
        "duracion_horas": 40,
        "descripcion": "Introducción completa a los paradigmas de IA, aprendizaje supervisado, no supervisado y por refuerzo. Cobertura de algoritmos clásicos y su implementación desde cero.",
        "temas": [
          {
            "id_tema": "MOD-01-T01",
            "titulo": "Historia y panorama de la Inteligencia Artificial",
            "subtemas": [
              "Test de Turing y la habitación china de Searle",
              "Inviernos de la IA y renacimiento con deep learning",
              "IA simbólica vs. IA conexionista",
              "Estado del arte actual: LLMs, modelos de difusión, agentes autónomos",
              "Ética en IA: sesgos algorítmicos, transparencia y regulación (EU AI Act)"
            ],
            "recursos_open_source": [
              {
                "nombre": "AIMA-Python",
                "tipo": "libreria",
                "url": "https://github.com/aimacode/aima-python",
                "descripcion": "Implementación en Python de los algoritmos del libro 'Artificial Intelligence: A Modern Approach' de Russell y Norvig",
                "licencia": "MIT"
              },
              {
                "nombre": "Hugging Face Course",
                "tipo": "curso",
                "url": "https://huggingface.co/learn",
                "descripcion": "Curso gratuito y open source sobre NLP, visión y audio con transformers",
                "licencia": "Apache 2.0"
              }
            ]
          },
          {
            "id_tema": "MOD-01-T02",
            "titulo": "Regresión y clasificación clásica",
            "subtemas": [
              "Regresión lineal simple y múltiple",
              "Regresión logística y función sigmoide",
              "Máquinas de vectores de soporte (SVM) con kernels",
              "Árboles de decisión y Random Forest",
              "Gradient Boosting: XGBoost, LightGBM, CatBoost",
              "K-Nearest Neighbors (KNN)",
              "Naive Bayes y teorema de Bayes aplicado"
            ],
            "recursos_open_source": [
              {
                "nombre": "scikit-learn",
                "tipo": "framework",
                "url": "https://github.com/scikit-learn/scikit-learn",
                "descripcion": "Biblioteca de machine learning en Python con implementaciones de todos los algoritmos clásicos",
                "licencia": "BSD-3-Clause",
                "version_recomendada": ">=1.4.0"
              },
              {
                "nombre": "XGBoost",
                "tipo": "libreria",
                "url": "https://github.com/dmlc/xgboost",
                "descripcion": "Implementación optimizada de gradient boosting con soporte GPU",
                "licencia": "Apache 2.0"
              },
              {
                "nombre": "LightGBM",
                "tipo": "libreria",
                "url": "https://github.com/microsoft/LightGBM",
                "descripcion": "Framework de gradient boosting de Microsoft, rápido y eficiente en memoria",
                "licencia": "MIT"
              }
            ]
          },
          {
            "id_tema": "MOD-01-T03",
            "titulo": "Aprendizaje no supervisado",
            "subtemas": [
              "K-Means y K-Medoids",
              "DBSCAN y HDBSCAN para clustering basado en densidad",
              "Reducción de dimensionalidad: PCA, t-SNE, UMAP",
              "Modelos de mezcla gaussianos (GMM)",
              "Reglas de asociación: Apriori y FP-Growth",
              "Detección de anomalías: Isolation Forest, Local Outlier Factor"
            ],
            "recursos_open_source": [
              {
                "nombre": "UMAP",
                "tipo": "libreria",
                "url": "https://github.com/lmcinnes/umap",
                "descripcion": "Reducción de dimensionalidad basada en teoría de variedades y topología algebraica",
                "licencia": "BSD-3-Clause"
              },
              {
                "nombre": "HDBSCAN",
                "tipo": "libreria",
                "url": "https://github.com/scikit-learn-contrib/hdbscan",
                "descripcion": "Clustering jerárquico basado en densidad, ahora integrado en scikit-learn",
                "licencia": "BSD-3-Clause"
              }
            ]
          },
          {
            "id_tema": "MOD-01-T04",
            "titulo": "Validación, evaluación y buenas prácticas",
            "subtemas": [
              "Cross-validation: K-Fold, Stratified, Leave-One-Out",
              "Métricas de clasificación: Accuracy, Precision, Recall, F1-Score, ROC-AUC, PR-AUC",
              "Métricas de regresión: MSE, RMSE, MAE, R², MAPE",
              "Curvas de aprendizaje y diagnóstico de overfitting/underfitting",
              "Regularización L1 (Lasso), L2 (Ridge) y ElasticNet",
              "Gestión de datos desbalanceados: SMOTE, ADASYN, undersampling"
            ],
            "recursos_open_source": [
              {
                "nombre": "imbalanced-learn",
                "tipo": "libreria",
                "url": "https://github.com/scikit-learn-contrib/imbalanced-learn",
                "descripcion": "Herramientas para manejar datasets desbalanceados en clasificación",
                "licencia": "MIT"
              }
            ]
          }
        ],
        "proyecto_practico": {
          "titulo": "Pipeline de ML end-to-end para predicción de precios inmobiliarios",
          "descripcion": "Construir un pipeline completo desde la limpieza de datos hasta el despliegue de un modelo de regresión con API REST usando FastAPI.",
          "herramientas": ["scikit-learn", "pandas", "FastAPI", "Docker"],
          "entregables": ["notebook Jupyter documentado", "API desplegada", "informe de métricas"]
        }
      },

      {
        "id_modulo": "MOD-02",
        "titulo": "Fundamentos de Deep Learning y Redes Neuronales",
        "nivel": "intermedio",
        "duracion_horas": 50,
        "descripcion": "Arquitecturas de redes neuronales profundas, backpropagation, optimizadores, funciones de activación y frameworks modernos de deep learning.",
        "temas": [
          {
            "id_tema": "MOD-02-T01",
            "titulo": "Perceptrón y redes feedforward",
            "subtemas": [
              "Modelo biológico vs. modelo computacional de neurona",
              "Perceptrón simple y teorema de convergencia",
              "Perceptrón multicapa (MLP) y teorema de aproximación universal",
              "Funciones de activación: ReLU, Leaky ReLU, GELU, Swish, Softmax",
              "Inicialización de pesos: Xavier/Glorot, He, LeCun",
              "Batch Normalization, Layer Normalization, Group Normalization"
            ],
            "recursos_open_source": [
              {
                "nombre": "PyTorch",
                "tipo": "framework",
                "url": "https://github.com/pytorch/pytorch",
                "descripcion": "Framework de deep learning con grafos computacionales dinámicos, estándar en investigación",
                "licencia": "BSD-3-Clause",
                "version_recomendada": ">=2.2.0"
              },
              {
                "nombre": "TensorFlow / Keras",
                "tipo": "framework",
                "url": "https://github.com/tensorflow/tensorflow",
                "descripcion": "Framework de deep learning de Google con API de alto nivel Keras integrada",
                "licencia": "Apache 2.0",
                "version_recomendada": ">=2.15.0"
              },
              {
                "nombre": "JAX",
                "tipo": "framework",
                "url": "https://github.com/google/jax",
                "descripcion": "Computación numérica de alto rendimiento con diferenciación automática y compilación XLA",
                "licencia": "Apache 2.0"
              }
            ]
          },
          {
            "id_tema": "MOD-02-T02",
            "titulo": "Backpropagation y optimización",
            "subtemas": [
              "Regla de la cadena y cálculo de gradientes",
              "Backpropagation through time (BPTT)",
              "Optimizadores: SGD, Momentum, Nesterov, Adagrad, RMSProp, Adam, AdamW, LAMB",
              "Learning rate scheduling: StepLR, CosineAnnealing, OneCycleLR, Warmup",
              "Gradient clipping y explosión/desvanecimiento de gradientes",
              "Mixed precision training (FP16/BF16)"
            ],
            "recursos_open_source": [
              {
                "nombre": "PyTorch Lightning",
                "tipo": "framework",
                "url": "https://github.com/Lightning-AI/pytorch-lightning",
                "descripcion": "Wrapper de alto nivel para PyTorch que elimina boilerplate y escala a multi-GPU/TPU",
                "licencia": "Apache 2.0"
              }
            ]
          },
          {
            "id_tema": "MOD-02-T03",
            "titulo": "Regularización y técnicas de entrenamiento",
            "subtemas": [
              "Dropout y variantes: Spatial Dropout, DropConnect",
              "Data augmentation para imágenes y texto",
              "Early stopping y patience",
              "Label smoothing",
              "Weight decay y decoupled weight decay",
              "Transfer learning y fine-tuning",
              "Knowledge distillation"
            ]
          }
        ],
        "proyecto_practico": {
          "titulo": "Clasificador de imágenes CIFAR-100 desde cero vs. transfer learning",
          "descripcion": "Comparar el rendimiento de una CNN entrenada desde cero contra ResNet-50 preentrenada con fine-tuning en CIFAR-100.",
          "herramientas": ["PyTorch", "torchvision", "Weights & Biases (wandb)"],
          "entregables": ["curvas de entrenamiento comparativas", "matriz de confusión", "análisis de errores"]
        }
      },

      {
        "id_modulo": "MOD-03",
        "titulo": "Computer Vision — Procesamiento de Imágenes Clásico",
        "nivel": "intermedio",
        "duracion_horas": 45,
        "descripcion": "Técnicas fundamentales de procesamiento de imágenes digitales, filtrado, detección de bordes, transformaciones geométricas y extracción de características clásicas.",
        "temas": [
          {
            "id_tema": "MOD-03-T01",
            "titulo": "Representación y manipulación de imágenes",
            "subtemas": [
              "Modelos de color: RGB, HSV, LAB, YCrCb, grayscale",
              "Resolución espacial y profundidad de bits",
              "Histogramas de intensidad y ecualización (CLAHE)",
              "Operaciones aritméticas y lógicas entre imágenes",
              "Remuestreo, interpolación bilineal y bicúbica",
              "Formatos de imagen: PNG, JPEG, TIFF, WebP, BMP — compresión con/sin pérdida"
            ],
            "recursos_open_source": [
              {
                "nombre": "OpenCV",
                "tipo": "framework",
                "url": "https://github.com/opencv/opencv",
                "descripcion": "Biblioteca de visión por computador con +2500 algoritmos optimizados, soporte C++/Python/Java",
                "licencia": "Apache 2.0",
                "version_recomendada": ">=4.9.0"
              },
              {
                "nombre": "Pillow (PIL Fork)",
                "tipo": "libreria",
                "url": "https://github.com/python-pillow/Pillow",
                "descripcion": "Biblioteca de procesamiento de imágenes en Python, ideal para operaciones básicas y ETL",
                "licencia": "HPND"
              },
              {
                "nombre": "scikit-image",
                "tipo": "libreria",
                "url": "https://github.com/scikit-image/scikit-image",
                "descripcion": "Procesamiento de imágenes integrado con el ecosistema científico de Python/NumPy",
                "licencia": "BSD-3-Clause"
              }
            ]
          },
          {
            "id_tema": "MOD-03-T02",
            "titulo": "Filtrado y mejora de imágenes",
            "subtemas": [
              "Convolución 2D y correlación",
              "Filtros pasa-bajos: media, gaussiano, bilateral",
              "Filtros pasa-altos: Laplaciano, Sobel, Prewitt, Scharr",
              "Filtro mediano para eliminación de ruido sal y pimienta",
              "Filtrado no local (Non-Local Means Denoising)",
              "Morfología matemática: erosión, dilatación, apertura, cierre",
              "Transformada de Fourier 2D y filtrado en el dominio de la frecuencia"
            ]
          },
          {
            "id_tema": "MOD-03-T03",
            "titulo": "Detección de características y descriptores",
            "subtemas": [
              "Detección de esquinas: Harris, Shi-Tomasi, FAST",
              "SIFT (Scale-Invariant Feature Transform) — ahora open source",
              "SURF, ORB, BRISK, AKAZE",
              "Descriptores de textura: LBP (Local Binary Patterns), HOG (Histogram of Oriented Gradients)",
              "Matching de características: Brute-Force, FLANN",
              "RANSAC para estimación robusta de homografías",
              "Stitching de panorámicas"
            ]
          },
          {
            "id_tema": "MOD-03-T04",
            "titulo": "Segmentación clásica",
            "subtemas": [
              "Umbralización: global, adaptativa, método de Otsu",
              "Segmentación por regiones: Region Growing, Split and Merge",
              "Watershed transform",
              "Contornos activos (Snakes) y Level Sets",
              "GrabCut para segmentación interactiva de foreground",
              "Superpíxeles: SLIC (Simple Linear Iterative Clustering)"
            ]
          }
        ],
        "proyecto_practico": {
          "titulo": "Sistema de stitching panorámico automático",
          "descripcion": "Implementar un pipeline que tome N fotos superpuestas y genere una panorámica usando detección de características ORB, matching FLANN y homografía RANSAC.",
          "herramientas": ["OpenCV", "NumPy", "Matplotlib"],
          "entregables": ["código modular documentado", "panorámica resultante", "visualización de keypoints y matches"]
        }
      },

      {
        "id_modulo": "MOD-04",
        "titulo": "Deep Learning para Computer Vision",
        "nivel": "avanzado",
        "duracion_horas": 70,
        "descripcion": "Arquitecturas de redes neuronales convolucionales y transformers para visión, desde clasificación hasta generación de imágenes.",
        "temas": [
          {
            "id_tema": "MOD-04-T01",
            "titulo": "Redes Neuronales Convolucionales (CNN)",
            "subtemas": [
              "Capas convolucionales: kernels, stride, padding, dilation",
              "Capas de pooling: max, average, global average",
              "Arquitecturas históricas: LeNet-5, AlexNet, VGG-16/19",
              "ResNet y conexiones residuales (skip connections)",
              "Inception/GoogLeNet y módulos inception",
              "EfficientNet y compound scaling",
              "ConvNeXt: modernización de CNNs con técnicas de transformers",
              "MobileNet y arquitecturas eficientes para edge computing (depthwise separable convolutions)"
            ],
            "recursos_open_source": [
              {
                "nombre": "timm (PyTorch Image Models)",
                "tipo": "libreria",
                "url": "https://github.com/huggingface/pytorch-image-models",
                "descripcion": "Colección de +700 arquitecturas de visión preentrenadas con pesos de ImageNet y fine-tuning",
                "licencia": "Apache 2.0"
              },
              {
                "nombre": "torchvision",
                "tipo": "libreria",
                "url": "https://github.com/pytorch/vision",
                "descripcion": "Datasets, transformaciones y modelos de visión preentrenados para PyTorch",
                "licencia": "BSD-3-Clause"
              }
            ]
          },
          {
            "id_tema": "MOD-04-T02",
            "titulo": "Detección de objetos",
            "subtemas": [
              "Detección en dos etapas: R-CNN, Fast R-CNN, Faster R-CNN, Mask R-CNN",
              "Detección en una etapa: YOLO (v1-v10), SSD, RetinaNet, EfficientDet",
              "Anchor-based vs. anchor-free: FCOS, CenterNet",
              "Non-Maximum Suppression (NMS) y variantes: Soft-NMS, DIoU-NMS",
              "Métricas de detección: mAP, AP50, AP75, AP por escala",
              "Detección en tiempo real para video y edge devices",
              "Small object detection y técnicas de tiling"
            ],
            "recursos_open_source": [
              {
                "nombre": "Ultralytics YOLOv8/v11",
                "tipo": "framework",
                "url": "https://github.com/ultralytics/ultralytics",
                "descripcion": "Framework unificado para detección, segmentación, clasificación y tracking con YOLO",
                "licencia": "AGPL-3.0",
                "version_recomendada": ">=8.2.0"
              },
              {
                "nombre": "Detectron2",
                "tipo": "framework",
                "url": "https://github.com/facebookresearch/detectron2",
                "descripcion": "Biblioteca de detección y segmentación de Meta AI con soporte para Mask R-CNN, PointRend, DETR",
                "licencia": "Apache 2.0"
              },
              {
                "nombre": "MMDetection",
                "tipo": "framework",
                "url": "https://github.com/open-mmlab/mmdetection",
                "descripcion": "Toolbox de detección de OpenMMLab con +400 modelos preentrenados y benchmarking",
                "licencia": "Apache 2.0"
              }
            ]
          },
          {
            "id_tema": "MOD-04-T03",
            "titulo": "Segmentación semántica e instancias",
            "subtemas": [
              "Segmentación semántica: FCN, U-Net, DeepLab (v1-v3+), PSPNet",
              "Segmentación de instancias: Mask R-CNN, SOLO, CondInst",
              "Segmentación panóptica: Panoptic FPN, Mask2Former",
              "U-Net y variantes: Attention U-Net, U-Net++, TransUNet",
              "Segmentación en imágenes médicas: nnU-Net",
              "Segment Anything Model (SAM) y SAM 2 — segmentación foundation",
              "Métricas: IoU, Dice coefficient, Hausdorff distance"
            ],
            "recursos_open_source": [
              {
                "nombre": "Segment Anything (SAM 2)",
                "tipo": "modelo",
                "url": "https://github.com/facebookresearch/sam2",
                "descripcion": "Modelo foundation de Meta para segmentación zero-shot en imágenes y video",
                "licencia": "Apache 2.0"
              },
              {
                "nombre": "MMSegmentation",
                "tipo": "framework",
                "url": "https://github.com/open-mmlab/mmsegmentation",
                "descripcion": "Toolbox de segmentación semántica de OpenMMLab con +100 modelos",
                "licencia": "Apache 2.0"
              },
              {
                "nombre": "MONAI",
                "tipo": "framework",
                "url": "https://github.com/Project-MONAI/MONAI",
                "descripcion": "Framework de IA para imágenes médicas basado en PyTorch",
                "licencia": "Apache 2.0"
              }
            ]
          },
          {
            "id_tema": "MOD-04-T04",
            "titulo": "Vision Transformers (ViT) y arquitecturas modernas",
            "subtemas": [
              "Vision Transformer (ViT) original de Google",
              "DeiT (Data-efficient Image Transformers)",
              "Swin Transformer y ventanas deslizantes",
              "BEiT y MAE (Masked Autoencoders)",
              "DINOv2: self-supervised learning para visión",
              "CLIP y modelos multimodales visión-lenguaje",
              "EVA y EVA-02: escalado de vision transformers",
              "Comparativa CNN vs. ViT: inductive biases, data hunger, escalabilidad"
            ],
            "recursos_open_source": [
              {
                "nombre": "DINOv2",
                "tipo": "modelo",
                "url": "https://github.com/facebookresearch/dinov2",
                "descripcion": "Modelos de visión auto-supervisados de Meta que producen features de propósito general",
                "licencia": "Apache 2.0"
              },
              {
                "nombre": "OpenCLIP",
                "tipo": "libreria",
                "url": "https://github.com/mlfoundations/open_clip",
                "descripcion": "Implementación open source de CLIP con múltiples variantes y datasets de entrenamiento",
                "licencia": "MIT"
              }
            ]
          },
          {
            "id_tema": "MOD-04-T05",
            "titulo": "Generación de imágenes y modelos de difusión",
            "subtemas": [
              "Autoencoders variacionales (VAE) para imágenes",
              "GANs: DCGAN, StyleGAN, CycleGAN, Pix2Pix",
              "Denoising Diffusion Probabilistic Models (DDPM)",
              "Latent Diffusion Models y Stable Diffusion",
              "ControlNet, IP-Adapter y condicionamiento avanzado",
              "Text-to-image, image-to-image, inpainting, outpainting",
              "Ética de la generación: deepfakes, watermarking, detección"
            ],
            "recursos_open_source": [
              {
                "nombre": "Stable Diffusion WebUI (AUTOMATIC1111)",
                "tipo": "aplicacion",
                "url": "https://github.com/AUTOMATIC1111/stable-diffusion-webui",
                "descripcion": "Interfaz web completa para Stable Diffusion con extensiones y customización",
                "licencia": "AGPL-3.0"
              },
              {
                "nombre": "Diffusers (Hugging Face)",
                "tipo": "libreria",
                "url": "https://github.com/huggingface/diffusers",
                "descripcion": "Biblioteca de modelos de difusión para generación de imágenes, audio y video",
                "licencia": "Apache 2.0"
              },
              {
                "nombre": "ComfyUI",
                "tipo": "aplicacion",
                "url": "https://github.com/comfyanonymous/ComfyUI",
                "descripcion": "Interfaz nodal para pipelines de Stable Diffusion y modelos de difusión",
                "licencia": "GPL-3.0"
              }
            ]
          }
        ],
        "proyecto_practico": {
          "titulo": "Sistema de detección y segmentación de defectos en manufactura",
          "descripcion": "Entrenar un modelo YOLOv8 para detección de defectos y Mask2Former para segmentación en un dataset industrial (ej: MVTec AD o NEU-DET).",
          "herramientas": ["Ultralytics", "Detectron2", "PyTorch", "Albumentations"],
          "entregables": ["modelo entrenado con mAP > 0.85", "demo en Gradio/Streamlit", "análisis de falsos positivos"]
        }
      },

      {
        "id_modulo": "MOD-05",
        "titulo": "Computer Vision en Video y Tiempo Real",
        "nivel": "avanzado",
        "duracion_horas": 40,
        "descripcion": "Procesamiento de video, tracking de objetos, estimación de pose, reconocimiento de acciones y análisis de escenas en tiempo real.",
        "temas": [
          {
            "id_tema": "MOD-05-T01",
            "titulo": "Procesamiento de video y optical flow",
            "subtemas": [
              "Captura y decodificación de video con OpenCV y GStreamer",
              "Background subtraction: MOG2, KNN, SuBSENSE",
              "Optical flow: Lucas-Kanade, Farnebäck, RAFT",
              "Estabilización de video",
              "Frame interpolation y slow motion con RIFE"
            ],
            "recursos_open_source": [
              {
                "nombre": "RAFT",
                "tipo": "modelo",
                "url": "https://github.com/princeton-vl/RAFT",
                "descripcion": "Recurrent All-Pairs Field Transforms para estimación de optical flow de alta precisión",
                "licencia": "BSD-3-Clause"
              }
            ]
          },
          {
            "id_tema": "MOD-05-T02",
            "titulo": "Multi-Object Tracking (MOT)",
            "subtemas": [
              "Tracking-by-detection: SORT, DeepSORT, ByteTrack, BoT-SORT",
              "Filtro de Kalman y extensiones no lineales",
              "Hungarian algorithm para asignación de tracks",
              "Re-identificación de personas (ReID)",
              "Métricas MOT: MOTA, MOTP, IDF1, HOTA"
            ],
            "recursos_open_source": [
              {
                "nombre": "ByteTrack",
                "tipo": "algoritmo",
                "url": "https://github.com/ifzhang/ByteTrack",
                "descripcion": "MOT de alto rendimiento que utiliza detecciones de baja confianza para mejorar tracking",
                "licencia": "MIT"
              },
              {
                "nombre": "BoT-SORT",
                "tipo": "algoritmo",
                "url": "https://github.com/NirAharon/BoT-SORT",
                "descripcion": "MOT state-of-the-art con cámara motion compensation y ReID integrado",
                "licencia": "GPL-3.0"
              }
            ]
          },
          {
            "id_tema": "MOD-05-T03",
            "titulo": "Estimación de pose humana y facial",
            "subtemas": [
              "Pose 2D: OpenPose, HRNet, ViTPose",
              "Pose 3D: VideoPose3D, MotionBERT",
              "Hand pose estimation: MediaPipe Hands, MANO",
              "Face landmark detection: MediaPipe Face Mesh, dlib",
              "Body mesh recovery: SMPL, SMPL-X, HMR",
              "Whole-body pose: DWPose, OneEuro filter para suavizado"
            ],
            "recursos_open_source": [
              {
                "nombre": "MediaPipe",
                "tipo": "framework",
                "url": "https://github.com/google-ai-edge/mediapipe",
                "descripcion": "Framework de Google para pipelines de ML en tiempo real: pose, manos, cara, gestos",
                "licencia": "Apache 2.0"
              },
              {
                "nombre": "ViTPose",
                "tipo": "modelo",
                "url": "https://github.com/ViTAE-Transformer/ViTPose",
                "descripcion": "Estimación de pose con Vision Transformers, state-of-the-art en COCO",
                "licencia": "Apache 2.0"
              },
              {
                "nombre": "MMPose",
                "tipo": "framework",
                "url": "https://github.com/open-mmlab/mmpose",
                "descripcion": "Toolbox de estimación de pose de OpenMMLab con +200 modelos",
                "licencia": "Apache 2.0"
              }
            ]
          },
          {
            "id_tema": "MOD-05-T04",
            "titulo": "Reconocimiento de acciones y comprensión de video",
            "subtemas": [
              "3D CNNs: C3D, I3D, SlowFast",
              "Video Transformers: TimeSformer, VideoMAE, ViViT",
              "Temporal modeling: TSM, X3D",
              "Video captioning y VideoQA",
              "Detección temporal de acciones: ActionFormer"
            ]
          }
        ],
        "proyecto_practico": {
          "titulo": "Sistema de conteo y análisis de personas en tiempo real",
          "descripcion": "Implementar un sistema que detecte, rastree y cuente personas cruzando líneas virtuales en video de CCTV usando YOLOv8 + ByteTrack.",
          "herramientas": ["Ultralytics", "ByteTrack", "OpenCV", "Supervision"],
          "entregables": ["demo en tiempo real a >25 FPS", "dashboard de conteo", "exportación de métricas"]
        }
      },

      {
        "id_modulo": "MOD-06",
        "titulo": "Visión 3D, NeRF y Reconstrucción",
        "nivel": "avanzado",
        "duracion_horas": 35,
        "descripcion": "Geometría epipolar, reconstrucción 3D, Neural Radiance Fields (NeRF) y Gaussian Splatting.",
        "temas": [
          {
            "id_tema": "MOD-06-T01",
            "titulo": "Geometría de múltiples vistas",
            "subtemas": [
              "Modelo de cámara pinhole y parámetros intrínsecos/extrínsecos",
              "Calibración de cámara: tablero de ajedrez, Zhang's method",
              "Geometría epipolar: matriz esencial y fundamental",
              "Estéreo visión: disparity maps, SGBM",
              "Structure from Motion (SfM): COLMAP",
              "Depth estimation monocular: MiDaS, Depth Anything"
            ],
            "recursos_open_source": [
              {
                "nombre": "COLMAP",
                "tipo": "software",
                "url": "https://github.com/colmap/colmap",
                "descripcion": "Pipeline de Structure-from-Motion y Multi-View Stereo para reconstrucción 3D",
                "licencia": "BSD-3-Clause"
              },
              {
                "nombre": "Depth Anything V2",
                "tipo": "modelo",
                "url": "https://github.com/DepthAnything/Depth-Anything-V2",
                "descripcion": "Estimación de profundidad monocular foundation model de alta precisión",
                "licencia": "Apache 2.0"
              }
            ]
          },
          {
            "id_tema": "MOD-06-T02",
            "titulo": "NeRF y Gaussian Splatting",
            "subtemas": [
              "Neural Radiance Fields: teoría y rendering volumétrico",
              "Instant-NGP y hash encoding",
              "3D Gaussian Splatting: representación explícita",
              "Dynamic NeRF y video NeRF",
              "Aplicaciones: novel view synthesis, digital twins, VR/AR"
            ],
            "recursos_open_source": [
              {
                "nombre": "3D Gaussian Splatting",
                "tipo": "modelo",
                "url": "https://github.com/graphdeco-inria/gaussian-splatting",
                "descripcion": "Implementación original de 3D Gaussian Splatting para renderizado de escenas en tiempo real",
                "licencia": "Gaussian-Splatting License (research)"
              },
              {
                "nombre": "Nerfstudio",
                "tipo": "framework",
                "url": "https://github.com/nerfstudio-project/nerfstudio",
                "descripcion": "Framework modular para NeRF y métodos de novel view synthesis",
                "licencia": "Apache 2.0"
              }
            ]
          }
        ]
      },

      {
        "id_modulo": "MOD-07",
        "titulo": "MLOps, Despliegue y Optimización de Modelos de CV",
        "nivel": "avanzado",
        "duracion_horas": 45,
        "descripcion": "Ciclo de vida completo de modelos de IA/CV en producción: entrenamiento distribuido, optimización, despliegue y monitoreo.",
        "temas": [
          {
            "id_tema": "MOD-07-T01",
            "titulo": "Entrenamiento distribuido y experimentación",
            "subtemas": [
              "Data parallelism vs. model parallelism vs. pipeline parallelism",
              "Distributed Data Parallel (DDP) y Fully Sharded Data Parallel (FSDP)",
              "DeepSpeed y ZeRO optimization",
              "Experiment tracking: MLflow, Weights & Biases, Neptune",
              "Hyperparameter tuning: Optuna, Ray Tune",
              "Reproducibilidad: seeds, versionado de datos y código"
            ],
            "recursos_open_source": [
              {
                "nombre": "MLflow",
                "tipo": "plataforma",
                "url": "https://github.com/mlflow/mlflow",
                "descripcion": "Plataforma de ciclo de vida de ML: tracking, registry, projects y deployment",
                "licencia": "Apache 2.0"
              },
              {
                "nombre": "Optuna",
                "tipo": "libreria",
                "url": "https://github.com/optuna/optuna",
                "descripcion": "Framework de optimización de hiperparámetros con pruning y sampling eficiente",
                "licencia": "MIT"
              },
              {
                "nombre": "DeepSpeed",
                "tipo": "libreria",
                "url": "https://github.com/microsoft/DeepSpeed",
                "descripcion": "Biblioteca de optimización de deep learning de Microsoft para entrenamiento a gran escala",
                "licencia": "Apache 2.0"
              }
            ]
          },
          {
            "id_tema": "MOD-07-T02",
            "titulo": "Optimización y compresión de modelos",
            "subtemas": [
              "Cuantización: PTQ (Post-Training Quantization), QAT (Quantization-Aware Training)",
              "Pruning: unstructured, structured, magnitude-based",
              "Knowledge distillation para modelos de CV",
              "ONNX y ONNX Runtime para interoperabilidad",
              "TensorRT para inferencia en GPU NVIDIA",
              "OpenVINO para inferencia en CPU/GPU Intel",
              "TFLite y CoreML para dispositivos móviles",
              "Neural Architecture Search (NAS)"
            ],
            "recursos_open_source": [
              {
                "nombre": "ONNX Runtime",
                "tipo": "motor_inferencia",
                "url": "https://github.com/microsoft/onnxruntime",
                "descripcion": "Motor de inferencia multiplataforma optimizado para modelos ONNX",
                "licencia": "MIT"
              },
              {
                "nombre": "OpenVINO",
                "tipo": "toolkit",
                "url": "https://github.com/openvinotoolkit/openvino",
                "descripcion": "Toolkit de Intel para optimización y despliegue de modelos de deep learning",
                "licencia": "Apache 2.0"
              },
              {
                "nombre": "TensorRT (OSS)",
                "tipo": "motor_inferencia",
                "url": "https://github.com/NVIDIA/TensorRT",
                "descripcion": "Optimizador e inferencia de alto rendimiento para GPU NVIDIA",
                "licencia": "Apache 2.0"
              }
            ]
          },
          {
            "id_tema": "MOD-07-T03",
            "titulo": "Despliegue en producción",
            "subtemas": [
              "APIs REST con FastAPI y Flask para inferencia",
              "gRPC para inferencia de baja latencia",
              "Triton Inference Server para serving multi-modelo",
              "Contenerización con Docker y orquestación con Kubernetes",
              "Edge deployment: Jetson Nano, Raspberry Pi, Coral TPU",
              "CI/CD para ML: GitHub Actions, GitLab CI con tests de modelo",
              "Model monitoring: data drift, concept drift, performance degradation"
            ],
            "recursos_open_source": [
              {
                "nombre": "Triton Inference Server",
                "tipo": "servidor",
                "url": "https://github.com/triton-inference-server/server",
                "descripcion": "Servidor de inferencia de NVIDIA con soporte multi-framework y batching dinámico",
                "licencia": "BSD-3-Clause"
              },
              {
                "nombre": "BentoML",
                "tipo": "framework",
                "url": "https://github.com/bentoml/BentoML",
                "descripcion": "Framework unificado para serving de modelos de ML en producción",
                "licencia": "Apache 2.0"
              },
              {
                "nombre": "Evidently AI",
                "tipo": "libreria",
                "url": "https://github.com/evidentlyai/evidently",
                "descripcion": "Monitoreo de modelos de ML: data drift, target drift y métricas de rendimiento",
                "licencia": "Apache 2.0"
              }
            ]
          }
        ],
        "proyecto_practico": {
          "titulo": "Despliegue completo de un servicio de detección de objetos",
          "descripcion": "Empaquetar un modelo YOLOv8 optimizado con TensorRT, servirlo con Triton Inference Server en Docker, y crear un frontend con Streamlit. Incluir monitoreo de latencia y throughput.",
          "herramientas": ["Triton", "TensorRT", "Docker", "FastAPI", "Streamlit", "Prometheus"],
          "entregables": ["docker-compose funcional", "load test con Locust", "dashboard de monitoreo"]
        }
      },

      {
        "id_modulo": "MOD-08",
        "titulo": "Datasets, Anotación y Gobernanza de Datos para CV",
        "nivel": "intermedio",
        "duracion_horas": 25,
        "descripcion": "Gestión de datasets de imágenes y video, herramientas de anotación, aumento de datos avanzado y versionado.",
        "temas": [
          {
            "id_tema": "MOD-08-T01",
            "titulo": "Datasets públicos de referencia",
            "subtemas": [
              "Clasificación: ImageNet-1K/21K, CIFAR-10/100, Places365",
              "Detección: COCO, Pascal VOC, Objects365, Open Images",
              "Segmentación: ADE20K, Cityscapes, Mapillary Vistas, LVIS",
              "Video: Kinetics-400/700, Something-Something, EPIC-KITCHENS",
              "Médicas: CheXpert, MIMIC-CXR, BraTS, ISIC",
              "Autónomos: nuScenes, Waymo Open Dataset, KITTI",
              "Faces: CelebA, FFHQ, LFW"
            ]
          },
          {
            "id_tema": "MOD-08-T02",
            "titulo": "Herramientas de anotación open source",
            "subtemas": [
              "Anotación de bounding boxes y polígonos",
              "Anotación de keypoints y esqueletos",
              "Anotación de segmentación semántica",
              "Anotación asistida por IA (auto-labeling con SAM)",
              "Control de calidad y consenso entre anotadores"
            ],
            "recursos_open_source": [
              {
                "nombre": "Label Studio",
                "tipo": "plataforma",
                "url": "https://github.com/HumanSignal/label-studio",
                "descripcion": "Plataforma de anotación multi-tipo: imágenes, texto, audio, video, time series",
                "licencia": "Apache 2.0"
              },
              {
                "nombre": "CVAT",
                "tipo": "plataforma",
                "url": "https://github.com/cvat-ai/cvat",
                "descripcion": "Herramienta de anotación de video e imágenes de Intel con auto-annotation",
                "licencia": "MIT"
              },
              {
                "nombre": "Roboflow (supervision)",
                "tipo": "libreria",
                "url": "https://github.com/roboflow/supervision",
                "descripcion": "Utilidades de anotación, visualización y evaluación para Computer Vision",
                "licencia": "MIT"
              }
            ]
          },
          {
            "id_tema": "MOD-08-T03",
            "titulo": "Data augmentation avanzada y versionado",
            "subtemas": [
              "Albumentations: augmentations geométricas y de color",
              "MixUp, CutMix, Mosaic, Copy-Paste augmentation",
              "AutoAugment, RandAugment, AugMix",
              "Synthetic data generation con difusión",
              "Versionado de datasets: DVC (Data Version Control)",
              "Data-centric AI: limpieza de labels, confident learning"
            ],
            "recursos_open_source": [
              {
                "nombre": "Albumentations",
                "tipo": "libreria",
                "url": "https://github.com/albumentations-team/albumentations",
                "descripcion": "Biblioteca de data augmentation rápida y flexible para imágenes y máscaras",
                "licencia": "MIT"
              },
              {
                "nombre": "DVC",
                "tipo": "herramienta",
                "url": "https://github.com/iterative/dvc",
                "descripcion": "Control de versiones para datos y modelos de ML, integrado con Git",
                "licencia": "Apache 2.0"
              },
              {
                "nombre": "cleanlab",
                "tipo": "libreria",
                "url": "https://github.com/cleanlab/cleanlab",
                "descripcion": "Detección automática de errores en labels y datos para data-centric AI",
                "licencia": "AGPL-3.0"
              }
            ]
          }
        ]
      },

      {
        "id_modulo": "MOD-09",
        "titulo": "IA Multimodal y Aplicaciones Emergentes",
        "nivel": "avanzado",
        "duracion_horas": 30,
        "descripcion": "Modelos que combinan visión, lenguaje y otros modos. Agentes de IA visual, VLMs y aplicaciones de frontera.",
        "temas": [
          {
            "id_tema": "MOD-09-T01",
            "titulo": "Vision-Language Models (VLMs)",
            "subtemas": [
              "CLIP y contrastive learning visión-lenguaje",
              "LLaVA, LLaVA-NeXT y visual instruction tuning",
              "GPT-4V, Gemini y modelos propietarios vs. open source",
              "Qwen-VL, InternVL, MiniCPM-V — VLMs open source competitivos",
              "Visual grounding y referring expression comprehension",
              "Document AI: OCR + comprensión de documentos (Donut, LayoutLMv3)"
            ],
            "recursos_open_source": [
              {
                "nombre": "LLaVA",
                "tipo": "modelo",
                "url": "https://github.com/haotian-liu/LLaVA",
                "descripcion": "Large Language and Vision Assistant con capacidades de razonamiento visual",
                "licencia": "Apache 2.0"
              },
              {
                "nombre": "InternVL",
                "tipo": "modelo",
                "url": "https://github.com/OpenGVLab/InternVL",
                "descripcion": "VLM de escala masiva con rendimiento competitivo con modelos propietarios",
                "licencia": "MIT"
              }
            ]
          },
          {
            "id_tema": "MOD-09-T02",
            "titulo": "Agentes de IA visual y robótica",
            "subtemas": [
              "Agentes que interactúan con interfaces gráficas (GUI agents)",
              "Visual navigation y embodied AI",
              "Manipulación robótica con visión: RT-2, Octo",
              "World models para planificación visual",
              "Simulación: Habitat, Isaac Sim"
            ]
          }
        ]
      }
    ],

    "stack_tecnologico_recomendado": {
      "lenguaje_principal": "Python >=3.10",
      "entorno_virtual": "conda o venv",
      "gpu_recomendada": "NVIDIA RTX 3060 12GB o superior (CUDA >=12.1)",
      "ide": ["VS Code", "JupyterLab", "PyCharm Community"],
      "control_versiones": "Git + GitHub/GitLab",
      "contenedores": "Docker + NVIDIA Container Toolkit",
      "cloud_gratuito": [
        "Google Colab (GPU T4 gratuita)",
        "Kaggle Kernels (GPU P100/T4 x2)",
        "Lambda Cloud (créditos gratuitos)",
        "Paperspace Gradient (free tier)"
      ],
      "librerias_base": [
        "numpy>=1.26", "pandas>=2.1", "matplotlib>=3.8", "seaborn>=0.13",
        "scipy>=1.12", "tqdm>=4.66", "pyyaml>=6.0", "pillow>=10.2"
      ]
    },

    "evaluacion": {
      "criterios": [
        { "componente": "Proyectos prácticos por módulo", "peso": "50%" },
        { "componente": "Contribución open source (PR a repositorio existente)", "peso": "15%" },
        { "componente": "Examen teórico-práctico final", "peso": "20%" },
        { "componente": "Portafolio en GitHub con documentación", "peso": "15%" }
      ],
      "certificacion": "Certificado de finalización verificable con hash en blockchain (opcional)",
      "nota_minima_aprobacion": "70/100"
    },

    "bibliografia_referencia": [
      {
        "titulo": "Deep Learning",
        "autores": ["Ian Goodfellow", "Yoshua Bengio", "Aaron Courville"],
        "anio": 2016,
        "editorial": "MIT Press",
        "url_open_access": "https://www.deeplearningbook.org/",
        "tipo": "libro"
      },
      {
        "titulo": "Computer Vision: Algorithms and Applications",
        "autores": ["Richard Szeliski"],
        "anio": 2022,
        "edicion": "2da edición",
        "url_open_access": "https://szeliski.org/Book/",
        "tipo": "libro"
      },
      {
        "titulo": "Dive into Deep Learning",
        "autores": ["Aston Zhang", "Zachary C. Lipton", "Mu Li", "Alexander J. Smola"],
        "anio": 2023,
        "url_open_access": "https://d2l.ai/",
        "tipo": "libro_interactivo"
      },
      {
        "titulo": "Programming Computer Vision with Python",
        "autores": ["Jan Erik Solem"],
        "anio": 2012,
        "editorial": "O'Reilly",
        "url_open_access": "https://programmingcomputervision.com/",
        "tipo": "libro"
      },
      {
        "titulo": "An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale",
        "autores": ["Dosovitskiy et al."],
        "anio": 2020,
        "arxiv": "https://arxiv.org/abs/2010.11929",
        "tipo": "paper"
      },
      {
        "titulo": "You Only Look Once: Unified, Real-Time Object Detection",
        "autores": ["Joseph Redmon et al."],
        "anio": 2016,
        "arxiv": "https://arxiv.org/abs/1506.02640",
        "tipo": "paper"
      },
      {
        "titulo": "Learning Transferable Visual Models From Natural Language Supervision (CLIP)",
        "autores": ["Alec Radford et al."],
        "anio": 2021,
        "arxiv": "https://arxiv.org/abs/2103.00020",
        "tipo": "paper"
      },
      {
        "titulo": "Segment Anything",
        "autores": ["Alexander Kirillov et al."],
        "anio": 2023,
        "arxiv": "https://arxiv.org/abs/2304.02643",
        "tipo": "paper"
      }
    ],

    "comunidades_y_soporte": [
      { "nombre": "Hugging Face Forums", "url": "https://discuss.huggingface.co/" },
      { "nombre": "PyTorch Discuss", "url": "https://discuss.pytorch.org/" },
      { "nombre": "OpenCV Forum", "url": "https://forum.opencv.org/" },
      { "nombre": "r/MachineLearning", "url": "https://www.reddit.com/r/MachineLearning/" },
      { "nombre": "r/computervision", "url": "https://www.reddit.com/r/computervision/" },
      { "nombre": "Papers With Code", "url": "https://paperswithcode.com/" },
      { "nombre": "Kaggle Competitions & Datasets", "url": "https://www.kaggle.com/" }
    ]
  }
}
```

---

## Resumen del contenido

| Módulo | Tema central | Horas | Nivel |
|--------|-------------|-------|-------|
| **MOD-01** | Fundamentos de IA y ML clásico | 40 | Principiante |
| **MOD-02** | Deep Learning y redes neuronales | 50 | Intermedio |
| **MOD-03** | CV clásico (OpenCV, filtros, features) | 45 | Intermedio |
| **MOD-04** | Deep Learning para CV (CNN, YOLO, ViT, SAM, difusión) | 70 | Avanzado |
| **MOD-05** | Video, tracking y pose en tiempo real | 40 | Avanzado |
| **MOD-06** | Visión 3D, NeRF y Gaussian Splatting | 35 | Avanzado |
| **MOD-07** | MLOps, optimización y despliegue | 45 | Avanzado |
| **MOD-08** | Datasets, anotación y gobernanza de datos | 25 | Intermedio |
| **MOD-09** | IA multimodal y aplicaciones emergentes | 30 | Avanzado |
| | **Total** | **~480 h** | |

> **Todos los recursos listados son open source verificables** con enlaces directos a sus repositorios en GitHub. Las licencias van desde MIT y Apache 2.0 (las más permisivas) hasta AGPL-3.0 (copyleft), lo que permite su uso académico y en la mayoría de casos comercial. El JSON está diseñado para ser consumido directamente por un LMS, una aplicación web o un pipeline de generación de contenido educativo.
