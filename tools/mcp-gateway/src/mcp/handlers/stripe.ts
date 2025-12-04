import axios, { AxiosInstance } from 'axios';
import { MCPHandler, MCPParams, MCPResult, MCPCapability } from '../protocol/types';
import { config } from '../../../config/environment';
import { ValidationError, ServiceUnavailableError } from '../../utils/errors';
import { logger } from '../../utils/logger';
import { recordMCPOperation, recordTokenUsage } from '../../monitoring/metrics';

/**
 * Stripe MCP Handler
 *
 * Proxies requests to Stripe's remote MCP server at https://mcp.stripe.com
 * Uses bearer token authentication with Stripe API key
 *
 * Available tools from Stripe MCP:
 * - Account: get_stripe_account_info
 * - Balance: retrieve_balance
 * - Coupon: create_coupon, list_coupons
 * - Customer: create_customer, list_customers
 * - Dispute: list_disputes, update_dispute
 * - Invoice: create_invoice, create_invoice_item, finalize_invoice, list_invoices
 * - Payment Link: create_payment_link
 * - PaymentIntent: list_payment_intents
 * - Price: create_price, list_prices
 * - Product: create_product, list_products
 * - Refund: create_refund
 * - Subscription: cancel_subscription, list_subscriptions, update_subscription
 * - Search: search_stripe_resources, fetch_stripe_resources, search_stripe_documentation
 */
export class StripeHandler implements MCPHandler {
  private readonly client: AxiosInstance;
  private readonly stripeMcpUrl = 'https://mcp.stripe.com';
  private requestId = 0;

