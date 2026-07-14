import { afterEach, describe, expect, it, vi } from 'vitest';
import { resolveSubdomainSlug, buildInviteUrl, buildEditUrl } from './subdomain';

// buildInviteUrl/buildEditUrl membaca window.location -- di environment node
// (tanpa DOM) kita stub window seperlunya per test.
function stubLocation(href: string) {
  const url = new URL(href);
  vi.stubGlobal('window', {
    location: { protocol: url.protocol, hostname: url.hostname, port: url.port },
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('resolveSubdomainSlug', () => {
  it('mengambil label pertama dari domain 3 label', () => {
    expect(resolveSubdomainSlug('ivan-aura.domainapapun.com')).toBe('ivan-aura');
  });

  it('root domain 2 label bukan tenant', () => {
    expect(resolveSubdomainSlug('domainapapun.com')).toBeNull();
  });

  it('.localhost root-nya 1 label (dev)', () => {
    expect(resolveSubdomainSlug('ivan-aura.localhost')).toBe('ivan-aura');
    expect(resolveSubdomainSlug('localhost')).toBeNull();
  });

  it('www dan admin bukan tenant', () => {
    expect(resolveSubdomainSlug('www.domainapapun.com')).toBeNull();
    expect(resolveSubdomainSlug('admin.domainapapun.com')).toBeNull();
    expect(resolveSubdomainSlug('www.localhost')).toBeNull();
  });

  it('slug dinormalkan ke lowercase', () => {
    expect(resolveSubdomainSlug('Ivan-Aura.domainapapun.com')).toBe('ivan-aura');
  });
});

describe('buildInviteUrl', () => {
  it('menyusun URL undangan dari lokasi admin saat ini (dev, dengan port)', () => {
    stubLocation('http://localhost:5173/');
    expect(buildInviteUrl('ivan-aura')).toBe('http://ivan-aura.localhost:5173');
  });

  it('membuang prefix www/admin dari host', () => {
    stubLocation('https://admin.domainapapun.com/');
    expect(buildInviteUrl('ivan-aura')).toBe('https://ivan-aura.domainapapun.com');
  });
});

describe('buildEditUrl', () => {
  it('menaruh token di fragment (bukan query) supaya tidak dikirim ke server', () => {
    stubLocation('http://localhost:5173/');
    expect(buildEditUrl('ivan-aura', 'tok-123')).toBe(
      'http://ivan-aura.localhost:5173/edit#token=tok-123',
    );
  });
});
