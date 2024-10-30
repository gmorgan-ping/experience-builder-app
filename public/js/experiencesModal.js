let experiencesModal

const initializeExperiencesModal = () => {
  const modalElement = document.getElementById('experienceModal');
  experiencesModal = new bootstrap.Modal(modalElement);
  
  //initialize handlers
  document.getElementById('openExperienceBtn').addEventListener('click', () => {experiencesModal.show()});
  document.getElementById('openExperience').addEventListener('click', loadExperience);
  
}

const loadExperience = () => {
  const experienceName = document.getElementById("experienceSelect").value;
  const experiencePath = `/experience/${experienceName}`;

  fetch(experiencePath)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Loaded JSON data:", data);
      
      const flattenedConfig = flattenObject(data);
      delete flattenedConfig["branding.style"];

      processFlattenedConfig(flattenedConfig, experienceOptions, brandingOptions);
      handleFormChange();
      experiencesModal.hide();
    })
    .catch((error) => {
      console.error("Error loading the JSON file:", error);
    });
};
