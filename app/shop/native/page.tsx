import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Native Whey Protein - Undenatured Protein | Springs Nutrition",
  description:
    "Undenatured native whey protein sourced directly from fresh milk. Contains all essential amino acids in their natural form.",
}

export default function NativeProteinPage() {
  redirect("/product/native-whey-protein")
}
