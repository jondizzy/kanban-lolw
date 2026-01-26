import AxiosClient from "./Axiosclient";

interface signupParams {
  email: string;
  password: string;
}

interface LoginParams {
  email: string;
  password: string;
}
const authApi = {
  signup: (params: signupParams) => AxiosClient.post("/auth/signup", params),
  login: (params: LoginParams) => AxiosClient.post("/auth/login", params),
  //res.user depends on this. need to check what verify-token returns
  verifyToken: () => AxiosClient.get("/auth/verify-token"),
};

export default authApi;
