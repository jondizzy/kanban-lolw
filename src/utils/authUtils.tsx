import authApi from "../api/authApi";

const authUtils = {
  isAuthenticated: async () => {
    const token = localStorage.getItem("token");
    if (!token) return false;
    try {
      const res = await authApi.verifyToken();
      //go to authApi.tsx for explanation
      return res.user;
    } catch (err) {
      return false;
    }
  },
};
export default authUtils;
