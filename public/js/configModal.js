let editor;
let modal;

/**
 * Initializes the modal and CodeMirror for displaying configuration data.
 */
function initializeConfigModal() {
  const modalElement = document.getElementById('configModal');
  modal = new bootstrap.Modal(modalElement);

  // Initialize CodeMirror
  editor = CodeMirror.fromTextArea(document.getElementById('jsonConfig'), {
    mode: { name: "javascript", json: true },
    lineNumbers: true,
    readOnly: false,
    theme: "default"
  });

  // Set the initial value of the editor
  editor.setValue('{}');

  // Hook into the modal's 'shown' event
  modalElement.addEventListener('shown.bs.modal', function () {
    editor.refresh();
  });

  // Add event listeners
  document.getElementById('configBtn').addEventListener('click', showExperienceConfigModal);
  document.getElementById('updateConfigBtn').addEventListener('click', applyCustomConfig);
  document.getElementById("copyToClipboardBtn").addEventListener("click", copyClipboardHandler);

  document.getElementById('clearEditorBtn').addEventListener('click', () => { editor.setValue(''); editor.focus() });

}

const showExperienceConfigModal = () => {
  // Get the latest config data
  const jsonData = buildConfigFromForm(experienceOptions, brandingOptions);

  // Update the CodeMirror editor with the new JSON configuration
  editor.setValue(JSON.stringify(jsonData, null, 2));

  modal.show();
}

/**
 * Handles copying the content from the CodeMirror editor to the clipboard.
 * Displays a success or error toast depending on the outcome of the clipboard action.
 */
const copyClipboardHandler = () => {
  try {
    // Get the content of the CodeMirror editor
    const codeContent = editor.getValue();

    // Parse the JSON content
    let jsonObject = JSON.parse(codeContent);

    // Check if branding and branding.style exist, and remove branding.style if it does
    // if (jsonObject.branding && jsonObject.branding.style) {
    //   delete jsonObject.branding.style;
    // }

    // Convert the modified object back to a JSON string
    const modifiedContent = JSON.stringify(jsonObject, null, 2); // Pretty print with 2 spaces

    // Copy the modified content to the clipboard using the Clipboard API
    navigator.clipboard.writeText(modifiedContent).then(function () {
      // Show success toast
      var toastElement = document.getElementById('copyToast');
      var toast = new bootstrap.Toast(toastElement);
      toast.show();
    }).catch(function (error) {
      // Show error toast
      var toastElement = document.getElementById('errorToast');
      var toast = new bootstrap.Toast(toastElement);
      toast.show();
    });
  } catch (error) {
    console.error('Invalid JSON format or other error:', error);

    // Show error toast if JSON parsing fails or any other error occurs
    var toastElement = document.getElementById('errorToast');
    var toast = new bootstrap.Toast(toastElement);
    toast.show();
  }
};

/**
 * Recursively flattens a nested object into dot-notation key-value pairs.
 * @param {Object} obj - The object to flatten.
 * @param {string} parent - The parent key (used for recursion).
 * @param {Object} result - The result object that holds the flattened key-value pairs.
 * @returns {Object} A flat object with dot-notation keys.
 */
const flattenObject = (obj, parent = '', result = {}) => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = parent ? `${parent}.${key}` : key; // Dot notation for nested keys

      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        // Recursively flatten for nested objects
        flattenObject(obj[key], newKey, result);
      } else {
        // Add the value to the result for non-object types (string, number, boolean, etc.)
        result[newKey] = obj[key];
      }
    }
  }
  return result;
};

/**
 * Finds the matching item in the options list based on the flattened key (dot notation).
 * @param {string} flattenedKey - The key from the flattened object (e.g., 'accountRecovery.enabled').
 * @param {Array} optionsList - The list of options (e.g., experienceOptions or brandingOptions).
 * @returns {Object|null} The matching option from the list, or null if no match is found.
 */
const findMatchingOption_old = (flattenedKey, optionsList) => {
  let matchingOption = null;

  // Iterate over all options in the options list
  for (const option of optionsList) {
    // Check for a direct match with the 'mapping' attribute
    if (option.mapping === flattenedKey) {
      matchingOption = option;
      break;
    }

    // Special case for 'socialLogin' type: iterate over providers
    if (option.type === 'socialLogin' && option.providers) {
      for (const provider of option.providers) {
        // Construct the dot-notation key for each provider (e.g., 'social.providers.google')
        const providerKey = `${option.mapping}.${provider.id}`;
        if (providerKey === flattenedKey) {
          matchingOption = provider;
          break;
        }
      }
    }

    // Break the outer loop if we found a match
    if (matchingOption) break;
  }

  return matchingOption || null; // Return null if no match is found
};

const findMatchingOption = (flattenedKey, optionsList) => {
  let matchingOption = null;

  for (const option of optionsList) {
    // If the option is a heading, we need to search inside its items
    if (option.type === 'heading' && option.items) {
      // Recursively search inside the items of the heading
      matchingOption = findMatchingOption(flattenedKey, option.items);
      if (matchingOption) break;
    }
    // Check for a direct match with the 'mapping' attribute in non-heading options
    else if (option.mapping === flattenedKey) {
      matchingOption = option;
      break;
    }

    // Special case for 'socialLogin' type: iterate over providers
    if (option.type === 'socialLogin' && option.providers) {
      for (const provider of option.providers) {
        // Construct the dot-notation key for each provider (e.g., 'social.providers.google')
        const providerKey = `${option.mapping}.${provider.id}`;
        if (providerKey === flattenedKey) {
          matchingOption = provider;
          break;
        }
      }
    }

    // Break the outer loop if we found a match
    if (matchingOption) break;
  }

  return matchingOption || null; // Return null if no match is found
};

