"use client";

import React, { useState, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import ReCAPTCHA from "react-google-recaptcha";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { StarRating } from "./StarRating";
import { PLANETS } from "@/lib/data";
import { ChevronLeft, ChevronRight, Send, Rocket } from "lucide-react";
import type { MissionApplicationData, CrewRole } from "@/types/types";

const callsignRegex = /^[A-Z]{2}-\d{3,5}$/;

const personalStepSchema = z.object({
  fullName: z
    .string()
    .min(3, "Imię i nazwisko musi mieć min. 3 znaki")
    .max(60, "Imię i nazwisko musi mieć maks. 60 znaków"),
  email: z
    .string()
    .email("Podaj prawidłowy adres e-mail"),
  callsign: z
    .string()
    .regex(callsignRegex, "Znak wywoławczy musi mieć format XX-000 (np. PL-4521)"),
  role: z.enum(["commander", "pilot", "engineer", "scientist", "medic"], {
    error: "Wybierz rolę w załodze",
  }),
});

const missionStepSchema = z.object({
  preferredDestination: z
    .string()
    .min(1, "Wybierz cel misji"),
  experienceLevel: z
    .number()
    .min(1, "Oceń swoje doświadczenie (min. 1)")
    .max(5, "Maksymalnie 5"),
  motivation: z
    .string()
    .min(20, "Motywacja musi mieć min. 20 znaków")
    .max(500, "Motywacja musi mieć maks. 500 znaków"),
  availabilityDate: z
    .string()
    .min(1, "Podaj datę dostępności")
    .refine(
      (date) => {
        const selected = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selected > today;
      },
      "Data dostępności musi być w przyszłości"
    ),
});

const reviewStepSchema = z.object({
  termsAccepted: z
    .boolean()
    .refine((val) => val === true, "Musisz zaakceptować regulamin"),
  recaptchaToken: z
    .string()
    .min(1, "Potwierdź, że nie jesteś robotem"),
});

const formSchema = personalStepSchema.merge(missionStepSchema).merge(reviewStepSchema);

type FormData = z.infer<typeof formSchema>;

const stepSchemas = [personalStepSchema, missionStepSchema, reviewStepSchema];

const STEP_LABELS = ["Dane osobowe", "Preferencje misji", "Podsumowanie"];

const roleLabels: Record<CrewRole, string> = {
  commander: "Dowódca",
  pilot: "Pilot",
  engineer: "Inżynier",
  scientist: "Naukowiec",
  medic: "Medyk",
};

export function MissionApplicationForm() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      callsign: "",
      role: undefined,
      preferredDestination: "",
      experienceLevel: 0,
      motivation: "",
      availabilityDate: "",
      termsAccepted: false,
      recaptchaToken: "",
    },
    mode: "onTouched",
  });

  const stepFields: (keyof FormData)[][] = [
    ["fullName", "email", "callsign", "role"],
    ["preferredDestination", "experienceLevel", "motivation", "availabilityDate"],
    ["termsAccepted", "recaptchaToken"],
  ];

  async function handleNext() {
    const fields = stepFields[currentStep];
    const isValid = await form.trigger(fields);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEP_LABELS.length - 1));
    }
  }

  function handleBack() {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }

  function onSubmit(data: FormData) {
    console.log("Submitted:", data);
    setIsSubmitted(true);
  }

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="rounded-full bg-emerald-500/15 p-4 animate-bounce">
            <Rocket className="w-10 h-10 text-emerald-500" />
          </div>
          <h3 className="text-2xl font-bold">Aplikacja wysłana!</h3>
          <p className="text-muted-foreground text-center max-w-sm">
            Twoja aplikacja na misję kosmiczną została pomyślnie przesłana.
            Skontaktujemy się z Tobą wkrótce.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              form.reset();
              setCurrentStep(0);
              setIsSubmitted(false);
            }}
          >
            Złóż kolejną aplikację
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">Aplikacja na misję kosmiczną</CardTitle>
        <CardDescription>
          Wypełnij formularz, aby dołączyć do naszej załogi.
        </CardDescription>

        <div className="flex items-center gap-2 mt-4">
          {STEP_LABELS.map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                    i <= currentStep
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {i + 1}
                </div>
                <span className="text-[10px] mt-1 text-muted-foreground text-center hidden sm:block">
                  {label}
                </span>
              </div>
              {i < STEP_LABELS.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 flex-1 rounded-full transition-colors duration-300",
                    i < currentStep ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <form id="mission-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {currentStep === 0 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <Controller
                  name="fullName"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="fullName">Imię i nazwisko</FieldLabel>
                      <Input
                        {...field}
                        id="fullName"
                        aria-invalid={fieldState.invalid}
                        placeholder="Jan Kowalski"
                        autoComplete="name"
                      />
                      <FieldDescription>Twoje pełne imię i nazwisko.</FieldDescription>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="email">Adres e-mail</FieldLabel>
                      <Input
                        {...field}
                        id="email"
                        type="email"
                        aria-invalid={fieldState.invalid}
                        placeholder="jan@kosmonauta.pl"
                        autoComplete="email"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="callsign"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="callsign">Znak wywoławczy</FieldLabel>
                      <Input
                        {...field}
                        id="callsign"
                        aria-invalid={fieldState.invalid}
                        placeholder="PL-4521"
                        autoComplete="off"
                      />
                      <FieldDescription>
                        Format: 2 wielkie litery, myślnik, 3-5 cyfr (np. PL-4521).
                      </FieldDescription>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="role"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="role">Rola w załodze</FieldLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger id="role" aria-invalid={fieldState.invalid}>
                          <SelectValue placeholder="Wybierz rolę..." />
                        </SelectTrigger>
                        <SelectContent>
                          {(Object.entries(roleLabels) as [CrewRole, string][]).map(
                            ([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <Controller
                  name="preferredDestination"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="destination">Preferowany cel</FieldLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger id="destination" aria-invalid={fieldState.invalid}>
                          <SelectValue placeholder="Wybierz planetę..." />
                        </SelectTrigger>
                        <SelectContent>
                          {PLANETS.map((planet) => (
                            <SelectItem key={planet.id} value={planet.id}>
                              {planet.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="experienceLevel"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Poziom doświadczenia</FieldLabel>
                      <StarRating
                        value={field.value}
                        onChange={field.onChange}
                        maxStars={5}
                      />
                      <FieldDescription>
                        Oceń swoje doświadczenie kosmiczne od 1 do 5.
                      </FieldDescription>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="motivation"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="motivation">Motywacja</FieldLabel>
                      <InputGroup>
                        <InputGroupTextarea
                          {...field}
                          id="motivation"
                          placeholder="Opowiedz, dlaczego chcesz polecieć w kosmos..."
                          rows={4}
                          className="min-h-24 resize-none"
                          aria-invalid={fieldState.invalid}
                        />
                        <InputGroupAddon align="block-end">
                          <InputGroupText className="tabular-nums">
                            {field.value.length}/500 znaków
                          </InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="availabilityDate"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="availabilityDate">
                        Data dostępności
                      </FieldLabel>
                      <Input
                        {...field}
                        id="availabilityDate"
                        type="date"
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldDescription>
                        Najwcześniejsza data, kiedy możesz rozpocząć misję.
                      </FieldDescription>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="rounded-lg border bg-muted/30 p-4 space-y-2 text-sm">
                  <h4 className="font-semibold mb-2">Podsumowanie aplikacji</h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    <span className="text-muted-foreground">Imię:</span>
                    <span className="font-medium">{form.watch("fullName")}</span>
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">{form.watch("email")}</span>
                    <span className="text-muted-foreground">Znak:</span>
                    <span className="font-medium font-mono">{form.watch("callsign")}</span>
                    <span className="text-muted-foreground">Rola:</span>
                    <span className="font-medium">
                      {form.watch("role") ? roleLabels[form.watch("role")] : "—"}
                    </span>
                    <span className="text-muted-foreground">Cel:</span>
                    <span className="font-medium">
                      {PLANETS.find((p) => p.id === form.watch("preferredDestination"))?.name || "—"}
                    </span>
                    <span className="text-muted-foreground">Doświadczenie:</span>
                    <span className="font-medium">{form.watch("experienceLevel")}/5</span>
                  </div>
                </div>

                <Controller
                  name="termsAccepted"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="mt-1 h-4 w-4 rounded border-input accent-primary"
                        />
                        <span className="text-sm leading-relaxed">
                          Akceptuję{" "}
                          <a href="#" className="text-primary underline hover:text-primary/80 focus:ring-2 focus:ring-primary/20">
                            regulamin misji kosmicznych
                          </a>{" "}
                          i zgadzam się na przetwarzanie danych.
                        </span>
                      </label>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="recaptchaToken"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Weryfikacja</FieldLabel>
                      <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
                        onChange={(token) => field.onChange(token || "")}
                        onExpired={() => field.onChange("")}
                        theme="dark"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </div>
            )}
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0}
          className="gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          Wstecz
        </Button>

        {currentStep < STEP_LABELS.length - 1 ? (
          <Button type="button" onClick={handleNext} className="gap-1">
            Dalej
            <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button type="submit" form="mission-form" className="gap-1">
            <Send className="w-4 h-4" />
            Wyślij aplikację
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
