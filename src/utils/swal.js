import Swal from 'sweetalert2';

export const showSuccessAlert = (title, text) => {
  return Swal.fire({
    title: title || 'Success!',
    text: text || '',
    icon: 'success',
    confirmButtonColor: '#1e3a8a',
    borderRadius: '16px',
    customClass: {
      popup: 'rounded-2xl font-sans',
      confirmButton: 'px-5 py-2.5 rounded-lg font-bold text-sm'
    }
  });
};

export const showErrorAlert = (title, text) => {
  return Swal.fire({
    title: title || 'Error!',
    text: text || '',
    icon: 'error',
    confirmButtonColor: '#dc2626',
    borderRadius: '16px',
    customClass: {
      popup: 'rounded-2xl font-sans',
      confirmButton: 'px-5 py-2.5 rounded-lg font-bold text-sm'
    }
  });
};

export const showInfoAlert = (title, text) => {
  return Swal.fire({
    title: title || 'Information',
    text: text || '',
    icon: 'info',
    confirmButtonColor: '#1e3a8a',
    borderRadius: '16px',
    customClass: {
      popup: 'rounded-2xl font-sans',
      confirmButton: 'px-5 py-2.5 rounded-lg font-bold text-sm'
    }
  });
};

export const showConfirmDialog = async (title, text, confirmButtonText = 'Yes, Proceed') => {
  return Swal.fire({
    title: title || 'Are you sure?',
    text: text || '',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#64748b',
    confirmButtonText: confirmButtonText,
    borderRadius: '16px',
    customClass: {
      popup: 'rounded-2xl font-sans',
      confirmButton: 'px-5 py-2.5 rounded-lg font-bold text-sm',
      cancelButton: 'px-5 py-2.5 rounded-lg font-bold text-sm'
    }
  });
};

export default Swal;
