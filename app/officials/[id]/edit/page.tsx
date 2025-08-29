"use client"

import { useParams } from "next/navigation"
import OfficialForm from "@/components/OfficialForm"

export default function EditOfficialPage() {
  const params = useParams()
  const id = Number(params?.id)

  return <OfficialForm mode="edit" officialId={id} />
}
