export interface CouponModel {
    id: string
    code: string
    description: string
    discount_type: string
    discount_value: string
    min_order_amount: string
    max_discount_amount: string
    usage_limit: string
    usage_per_user: number
    is_active: boolean
    isUsed: boolean
    user: string
    IsChecked: string
    eligibleUsers: string[]
    created_at: string
}

