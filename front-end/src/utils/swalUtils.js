import Swal from 'sweetalert2';

// Check if dark mode is active
const isDarkMode = () => document.documentElement.classList.contains('dark') || document.body.classList.contains('dark');

const getSwalOptions = (options) => ({
    background: isDarkMode() ? '#1a2c22' : '#ffffff',
    color: isDarkMode() ? '#ffffff' : '#111714',
    confirmButtonColor: '#22c55e', // matches primary
    cancelButtonColor: '#ef4444',
    customClass: {
        popup: 'rounded-2xl border border-gray-200 dark:border-[#2a3c32]',
        title: 'text-xl font-bold',
        htmlContainer: 'text-sm font-medium',
        confirmButton: 'rounded-lg px-6 py-2',
        cancelButton: 'rounded-lg px-6 py-2'
    },
    ...options
});

export const showAlert = (title, text, icon = 'info') => {
    return Swal.fire(getSwalOptions({
        title,
        text,
        icon,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        toast: true,
        position: 'top-end',
    }));
};

export const showSuccess = (title, text) => {
    return showAlert(title, text, 'success');
};

export const showError = (title, text) => {
    return Swal.fire(getSwalOptions({
        title,
        text,
        icon: 'error',
    }));
};

export const showWarning = (title, text) => {
    return Swal.fire(getSwalOptions({
        title,
        text,
        icon: 'warning',
    }));
};

export const showConfirm = (title, text, confirmButtonText = 'Confirm', cancelButtonText = 'Cancel') => {
    return Swal.fire(getSwalOptions({
        title,
        text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText,
        cancelButtonText,
    }));
};

export default Swal;
