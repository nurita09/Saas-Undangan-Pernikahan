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

describe('resolveSubdomainSlug dengan VITE_BASE_DOMAIN (root domain 3 label)', () => {
  // BASE_DOMAIN dibaca saat modul dimuat, jadi tiap kasus memuat ulang modul
  // dengan env yang sudah di-stub.
  async function loadWithBase(base: string) {
    vi.stubEnv('VITE_BASE_DOMAIN', base);
    vi.resetModules();
    const module = await import('./subdomain');
    return module.resolveSubdomainSlug;
  }

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('root domain & www/admin bukan tenant', async () => {
    const resolve = await loadWithBase('undangan.nurita.id');
    expect(resolve('undangan.nurita.id')).toBeNull();
    expect(resolve('www.undangan.nurita.id')).toBeNull();
    expect(resolve('admin.undangan.nurita.id')).toBeNull();
  });

  it('satu label di depan base = slug tenant', async () => {
    const resolve = await loadWithBase('undangan.nurita.id');
    expect(resolve('ivan-aura.undangan.nurita.id')).toBe('ivan-aura');
    expect(resolve('Demo-Jawa.undangan.nurita.id')).toBe('demo-jawa');
  });

  it('subdomain dalam (2 label) ditolak; host di luar base pakai heuristik', async () => {
    const resolve = await loadWithBase('undangan.nurita.id');
    expect(resolve('a.b.undangan.nurita.id')).toBeNull();
    expect(resolve('ivan-aura.localhost')).toBe('ivan-aura');
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
