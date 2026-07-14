import { afterEach, describe, expect, it, vi } from 'vitest';
import { readAccessToken } from './token';

function stubLocation({ hash = '', search = '' }: { hash?: string; search?: string }) {
  vi.stubGlobal('window', { location: { hash, search } });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('readAccessToken', () => {
  it('membaca token dari fragment (#token=)', () => {
    stubLocation({ hash: '#token=abc-123' });
    expect(readAccessToken()).toBe('abc-123');
  });

  it('fragment menang atas query string kalau dua-duanya ada', () => {
    stubLocation({ hash: '#token=dari-hash', search: '?token=dari-query' });
    expect(readAccessToken()).toBe('dari-hash');
  });

  it('fallback ke ?token= untuk link lama', () => {
    stubLocation({ search: '?token=token-lama' });
    expect(readAccessToken()).toBe('token-lama');
  });

  it('null kalau tidak ada token sama sekali', () => {
    stubLocation({});
    expect(readAccessToken()).toBeNull();
  });

  it('token ter-encode di fragment di-decode dengan benar', () => {
    stubLocation({ hash: '#token=abc%2D123&x=1' });
    expect(readAccessToken()).toBe('abc-123');
  });
});
