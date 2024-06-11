import './styles/global.css';

import type {} from 'svelte';
import App from './App.svelte';
import { postMessage } from './post-message';
import UnsupportedVersion from './UnsupportedVersion.svelte';
import semver from 'semver';
import { compatibleContractsSemver as compatibleSolidityContractsSemver } from '@openzeppelin/wizard';

function postResize() {
  const { height } = document.documentElement.getBoundingClientRect();
  postMessage({ kind: 'oz-wizard-resize', height });
}

window.onload = postResize;

const resizeObserver = new ResizeObserver(postResize);
resizeObserver.observe(document.body);

const params = new URLSearchParams(window.location.search);

const initialTab = params.get('tab') ?? undefined;
const requestedVersion = params.get('version') ?? undefined;

let app;
if (requestedVersion && !semver.satisfies(requestedVersion, compatibleSolidityContractsSemver)) {
  postMessage({ kind: 'oz-wizard-unsupported-version' });
  app = new UnsupportedVersion({ target: document.body, props: { requestedVersion, compatibleSolidityContractsSemver }});
} else {
  app = new App({ target: document.body, props: { initialTab } });
}

app.$on('tab-change', (e: CustomEvent) => {
  postMessage({ kind: 'oz-wizard-tab-change', tab: e.detail.toLowerCase() });
});

export default app;

