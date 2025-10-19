export interface CouponModel {
    id: string
    parrain_id: string | null
    code: string
    description: string | null
    discount_type: string
    discount_value: string
    min_order_amount: string | null
    max_discount_amount: string | null
    usage_limit: string
    usage_per_user: number
    is_active: boolean
    is_used: boolean
    user: string
    is_checked: boolean
    eligible_users: string | null
    eligibleUsers: string[] // Propriété transformée pour la compatibilité
    is_deleted: boolean
    parrain: any | null
    created_at: string
    updated_at: string
}

