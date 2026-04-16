/* =========================
   FORM VALIDATION HELPERS
========================= */

function isValidImageUrl(url) {
  const trimmedUrl = url.trim();

  if (trimmedUrl === '') {
    return true;
  }

  return trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://');
}

function isValidNotesLength(notes, maxLength = 180) {
  return notes.trim().length <= maxLength;
}

function validateLibraryGameForm(formData) {
  const errors = {};

  if (!formData.title || formData.title.trim() === '') {
    errors.title = 'Game title is required.';
  }

  if (!formData.status || formData.status.trim() === '') {
    errors.status = 'Please select a status.';
  }

  if (!formData.platform || formData.platform.trim() === '') {
    errors.platform = 'Please select a platform.';
  }

  if (!formData.priority || formData.priority.trim() === '') {
    errors.priority = 'Please select a priority.';
  }

  if (!isValidImageUrl(formData.cover || '')) {
    errors.cover = 'Please enter a valid image URL.';
  }

  if (!isValidNotesLength(formData.notes || '')) {
    errors.notes = 'Notes must be 180 characters or fewer.';
  }

  if (formData.completedDate && formData.status !== 'Completed') {
    errors.completedDate = 'Completion date should only be set for completed games.';
  }

  return errors;
}