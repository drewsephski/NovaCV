import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { upstashRedis } from '@/lib/server/redis';
import type Stripe from 'stripe';

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  if (!STRIPE_WEBHOOK_SECRET) {
    console.error('STRIPE_WEBHOOK_SECRET is not set');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  // Handle different event types
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId || (session.subscription as string);

      if (userId) {
        // Update user's subscription status in Redis
        await upstashRedis.hset(`subscription:${userId}`, {
          status: 'active',
          customerId: session.customer as string,
          sessionId: session.id,
          updatedAt: Date.now(),
        });

        console.log('Checkout completed for user:', userId);
      }
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;

      if (userId) {
        await upstashRedis.hset(`subscription:${userId}`, {
          status: subscription.status,
          subscriptionId: subscription.id,
          currentPeriodEnd: subscription.items.data[0]?.current_period_end,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          updatedAt: Date.now(),
        });

        console.log('Subscription updated for user:', userId);
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;

      if (userId) {
        await upstashRedis.hset(`subscription:${userId}`, {
          status: 'canceled',
          subscriptionId: subscription.id,
          canceledAt: Date.now(),
          updatedAt: Date.now(),
        });

        console.log('Subscription canceled for user:', userId);
      }
      break;
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice;
      const userId = invoice.metadata?.userId;

      if (userId) {
        await upstashRedis.hset(`subscription:${userId}`, {
          lastPaymentStatus: 'succeeded',
          lastPaymentDate: Date.now(),
          updatedAt: Date.now(),
        });

        console.log('Payment succeeded for user:', userId);
      }
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      const userId = invoice.metadata?.userId;

      if (userId) {
        await upstashRedis.hset(`subscription:${userId}`, {
          lastPaymentStatus: 'failed',
          lastPaymentDate: Date.now(),
          updatedAt: Date.now(),
        });

        console.log('Payment failed for user:', userId);
      }
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
