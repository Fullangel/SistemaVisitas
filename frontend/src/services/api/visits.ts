import api from '@/lib/axios'

// Types
export interface Visit {
    id: number
    visit_code: string
    qr_code?: string
    qr_generated_at?: string
    qr_scanned_at?: string
    purpose: string
    description?: string
    visit_date: string
    entry_time?: string
    exit_time?: string
    status: 'pending' | 'approved' | 'rejected' | 'in_progress' | 'completed' | 'cancelled'
    priority: 'low' | 'medium' | 'high' | 'urgent'
    visitor_name: string
    visitor_email?: string
    visitor_phone?: string
    visitor_identification: string
    visitor_company?: string
    employee_id?: number
    department_id?: number
    headquarter_id?: number
    created_by?: number
    approved_by?: number
    approved_at?: string
    rejection_reason?: string
    has_vehicle: boolean
    vehicle_plate?: string
    vehicle_model?: string
    vehicle_color?: string
    created_at: string
    updated_at: string

    // Relationships
    employee?: {
        id: number
        first_name: string
        last_name: string
        email?: string
    }
    department?: {
        id: number
        name: string
        code: string
    }
    headquarter?: {
        id: number
        name: string
        code: string
        address?: string
    }
}

export interface CreateVisitData {
    visitor_name: string
    visitor_document: string
    visitor_email?: string
    visitor_phone?: string
    visitor_company?: string
    host_name: string
    host_department?: string
    purpose: string
    scheduled_date: string
    scheduled_time: string
    notes?: string
}

export interface UpdateVisitData extends Partial<CreateVisitData> {
    status?: Visit['status']
    rejection_reason?: string
    cancellation_reason?: string
}

export interface VisitFilters {
    status?: Visit['status']
    date_from?: string
    date_to?: string
    visitor_name?: string
    host_name?: string
    page?: number
    per_page?: number
}

export interface PaginatedResponse<T> {
    data: T[]
    current_page: number
    last_page: number
    per_page: number
    total: number
}

// API Functions
export const getVisits = async (filters?: VisitFilters): Promise<PaginatedResponse<Visit>> => {
    const { data } = await api.get('/visits', { params: filters })
    return data
}

export const getActiveVisits = async (): Promise<Visit[]> => {
    const { data } = await api.get('/visits/active')
    return data
}

export const getPendingVisits = async (): Promise<Visit[]> => {
    const { data } = await api.get('/visits/pending')
    return data
}

export const getVisitById = async (id: number): Promise<Visit> => {
    const { data } = await api.get(`/ visits / ${id} `)
    return data
}

export const createVisit = async (visitData: CreateVisitData): Promise<Visit> => {
    const { data } = await api.post('/visits', visitData)
    return data
}

export const updateVisit = async (id: number, visitData: UpdateVisitData): Promise<Visit> => {
    const { data } = await api.put(`/ visits / ${id} `, visitData)
    return data
}

export const updateVisitStatus = async (
    id: number,
    status: Visit['status'],
    rejection_reason?: string
): Promise<Visit> => {
    const { data } = await api.patch(`/ visits / ${id}/status`, {
        status,
        rejection_reason,
    })
    return data
}

export const approveVisit = async (id: number): Promise<Visit> => {
    const { data } = await api.post(`/visits/${id}/approve`)
    return data
}

export const rejectVisit = async (id: number, reason: string): Promise<Visit> => {
    const { data } = await api.post(`/visits/${id}/reject`, { reason })
    return data
}

export const checkInVisit = async (id: number): Promise<Visit> => {
    const { data } = await api.post(`/visits/${id}/check-in`)
    return data
}

export const checkOutVisit = async (id: number): Promise<Visit> => {
    const { data } = await api.post(`/visits/${id}/check-out`)
    return data
}

export const cancelVisit = async (id: number, reason?: string): Promise<Visit> => {
    const { data } = await api.post(`/visits/${id}/cancel`, { reason })
    return data
}

export const deleteVisit = async (id: number): Promise<void> => {
    await api.delete(`/visits/${id}`)
}
