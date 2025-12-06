/**
 * Knowledge Articles Database Queries
 *
 * Database queries for knowledge base articles via direct PostgreSQL connection.
 * Uses the query/execute functions from index.ts for connection pooling.
 */

import { query, execute } from './index';
import type {
  KnowledgeArticle,
  ArticleListOptions,
  ArticleListResult,
  CreateArticleInput,
  UpdateArticleInput,
  ArticleStatus,
} from '../../types/support';

// Database row type (snake_case)
export interface DBKnowledgeArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary: string | null;
  category: string | null;
  tags: string[];
  language: string;
  status: ArticleStatus;
  view_count: number;
  helpful_count: number;
  created_by: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

// Transform snake_case DB row to camelCase domain object
function toDomainModel(row: DBKnowledgeArticle & {
  author_id?: string;
  author_name?: string;
  author_email?: string;
}): KnowledgeArticle {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    content: row.content,
    summary: row.summary || undefined,
    category: row.category || undefined,
    tags: row.tags,
    language: row.language,
    status: row.status,
    viewCount: row.view_count,
    helpfulCount: row.helpful_count,
    createdBy: row.created_by || undefined,
    publishedAt: row.published_at || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    author: row.author_id ? {
      id: row.author_id,
      name: row.author_name || 'Unknown',
      email: row.author_email || '',
    } : undefined,
  };
}

// Generate URL-friendly slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
}

/**
 * List all articles with filtering and pagination
 */
