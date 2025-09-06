import type { CalendarEvent } from "@/types/calendar"

export const mockEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "City Commission Meeting",
    description: "Monthly city commission meeting to discuss budget allocations and upcoming infrastructure projects.",
    startDate: new Date(2025, 8, 15, 18, 0), // September 15, 2025, 6:00 PM
    endDate: new Date(2025, 8, 15, 20, 0), // September 15, 2025, 8:00 PM
    type: "commission",
    location: "City Hall, Main Conference Room",
    organizer: "Albany City Commission",
  },
  {
    id: "2",
    title: "County Board Meeting",
    description:
      "Albany County Board quarterly meeting to review county policies and discuss public safety initiatives.",
    startDate: new Date(2025, 8, 18, 14, 0), // September 18, 2025, 2:00 PM
    endDate: new Date(2025, 8, 18, 16, 30), // September 18, 2025, 4:30 PM
    type: "county",
    location: "Albany County Courthouse",
    organizer: "Albany County Board",
  },
  {
    id: "3",
    title: "School Board Meeting",
    description: "Albany School District board meeting to discuss curriculum updates and facility improvements.",
    startDate: new Date(2025, 8, 20, 19, 0), // September 20, 2025, 7:00 PM
    endDate: new Date(2025, 8, 20, 21, 0), // September 20, 2025, 9:00 PM
    type: "school-board",
    location: "Albany High School Auditorium",
    organizer: "Albany School District",
  },
  {
    id: "4",
    title: "Municipal Election",
    description: "General municipal election for mayor and city council positions.",
    startDate: new Date(2025, 8, 3, 6, 0), // September 3, 2025, 6:00 AM
    endDate: new Date(2025, 8, 3, 20, 0), // September 3, 2025, 8:00 PM
    type: "election",
    location: "Various polling locations throughout Albany",
    organizer: "Albany Board of Elections",
  },
  {
    id: "5",
    title: "Emergency Commission Session",
    description: "Special emergency session to address recent flooding concerns and emergency response protocols.",
    startDate: new Date(2025, 8, 12, 16, 0), // September 12, 2025, 4:00 PM
    endDate: new Date(2025, 8, 12, 18, 0), // September 12, 2025, 6:00 PM
    type: "commission",
    location: "City Hall Emergency Operations Center",
    organizer: "Albany Emergency Management",
  },
  {
    id: "6",
    title: "County Planning Committee",
    description: "Monthly planning committee meeting to review zoning applications and development proposals.",
    startDate: new Date(2025, 8, 25, 10, 0), // September 25, 2025, 10:00 AM
    endDate: new Date(2025, 8, 25, 12, 0), // September 25, 2025, 12:00 PM
    type: "county",
    location: "Albany County Planning Office",
    organizer: "Albany County Planning Department",
  },
  {
    id: "7",
    title: "School Board Budget Workshop",
    description:
      "Special workshop session to review and discuss the proposed school district budget for next fiscal year.",
    startDate: new Date(2025, 8, 28, 9, 0), // September 28, 2025, 9:00 AM
    endDate: new Date(2025, 8, 28, 15, 0), // September 28, 2025, 3:00 PM
    type: "school-board",
    location: "Albany School District Administration Building",
    organizer: "Albany School District Finance Committee",
  },
  {
    id: "8",
    title: "Primary Election",
    description: "Primary election for state and local candidates.",
    startDate: new Date(2025, 8, 5, 6, 0), // September 5, 2025, 6:00 AM
    endDate: new Date(2025, 8, 5, 20, 0), // September 5, 2025, 8:00 PM
    type: "election",
    location: "Albany Community Center & Other Polling Sites",
    organizer: "Albany Board of Elections",
  },
  {
    id: "9",
    title: "City Commission Public Hearing",
    description: "Public hearing on proposed changes to local business licensing requirements.",
    startDate: new Date(2025, 8, 8, 18, 30), // September 8, 2025, 6:30 PM
    endDate: new Date(2025, 8, 8, 20, 30), // September 8, 2025, 8:30 PM
    type: "commission",
    location: "City Hall Council Chambers",
    organizer: "Albany City Commission",
  },
  {
    id: "11",
    title: "Morning Coffee with Mayor",
    description: "Informal community meeting with the mayor to discuss local concerns.",
    startDate: new Date(2025, 8, 8, 8, 0), // September 8, 2025, 8:00 AM
    endDate: new Date(2025, 8, 8, 9, 30), // September 8, 2025, 9:30 AM
    type: "commission",
    location: "Albany Community Center",
    organizer: "Mayor's Office",
  },
  {
    id: "12",
    title: "County Tax Assessment Review",
    description: "Review of property tax assessments and appeals process.",
    startDate: new Date(2025, 8, 8, 10, 0), // September 8, 2025, 10:00 AM
    endDate: new Date(2025, 8, 8, 12, 0), // September 8, 2025, 12:00 PM
    type: "county",
    location: "Albany County Assessor's Office",
    organizer: "Albany County Assessor",
  },
  {
    id: "13",
    title: "School Board Transportation Committee",
    description: "Committee meeting to discuss school bus routes and transportation safety.",
    startDate: new Date(2025, 8, 8, 14, 0), // September 8, 2025, 2:00 PM
    endDate: new Date(2025, 8, 8, 15, 30), // September 8, 2025, 3:30 PM
    type: "school-board",
    location: "Albany School District Transportation Depot",
    organizer: "Albany School District Transportation",
  },
  {
    id: "14",
    title: "Voter Registration Drive",
    description: "Community voter registration event ahead of upcoming elections.",
    startDate: new Date(2025, 8, 8, 16, 0), // September 8, 2025, 4:00 PM
    endDate: new Date(2025, 8, 8, 18, 0), // September 8, 2025, 6:00 PM
    type: "election",
    location: "Albany Public Library",
    organizer: "Albany Board of Elections",
  },
  {
    id: "10",
    title: "County Health Board Meeting",
    description: "Quarterly meeting to discuss public health initiatives and review health department budget.",
    startDate: new Date(2025, 8, 22, 13, 0), // September 22, 2025, 1:00 PM
    endDate: new Date(2025, 8, 22, 15, 30), // September 22, 2025, 3:30 PM
    type: "county",
    location: "Albany County Health Department",
    organizer: "Albany County Health Board",
  },
]
