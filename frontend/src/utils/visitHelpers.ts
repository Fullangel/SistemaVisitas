import type { Visit } from "@/services/api/visits"

/**
 * Helper function to calculate visit duration
 */
export function calculateVisitDuration(visit: Visit): string {
    if (!visit.entry_time) return 'N/A'

    const entryTime = new Date(`${visit.visit_date} ${visit.entry_time}`)
    const now = new Date()

    const diffMs = now.getTime() - entryTime.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 60) {
        return `${diffMins}m`
    }

    const hours = Math.floor(diffMins / 60)
    const minutes = diffMins % 60

    return `${hours}h ${minutes}m`
}

/**
 * Helper function to get visitor initials
 */
export function getVisitorInitials(name: string): string {
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
}

/**
 * Helper function to get ID card photo URL
 */
export function getIdCardPhotoUrl(visit: Visit): string | null {
    const idCardPhoto = visit.photos?.find(p => p.photo_type === 'id_card')
    return idCardPhoto?.medium_url || null
}

/**
 * Helper function to get visitor photo URL
 */
export function getVisitorPhotoUrl(visit: Visit): string | null {
    const visitorPhoto = visit.photos?.find(p => p.photo_type === 'visitor')
    return visitorPhoto?.thumbnail_url || null
}

/**
 * Helper function to download ID card photo
 */
export function downloadIdCardPhoto(photoUrl: string, visitorName: string): void {
    const link = document.createElement('a')
    link.href = photoUrl
    link.download = `cedula_${visitorName.replace(/\s+/g, '_')}_${new Date().getTime()}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

/**
 * Helper function to format employee name
 */
export function getEmployeeName(visit: Visit): string {
    if (!visit.employee) return 'N/A'
    return `${visit.employee.first_name} ${visit.employee.last_name}`
}
