'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe, Clock, Shield, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useAppStore } from '@/hooks/use-app-store';

const COUNTRIES = [
  { value: 'venezuela', label: '🇻🇪 Venezuela' },
  { value: 'colombia', label: '🇨🇴 Colombia' },
  { value: 'argentina', label: '🇦🇷 Argentina' },
  { value: 'mexico', label: '🇲🇽 México' },
  { value: 'peru', label: '🇵🇪 Perú' },
  { value: 'chile', label: '🇨🇱 Chile' },
  { value: 'ecuador', label: '🇪🇨 Ecuador' },
  { value: 'bolivia', label: '🇧🇴 Bolivia' },
  { value: 'paraguay', label: '🇵🇾 Paraguay' },
  { value: 'uruguay', label: '🇺🇾 Uruguay' },
  { value: 'republica_dominicana', label: '🇩🇴 República Dominicana' },
  { value: 'cuba', label: '🇨🇺 Cuba' },
  { value: 'honduras', label: '🇭🇳 Honduras' },
  { value: 'guatemala', label: '🇬🇹 Guatemala' },
  { value: 'el_salvador', label: '🇸🇻 El Salvador' },
  { value: 'nicaragua', label: '🇳🇮 Nicaragua' },
  { value: 'costa_rica', label: '🇨🇷 Costa Rica' },
  { value: 'panama', label: '🇵🇦 Panamá' },
  { value: 'puerto_rico', label: '🇵🇷 Puerto Rico' },
  { value: 'espana', label: '🇪🇸 España' },
  { value: 'otro', label: '🌍 Otro país' },
];

const TIME_OPTIONS = [
  { value: 'recien_llegado', label: 'Acabo de llegar (< 1 mes)' },
  { value: 'poco_tiempo', label: 'Poco tiempo (1-6 meses)' },
  { value: 'medio_anio', label: 'Medio año (6-12 meses)' },
  { value: 'uno_dos_anios', label: '1-2 años' },
  { value: 'mas_dos_anios', label: 'Más de 2 años' },
  { value: 'naci_aqui', label: 'Nací en España' },
];

interface OnboardingData {
  country: string;
  timeInSpain: string;
  isUndocumented: boolean;
  completed: boolean;
}

const STORAGE_KEY = 'manos-abiertas-onboarding';

export function OnboardingModal() {
  const { language } = useAppStore();
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState('');
  const [timeInSpain, setTimeInSpain] = useState('');
  const [isUndocumented, setIsUndocumented] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // Mostrar modal después de 2 segundos de carga
      const timer = setTimeout(() => setOpen(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleComplete = () => {
    const data: OnboardingData = {
      country,
      timeInSpain,
      isUndocumented,
      completed: true,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setOpen(false);
  };

  const totalSteps = 3;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => step === totalSteps && handleComplete()}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50 px-4"
          >
            <Card className="border-2 shadow-2xl overflow-hidden">
              {/* Header con gradiente */}
              <div className="gradient-brand p-6 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-2xl font-bold">¡Bienvenido/a a Manos Abiertas! 🤝</h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setOpen(false)}
                      className="text-white hover:bg-white/20"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <p className="text-white/90 text-sm">
                    Queremos conocerte mejor para ofrecerte la ayuda más relevante
                  </p>
                </div>

                {/* Progress bar */}
                <div className="mt-4 flex items-center gap-2">
                  {Array.from({ length: totalSteps }).map((_, i) => (
                    <div key={i} className="flex-1 h-1.5 rounded-full bg-white/20 overflow-hidden">
                      <motion.div
                        className="h-full bg-white"
                        initial={{ width: 0 }}
                        animate={{ width: i < step ? '100%' : i === step - 1 ? '50%' : '0%' }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-white/70 mt-1">
                  Paso {step} de {totalSteps}
                </p>
              </div>

              <CardContent className="p-6">
                {/* Step 1: País de origen */}
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <Globe className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <Label className="text-base font-semibold">¿De qué país eres?</Label>
                        <p className="text-xs text-muted-foreground">
                          Esto nos ayuda a personalizar los recursos para ti
                        </p>
                      </div>
                    </div>

                    <Select value={country} onValueChange={setCountry}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona tu país de origen" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {COUNTRIES.map((c) => (
                          <SelectItem key={c.value} value={c.value}>
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button
                      className="w-full mt-4"
                      disabled={!country}
                      onClick={() => setStep(2)}
                    >
                      Continuar →
                    </Button>
                  </motion.div>
                )}

                {/* Step 2: Tiempo en España */}
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                        <Clock className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <Label className="text-base font-semibold">
                          ¿Cuánto tiempo llevas en España?
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Para recomendarte recursos según tu etapa
                        </p>
                      </div>
                    </div>

                    <Select value={timeInSpain} onValueChange={setTimeInSpain}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona una opción" />
                      </SelectTrigger>
                      <SelectContent>
                        {TIME_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" onClick={() => setStep(1)}>
                        ← Atrás
                      </Button>
                      <Button
                        className="flex-1"
                        disabled={!timeInSpain}
                        onClick={() => setStep(3)}
                      >
                        Continuar →
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Situación documental */}
                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                        <Shield className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <Label className="text-base font-semibold">
                          Tu información es 100% confidencial
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          No compartimos tus datos con nadie. Todo es anónimo.
                        </p>
                      </div>
                    </div>

                    <Card className="border-2 border-amber-200 bg-amber-50">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start gap-3">
                          <Shield className="h-5 w-5 text-amber-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-amber-900">
                              ¿Te encuentras en situación irregular en España?
                            </p>
                            <p className="text-xs text-amber-700 mt-1">
                              Si es así, podemos mostrarte recursos específicos de apoyo legal y social.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <Label htmlFor="undocumented-switch" className="text-sm font-medium">
                            Sí, estoy en situación irregular
                          </Label>
                          <Switch
                            id="undocumented-switch"
                            checked={isUndocumented}
                            onCheckedChange={setIsUndocumented}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" onClick={() => setStep(2)}>
                        ← Atrás
                      </Button>
                      <Button className="flex-1 gradient-brand text-white" onClick={handleComplete}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        ¡Comenzar!
                      </Button>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
