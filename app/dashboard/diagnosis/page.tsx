"use client"

import { useState, useRef, useEffect } from "react"
import * as tf from "@tensorflow/tfjs"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft,
  Camera,
  X,
  Save,
  ImageIcon,
  Loader2,
  FileUp, // Icono para "subir"
} from "lucide-react" 

interface CapturedImage {
  id: string
  dataUrl: string
  timestamp: Date
}

export default function DiagnosisPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [isCameraActive, setIsCameraActive] = useState(false) // Esto ya no es tan relevante
  const [capturedImages, setCapturedImages] = useState<CapturedImage[]>([])
  const [selectedPatient, setSelectedPatient] = useState("")
  const [diagnosis, setDiagnosis] = useState("")
  const [notes, setNotes] = useState("")
  const [patients, setPatients] = useState<any[]>([])
  const [saving, setSaving] = useState(false)
  
  const [model, setModel] = useState<tf.LayersModel | null>(null)
  const [loadingModel, setLoadingModel] = useState(true)
  const [prediction, setPrediction] = useState("")
  const [isPredicting, setIsPredicting] = useState(false)
  const [probabilities, setProbabilities] = useState<number[]>([])

  // Mapeo de las clases del modelo
  const classLabels = ['Melanoma Maligno', 'Melanoma Benigno', 'No Melanoma'];

  useEffect(() => {
    async function loadModel() {
      try {
        const loadedModel = await tf.loadLayersModel("/model/model.json")
        setModel(loadedModel)
        setLoadingModel(false)
      } catch (error) {
        console.error("Error loading model:", error)
        setLoadingModel(false)
      }
    }
    loadModel()
    fetchPatients()
  }, []) // Se ejecuta solo una vez al montar el componente

  const fetchPatients = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}")
      const response = await fetch(`/api/patients?doctorId=${user.id}`)
      const data = await response.json()
      setPatients(data)
    } catch (error) {
      console.error("Error fetching patients:", error)
    }
  }

  const runPrediction = async (image: HTMLImageElement) => {
    if (!model || !image) return;

    setIsPredicting(true);
    setPrediction("Analizando imagen con IA...")
    setProbabilities([]) // Limpiar probabilidades anteriores

    // Preprocesar la imagen
    const tensor = tf.browser.fromPixels(image)
      .resizeNearestNeighbor([224, 224]) // Redimensionar a 224x224
      .toFloat()
      .div(tf.scalar(127.5)) // Normalizar a [-1, 1]
      .sub(tf.scalar(1.0))
      .expandDims(); // Añadir dimensión de batch

    try {
      // Realizar la predicción
      const result = model.predict(tensor) as tf.Tensor;
      const probabilitiesData = await result.data() as Float32Array;
      
      // Encontrar la clase con la mayor probabilidad
      let maxProb = 0;
      let maxIndex = -1;
      probabilitiesData.forEach((prob, i) => {
        if (prob > maxProb) {
          maxProb = prob;
          maxIndex = i;
        }
      });

      setProbabilities(Array.from(probabilitiesData)); // Guardar todas las probabilidades
      const predictedClass = classLabels[maxIndex] || "Desconocido";
      const confidence = (maxProb * 100).toFixed(2);
      const predictionText = `IA: ${predictedClass} (Confianza: ${confidence}%)`;

      setPrediction(predictionText);
      setDiagnosis(predictionText); // Autocompletar el diagnóstico
    } catch (error) {
      console.error("Error during prediction:", error);
      setPrediction("Error al analizar la imagen.");
    } finally {
      setIsPredicting(false);
      tf.dispose(tensor); // Liberar memoria del tensor
    }
  };

  const handleUploadButtonClick = () => {
    // Abre el selector de archivos
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        const newImage: CapturedImage = {
          id: Date.now().toString(),
          dataUrl,
          timestamp: new Date(),
        };
        setCapturedImages((prevImages) => [...prevImages, newImage]);

        // Cargar la imagen en el elemento <img> para que TF.js pueda usarlo
        const img = new Image();
        img.src = dataUrl;
        img.onload = () => {
          runPrediction(img);
        };
      }
    }
    reader.readAsDataURL(file)

    event.target.value = ""
  }
  // -------------------------------------------------------------

  const removeImage = (id: string) => {
    setCapturedImages(capturedImages.filter((img) => img.id !== id))
  }

  const saveDiagnosis = async () => {
    if (!selectedPatient || !diagnosis) {
      alert("Por favor selecciona un paciente y escribe un diagnóstico")
      return
    }

    setSaving(true)
    try {
      const response = await fetch("/api/diagnosis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: selectedPatient,
          description: diagnosis,
          notes,
          images: capturedImages.map((img) => img.dataUrl),
        }),
      })

      if (response.ok) {
        alert("Diagnóstico guardado exitosamente")
        setCapturedImages([])
        setDiagnosis("")
        setNotes("")
        setPrediction("") // Limpiar la predicción
        setProbabilities([]) // Limpiar las probabilidades
        setSelectedPatient("")
      }
    } catch (error) {
      console.error("Error saving diagnosis:", error)
      alert("Error al guardar el diagnóstico")
    } finally {
      setSaving(false)
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header (sin cambios) */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          {/* ... (tu header sigue igual) ... */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button onClick={() => router.push("/dashboard")} variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 font-display">Diagnóstico por Imagen</h1>
                  <p className="text-sm text-gray-600">Sube imágenes y registra diagnósticos</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4 font-display">Cargar Imagen</h2>

                {/* Input de archivo oculto */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />

                {/* Zona de carga */}
                <div
                  className="relative bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl overflow-hidden aspect-video mb-4 flex items-center justify-center text-center p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={handleUploadButtonClick}
                >
                  <div>
                    <FileUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Haz clic para subir una imagen</p>
                    <p className="text-sm text-gray-500">Para realizar analisis</p>
                  </div>
                </div>

                <Button
                  onClick={handleUploadButtonClick}
                  className="w-full bg-[#1877f2] hover:bg-[#166fe5] gap-2"
                  disabled={isPredicting || loadingModel}
                >
                  <FileUp className="w-4 h-4" />
                  {loadingModel ? "Cargando modelo..." : isPredicting ? "Analizando..." : "Seleccionar Imagen"}
                </Button>

                {/* Mostrar la predicción de la IA aquí */}
                {isPredicting && (
                  <div className="mt-4 p-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 font-medium text-center flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {prediction}
                  </div>
                )}
                
                {prediction && !isPredicting && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 font-medium text-center">
                    {prediction}
                  </div>
                )}

                {/* Desglose de probabilidades */}
                {probabilities.length > 0 && !isPredicting && (
                  <div className="mt-4 space-y-2">
                    <h4 className="text-sm font-semibold text-gray-700">Desglose de Predicción:</h4>
                    {probabilities.map((prob, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <span className="w-20 text-sm text-gray-600">{classLabels[index]}:</span>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${(prob * 100).toFixed(2)}%` }}
                          ></div>
                        </div>
                        <span className="w-16 text-right text-sm font-mono text-gray-800">
                          {(prob * 100).toFixed(2)}%
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Captured Images (Esta sección funciona igual que antes) */}
                {capturedImages.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                      Imágenes Cargadas ({capturedImages.length})
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                      <AnimatePresence>
                        {capturedImages.map((image) => (
                          <motion.div
                            key={image.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="relative group"
                          >
                            <img
                              src={image.dataUrl || "/placeholder.svg"}
                              alt="Captured"
                              className="w-full aspect-square object-cover rounded-lg border-2 border-gray-200"
                            />
                            <button
                              onClick={() => removeImage(image.id)}
                              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Diagnosis Form (sin cambios en la estructura) */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4 font-display">Información del Diagnóstico</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="patient">Seleccionar Paciente *</Label>
                    <select
                      id="patient"
                      value={selectedPatient}
                      onChange={(e) => setSelectedPatient(e.target.value)}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                    >
                      <option value="">-- Selecciona un paciente --</option>
                      {patients.map((patient) => (
                        <option key={patient.id} value={patient.id}>
                          {patient.name} - {patient.age} años
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="diagnosis">Diagnóstico (Resultado IA) *</Label>
                    <Textarea
                      id="diagnosis"
                      value={diagnosis} // Este valor se actualiza desde la IA
                      onChange={(e) => setDiagnosis(e.target.value)}
                      rows={4}
                      className="mt-1"
                      placeholder="El resultado de la IA aparecerá aquí. Puedes editarlo."
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Notas Adicionales</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="mt-1"
                      placeholder="Observaciones, recomendaciones, tratamiento sugerido..."
                    />
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <ImageIcon className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">Imágenes adjuntas</p>
                        <p className="text-sm text-blue-700">
                          {capturedImages.length === 0
                            ? "No hay imágenes cargadas"
                            : `${capturedImages.length} imagen${
                                capturedImages.length > 1 ? "es" : ""
                              } lista${capturedImages.length > 1 ? "s" : ""}`}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={saveDiagnosis}
                    disabled={saving || !selectedPatient || !diagnosis || isPredicting || loadingModel}
                    className="w-full bg-[#10b981] hover:bg-[#059669] gap-2 py-6"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Guardar Diagnóstico
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}