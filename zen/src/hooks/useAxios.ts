import axios from "axios";
import jwt_decode from "jwt-decode";
import store, {
  logout,
  setAccessToken,
  useAppDispatch,
} from "../store/store";
import constants from "@/constants";

const useAxios = () => {
  const appDispatch = useAppDispatch();

  const myAxios = axios.create({
    baseURL: constants.ServerURL,
    timeout: 5000,
    headers: {
      Authorization: `JWT ${store.getState().auth.accessToken}`,
    },
    withCredentials: true,
    validateStatus: () => {
      // don't want axios throwin error on 4xx and 5xx #sorry axios
      return true;
    },
  });

  const refreshToken = async () => {
    console.log("refreshing token");
    const response = await axios.post(
      `${constants.ServerURL}/apex/auth/refresh-token`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    if (!response.data.error && response.data.accessToken) {
      console.log("setting access token: ", response.data.accessToken);
      appDispatch(setAccessToken(response.data.accessToken));
      return response.data.accessToken as string;
    } else {
      console.log("logging out because couldn't refresh");
      appDispatch(logout());
      return "";
    }
  };

  const isExpired = async (tokenStr: string) => {
    if (!isValid(tokenStr)) {
      return false;
    }
    try {
      const { exp } = (await jwt_decode(tokenStr.split(" ")[1])) as {
        exp: number;
      };
      const expired = Date.now() >= exp * 1000;
      if (!expired) {
        console.log("token is not expired");
        return false;
      }
    } catch (err) {
      console.log("expired");
    }
    return true;
  };

  const isValid = (token: string) => {
    const tokenArr = token.split(" ");
    if (tokenArr.length !== 2) {
      return false;
    }
    if (tokenArr[0] !== "JWT") {
      return false;
    }
    if (!tokenArr[1]) {
      return false;
    }
    return true;
  };

  myAxios.interceptors.request.use(
    async (request) => {
      const authState = store.getState().auth;
      if (isValid(request.headers.Authorization as string)) {
        const expired = await isExpired(
          request.headers.Authorization as string
        );
        if (!expired) {
          return request;
        }
        const token = await refreshToken();
        if (token) {
          request.headers["Authorization"] = `JWT ${token}`;
          appDispatch(setAccessToken(token));
          return request;
        }
        return request;
      }

      if (authState.accessToken && !(await isExpired(authState.accessToken))) {
        request.headers["Authorization"] = `JWT ${authState.accessToken}`;
        return request;
      }

      const token = await refreshToken();
      request.headers["Authorization"] = `JWT ${token}`;
      appDispatch(setAccessToken(token));
      return request;
    },
    async (error) => {
      return Promise.reject(error);
    }
  );

  myAxios.interceptors.response.use(
    async (response) => {
      if (response.data.accessToken) {
        appDispatch(setAccessToken(response.data.accessToken));
      }
      return response;
    },
    async (error) => {
      console.log({ error })
      if (error) {
        appDispatch(logout());
      }
      return Promise.reject(error);
    }
  );
  return myAxios;
};

export default useAxios;
