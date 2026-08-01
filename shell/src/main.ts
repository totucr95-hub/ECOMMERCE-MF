import { registerRemotes } from '@module-federation/enhanced/runtime';

const bootstrap = async (): Promise<void> => {
  const response = await fetch('/module-federation.manifest.json');

  if (!response.ok) {
    throw new Error(`Unable to load remote manifest: HTTP ${response.status}`);
  }

  const manifest = (await response.json()) as Record<string, unknown>;
  const remotes = Object.entries(manifest).map(([name, entry]) => {
    if (typeof entry !== 'string') {
      throw new Error(`Invalid manifest entry for remote "${name}"`);
    }

    return { name, entry };
  });

  await registerRemotes(remotes);
  await import('./bootstrap');
};

void bootstrap().catch((error: unknown) => {
  console.error('Shell bootstrap failed', error);
});