  constructor() {
    if (!config.STRIPE_SECRET_KEY) {
      throw new Error('Stripe API key not configured. Set STRIPE_SECRET_KEY environment variable');
    }

    this.client = axios.create({
      baseURL: this.stripeMcpUrl,
      timeout: config.HTTP_TIMEOUT_MS,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.STRIPE_SECRET_KEY}`,
      },
    });

    // Add request/response logging
    this.client.interceptors.request.use((req) => {
      logger.debug('Stripe MCP request', {
        method: req.method,
        url: req.url,
        data: req.data,
      });
      return req;
    });

    this.client.interceptors.response.use(
      (res) => {
        logger.debug('Stripe MCP response', {
          status: res.status,
          data: res.data,
        });
        return res;
      },
      (error) => {
        logger.error('Stripe MCP error', {
          message: error.message,
          response: error.response?.data,
        });
        throw error;
      }
    );

    logger.info('Stripe MCP handler initialized');
  }

  public async execute(params: MCPParams): Promise<MCPResult> {
    const startTime = Date.now();

    try {
      let result: any;

      // Map gateway operations to Stripe MCP tool names
      switch (params.operation) {
        // Account operations
        case 'get-account':
        case 'get_stripe_account_info':
          result = await this.callStripeMcp('get_stripe_account_info', {});
          break;

        // Balance operations
        case 'get-balance':
        case 'retrieve_balance':
          result = await this.callStripeMcp('retrieve_balance', {});
          break;

        // Customer operations
        case 'list-customers':
        case 'list_customers':
          result = await this.callStripeMcp('list_customers', params.args || {});
          break;

        case 'create-customer':
        case 'create_customer':
          result = await this.callStripeMcp('create_customer', params.args || {});
          break;

        // Product operations
        case 'list-products':
        case 'list_products':
          result = await this.callStripeMcp('list_products', params.args || {});
          break;

        case 'create-product':
        case 'create_product':
          result = await this.callStripeMcp('create_product', params.args || {});
          break;

        // Price operations
        case 'list-prices':
        case 'list_prices':
          result = await this.callStripeMcp('list_prices', params.args || {});
          break;

        case 'create-price':
        case 'create_price':
          result = await this.callStripeMcp('create_price', params.args || {});
          break;

        // Invoice operations
        case 'list-invoices':
        case 'list_invoices':
          result = await this.callStripeMcp('list_invoices', params.args || {});
          break;

        case 'create-invoice':
        case 'create_invoice':
          result = await this.callStripeMcp('create_invoice', params.args || {});
          break;

        case 'create-invoice-item':
        case 'create_invoice_item':
          result = await this.callStripeMcp('create_invoice_item', params.args || {});
          break;

        case 'finalize-invoice':
        case 'finalize_invoice':
          result = await this.callStripeMcp('finalize_invoice', params.args || {});
          break;

        // Subscription operations
        case 'list-subscriptions':
        case 'list_subscriptions':
          result = await this.callStripeMcp('list_subscriptions', params.args || {});
          break;

        case 'update-subscription':
        case 'update_subscription':
          result = await this.callStripeMcp('update_subscription', params.args || {});
          break;

        case 'cancel-subscription':
        case 'cancel_subscription':
          result = await this.callStripeMcp('cancel_subscription', params.args || {});
          break;

        // Payment Intent operations
        case 'list-payment-intents':
        case 'list_payment_intents':
          result = await this.callStripeMcp('list_payment_intents', params.args || {});
          break;

        // Payment Link operations
        case 'create-payment-link':
        case 'create_payment_link':
          result = await this.callStripeMcp('create_payment_link', params.args || {});
          break;

        // Refund operations
        case 'create-refund':
        case 'create_refund':
          result = await this.callStripeMcp('create_refund', params.args || {});
          break;

        // Coupon operations
        case 'list-coupons':
        case 'list_coupons':
          result = await this.callStripeMcp('list_coupons', params.args || {});
          break;

        case 'create-coupon':
        case 'create_coupon':
          result = await this.callStripeMcp('create_coupon', params.args || {});
          break;

        // Dispute operations
        case 'list-disputes':
        case 'list_disputes':
          result = await this.callStripeMcp('list_disputes', params.args || {});
          break;

        case 'update-dispute':
        case 'update_dispute':
          result = await this.callStripeMcp('update_dispute', params.args || {});
          break;

        // Search operations
        case 'search':
        case 'search_stripe_resources':
          result = await this.callStripeMcp('search_stripe_resources', params.args || {});
          break;

        case 'fetch':
        case 'fetch_stripe_resources':
          result = await this.callStripeMcp('fetch_stripe_resources', params.args || {});
          break;

        case 'search-docs':
        case 'search_stripe_documentation':
          result = await this.callStripeMcp('search_stripe_documentation', params.args || {});
          break;

        // Health check
        case 'health':
        case 'test':
          result = await this.checkHealth();
          break;

        default:
          throw new ValidationError(`Unknown operation: ${params.operation}`);
      }

      const duration = Date.now() - startTime;

      // Record metrics
      recordMCPOperation('stripe', params.operation, duration, 'success');
      recordTokenUsage('stripe', params.operation, 400);

      return {
        status: 'success',
        data: result,
        metadata: {
          executionTime: duration,
          tokensUsed: 400,
          cost: 0.0012,
          service: 'stripe',
          operation: params.operation,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      recordMCPOperation('stripe', params.operation, duration, 'error');

      logger.error('Stripe operation failed', {
        operation: params.operation,
        error,
      });

      // Handle Axios errors
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.error?.message || error.message;

        if (status === 401 || status === 403) {
          throw new ValidationError('Stripe authentication failed - check API key');
        }
        if (status === 400) {
          throw new ValidationError(`Invalid request: ${message}`);
        }
        if (status === 404) {
          throw new ValidationError('Resource not found');
        }
        if (status && status >= 500) {
          throw new ServiceUnavailableError('stripe', message);
        }
        throw new ValidationError(message);
      }

      throw error;
    }
  }

  /**
   * Call the Stripe MCP server using JSON-RPC
   */
  private async callStripeMcp(toolName: string, args: Record<string, any>): Promise<any> {
    const requestId = ++this.requestId;

    const payload = {
      jsonrpc: '2.0',
      method: 'tools/call',
      params: {
        name: toolName,
        arguments: args,
      },
      id: requestId,
    };

    const response = await this.client.post('/', payload);

    // Handle JSON-RPC errors
    if (response.data.error) {
      throw new ValidationError(
        response.data.error.message || 'Stripe MCP error',
        response.data.error.data
      );
    }

    return response.data.result;
  }

  /**
   * Check Stripe MCP health
   */
  private async checkHealth(): Promise<any> {
    try {
      const startTime = Date.now();

      // Try to get account info as a health check
      const result = await this.callStripeMcp('get_stripe_account_info', {});
      const latency = Date.now() - startTime;

      return {
        status: 'healthy',
        service: 'stripe',
        latency: `${latency}ms`,
        account_id: result?.content?.[0]?.text?.match(/ID: (acct_\w+)/)?.[1] || 'unknown',
        mcp_url: this.stripeMcpUrl,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        service: 'stripe',
        error: error instanceof Error ? error.message : 'Unknown error',
        mcp_url: this.stripeMcpUrl,
        timestamp: new Date().toISOString(),
      };
    }
  }

  public validateParams(params: MCPParams): void {
    if (!params.operation) {
      throw new ValidationError('Operation parameter is required');
    }

    const validOperations = this.getCapabilities().map(c => c.name);
    // Also allow snake_case versions
    const snakeCaseOperations = validOperations.map(op => op.replace(/-/g, '_'));
    const allOperations = [...validOperations, ...snakeCaseOperations];

    if (!allOperations.includes(params.operation)) {
      throw new ValidationError(
        `Invalid operation. Allowed: ${validOperations.join(', ')}`
      );
    }
  }

  public getCapabilities(): MCPCapability[] {
    return [
      // Account
      {
        name: 'get-account',
        description: 'Get Stripe account information',
        requiresAuth: true,
        tokenCost: 200,
      },
      // Balance
      {
        name: 'get-balance',
        description: 'Retrieve account balance',
        requiresAuth: true,
        tokenCost: 200,
      },
      // Customers
      {
        name: 'list-customers',
        description: 'List all customers',
        parameters: [
          { name: 'limit', type: 'number', description: 'Number of customers to return', required: false, default: 10 },
          { name: 'starting_after', type: 'string', description: 'Cursor for pagination', required: false },
        ],
        requiresAuth: true,
        tokenCost: 300,
      },
      {
        name: 'create-customer',
        description: 'Create a new customer',
        parameters: [
          { name: 'name', type: 'string', description: 'Customer name', required: false },
          { name: 'email', type: 'string', description: 'Customer email', required: false },
          { name: 'description', type: 'string', description: 'Customer description', required: false },
          { name: 'metadata', type: 'object', description: 'Additional metadata', required: false },
        ],
        requiresAuth: true,
        tokenCost: 350,
      },
      // Products
      {
        name: 'list-products',
        description: 'List all products',
        parameters: [
          { name: 'limit', type: 'number', description: 'Number of products to return', required: false, default: 10 },
          { name: 'active', type: 'boolean', description: 'Filter by active status', required: false },
        ],
        requiresAuth: true,
        tokenCost: 300,
      },
      {
        name: 'create-product',
        description: 'Create a new product',
        parameters: [
          { name: 'name', type: 'string', description: 'Product name', required: true },
          { name: 'description', type: 'string', description: 'Product description', required: false },
          { name: 'metadata', type: 'object', description: 'Additional metadata', required: false },
        ],
        requiresAuth: true,
        tokenCost: 350,
      },
      // Prices
      {
        name: 'list-prices',
        description: 'List all prices',
        parameters: [
          { name: 'limit', type: 'number', description: 'Number of prices to return', required: false, default: 10 },
          { name: 'product', type: 'string', description: 'Filter by product ID', required: false },
        ],
        requiresAuth: true,
        tokenCost: 300,
      },
      {
        name: 'create-price',
        description: 'Create a new price',
        parameters: [
          { name: 'unit_amount', type: 'number', description: 'Price in cents', required: true },
          { name: 'currency', type: 'string', description: 'Three-letter currency code', required: true },
          { name: 'product', type: 'string', description: 'Product ID', required: true },
          { name: 'recurring', type: 'object', description: 'Recurring billing config', required: false },
        ],
        requiresAuth: true,
        tokenCost: 350,
      },
      // Invoices
      {
        name: 'list-invoices',
        description: 'List all invoices',
        parameters: [
          { name: 'limit', type: 'number', description: 'Number of invoices to return', required: false, default: 10 },
          { name: 'customer', type: 'string', description: 'Filter by customer ID', required: false },
          { name: 'status', type: 'string', description: 'Filter by status', required: false },
        ],
        requiresAuth: true,
        tokenCost: 300,
      },
      {
        name: 'create-invoice',
        description: 'Create a new invoice',
        parameters: [
          { name: 'customer', type: 'string', description: 'Customer ID', required: true },
          { name: 'auto_advance', type: 'boolean', description: 'Auto-finalize invoice', required: false },
          { name: 'collection_method', type: 'string', description: 'Collection method', required: false },
        ],
        requiresAuth: true,
        tokenCost: 350,
      },
      {
        name: 'create-invoice-item',
        description: 'Create an invoice item',
        parameters: [
          { name: 'customer', type: 'string', description: 'Customer ID', required: true },
          { name: 'price', type: 'string', description: 'Price ID', required: false },
          { name: 'amount', type: 'number', description: 'Amount in cents', required: false },
          { name: 'invoice', type: 'string', description: 'Invoice ID', required: false },
        ],
        requiresAuth: true,
        tokenCost: 300,
      },
      {
        name: 'finalize-invoice',
        description: 'Finalize a draft invoice',
        parameters: [
          { name: 'invoice', type: 'string', description: 'Invoice ID', required: true },
        ],
        requiresAuth: true,
        tokenCost: 300,
      },
      // Subscriptions
      {
        name: 'list-subscriptions',
        description: 'List all subscriptions',
        parameters: [
          { name: 'limit', type: 'number', description: 'Number of subscriptions to return', required: false, default: 10 },
          { name: 'customer', type: 'string', description: 'Filter by customer ID', required: false },
          { name: 'status', type: 'string', description: 'Filter by status', required: false },
        ],
        requiresAuth: true,
        tokenCost: 300,
      },
      {
        name: 'update-subscription',
        description: 'Update a subscription',
        parameters: [
          { name: 'subscription_id', type: 'string', description: 'Subscription ID', required: true },
          { name: 'items', type: 'array', description: 'Subscription items', required: false },
          { name: 'cancel_at_period_end', type: 'boolean', description: 'Cancel at period end', required: false },
        ],
        requiresAuth: true,
        tokenCost: 350,
      },
      {
        name: 'cancel-subscription',
        description: 'Cancel a subscription',
        parameters: [
          { name: 'subscription_id', type: 'string', description: 'Subscription ID', required: true },
        ],
        requiresAuth: true,
        tokenCost: 300,
      },
      // Payment Intents
      {
        name: 'list-payment-intents',
        description: 'List payment intents',
        parameters: [
          { name: 'limit', type: 'number', description: 'Number of payment intents to return', required: false, default: 10 },
          { name: 'customer', type: 'string', description: 'Filter by customer ID', required: false },
        ],
        requiresAuth: true,
        tokenCost: 300,
      },
      // Payment Links
      {
        name: 'create-payment-link',
        description: 'Create a payment link',
        parameters: [
          { name: 'line_items', type: 'array', description: 'Line items for the payment link', required: true },
        ],
        requiresAuth: true,
        tokenCost: 350,
      },
      // Refunds
      {
        name: 'create-refund',
        description: 'Create a refund',
        parameters: [
          { name: 'payment_intent', type: 'string', description: 'Payment Intent ID', required: true },
          { name: 'amount', type: 'number', description: 'Amount to refund in cents', required: false },
          { name: 'reason', type: 'string', description: 'Reason for refund', required: false },
        ],
        requiresAuth: true,
        tokenCost: 350,
      },
      // Coupons
      {
        name: 'list-coupons',
        description: 'List all coupons',
        parameters: [
          { name: 'limit', type: 'number', description: 'Number of coupons to return', required: false, default: 10 },
        ],
        requiresAuth: true,
        tokenCost: 300,
      },
      {
        name: 'create-coupon',
        description: 'Create a coupon',
        parameters: [
          { name: 'percent_off', type: 'number', description: 'Percentage discount', required: false },
          { name: 'amount_off', type: 'number', description: 'Amount discount in cents', required: false },
          { name: 'currency', type: 'string', description: 'Currency for amount_off', required: false },
          { name: 'duration', type: 'string', description: 'Duration (forever, once, repeating)', required: true },
        ],
        requiresAuth: true,
        tokenCost: 350,
      },
      // Disputes
      {
        name: 'list-disputes',
        description: 'List all disputes',
        parameters: [
          { name: 'limit', type: 'number', description: 'Number of disputes to return', required: false, default: 10 },
        ],
        requiresAuth: true,
        tokenCost: 300,
      },
      {
        name: 'update-dispute',
        description: 'Update a dispute',
        parameters: [
          { name: 'dispute', type: 'string', description: 'Dispute ID', required: true },
          { name: 'evidence', type: 'object', description: 'Evidence to submit', required: false },
          { name: 'submit', type: 'boolean', description: 'Submit evidence', required: false },
        ],
        requiresAuth: true,
        tokenCost: 350,
      },
      // Search
      {
        name: 'search',
        description: 'Search Stripe resources',
        parameters: [
          { name: 'query', type: 'string', description: 'Search query', required: true },
          { name: 'resource', type: 'string', description: 'Resource type to search', required: true },
        ],
        requiresAuth: true,
        tokenCost: 400,
      },
      {
        name: 'fetch',
        description: 'Fetch a Stripe object by ID',
        parameters: [
          { name: 'id', type: 'string', description: 'Object ID', required: true },
        ],
        requiresAuth: true,
        tokenCost: 200,
      },
      {
        name: 'search-docs',
        description: 'Search Stripe documentation',
        parameters: [
          { name: 'query', type: 'string', description: 'Search query', required: true },
        ],
        requiresAuth: true,
        tokenCost: 400,
      },
      // Health
      {
        name: 'health',
        description: 'Check Stripe MCP health',
        requiresAuth: false,
        tokenCost: 100,
      },
    ];
  }

  public async shutdown(): Promise<void> {
    logger.info('Shutting down Stripe handler...');
    // No persistent connections to close
  }
}
