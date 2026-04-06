import { stripe } from '@/lib/stripe';

export async function setupPortfolioHostingPricing() {
  // Create the portfolio hosting product
  const product = await stripe.products.create({
    name: 'Portfolio Hosting',
    description: 'Host your professional portfolio with a custom subdomain. Cancel anytime.',
    metadata: { tier: 'portfolio_hosting' },
  });

  // Create monthly recurring price - $4.99/month
  const monthlyPrice = await stripe.prices.create({
    product: product.id,
    unit_amount: 499, // $4.99 in cents
    currency: 'usd',
    recurring: {
      interval: 'month',
      interval_count: 1,
    },
  });

  console.log('Portfolio Hosting Pricing Created:', {
    productId: product.id,
    priceId: monthlyPrice.id,
  });

  return {
    productId: product.id,
    priceId: monthlyPrice.id,
  };
}
