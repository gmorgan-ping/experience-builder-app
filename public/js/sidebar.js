// js/sidebar.js

/**
 * Handles form changes, collects the config data from both sidebars, and updates the widget.
 */
const handleFormChange = () => {
  const flowConfig = buildConfigFromForm(experienceOptions, brandingOptions);
  const wrappedObject = { configObject: flowConfig };
   // Update the widget with the new configuration
  loadwidget(wrappedObject);
}

/**
 * Initializes the sidebars, sets up change event handlers, and loads the initial configuration.
 */
const initializeSidebarsAndConfig = () => {
  initializeSidebars(handleFormChange); 
   // Load the initial configuration when the page loads
  handleFormChange();
  initializeConfigModal();
  initializeSuccessModal();
  initializeExperiencesModal()
  
  document.getElementById('refreshBtn').addEventListener('click', function () {
      handleFormChange();
  });
}

/**
 * Initializes the sidebars and attaches the change event handler.
 * Also initializes the sidebar toggle functionality.
 * @param {function} changeHandler - Function to handle changes in form inputs.
 */
const initializeSidebars = (changeHandler) => {
  buildSidebar('dynamicSidebar', experienceOptions); 
  buildSidebar('brandingSidebar', brandingOptions);  

  const leftForm = document.getElementById('dynamicSidebarForm'); 
  const rightForm = document.getElementById('brandingSidebarForm'); 

  // Attach the same change handler to both forms
  leftForm.addEventListener('change', changeHandler);
  rightForm.addEventListener('change', changeHandler);

  // Initialize sidebar toggle buttons
  setupSidebarToggleButtons(); 
}

/**
 * Sets up the toggle buttons to collapse and expand the sidebars.
 */
const setupSidebarToggleButtons = () => {

  const leftToggleBtn = document.getElementById('leftToggleBtn');
  if (leftToggleBtn) {
    leftToggleBtn.addEventListener('click', function () {
      document.body.classList.toggle('collapsed-left');
      updateLeftSidebarIcon();
    });
  }

  const rightToggleBtn = document.getElementById('rightToggleBtn');
  if (rightToggleBtn) {
    rightToggleBtn.addEventListener('click', function () {
      document.body.classList.toggle('collapsed-right');
      updateRightSidebarIcon();
    });
  }
}

/**
 * Updates the icon for the left sidebar toggle button based on the sidebar's state.
 */
const updateLeftSidebarIcon = () => {
  const leftIcon = document.getElementById('leftToggleBtn').querySelector('i');
  if (document.body.classList.contains('collapsed-left')) {
    leftIcon.classList.remove('fa-chevron-left');
    leftIcon.classList.add('fa-chevron-right');
  } else {
    leftIcon.classList.remove('fa-chevron-right');
    leftIcon.classList.add('fa-chevron-left');
  }
}

/**
 * Updates the icon for the right sidebar toggle button based on the sidebar's state.
 */
const updateRightSidebarIcon = () => {
  const rightIcon = document.getElementById('rightToggleBtn').querySelector('i');
  if (document.body.classList.contains('collapsed-right')) {
    rightIcon.classList.remove('fa-chevron-right');
    rightIcon.classList.add('fa-chevron-left');
  } else {
    rightIcon.classList.remove('fa-chevron-left');
    rightIcon.classList.add('fa-chevron-right');
  }
}

/**
 * Builds and renders an accordion-based sidebar for displaying configurable items.
 *
 * Supports 'expanded', 'collapsed', and 'hidden' states. The 'hidden' state hides the entire accordion
 * while still keeping the form elements in the DOM.
 *
 * @param {string} id - The ID of the sidebar container element where the accordion will be rendered.
 * @param {Array} options - An array of configuration options, each representing a heading with nested items.
 */
