export const getToken = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token found");
  }
  return token;
};
