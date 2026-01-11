function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function validateRequired(value) {
    return value && value.trim() !== '';
}
function showSuccess(msg) {
    alert('✅ ' + msg);
}
function showError(msg) {
    alert('❌ ' + msg);
}