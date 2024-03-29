import stripe from "stripe";

const client = new stripe(`${process.env.STRIPE_SECRET_KEY}`, {
  apiVersion: "2020-08-27",
  typescript: true,
});

export const Stripe = {
  connect: async (code: string): Promise<stripe.OAuthToken> => {
    const response = await client.oauth.token({
      code,
      grant_type: "authorization_code",
    });

    return response;
  },
  charge: async (amount: number, source: string, stripeAccount: string) => {
    const res = await client.charges.create(
      {
        amount,
        currency: "usd",
        source,
        application_fee_amount: Math.round(amount * 0.05),
      },
      {
        stripeAccount: stripeAccount,
      }
    );

    if (res.status !== "succeeded") {
      throw new Error("failed to create charge with Stripe");
    }
  },
};
