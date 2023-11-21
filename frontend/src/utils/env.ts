export const env = {
  VITE_API_URL: import.meta.env.VITE_API_URL,
};

if (env.VITE_API_URL === undefined) {
  throw new Error("VITE_API_URL is undefined");
}
