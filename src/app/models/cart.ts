export interface Cart {
    user_id: string,
    id: number,
    cart_date: Date
}

export interface CartItem {
    item_id: number,
    product_id: number,
    quantity: number,
    cart_id: number,
    product_name?: string,
    price?: number,
    total_price?: number,
    image?: string
}