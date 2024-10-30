// js/renderDaVinciFlow.js

/**
 * Loads and renders the DaVinci widget.
 * Applies fade-in/fade-out transition when reloading.
 *
 * @param {Object} flowParameters - Parameters to pass into the DaVinci flow.
 */
const loadwidget = (flowParameters) => {
  const widgetElement = document.getElementById("davinci-widget");

  // Fade-out the widget before reloading
  widgetElement.classList.add("hidden");
   

  var props = {
    config: {
      method: "runFlow",
      apiRoot: `${ExpApp.getDavinciConfig().flowUrl}/v1`,
      accessToken: ExpApp.getDavinciConfig().accessToken,
      companyId: ExpApp.getDavinciConfig().companyId,
      policyId: ExpApp.getDavinciConfig().policyId,
      parameters: flowParameters,
    },
    useModal: false,
    successCallback,
    errorCallback,
    onCloseModal,
  };

  // Render the DaVinci widget
  davinci.skRenderScreen(widgetElement, props);

  // Fade-in the widget after rendering
  widgetElement.classList.remove("hidden");
};

/**
 * Success callback for DaVinci flow.
 * @param {Object} response - The success response returned by the DaVinci flow.
 */
const successCallback = (response) => {
  showSuccessModal();
};

/**
 * Error callback for DaVinci flow.
 * @param {Object} error - The error returned by the DaVinci flow.
 */
const errorCallback = (error) => {
  console.log(error);
};

/**
 * Callback when the DaVinci modal is closed.
 */
const onCloseModal = () => {
  console.log("onCloseModal");
};
