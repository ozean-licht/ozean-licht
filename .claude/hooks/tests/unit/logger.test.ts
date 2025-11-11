/**
 * Unit tests for logger utility
 */

import { logger } from '../../src/utils/logger';

describe('Logger', () => {
  let stderrSpy: jest.SpyInstance;

  beforeEach(() => {
    stderrSpy = jest.spyOn(process.stderr, 'write').mockImplementation(() => true);
  });

  afterEach(() => {
    stderrSpy.mockRestore();
  });

  it('should log info messages', () => {
    logger.info('Test message');
    expect(stderrSpy).toHaveBeenCalled();
    const output = stderrSpy.mock.calls[0][0];
    expect(output).toContain('Test message');
    expect(output).toContain('info');
  });

  it('should log error messages with error object', () => {
    const error = new Error('Test error');
    logger.error('Error occurred', error);
    expect(stderrSpy).toHaveBeenCalled();
    const output = stderrSpy.mock.calls[0][0];
    expect(output).toContain('Error occurred');
    expect(output).toContain('Test error');
  });

  it('should include context in log output', () => {
    logger.info('Message with context', { userId: '123', action: 'test' });
    expect(stderrSpy).toHaveBeenCalled();
    const output = stderrSpy.mock.calls[0][0];
    expect(output).toContain('userId');
    expect(output).toContain('123');
  });

  it('should respect log level', () => {
    logger.setLevel('error');
    logger.debug('Debug message');
    logger.info('Info message');
    logger.error('Error message');

    // Only error should be logged
    expect(stderrSpy).toHaveBeenCalledTimes(1);
    const output = stderrSpy.mock.calls[0][0];
    expect(output).toContain('Error message');
  });
});
