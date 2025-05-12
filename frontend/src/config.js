let BACKEND_URL;

if (import.meta.env.DEV) {
  BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
} else {
  BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://aits-group-t-3712bf6213e8.herokuapp.com';
}
export { BACKEND_URL };