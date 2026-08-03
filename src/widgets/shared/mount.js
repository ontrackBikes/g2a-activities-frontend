import { createApp } from "vue";

import { showLoading } from "./loading";
import { showError } from "./errors";

export async function mountWidget({ element, component, loader }) {
  try {
    showLoading(element);

    const props = await loader(element);

    element.innerHTML = "";

    createApp(component, props).mount(element);
  } catch (err) {
    console.error("========== WIDGET ERROR ==========");
    console.error(err);
    console.error(err.stack);

    element.innerHTML = `
    <pre style="color:red;white-space:pre-wrap">
${err.stack || err.message}
    </pre>
  `;
  }
}
