/**
 * Database Mocks for Testing
 */

export const mockPool = {
  query: jest.fn(),
  connect: jest.fn(),
  end: jest.fn(),
  on: jest.fn(),
  totalCount: 10,
  idleCount: 5,
  waitingCount: 0,
};

export const mockClient = {
  query: jest.fn(),
  release: jest.fn(),
};

export const mockQueryResult = {
  rows: [
    { id: 1, name: 'Test Row 1' },
    { id: 2, name: 'Test Row 2' },
  ],
  rowCount: 2,
  command: 'SELECT',
  oid: 0,
  fields: [],
};

export const mockTableListResult = {
  rows: [
    {
      schemaname: 'public',
      tablename: 'users',
      tableowner: 'postgres',
    },
    {
      schemaname: 'public',
      tablename: 'videos',
      tableowner: 'postgres',
    },
    {
      schemaname: 'public',
      tablename: 'test_mcp',
      tableowner: 'postgres',
    },
  ],
  rowCount: 3,
};

export const mockTableDescriptionResult = {
  rows: [
    {
      column_name: 'id',
      data_type: 'integer',
      is_nullable: 'NO',
      column_default: "nextval('users_id_seq'::regclass)",
    },
    {
      column_name: 'name',
      data_type: 'character varying',
      is_nullable: 'NO',
      column_default: null,
    },
    {
      column_name: 'email',
      data_type: 'character varying',
      is_nullable: 'YES',
      column_default: null,
    },
  ],
  rowCount: 3,
};

/**
 * Reset all database mocks
 */
export function resetDatabaseMocks() {
  mockPool.query.mockReset();
  mockPool.connect.mockReset();
  mockPool.end.mockReset();
  mockClient.query.mockReset();
  mockClient.release.mockReset();
}

/**
 * Setup successful database connection mock
 */
export function mockSuccessfulConnection() {
  mockPool.connect.mockResolvedValue(mockClient);
  mockClient.query.mockResolvedValue(mockQueryResult);
}

/**
 * Setup failed database connection mock
 */
export function mockFailedConnection() {
  mockPool.connect.mockRejectedValue(new Error('Connection failed'));
}

/**
 * Setup query timeout mock
 */
export function mockQueryTimeout() {
  mockClient.query.mockRejectedValue(new Error('Query timeout'));
}