const buildSidebar = (id, options) => {
  const sidebar = document.getElementById(id);
  sidebar.innerHTML = '';  // Clear existing content

  const accordionId = `${id}-accordion`;  // Unique ID for the accordion
  const accordion = document.createElement('div');
  accordion.id = accordionId;
  accordion.classList.add('accordion');

  options.forEach((option, index) => {
    if (option.type === 'heading') {
      const card = document.createElement('div');
      card.classList.add('accordion-item');

      const collapseId = `${id}-collapse-${index}`;  // Unique collapse ID for each item

      // Use the utility function to build the accordion header
      const header = DomUtils.buildAccordionHeader(index, option, collapseId, id);
      
      // Handle accordion state: expanded, collapsed, or hidden
      const button = header.querySelector('button');

      if (option.state === 'hidden') {
        card.style.display = 'none';  // Hide the entire accordion item if state is 'hidden'
      } else if (option.state === 'expanded') {
        button.setAttribute('aria-expanded', 'true');
      } else {
        button.setAttribute('aria-expanded', 'false');
        button.classList.add('collapsed');  // Add 'collapsed' class when not expanded
      }

      card.appendChild(header);

      // Create the collapsible content
      const collapse = document.createElement('div');
      collapse.id = collapseId;
      collapse.classList.add('accordion-collapse', 'collapse');
      
      // Add 'show' class if the state is expanded
      if (option.state === 'expanded') {
        collapse.classList.add('show');
      }

      collapse.setAttribute('aria-labelledby', header.id);

      const body = document.createElement('div');
      body.classList.add('accordion-body');

      // Iterate over the nested items within this heading and add the appropriate form elements
      option.items.forEach(item => {
        switch (item.type) {
          case 'toggle':
            body.appendChild(DomUtils.buildToggleOption(item));
            break;
          case 'input':
            body.appendChild(DomUtils.buildInputOption(item));
            break;
          case 'select':
            body.appendChild(DomUtils.buildSelectOption(item));
            break;
          case 'socialLogin':
            body.appendChild(DomUtils.buildSocialLoginOption(item));
            break;
          case 'color':
            item.width = "200px";  // Set default width for color picker
            body.appendChild(DomUtils.buildColorOption(item));
            break;
          case 'stepper':
            item.width = "200px";  // Set default width for stepper control
            body.appendChild(DomUtils.buildNumericStepperOption(item));
            break;
          default:
            console.warn(`Unsupported item type: ${item.type}`);
            break;
        }
      });

      collapse.appendChild(body);
      card.appendChild(collapse);
      accordion.appendChild(card);
    }
  });

  sidebar.appendChild(accordion);  // Append the accordion to the sidebar
}

/**
 * Builds the configuration data from the form options of both sidebars.
 * @param {Array} leftOptions - The options from the left sidebar.
 * @param {Array} rightOptions - The options from the right sidebar.
 * @returns {Object} The combined config data from both sidebars.
 */
const buildConfigFromForm = (leftOptions, rightOptions) => {
  const config = {};
  
  let brandingStyles = buildCSSFromForm();

  // Helper function to process each option
  const processOption = (option) => {
    const element = document.getElementById(option.id);

    switch (option.type) {
      case 'socialLogin':
        const socialMapping = option.mapping || 'social';

        option.providers.forEach(provider => {
          const providerElement = document.getElementById(provider.id);
          if (providerElement) {
            const value = providerElement.checked; // Set the value of the toggle (checked/unchecked)
            const pathParts = socialMapping.split('.'); // Respect mapping for social login
            setValueByPath(config, [...pathParts, provider.id], value);
          }
        });
        break;

      case 'input':
      case 'select':
      case 'color':
      case 'stepper':
        if (element && option.mapping) {
          const value = element.value;  // Input or select value
          const pathParts = option.mapping.split('.');
          setValueByPath(config, pathParts, value);
        }
        break;

      case 'toggle':
        if (element && option.mapping) {
          const value = element.checked;  // Checkbox (toggle) state
          const pathParts = option.mapping.split('.');
          setValueByPath(config, pathParts, value);
        }
        break;

      case 'heading':
        // No direct processing, handled in processOptions
        break;

      default:
        console.warn(`Unsupported option type: ${option.type}`);
    }
  };

  // Function to process the options including nested items
  const processOptions = (options) => {
    options.forEach(option => {
      if (option.type === 'heading' && option.items) {
        // If the option is a heading, process its nested items
        option.items.forEach(item => processOption(item));
      } else {
        // If not a heading, process the option directly
        processOption(option);
      }
    });
  };

  // Process both the left and right sidebar options
  processOptions(leftOptions);
  processOptions(rightOptions);
  
  // Add branding styles to config
  if (!config.branding) {
    config.branding = {};
  }
  
  config.branding.style = brandingStyles;
  
  // Sort the config object recursively before returning it
  const sortedConfig = sortObjectRecursively(config);

  return sortedConfig;  
}


/**
 * Recursively sorts the attributes of an object alphabetically, with 'id' key always appearing first.
 * @param {Object} obj - The object to be sorted.
 * @returns {Object} A new object with sorted attributes, with 'id' first if it exists.
 */
function sortObjectRecursively(obj) {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    // Return the value if it's not an object or if it's an array
    return obj; 
  }

  const sortedKeys = Object.keys(obj).sort((a, b) => {
    // Ensure 'id' appears first
    if (a === 'id') return -1;
    if (b === 'id') return 1;
    return a.localeCompare(b); 
  });

  return sortedKeys.reduce((sortedObj, key) => {
    // Recursively sort nested objects
    sortedObj[key] = sortObjectRecursively(obj[key]); 
    return sortedObj;
  }, {});
}

/**
 * Helper function to set values in an object using a path.
 * @param {Object} obj - The target object.
 * @param {Array} pathParts - An array of path segments.
 * @param {*} value - The value to set.
 */
const setValueByPath = (obj, pathParts, value) => {
  const lastKey = pathParts.pop();
  const lastObj = pathParts.reduce((obj, key) => (obj[key] = obj[key] || {}), obj);
  lastObj[lastKey] = value;
}
