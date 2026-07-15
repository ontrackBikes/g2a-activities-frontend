import { createApp } from "vue";

import { showLoading } from "./loading";
import { showError } from "./errors";

export async function mountWidget({
  element,
  component,
  loader,
}) {
  try {
    showLoading(element);

    const props = await loader(element);

    element.innerHTML = "";

    createApp(component, props).mount(element);
  } catch (err) {
    console.error(err);

    showError(element, "Unable to load widget.");
  }
}