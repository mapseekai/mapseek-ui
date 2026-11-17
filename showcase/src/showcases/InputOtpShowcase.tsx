import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@registry/ui/input-otp"
import { useState } from "react"

import type { LocalizedDemoProps } from "./types"

const labels = {
  "zh-CN": {
    basic: "六码验证",
    basicDescription: "输入发送到手机的六码验证码。",
    grouped: "分组输入",
    groupedDescription: "三位一组，更易于辨识。",
  },
  en: {
    basic: "Six-digit verification",
    basicDescription: "Enter the six-digit code sent to your phone.",
    grouped: "Grouped input",
    groupedDescription: "Three digits per group for easier scanning.",
  },
}

export function InputOtpOverviewDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = labels[locale]
  const [code, setCode] = useState("")
  const [groupedCode, setGroupedCode] = useState("")

  return (
    <div className="grid w-full max-w-sm gap-8">
      <section className="space-y-3" data-demo="input-otp-basic">
        <div>
          <h4 className="text-headline-sm text-foreground">{demoLabels.basic}</h4>
          <p className="text-body-sm text-muted-foreground">{demoLabels.basicDescription}</p>
        </div>
        <InputOTP maxLength={6} value={code} onChange={setCode} aria-label={demoLabels.basic}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </section>

      <section className="space-y-3" data-demo="input-otp-grouped">
        <div>
          <h4 className="text-headline-sm text-foreground">{demoLabels.grouped}</h4>
          <p className="text-body-sm text-muted-foreground">{demoLabels.groupedDescription}</p>
        </div>
        <InputOTP
          maxLength={6}
          value={groupedCode}
          onChange={setGroupedCode}
          aria-label={demoLabels.grouped}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </section>
    </div>
  )
}
