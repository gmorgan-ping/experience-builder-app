let successModal;

const initializeSuccessModal = () => {
   const modalElement = document.getElementById('successModal');
   successModal = new bootstrap.Modal(modalElement);
  
   // Add button handlers
  document.getElementById('restartExperienceButton').addEventListener('click', restartExperienceHandler);
  document.getElementById('viewConfigurationButton').addEventListener('click', viewConfigurationHandler);
  
}

const showSuccessModal = () => {
  successModal.show();
}

const restartExperienceHandler = () => {
  handleFormChange();
  successModal.hide();
}

const viewConfigurationHandler = () => {
  successModal.hide();
  showExperienceConfigModal();
}

