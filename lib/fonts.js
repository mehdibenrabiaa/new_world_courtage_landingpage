import { Playfair_Display } from "next/font/google"

const _playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
})

export const libreCaslon = {
  ..._playfair,
  className: `${_playfair.className} caslon`,
}
