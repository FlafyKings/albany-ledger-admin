export type OfficeDetails = {
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  zip: string
  room?: string
  hours?: string
}

export type RoleExperience = {
  id: string
  title: string
  organization: string
  startDate: string // YYYY-MM-DD
  endDate?: string // YYYY-MM-DD
  description?: string
}

export type CommitteeCatalogItem = {
  id: number
  name: string
  description?: string
}

export type CommitteeMembership = {
  id: string
  committeeId: number
  name: string
  role: "Chair" | "Vice Chair" | "Member"
}

export type VoteRecord = {
  id: string
  issue: string
  vote: "Yes" | "No" | "Abstain"
  result: "Passed" | "Failed"
  date: string // YYYY-MM-DD
  description?: string
}

export type Achievement = {
  id: string
  title: string
  description: string
  period?: string // e.g., Jan 2023 - Dec 2023
}

export type Official = {
  id: number
  name: string
  roleTitle: string
  termStart: string
  termEnd: string
  contact: {
    email: string
    phone: string
    office: OfficeDetails
  }
  biography: string
  experience: RoleExperience[]
  committees: CommitteeMembership[]
  votingHistory: VoteRecord[]
  achievements: Achievement[]
  image?: string
}

export const committeesCatalog: CommitteeCatalogItem[] = [
  { id: 1, name: "Budget Committee", description: "Oversees city budget and financial planning" },
  { id: 2, name: "Public Safety Committee", description: "Police and fire department oversight" },
  { id: 3, name: "Infrastructure Committee", description: "Roads, utilities, and public works" },
  { id: 4, name: "Parks & Recreation Committee", description: "Parks, recreation facilities, and programs" },
]

let officialsData: Official[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    roleTitle: "Mayor",
    termStart: "2022-01-01",
    termEnd: "2025-12-31",
    contact: {
      email: "s.johnson@albany.gov",
      phone: "(518) 555-0123",
      office: {
        addressLine1: "24 Eagle Street",
        addressLine2: "City Hall, Room 201",
        city: "Albany",
        state: "NY",
        zip: "12207",
        room: "201",
        hours: "Mon–Fri, 9:00 AM – 5:00 PM",
      },
    },
    biography:
      "Sarah Johnson has dedicated her career to public service, focusing on economic development, sustainability, and public safety.",
    experience: [
      {
        id: "exp-1",
        title: "Mayor",
        organization: "City of Albany",
        startDate: "2022-01-01",
        description: "Leading the strategic direction of the city with a focus on growth and equity.",
      },
      {
        id: "exp-2",
        title: "City Council Member",
        organization: "City of Albany",
        startDate: "2018-01-01",
        endDate: "2021-12-31",
        description: "Chaired the Budget Committee and co-authored public safety reform.",
      },
    ],
    committees: [
      { id: "m-1", committeeId: 1, name: "Budget Committee", role: "Chair" },
      { id: "m-2", committeeId: 2, name: "Public Safety Committee", role: "Member" },
    ],
    votingHistory: [
      {
        id: "v-1",
        issue: "2024 Budget Approval",
        vote: "Yes",
        result: "Passed",
        date: "2024-03-15",
        description: "Annual city budget for fiscal year 2024",
      },
      {
        id: "v-2",
        issue: "Downtown Parking Ordinance",
        vote: "No",
        result: "Failed",
        date: "2024-03-10",
        description: "Proposed changes to downtown parking regulations",
      },
    ],
    achievements: [
      {
        id: "a-1",
        title: "Led Downtown Revitalization Project",
        description:
          "Coordinated a $2.5M improvement initiative resulting in 15 new businesses and 200 jobs.",
        period: "Jan 2023 – Dec 2023",
      },
      {
        id: "a-2",
        title: "Implemented Green Energy Initiative",
        description: "Launched city-wide solar program reducing municipal energy costs by 30%.",
        period: "Mar 2022 – Ongoing",
      },
    ],
    image: "/placeholder.svg?height=64&width=64",
  },
  {
    id: 2,
    name: "Michael Chen",
    roleTitle: "City Council Member",
    termStart: "2023-01-01",
    termEnd: "2026-12-31",
    contact: {
      email: "m.chen@albany.gov",
      phone: "(518) 555-0124",
      office: {
        addressLine1: "24 Eagle Street",
        addressLine2: "City Hall, Room 110",
        city: "Albany",
        state: "NY",
        zip: "12207",
        room: "110",
        hours: "Mon–Thu, 10:00 AM – 4:00 PM",
      },
    },
    biography:
      "Michael advocates for small business growth and community-centered infrastructure improvements.",
    experience: [
      {
        id: "exp-3",
        title: "City Council Member, Ward 1",
        organization: "City of Albany",
        startDate: "2023-01-01",
        description: "Member of Infrastructure Committee; proposed digital permitting system.",
      },
    ],
    committees: [
      { id: "m-3", committeeId: 3, name: "Infrastructure Committee", role: "Vice Chair" },
    ],
    votingHistory: [
      {
        id: "v-3",
        issue: "2024 Budget Approval",
        vote: "Yes",
        result: "Passed",
        date: "2024-03-15",
      },
    ],
    achievements: [
      {
        id: "a-3",
        title: "Modernized Permitting",
        description:
          "Championed rollout of an online permit portal cutting average processing time by 40%.",
        period: "2023",
      },
    ],
    image: "/placeholder.svg?height=64&width=64",
  },
  {
    id: 3,
    name: "Jennifer Martinez",
    roleTitle: "City Council Member",
    termStart: "2023-01-01",
    termEnd: "2026-12-31",
    contact: {
      email: "j.martinez@albany.gov",
      phone: "(518) 555-0125",
      office: {
        addressLine1: "24 Eagle Street",
        addressLine2: "City Hall, Room 108",
        city: "Albany",
        state: "NY",
        zip: "12207",
        room: "108",
        hours: "Tue–Fri, 9:30 AM – 4:30 PM",
      },
    },
    biography:
      "Jennifer focuses on neighborhood services, environmental stewardship, and inclusive public engagement.",
    experience: [
      {
        id: "exp-4",
        title: "City Council Member, Ward 2",
        organization: "City of Albany",
        startDate: "2023-01-01",
      },
      {
        id: "exp-5",
        title: "Community Organizer",
        organization: "Albany Neighborhood Alliance",
        startDate: "2020-06-01",
        endDate: "2022-12-31",
        description: "Led community clean-ups and tree planting programs.",
      },
    ],
    committees: [
      { id: "m-4", committeeId: 4, name: "Parks & Recreation Committee", role: "Member" },
    ],
    votingHistory: [],
    achievements: [],
    image: "/placeholder.svg?height=64&width=64",
  },
]

