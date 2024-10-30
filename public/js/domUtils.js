// domUtils.js

/**
 * Utility functions to dynamically create and manage DOM elements for various UI components,
 * such as form inputs, toggles, social login sections, color pickers, and numeric steppers.
 */
const DomUtils = (function () {
  /**
   * Creates a label element for a given option.
   * @param {Object} option - The option object containing label and id information.
   * @param {string} option.label - The text to be displayed in the label.
   * @param {string} option.id - The id of the input element associated with the label.
   * @param {string} [option.width] - Optional width for the label.
   * @returns {HTMLElement} The label element.
   */
  const createLabel = (option) => {
    const label = document.createElement("label");
    label.textContent = option.label;
    label.classList.add("form-label");
    label.setAttribute("for", option.id);
    if (option.width) label.style.width = option.width;
    return label;
  };

  /**
   * Creates a heading element for a given option.
   * @param {Object} option - The option object containing label information.
   * @param {string} option.label - The text to be displayed in the heading.
   * @returns {HTMLElement} The heading element.
   */
  const buildHeading = (option) => {
    const heading = document.createElement("h5");
    heading.textContent = option.label;
    heading.classList.add("section-heading", "my-3");
    return heading;
  };

  /**
   * Creates a text input field with an associated label.
   * @param {Object} option - The option object containing input properties.
   * @param {string} option.id - The id for the input element.
   * @param {string} [option.placeholder] - The placeholder text for the input.
   * @param {string} [option.defaultValue] - The default value for the input field.
   * @returns {HTMLElement} A wrapper div containing the label and input field.
   */
  const buildInputOption = (option) => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("mb-3");

    const input = document.createElement("input");
    input.type = "text";
    input.id = option.id;
    input.placeholder = option.placeholder || "";
    input.value = option.defaultValue || "";
    input.classList.add("form-control");

    wrapper.appendChild(createLabel(option));
    wrapper.appendChild(input);

    return wrapper;
  };

  /**
   * Creates a dropdown (select) element with an associated label.
   * @param {Object} option - The option object containing select properties.
   * @param {string} option.id - The id for the select element.
   * @param {Array<Object>} option.options - The array of options for the select element.
   * @param {string} [option.defaultValue] - The default selected value for the select.
   * @returns {HTMLElement} A wrapper div containing the label and select dropdown.
   */
  const buildSelectOption = (option) => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("mb-3");

    const select = document.createElement("select");
    select.classList.add("form-select");
    select.id = option.id;

    option.options.forEach((opt) => {
      const optionElement = document.createElement("option");
      optionElement.value = opt.value;
      optionElement.textContent = opt.text;
      if (opt.value === option.defaultValue) optionElement.selected = true;
      select.appendChild(optionElement);
    });

    wrapper.appendChild(createLabel(option));
    wrapper.appendChild(select);

    return wrapper;
  };

  /**
   * Creates a toggle (checkbox) element with an associated label.
   * @param {Object} option - The option object containing toggle properties.
   * @param {string} option.id - The id for the toggle element.
   * @param {boolean} [option.defaultValue] - The default checked state for the toggle.
   * @returns {HTMLElement} A wrapper div containing the toggle switch and label.
   */
  const buildToggleOption = (option) => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("mb-3");

    const toggleWrapper = document.createElement("div");
    toggleWrapper.classList.add("form-check", "form-switch");

    const toggle = document.createElement("input");
    toggle.type = "checkbox";
    toggle.id = option.id;
    toggle.classList.add("form-check-input");
    toggle.checked = option.defaultValue || false;

    toggleWrapper.appendChild(toggle);
    toggleWrapper.appendChild(createLabel(option));

    wrapper.appendChild(toggleWrapper);

    return wrapper;
  };

  /**
   * Creates a section for social login options, each with a logo, name, and toggle switch.
   * @param {Object} option - The option object containing social login properties.
   * @param {Array<Object>} option.providers - The array of social login providers.
   * @returns {HTMLElement} A wrapper div containing the social login section.
   */
  const buildSocialLoginOption = (option) => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("mb-3");

    wrapper.appendChild(createLabel(option));

    const socialLoginContainer = document.createElement("div");
    socialLoginContainer.classList.add(
      "social-login-container",
      "d-flex",
      "flex-wrap",
      "gap-3"
    );

    option.providers.forEach((provider) => {
      const providerWrapper = document.createElement("div");
      providerWrapper.classList.add(
        "social-login-box",
        "text-center",
      );

      const logo = document.createElement("img");
      logo.src = provider.logoUrl;
      logo.alt = `${provider.name} Logo`;
      logo.classList.add("social-logo", "mb-2");

      const providerLabel = document.createElement("h6");
      providerLabel.textContent = provider.name;

      const toggleWrapper = document.createElement("div");
      toggleWrapper.classList.add(
        "form-check",
        "form-switch",
        "d-flex",
        "justify-content-center"
      );

      const providerToggle = document.createElement("input");
      providerToggle.type = "checkbox";
      providerToggle.id = provider.id;
      providerToggle.classList.add("form-check-input");
      providerToggle.checked = provider.defaultValue || false;

      toggleWrapper.appendChild(providerToggle);
      providerWrapper.appendChild(logo);
      providerWrapper.appendChild(providerLabel);
      providerWrapper.appendChild(toggleWrapper);

      socialLoginContainer.appendChild(providerWrapper);
    });

    wrapper.appendChild(socialLoginContainer);

    return wrapper;
  };

  /**
   * Creates a color input field with an associated label.
   * @param {Object} option - The option object containing color input properties.
   * @param {string} option.id - The id for the color input element.
   * @param {string} [option.defaultValue] - The default color value (in HEX or RGB).
   * @returns {HTMLElement} A wrapper div containing the label and color input field.
   */
  const buildColorOption = (option) => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("d-flex", "mb-3", "align-items-center");

    const colorInput = document.createElement("input");
    colorInput.type = "color";
    colorInput.id = option.id;
    colorInput.value = option.defaultValue || "#000000";
    colorInput.classList.add("form-control-color");

    wrapper.appendChild(createLabel(option));
    wrapper.appendChild(colorInput);

    return wrapper;
  };

  /**
   * Creates a numeric input field with a label and stepper controls.
   * @param {Object} option - The option object containing numeric input properties.
   * @param {string} option.id - The id for the numeric input element.
   * @param {string} option.label - The label text to be displayed.
   * @param {number} [option.min=0] - The minimum value.
   * @param {number} [option.max=100] - The maximum value.
   * @param {number} [option.step=1] - The step value.
   * @param {number} [option.defaultValue=0] - The default value.
   * @returns {HTMLElement} A wrapper div containing the label and numeric stepper input.
   */
  const buildNumericStepperOption = (option) => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("d-flex", "mb-3", "align-items-center");

    const label = createLabel(option);
    wrapper.appendChild(label);

    const numericInput = document.createElement("input");
    numericInput.type = "number";
    numericInput.id = option.id;
    numericInput.min = option.min || 0;
    numericInput.max = option.max || 100;
    numericInput.step = option.step || 1;
    numericInput.value = option.defaultValue || option.min || 0;
    numericInput.classList.add("form-control", "form-control-stepper");

    wrapper.appendChild(numericInput);

    return wrapper;
  };

  /**
   * Builds a header element for an accordion with toggle functionality.
   * @param {number} index - The index of the accordion section.
   * @param {Object} option - The option object containing header properties.
   * @param {string} option.label - The label text for the accordion header.
   * @param {string} collapseId - The ID for the collapse section.
   * @param {string} sidebarId - The unique ID for the sidebar.
   * @returns {HTMLElement} The header element for the accordion.
   */
  const buildAccordionHeader = (index, option, collapseId, sidebarId) => {
    const headerId = `${sidebarId}-heading-${index}`;

    const header = document.createElement('h2');
    header.classList.add('accordion-header', 'custom-accordion-header');
    header.id = headerId;

    const button = document.createElement('button');
    button.classList.add('accordion-button');
    button.type = 'button';
    button.setAttribute('data-bs-toggle', 'collapse');
    button.setAttribute('data-bs-target', `#${collapseId}`);
    button.setAttribute('aria-expanded', option.state === 'expanded' ? 'true' : 'false');
    button.setAttribute('aria-controls', collapseId);
    button.textContent = option.label;

    header.appendChild(button);

    return header;
  };

  return {
    createLabel,
    buildHeading,
    buildInputOption,
    buildSelectOption,
    buildToggleOption,
    buildSocialLoginOption,
    buildColorOption,
    buildNumericStepperOption,
    buildAccordionHeader,
  };
})();
