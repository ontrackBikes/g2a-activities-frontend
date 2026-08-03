export function showError(element, message) {
  element.innerHTML = `
    <div class="g2a-widget-error">
      ${message}
    </div>
  `;
}