// Import API client
import { officialsApi, transformApiOfficial, transformForApi } from '@/lib/officials-api'

function nextId() {
  return Math.max(0, ...officialsData.map((o) => o.id)) + 1
}

// Check if we should use API or fallback to mock data
const USE_API = process.env.NEXT_PUBLIC_USE_OFFICIALS_API === 'true'

export async function getOfficials() {
  if (USE_API) {
    try {
      const result = await officialsApi.list()
      if (result.success && result.data) {
        return result.data.officials.map(transformApiOfficial)
      }
    } catch (error) {
      console.warn('API call failed, falling back to mock data:', error)
    }
  }
  return officialsData
}

export async function getOfficialById(id: number) {
  if (USE_API) {
    try {
      const result = await officialsApi.get(id)
      if (result.success && result.data) {
        return transformApiOfficial(result.data)
      }
    } catch (error) {
      console.warn('API call failed, falling back to mock data:', error)
    }
  }
  return officialsData.find((o) => o.id === id)
}

// Non-persistent in-memory updates for demo purposes.
export async function upsertOfficial(official: Official) {
  if (USE_API) {
    try {
      const apiData = transformForApi(official)
      const result = await officialsApi.update(official.id, apiData)
      if (result.success && result.data) {
        return transformApiOfficial(result.data)
      }
    } catch (error) {
      console.warn('API call failed, falling back to mock data:', error)
    }
  }
  
  const idx = officialsData.findIndex((o) => o.id === official.id)
  if (idx >= 0) {
    officialsData[idx] = official
  } else {
    officialsData.push({ ...official, id: official.id || nextId() })
  }
  return official
}

export async function createOfficial(partial: Omit<Official, "id">) {
  if (USE_API) {
    try {
      const apiData = transformForApi(partial)
      const result = await officialsApi.create(apiData)
      if (result.success && result.data) {
        return transformApiOfficial(result.data)
      }
    } catch (error) {
      console.warn('API call failed, falling back to mock data:', error)
    }
  }
  
  const official: Official = { ...partial, id: nextId() }
  officialsData.push(official)
  return official
}

export async function deleteOfficial(id: number) {
  if (USE_API) {
    try {
      const result = await officialsApi.delete(id)
      if (result.success) {
        return true
      }
    } catch (error) {
      console.warn('API call failed, falling back to mock data:', error)
    }
  }
  
  const before = officialsData.length
  officialsData = officialsData.filter((o) => o.id !== id)
  return officialsData.length < before
}
