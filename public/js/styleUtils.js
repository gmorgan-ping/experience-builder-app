/**
 * Converts a HEX color to RGB format.
 * @param {string} hex - The hex color value (e.g., '#ff0000' or 'ff0000').
 * @returns {string} The RGB color value in the format 'rgb(r, g, b)'.
 */
const hexToRgb = (hex) => {
  // Remove the leading '#' if it's present
  hex = hex.replace(/^#/, '');

  // Parse the hex values into RGB components
  let r, g, b;

  if (hex.length === 3) {
    // Handle shorthand hex values (e.g., '#f00')
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 6) {
    // Handle full-length hex values (e.g., '#ff0000')
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else {
    throw new Error('Invalid HEX color format.');
  }

  return `${r}, ${g}, ${b}`;
};

/**
 * Retrieves the value from the DOM element by ID and converts it to RGB if it's a color.
 * @param {string} id - The id of the element to get the value from.
 * @returns {string} The value of the element in RGB if it's a color input, or the value as-is.
 */
const getValueFor = (id) => {
  const element = document.getElementById(id);
  if (element) {
    const value = element.value; // Get the value from the element

    // If it's a color input, convert HEX to RGB
    if (element.type === 'color') {
      return hexToRgb(value); // Convert hex to RGB
    }
    return value; 
  }
  return '';
};

const buildCSSFromForm = () => {

  let style = `
  
:root {
    /********************************************************
    * CARD BODY
    *********************************************************/
    --card-background-color: rgb(${getValueFor('formBackgroundColor')});
    --card-shadow-color: rgba(121, 128, 135, .35);

    /********************************************************
    * BODY
    *********************************************************/
    --body-font-family: ${getValueFor('fontfamily')};
    --body-font-size: 0.935rem;

    /********************************************************
    * TEXT FONT COLORS
    *********************************************************/

    /*  PRIMARY FONT COLOR (RGB) */
    --text-color-primary: ${getValueFor('primaryTextColor')};

    /* HEADING FONT COLR (RBG) */
    --heading-text-color: ${getValueFor('headingColor')};
      
    /*  MUTED TEXT ALPHA  */
    --text-color-muted-apha: 0.75;

    /*  ERROR FONT COLOR  */
    --text-color-error: rgb(${getValueFor('errorColor')});

    /********************************************************
    * BUTTON ATTRIBUTES
    *********************************************************/

    /*  BUTTON FONT COLOR  */
    --button-primary-text-color: rgb(${getValueFor('buttonTextColor')});

    /*  BUTTON BACKGROUND COLOR (RGB)  */
    --button-primary-background-color: ${getValueFor('buttonBackgroundColor')};
    
    /* LINK BUTTON FONT COLOR (RGB)  */
    --link-button-primary-color: ${getValueFor('linkButtonColor')};

    /* BUTTON BORDER RADIUS */
    --button-primary-border-radius: ${getValueFor('formControlBorderRadius')}px;

    /*  BUTTON HOVER ALPHA  */
    --button-hover-alpha: 0.70;

    /*  BUTTON ACTIVE ALPHA  */
    --button-active-alpha: 0.80;

    /*  BUTTON DISABLED ALPHA  */
    --button-disabled-alpha: 0.65;

    --button-primary-disabled-background-color: 39, 123, 165;
    --button-primary-disabled-text-color: 255, 255, 255;

    /********************************************************
     * FORM CONTROLS
     *********************************************************/
    --form-control-border-radius: ${getValueFor('formControlBorderRadius')}px;
    --card-body-border-radius: ${getValueFor('cardBorderRadius')}px;
    --focus-highlight-color: ${getValueFor('buttonBackgroundColor')};

    /********************************************************
    * ACTIVITY INDICATOR & BUTTON SPINNER COLOR
    *********************************************************/

    --activity-indicator-color: rgb(68, 98, 237);

    --polling-indicator-color: rgb(68, 98, 237);

    /********************************************************
    * APPLYING TEXT COLOR - DO NOT CHANGE
    *********************************************************/
    /* H1,H2, H3, Body text color */
    --bs-body-color: rgb(var(--text-color-main)) !important;
    --bs-danger-rgb: var(--text-color-error);
  }

  
  
/********************************************************
* CLASSES BELOW ARE DERIVED FROM VALUES ABOVE
* DO NOT CHANGE UNLESS YOU HAVE CSS 'SKILLZ' :)
*********************************************************/


/*  BACKGROUND IMAGE  */
div.bg-light {
  background-image:       var(--background-image-url);
  background-size:        cover;
  background-repeat:      no-repeat;
}

/*  HEADING TEXT  */
h1, h2, h3, h4 {
  color: rgb(var(--heading-text-color)) !important;
}

/*  BODY FONT & COLOR  */
.card-body {
  /*  font family */
  font-family: var(--body-font-family) !important;
  /*  font size */
  font-size: var(--body-font-size) !important;
  /*  font color */
  color: rgb(var(--text-color-primary)) !important;
  /*  background color */
  background-color: var(--card-background-color) !important;
}

/*  MUTED PARAGRAPH  */
.end-user-nano p.text-muted {
  color: rgba(var(--text-color-primary), var(--text-color-muted-apha)) !important;
}

/*  ERROR MESSAGE PARAGRAPH  */
.card .text-danger {
  color: var(--text-color-error) !important;
}

/*  FORM CONTROL FONT COLOR  */
.form-control,
.form-control:focus {
  color: var(--text-color-primary) !important;
  border-radius: var(--form-control-border-radius) !important;
}

/*  FORM CONTROL PLACEHOLDER FONT COLOR  */
.form-floating input+label {
  color: rgba(var(--text-color-primary), var(--text-color-muted-apha)) !important;
}

/*  FORM CONTROL HIGHLIGHT  */
.end-user-nano .form-control:focus {
  border-color: rgba(var(--focus-highlight-color), .5) !important;
  box-shadow: 0 0 0 0.25rem rgba(var(--focus-highlight-color), 0.25) !important;
}

/*  PRIMARY BUTTON  */
.end-user-nano .btn-primary {
  /*  font color  */
  --bs-btn-color: var(--button-primary-text-color) !important;
  /*  font color when hovering  */
  --bs-btn-hover-color: var(--button-primary-text-color) !important;
  /*  border color  */
  --bs-btn-border-color: var(--button-primary-background-color) !important;
  /*  background color  */
  --bs-btn-bg: rgb(var(--button-primary-background-color)) !important;
  /*  background color when hovering  */
  --bs-btn-hover-bg: rgba(var(--button-primary-background-color), var(--button-hover-alpha)) !important;
  /*  background color when active  */
  --bs-btn-active-bg: rgba(var(--button-primary-background-color), var(--button-active-alpha)) !important;
  /*  background color when disabled  */
  --bs-btn-disabled-bg: rgba(var(--button-primary-background-color), var(--button-disabled-alpha)) !important;
  background-color: rgb(var(--button-primary-background-color)) !important;
  border-color: rgb(var(--button-primary-background-color)) !important;
  color: var(--button-primary-text-color) !important;
  border-radius: var(--button-primary-border-radius);
}


.btn-primary:hover {
  background-color: rgba(var(--button-primary-background-color), var(--button-hover-alpha)) !important;
  border-color: rgba(var(--button-primary-background-color), var(--button-hover-alpha)) !important;
  color: var(--button-primary-text-color) !important;
}

/*  LINK BUTTON  */
.btn-link {
  /*  button font color  */
  --bs-btn-color: rgb(var(--link-button-primary-color)) !important;
  /*  button font color when active  */
  --bs-btn-active-color: rgba(var(--link-button-primary-color), var(--button-active-alpha)) !important;
  /*  button font color when hovering  */
  --bs-btn-hover-color: rgba(var(--link-button-primary-color), var(--button-hover-alpha)) !important;
  /*  button font color when disabled  */
  --bs-btn-disabled-color: rgba(var(--link-button-primary-color), var(--button-disabled-alpha)) !important;
  color: rgb(var(--link-button-primary-color)) !important;
}

/* DISABLED BUTTON */
.btn:disabled, .btn.disabled, fieldset:disabled .btn {
	color: rgb(var(--button-primary-disabled-text-color)) !important;
	background-color: rgba(var(--button-primary-background-color), .8) !important;
	border-color: rgb(var(--button-primary-disabled-background-color)) !important;
	/* opacity: var(--bs-btn-disabled-opacity); */
}

/*  POLLING INDICATORS  */
.css-11k6vsm,
.css-17zi2ag,
.css-139roxj {
  /* width: 20px; */
  /* height: 20px; */
  /* animation-duration: 0.75s; */
  /*  circle background color  */
  background-color: var(--polling-indicator-color) !important;
}

/*  BUTTON ACTIVITY INDICATOR, PROGRESS SPINNER  */
.css-sw2ho0 {
  /*  spinning circle color  */
  --primary-color: var(--activity-indicator-color) !important;
}

/* PROGRESS SPINNER */
.spinner-color {
  color: var(--polling-indicator-color) !important;
}

.card-body.p-5.d-flex.flex-column {
  border-radius: var(--card-body-border-radius);
}

.card.shadow.mb-5 {
  border-radius: var(--card-body-border-radius);
  box-shadow: 1px 1px 3px 1px var(--card-shadow-color) !important;
}


  `;

  // console.log(style)

  return style;
}
