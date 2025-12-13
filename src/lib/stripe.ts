// Stripe product and price configuration
export const STRIPE_PLANS = {
  premium: {
    product_id: "prod_Tb8xvmZsjHVjSv",
    price_id: "price_1SdwfEFEeMHcHuvR68GveCYR",
    credits: 200,
  },
  pro: {
    product_id: "prod_Tb8xsKZ6h4LyXU",
    price_id: "price_1SdwfQFEeMHcHuvRy3pQyGlm",
    credits: 600,
  },
} as const;

export type PlanType = keyof typeof STRIPE_PLANS | "free";
