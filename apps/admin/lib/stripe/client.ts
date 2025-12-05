/**
 * Stripe Client
 *
 * Server-side Stripe SDK client for payment link generation.
 */

import Stripe from 'stripe';

/**
 * Lazy-initialized Stripe client with timeout and retry configuration.
 * Validates environment only when first accessed to prevent import-time crashes.
 */
let _stripeClient: Stripe | null = null;

function getStripeClient(): Stripe {
  if (!_stripeClient) {
    const apiKey = process.env.STRIPE_SECRET_KEY;
    if (!apiKey) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }

    _stripeClient = new Stripe(apiKey, {
      timeout: 30000, // 30 second timeout
      maxNetworkRetries: 2, // Retry failed requests up to 2 times
      apiVersion: '2025-11-17.clover', // Pin API version for stability
    });
  }
  return _stripeClient;
}

export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripeClient() as any)[prop];
  },
});

/**
 * Generate idempotency key for Stripe API calls
 */
function generateIdempotencyKey(prefix: string, identifier: string): string {
  return `${prefix}_${identifier}_${Date.now()}`;
}

/**
 * Create a Stripe product for a course
 */
export async function createStripeProduct(course: {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
}): Promise<Stripe.Product> {
  return stripe.products.create(
    {
      name: course.title,
      description: course.description || undefined,
      images: course.thumbnailUrl ? [course.thumbnailUrl] : undefined,
      metadata: {
        courseId: course.id,
        source: 'ozean-licht-admin',
      },
    },
    {
      idempotencyKey: generateIdempotencyKey('product', course.id),
    }
  );
}

/**
 * Create a Stripe price for a product
 */
export async function createStripePrice(
  productId: string,
  priceCents: number,
  currency: string = 'EUR'
): Promise<Stripe.Price> {
  return stripe.prices.create(
    {
      product: productId,
      unit_amount: priceCents,
      currency: currency.toLowerCase(),
    },
    {
      idempotencyKey: generateIdempotencyKey('price', `${productId}_${priceCents}_${currency}`),
    }
  );
}

/**
 * Create a payment link for a price
 */
export async function createPaymentLink(
  priceId: string,
  courseTitle: string
): Promise<Stripe.PaymentLink> {
  return stripe.paymentLinks.create(
    {
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        source: 'ozean-licht-admin',
      },
      after_completion: {
        type: 'redirect',
        redirect: {
          url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://ozean-licht.at'}/thank-you?course=${encodeURIComponent(courseTitle)}`,
        },
      },
    },
    {
      idempotencyKey: generateIdempotencyKey('paymentlink', priceId),
    }
  );
}

/**
 * Full sync: create product + price + payment link
 */
export async function createFullPaymentLink(course: {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  priceCents: number;
  currency: string;
}): Promise<{
  productId: string;
  priceId: string;
  paymentLinkId: string;
  paymentLinkUrl: string;
}> {
  // 1. Create product
  const product = await createStripeProduct({
    id: course.id,
    title: course.title,
    description: course.description,
    thumbnailUrl: course.thumbnailUrl,
  });

  // 2. Create price
  const price = await createStripePrice(
    product.id,
    course.priceCents,
    course.currency
  );

  // 3. Create payment link
  const paymentLink = await createPaymentLink(price.id, course.title);

  return {
    productId: product.id,
    priceId: price.id,
    paymentLinkId: paymentLink.id,
    paymentLinkUrl: paymentLink.url,
  };
}

/**
 * Get existing Stripe product by course ID metadata
 */
export async function findExistingProduct(courseId: string): Promise<Stripe.Product | null> {
  const products = await stripe.products.search({
    query: `metadata['courseId']:'${courseId}'`,
    limit: 1,
  });
  return products.data[0] || null;
}

/**
 * Get existing prices for a product
 */
export async function getProductPrices(productId: string): Promise<Stripe.Price[]> {
  const prices = await stripe.prices.list({
    product: productId,
    active: true,
    limit: 10,
  });
  return prices.data;
}
