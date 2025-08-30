"use client"

import { useParams } from "next/navigation"
import OfficialForm from "@/components/OfficialForm"
import EditOfficialLoading from "./loading"

export default function EditOfficialPage() {
  const params = useParams()
  const officialId = Number(params.id)

  return <OfficialForm mode="edit" officialId={officialId} />
}
