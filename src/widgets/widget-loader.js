import registry from "./shared/registry";

async function loadWidgets() {
  const widgets = document.querySelectorAll("[data-widget]");

  for (const element of widgets) {
    const widgetName = element.dataset.widget;

    const widget = registry[widgetName];

    if (!widget) {
      console.warn(
        `Unknown widget: ${widgetName}`
      );
      continue;
    }

    try {
      const module = await widget.loader();

      if (module.mount) {
        await module.mount(element);
      }
    } catch (error) {
      console.error(error);
    }
  }
}

loadWidgets();