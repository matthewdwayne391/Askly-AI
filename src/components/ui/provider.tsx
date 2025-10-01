"use client"

import { ChakraProvider, defaultSystem, defineConfig } from "@chakra-ui/react"
import { ColorModeProvider } from "./color-mode"

const customConfig = defineConfig({
  ...defaultSystem,
  globalCss: {
    '*': {
      fontFamily: "'Cairo', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important",
      direction: "rtl",
    },
    html: {
      direction: "rtl",
      fontFamily: "'Cairo', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important",
    },
    body: {
      direction: "rtl", 
      fontFamily: "'Cairo', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important",
    }
  }
})

export function Provider(props: React.PropsWithChildren) {
  return (
    <ChakraProvider value={customConfig}>
      <ColorModeProvider>{props.children}</ColorModeProvider>
    </ChakraProvider>
  )
}
