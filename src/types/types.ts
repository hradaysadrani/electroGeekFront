
export type User = {
    name:string;
    email:string;
    photo:string;
    gender:string;
    role:string;
    dob:string;
    _id:string;
}

export interface Product{
    name:string;
    price: number;
    stock: number;
    category:string;
    photo:string;
    _id:string;
}

export type ShippingInfo = {
    address:string;
    city:string;
    state:string;
    country:string;
    pinCode:string;
}

export type CartItem = {
    productId:string;
    photo:string;
    name:string;
    price: number;
    quantity: number;
    stock: number;
}


export type OrderItem = Omit<CartItem, "stock"> &  {_id: string};
// export type OrderItem = {
//     productId:string;
//     photo:string;
//     name:string;  
//     price: number;
//     quantity: number;
//     _id: string;
// }

export type Order = {
    orderItems: OrderItem[];
    shippingInfo: ShippingInfo;
    subtotal: number;
    tax: number;
    shippingCharges: number;
    discount: number;
    total: number;
    status: string;
    user: {
        name: string;
        _id: string;
    }
    _id: string;
}

type CountAndChange = {
    revenue: number;
    product: number;
    user: number;
    order: number;
}

type LatestTransaction =  { 
    _id: string;
    amount: number;
    discount: number;
    quantity: number;
    status: string;
}

export type Stats = {
    categoryCount: Record<string,number>[],
    latestTransaction: LatestTransaction[],
    changePercent: CountAndChange,
    count : CountAndChange,
    userRatio :{
        male: number;
        female: number;
    },
    chart: {
        order: number[];
        revenue: number[];
    }
};

export type Pie = {
    adminCustomer: {
        admin: number;
        customer: number;
    },
    orderFulfillment: {
        processing: number;
        shipped: number;
        delivered: number;
    },
    productCategories : Record<string, number>[], 
    stockAvailability : {
        inStock: number;
        outStock: number;
    },
    revenueDistribution : {
        netMargin: number;
        discount: number;
        productionCost: number;
        burnt: number;
        marketingCost: number;
    },
    usersAgeGroup: {
        teen: number;
        adult: number;
        senior: number;
    }
};

export type Bar = {
    users: number[];
    products: number[];
    orders: number[];
};

export type Line = {
    users: number[];
    products: number[];
    discount: number[];
    revenue: number[];
};