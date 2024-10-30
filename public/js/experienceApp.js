/**
 * ExpApp module serves as the main entry point into the application.
 * It initializes and manages the DaVinci configuration settings needed
 * for application flow.
 */
const ExpApp = (function () {
  let davinciConfig;

  /**
   * Initializes the DaVinci configuration with necessary parameters.
   * This function must be called before using the configuration.
   * @param {string} flowUrl - The URL of the DaVinci flow.
   * @param {string} companyId - The unique identifier for the company.
   * @param {string} policyId - The policy identifier associated with the flow.
   * @param {string} accessToken - The access token for authorization.
   */
  const init = (flowUrl, companyId, policyId, accessToken) => {
    davinciConfig = {
      flowUrl: flowUrl,
      companyId: companyId,
      policyId: policyId,
      accessToken: accessToken
    };
    
    initializeSidebarsAndConfig();
  };

  /**
   * Retrieves the current DaVinci configuration settings.
   * @returns {Object} The DaVinci configuration object containing `flowUrl`, `companyId`, `policyId`, and `accessToken`.
   */
  const getDavinciConfig = () => davinciConfig;

  return {
    init: init,
    getDavinciConfig: getDavinciConfig
  };
})();
