import { Button } from "@registry/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@registry/ui/form"
import { Input } from "@registry/ui/input"
import { useState } from "react"
import { useForm } from "react-hook-form"

import type { LocalizedDemoProps } from "./types"

type DatasetValues = {
  name: string
  epsg: string
}

const labels = {
  "zh-CN": {
    title: "数据集元数据",
    name: "数据集名称",
    namePlaceholder: "例如：道路网络",
    nameDescription: "显示在图层目录中的名称。",
    nameRequired: "请输入数据集名称。",
    epsg: "EPSG 代码",
    epsgPlaceholder: "EPSG:4326",
    epsgDescription: "使用 EPSG:XXXX 格式指定坐标参考系。",
    epsgInvalid: "请输入有效的 EPSG 代码，例如 EPSG:4326。",
    submit: "保存数据集",
    success: "数据集元数据已保存。",
  },
  en: {
    title: "Dataset metadata",
    name: "Dataset name",
    namePlaceholder: "For example: Road network",
    nameDescription: "The name shown in the layer catalog.",
    nameRequired: "Enter a dataset name.",
    epsg: "EPSG code",
    epsgPlaceholder: "EPSG:4326",
    epsgDescription: "Set the coordinate reference system as EPSG:XXXX.",
    epsgInvalid: "Enter a valid EPSG code, such as EPSG:4326.",
    submit: "Save dataset",
    success: "Dataset metadata saved.",
  },
}

export function FormOverviewDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = labels[locale]
  const form = useForm<DatasetValues>({ defaultValues: { name: "", epsg: "" } })
  const [submitted, setSubmitted] = useState(false)

  return (
    <section className="w-full max-w-sm space-y-3" data-demo="form-overview">
      <h4 className="text-headline-md">{demoLabels.title}</h4>
      <Form {...form}>
        <form
          className="grid gap-4"
          onSubmit={form.handleSubmit(() => {
            setSubmitted(true)
          })}
        >
          <FormField
            control={form.control}
            name="name"
            rules={{ required: demoLabels.nameRequired }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{demoLabels.name}</FormLabel>
                <FormControl>
                  <Input placeholder={demoLabels.namePlaceholder} {...field} />
                </FormControl>
                <FormDescription>{demoLabels.nameDescription}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="epsg"
            rules={{ pattern: { value: /^EPSG:\d+$/, message: demoLabels.epsgInvalid } }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{demoLabels.epsg}</FormLabel>
                <FormControl>
                  <Input placeholder={demoLabels.epsgPlaceholder} {...field} />
                </FormControl>
                <FormDescription>{demoLabels.epsgDescription}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">{demoLabels.submit}</Button>
          {submitted && <p className="text-body-md text-primary">{demoLabels.success}</p>}
        </form>
      </Form>
    </section>
  )
}