export async function getAllArticles(options: ArticleListOptions = {}): Promise<ArticleListResult> {
  const {
    status,
    category,
    search,
    limit: requestedLimit = 50,
    offset = 0,
  } = options;

  // Cap limit at 100 to prevent DoS attacks
  const limit = Math.min(requestedLimit, 100);

  // Build WHERE conditions
  const conditions: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  if (status) {
    conditions.push(`ka.status = $${paramIndex++}`);
    params.push(status);
  }

  if (category) {
    conditions.push(`ka.category = $${paramIndex++}`);
    params.push(category);
  }

  if (search) {
    conditions.push(`(ka.title ILIKE $${paramIndex} OR ka.content ILIKE $${paramIndex})`);
    params.push(`%${search}%`);
    paramIndex++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Count query
  const countSql = `SELECT COUNT(*) as count FROM knowledge_articles ka ${whereClause}`;
  const countResult = await query<{ count: string }>(countSql, params);
  const total = parseInt(countResult[0]?.count || '0', 10);

  // Data query with author info
  // Add LIMIT and OFFSET to params for proper parameterization
  params.push(limit);
  const limitParamIndex = paramIndex++;
  params.push(offset);
  const offsetParamIndex = paramIndex++;

  const dataSql = `
    SELECT
      ka.id, ka.title, ka.slug, ka.content, ka.summary, ka.category,
      ka.tags, ka.language, ka.status, ka.view_count, ka.helpful_count,
      ka.created_by, ka.published_at, ka.created_at, ka.updated_at,
      au.id as author_id,
      u.full_name as author_name,
      u.email as author_email
    FROM knowledge_articles ka
    LEFT JOIN admin_users au ON ka.created_by = au.id
    LEFT JOIN users u ON au.user_id = u.id
    ${whereClause}
    ORDER BY ka.created_at DESC
    LIMIT $${limitParamIndex} OFFSET $${offsetParamIndex}
  `;

  const rows = await query<DBKnowledgeArticle & {
    author_id?: string;
    author_name?: string;
    author_email?: string;
  }>(dataSql, params);

  return {
    articles: rows.map(toDomainModel),
    total,
  };
}

/**
 * Get a single article by ID
 */
export async function getArticleById(id: string): Promise<KnowledgeArticle | null> {
  const sql = `
    SELECT
      ka.id, ka.title, ka.slug, ka.content, ka.summary, ka.category,
      ka.tags, ka.language, ka.status, ka.view_count, ka.helpful_count,
      ka.created_by, ka.published_at, ka.created_at, ka.updated_at,
      au.id as author_id,
      u.full_name as author_name,
      u.email as author_email
    FROM knowledge_articles ka
    LEFT JOIN admin_users au ON ka.created_by = au.id
    LEFT JOIN users u ON au.user_id = u.id
    WHERE ka.id = $1
  `;

  const rows = await query<DBKnowledgeArticle & {
    author_id?: string;
    author_name?: string;
    author_email?: string;
  }>(sql, [id]);

  return rows.length > 0 ? toDomainModel(rows[0]) : null;
}

/**
 * Get an article by slug (for public access)
 */
export async function getArticleBySlug(slug: string): Promise<KnowledgeArticle | null> {
  const sql = `
    SELECT
      ka.id, ka.title, ka.slug, ka.content, ka.summary, ka.category,
      ka.tags, ka.language, ka.status, ka.view_count, ka.helpful_count,
      ka.created_by, ka.published_at, ka.created_at, ka.updated_at,
      au.id as author_id,
      u.full_name as author_name,
      u.email as author_email
    FROM knowledge_articles ka
    LEFT JOIN admin_users au ON ka.created_by = au.id
    LEFT JOIN users u ON au.user_id = u.id
    WHERE ka.slug = $1
  `;

  const rows = await query<DBKnowledgeArticle & {
    author_id?: string;
    author_name?: string;
    author_email?: string;
  }>(sql, [slug]);

  return rows.length > 0 ? toDomainModel(rows[0]) : null;
}

/**
 * Create a new article
 */
export async function createArticle(
  data: CreateArticleInput,
  createdBy: string
): Promise<KnowledgeArticle> {
  // Generate slug from title
  const slug = generateSlug(data.title);

  const sql = `
    INSERT INTO knowledge_articles (
      title, slug, content, summary, category, tags, language, status, created_by
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9
    )
    RETURNING
      id, title, slug, content, summary, category, tags, language, status,
      view_count, helpful_count, created_by, published_at, created_at, updated_at
  `;

  const params = [
    data.title,
    slug,
    data.content,
    data.summary || null,
    data.category || null,
    data.tags || [],
    data.language || 'de',
    data.status || 'draft',
    createdBy,
  ];

  const rows = await query<DBKnowledgeArticle>(sql, params);
  return toDomainModel(rows[0]);
}

/**
 * Update an article by ID
 * Only updates fields that are provided in the input
 */
export async function updateArticle(
  id: string,
  data: UpdateArticleInput
): Promise<KnowledgeArticle | null> {
  const setClauses: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  // Build dynamic SET clause for each provided field
  const fieldMappings: Array<{ key: keyof UpdateArticleInput; column: string }> = [
    { key: 'title', column: 'title' },
    { key: 'content', column: 'content' },
    { key: 'summary', column: 'summary' },
    { key: 'category', column: 'category' },
    { key: 'tags', column: 'tags' },
    { key: 'language', column: 'language' },
    { key: 'status', column: 'status' },
  ];

  for (const { key, column } of fieldMappings) {
    if (data[key] !== undefined) {
      setClauses.push(`${column} = $${paramIndex++}`);
      params.push(data[key]);
    }
  }

  // If title is updated, regenerate slug
  if (data.title !== undefined) {
    setClauses.push(`slug = $${paramIndex++}`);
    params.push(generateSlug(data.title));
  }

  if (setClauses.length === 0) {
    // No fields to update, return current article
    return getArticleById(id);
  }

  // The updated_at trigger will automatically update the timestamp

  params.push(id);
  const sql = `
    UPDATE knowledge_articles
    SET ${setClauses.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING
      id, title, slug, content, summary, category, tags, language, status,
      view_count, helpful_count, created_by, published_at, created_at, updated_at
  `;

  const rows = await query<DBKnowledgeArticle>(sql, params);
  return rows.length > 0 ? toDomainModel(rows[0]) : null;
}

/**
 * Delete an article by ID (hard delete)
 * Returns true if the article was deleted, false if it was not found
 */
export async function deleteArticle(id: string): Promise<boolean> {
  const sql = `DELETE FROM knowledge_articles WHERE id = $1`;
  const result = await execute(sql, [id]);
  return (result.rowCount ?? 0) > 0;
}

/**
 * Publish an article
 * Sets status to published and sets published_at timestamp
 */
export async function publishArticle(id: string): Promise<KnowledgeArticle | null> {
  const sql = `
    UPDATE knowledge_articles
    SET status = 'published', published_at = NOW()
    WHERE id = $1
    RETURNING
      id, title, slug, content, summary, category, tags, language, status,
      view_count, helpful_count, created_by, published_at, created_at, updated_at
  `;

  const rows = await query<DBKnowledgeArticle>(sql, [id]);
  return rows.length > 0 ? toDomainModel(rows[0]) : null;
}

/**
 * Archive an article
 * Sets status to archived
 */
export async function archiveArticle(id: string): Promise<KnowledgeArticle | null> {
  const sql = `
    UPDATE knowledge_articles
    SET status = 'archived'
    WHERE id = $1
    RETURNING
      id, title, slug, content, summary, category, tags, language, status,
      view_count, helpful_count, created_by, published_at, created_at, updated_at
  `;

  const rows = await query<DBKnowledgeArticle>(sql, [id]);
  return rows.length > 0 ? toDomainModel(rows[0]) : null;
}

/**
 * Increment view count for an article
 */
export async function incrementViewCount(id: string): Promise<void> {
  const sql = `
    UPDATE knowledge_articles
    SET view_count = view_count + 1
    WHERE id = $1
  `;

  await execute(sql, [id]);
}

/**
 * Increment helpful count (user found it helpful)
 */
export async function incrementHelpfulCount(id: string): Promise<void> {
  const sql = `
    UPDATE knowledge_articles
    SET helpful_count = helpful_count + 1
    WHERE id = $1
  `;

  await execute(sql, [id]);
}

/**
 * Search articles by query (title and content)
 */
export async function searchArticles(
  searchQuery: string,
  limit: number = 50
): Promise<KnowledgeArticle[]> {
  // Cap limit at 100
  const safeLimit = Math.min(limit, 100);

  const sql = `
    SELECT
      ka.id, ka.title, ka.slug, ka.content, ka.summary, ka.category,
      ka.tags, ka.language, ka.status, ka.view_count, ka.helpful_count,
      ka.created_by, ka.published_at, ka.created_at, ka.updated_at,
      au.id as author_id,
      u.full_name as author_name,
      u.email as author_email
    FROM knowledge_articles ka
    LEFT JOIN admin_users au ON ka.created_by = au.id
    LEFT JOIN users u ON au.user_id = u.id
    WHERE (ka.title ILIKE $1 OR ka.content ILIKE $1)
    ORDER BY ka.view_count DESC, ka.created_at DESC
    LIMIT $2
  `;

  const rows = await query<DBKnowledgeArticle & {
    author_id?: string;
    author_name?: string;
    author_email?: string;
  }>(sql, [`%${searchQuery}%`, safeLimit]);

  return rows.map(toDomainModel);
}

/**
 * Get articles by category
 */
export async function getArticlesByCategory(category: string): Promise<KnowledgeArticle[]> {
  const sql = `
    SELECT
      ka.id, ka.title, ka.slug, ka.content, ka.summary, ka.category,
      ka.tags, ka.language, ka.status, ka.view_count, ka.helpful_count,
      ka.created_by, ka.published_at, ka.created_at, ka.updated_at,
      au.id as author_id,
      u.full_name as author_name,
      u.email as author_email
    FROM knowledge_articles ka
    LEFT JOIN admin_users au ON ka.created_by = au.id
    LEFT JOIN users u ON au.user_id = u.id
    WHERE ka.category = $1 AND ka.status = 'published'
    ORDER BY ka.view_count DESC, ka.created_at DESC
  `;

  const rows = await query<DBKnowledgeArticle & {
    author_id?: string;
    author_name?: string;
    author_email?: string;
  }>(sql, [category]);

  return rows.map(toDomainModel);
}

/**
 * Get unique categories from published articles
 */
export async function getCategories(): Promise<string[]> {
  const sql = `
    SELECT DISTINCT category
    FROM knowledge_articles
    WHERE category IS NOT NULL AND status = 'published'
    ORDER BY category ASC
  `;

  const rows = await query<{ category: string }>(sql);
  return rows.map(row => row.category);
}
