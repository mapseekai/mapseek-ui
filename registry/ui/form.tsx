"use client"

import * as React from "react"
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form"

import { cn } from "@/registry/lib/utils"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/registry/ui/field"

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue)

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue)

const Form = FormProvider

function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

function useFormField() {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()
  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext.name) {
    throw new Error("useFormField must be used within <FormField>")
  }

  return {
    id: itemContext.id,
    name: fieldContext.name,
    formItemId: itemContext.id,
    formDescriptionId: `${itemContext.id}-form-item-description`,
    formMessageId: `${itemContext.id}-form-item-message`,
    ...fieldState,
  }
}

function FormItem({ className, ...props }: React.ComponentProps<typeof Field>) {
  const id = React.useId()
  const { error } = useFormField()

  return (
    <FormItemContext.Provider value={{ id }}>
      <Field {...props} data-slot="form-item" data-invalid={!!error} className={cn(className)} />
    </FormItemContext.Provider>
  )
}

function FormLabel({ className, ...props }: React.ComponentProps<typeof FieldLabel>) {
  const { error, formItemId } = useFormField()

  return (
    <FieldLabel
      {...props}
      data-slot="form-label"
      data-invalid={!!error}
      className={cn(className)}
      htmlFor={formItemId}
    />
  )
}

type FormControlProps = {
  children: React.ReactElement<Record<string, unknown>>
}

function FormControl({ children }: FormControlProps) {
  const { error, formDescriptionId, formItemId, formMessageId } = useFormField()
  const describedBy = error ? `${formDescriptionId} ${formMessageId}` : formDescriptionId

  return React.cloneElement(children, {
    "aria-describedby": describedBy,
    "aria-invalid": !!error,
    "data-slot": "form-control",
    id: formItemId,
  })
}

function FormDescription({ className, ...props }: React.ComponentProps<typeof FieldDescription>) {
  const { formDescriptionId } = useFormField()

  return (
    <FieldDescription
      {...props}
      data-slot="form-description"
      className={cn(className)}
      id={formDescriptionId}
    />
  )
}

function FormMessage({ className, children, ...props }: React.ComponentProps<typeof FieldError>) {
  const { error, formMessageId } = useFormField()
  const body = error?.message ?? children

  if (!body) {
    return null
  }

  return (
    <FieldError {...props} data-slot="form-message" className={cn(className)} id={formMessageId}>
      {body}
    </FieldError>
  )
}

export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
}
