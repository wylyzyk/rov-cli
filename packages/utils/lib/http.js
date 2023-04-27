import qs from "qs";

const apiUrl = "https://api.github.com";

// interface Config extends RequestInit {
//   token?: string;
//   data?: object;
// }

export const http = async (endpoint, { data, token, headers, ...customConfig }) => {
  const config = {
    method: "GET",
    headers: {
      Authorization: token ? `Bearer ${ token }` : "",
      Accept: "application/vnd.github+json",
      "Content-Type": data ? "application/json" : "",
    },
    // customConfig 会覆盖前面的值
    ...customConfig,
  };

  if (config.method.toUpperCase() === "GET") {
    endpoint += `?${ qs.stringify(data) }`;
  } else {
    config.body = JSON.stringify(data || {});
  }

  // axios 和 fetch 表现不一样, axios 可以直接在返回状态不为2xx 的时候抛出异常
  return global
    .fetch(`${ apiUrl }/${ endpoint }`, config)
    .then(async (response) => {
      // 未登录状态, token失效 返回401
      if (response.status === 401) {
        // TODO: 重新获取token
        window.location.reload();
        return Promise.reject({ message: "请重新获取toekn" });
      }

      const data = await response.json();

      if (response.ok) {
        return data;
      } else {
        return Promise.reject(data);
      }
    });
};

// export const useHttp = () => {
//   const { user } = useAuth();
//
//   // 使用rest操作符, 将 tuple 中的值结构出来
//   return useCallback(
//     (...[endpoint, config]) =>
//       http(endpoint, { ...config, token: user?.token }),
//     [user?.token]
//   );
// };