/**
 * Iterates over the flattened config and finds matching items in the options lists.
 * @param {Object} flattenedConfig - The flattened config object with dot-notation keys.
 * @param {Array} experienceOptions - The list of experience options with mappings.
 * @param {Array} brandingOptions - The list of branding options with mappings.
 */
const processFlattenedConfig_old = (flattenedConfig, experienceOptions, brandingOptions) => {
  Object.keys(flattenedConfig).forEach(flattenedKey => {
    const flattenedValue = flattenedConfig[flattenedKey];

    // Try to find the matching option in experienceOptions
    let matchingOption = findMatchingOption(flattenedKey, experienceOptions);

    if (!matchingOption) {
      // If not found in experienceOptions, search in brandingOptions
      matchingOption = findMatchingOption(flattenedKey, brandingOptions);
    }

    if (matchingOption) {
      let element = document.getElementById(matchingOption.id);
      try {
        // Handle toggles
        if (element.type === 'checkbox') {
          element.checked = !!flattenedValue; // Convert value to boolean
        }
        // Handle select dropdowns and text inputs
        else if (element.tagName === 'SELECT' || element.tagName === 'INPUT') {
          element.value = flattenedValue;
        } else {
          console.log("Unhandled element type for ID: " + matchingOption.id);
        }
      } catch (e) {
        console.log("Unable to match item with ID: " + matchingOption.id);
      }
    } else {
      console.log(`No match found for key: ${flattenedKey}`);
    }
  });
};

const processFlattenedConfig = (flattenedConfig, experienceOptions, brandingOptions) => {
  Object.keys(flattenedConfig).forEach(flattenedKey => {
    const flattenedValue = flattenedConfig[flattenedKey];

    // Try to find the matching option in experienceOptions (searching inside headings and items)
    let matchingOption = findMatchingOption(flattenedKey, experienceOptions);

    if (!matchingOption) {
      // If not found in experienceOptions, search in brandingOptions
      matchingOption = findMatchingOption(flattenedKey, brandingOptions);
    }

    if (matchingOption) {
      let element = document.getElementById(matchingOption.id);
      try {
        // Handle toggles (checkbox)
        if (element && element.type === 'checkbox') {
          element.checked = !!flattenedValue; // Convert value to boolean
        }
        // Handle select dropdowns and text inputs
        else if (element && (element.tagName === 'SELECT' || element.tagName === 'INPUT')) {
          element.value = flattenedValue;
        } else {
          console.log("Unhandled element type for ID: " + matchingOption.id);
        }
      } catch (e) {
        console.log("Unable to match item with ID: " + matchingOption.id);
      }
    } else {
      console.log(`No match found for key: ${flattenedKey}`);
    }
  });
};

/**
 * Applies the custom configuration by parsing the JSON from the CodeMirror editor,
 * processing the configuration, and hiding the modal.
 * 
 * This method also flattens the parsed JSON object and removes the 'branding.style' property.
 * If the JSON is invalid, it catches the error and alerts the user.
 * 
 * @throws {Error} If the JSON in the editor is invalid, an error is logged and an alert is shown.
 */
const applyCustomConfig_old = () => {
  const jsonConfig = editor.getValue();
  try {
    const parsedConfig = JSON.parse(jsonConfig);
    const flattenedConfig = flattenObject(parsedConfig);
    delete flattenedConfig['branding.style'];

    processFlattenedConfig(flattenedConfig, experienceOptions, brandingOptions);
    handleFormChange();
    hideModal();
    // Show success toast
    var successToastElement = document.getElementById('successApplyConfigToast');
    var successToast = new bootstrap.Toast(successToastElement);
    successToast.show();

  } catch (error) {
    // Show error toast
    var errorToastElement = document.getElementById('errorApplyConfigToast');
    var errorToast = new bootstrap.Toast(errorToastElement);
    errorToast.show();
  }
}

const applyCustomConfig = () => {
  const jsonConfig = editor.getValue();
  try {
    const parsedConfig = JSON.parse(jsonConfig);
    const flattenedConfig = flattenObject(parsedConfig);

    // Optionally, remove branding.style if not needed for form update
    delete flattenedConfig['branding.style'];

    // Process the flattened configuration and map values to form elements
    processFlattenedConfig(flattenedConfig, experienceOptions, brandingOptions);

    // Call handleFormChange or any other logic to reflect changes in form state
    handleFormChange();

    hideModal();

    // Show success toast
    var successToastElement = document.getElementById('successApplyConfigToast');
    var successToast = new bootstrap.Toast(successToastElement);
    successToast.show();

  } catch (error) {
    console.error('Invalid JSON format:', error);

    // Show error toast if JSON parsing fails
    var errorToastElement = document.getElementById('errorApplyConfigToast');
    var errorToast = new bootstrap.Toast(errorToastElement);
    errorToast.show();
  }
};

