import { useQuery, useMutation, useQueryClient, UseQueryOptions } from 'react-query'
import {
    getVisits,
    getActiveVisits,
    getPendingVisits,
    getVisitById,
    createVisit,
    updateVisit,
    updateVisitStatus,
    approveVisit,
    rejectVisit,
    checkInVisit,
    checkOutVisit,
    cancelVisit,
    deleteVisit,
    type Visit,
    type CreateVisitData,
    type UpdateVisitData,
    type VisitFilters,
    type PaginatedResponse
} from '@/services/api/visits'
import toast from 'react-hot-toast'

// Query keys
export const visitKeys = {
    all: ['visits'] as const,
    lists: () => [...visitKeys.all, 'list'] as const,
    list: (filters?: VisitFilters) => [...visitKeys.lists(), filters] as const,
    active: () => [...visitKeys.all, 'active'] as const,
    pending: () => [...visitKeys.all, 'pending'] as const,
    details: () => [...visitKeys.all, 'detail'] as const,
    detail: (id: number) => [...visitKeys.details(), id] as const,
}

/**
 * Hook para obtener lista de visitas con filtros
 */
export const useVisits = (filters?: VisitFilters, options?: UseQueryOptions<PaginatedResponse<Visit>>) => {
    return useQuery({
        queryKey: visitKeys.list(filters),
        queryFn: () => getVisits(filters),
        ...options,
    })
}

/**
 * Hook para obtener visitas activas
 */
export const useActiveVisits = (options?: UseQueryOptions<Visit[]>) => {
    return useQuery({
        queryKey: visitKeys.active(),
        queryFn: getActiveVisits,
        refetchInterval: 30000, // Refrescar cada 30 segundos
        ...options,
    })
}

/**
 * Hook para obtener visitas pendientes
 */
export const usePendingVisits = (options?: UseQueryOptions<Visit[]>) => {
    return useQuery({
        queryKey: visitKeys.pending(),
        queryFn: getPendingVisits,
        refetchInterval: 30000, // Refrescar cada 30 segundos
        ...options,
    })
}

/**
 * Hook para obtener una visita por ID
 */
export const useVisit = (id: number, options?: UseQueryOptions<Visit>) => {
    return useQuery({
        queryKey: visitKeys.detail(id),
        queryFn: () => getVisitById(id),
        enabled: !!id,
        ...options,
    })
}

/**
 * Hook para crear visita
 */
export const useCreateVisit = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateVisitData) => createVisit(data),
        onSuccess: () => {
            // Invalidar queries relacionadas
            queryClient.invalidateQueries({ queryKey: visitKeys.lists() })
            queryClient.invalidateQueries({ queryKey: visitKeys.pending() })

            toast.success('Visita creada exitosamente')
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Error al crear la visita'
            toast.error(message)
        },
    })
}

/**
 * Hook para actualizar visita
 */
export const useUpdateVisit = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateVisitData }) =>
            updateVisit(id, data),
        onSuccess: (updatedVisit: Visit) => {
            // Invalidar queries relacionadas
            queryClient.invalidateQueries({ queryKey: visitKeys.lists() })
            queryClient.invalidateQueries({ queryKey: visitKeys.detail(updatedVisit.id) })

            toast.success('Visita actualizada exitosamente')
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Error al actualizar la visita'
            toast.error(message)
        },
    })
}

/**
 * Hook para cambiar estado de visita
 */
export const useUpdateVisitStatus = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            status,
            rejection_reason
        }: {
            id: number
            status: Visit['status']
            rejection_reason?: string
        }) => updateVisitStatus(id, status, rejection_reason),
        onSuccess: () => {
            // Invalidar todas las queries de visitas
            queryClient.invalidateQueries({ queryKey: visitKeys.all })

            toast.success('Estado actualizado exitosamente')
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Error al actualizar el estado'
            toast.error(message)
        },
    })
}

/**
 * Hook para aprobar visita
 */
export const useApproveVisit = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: number) => approveVisit(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: visitKeys.all })
            toast.success('Visita aprobada exitosamente')
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Error al aprobar la visita'
            toast.error(message)
        },
    })
}

/**
 * Hook para rechazar visita
 */
export const useRejectVisit = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, reason }: { id: number; reason: string }) =>
            rejectVisit(id, reason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: visitKeys.all })
            toast.success('Visita rechazada')
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Error al rechazar la visita'
            toast.error(message)
        },
    })
}

/**
 * Hook para check-in de visita
 */
export const useCheckInVisit = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: number) => checkInVisit(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: visitKeys.all })
            toast.success('Check-in realizado exitosamente')
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Error al realizar check-in'
            toast.error(message)
        },
    })
}

/**
 * Hook para check-out de visita
 */
export const useCheckOutVisit = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: number) => checkOutVisit(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: visitKeys.all })
            toast.success('Check-out realizado exitosamente')
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Error al realizar check-out'
            toast.error(message)
        },
    })
}

/**
 * Hook para cancelar visita
 */
export const useCancelVisit = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, reason }: { id: number; reason?: string }) =>
            cancelVisit(id, reason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: visitKeys.all })
            toast.success('Visita cancelada')
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Error al cancelar la visita'
            toast.error(message)
        },
    })
}

/**
 * Hook para eliminar visita
 */
export const useDeleteVisit = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: number) => deleteVisit(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: visitKeys.all })
            toast.success('Visita eliminada exitosamente')
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Error al eliminar la visita'
            toast.error(message)
        },
    })
}
