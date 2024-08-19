async function refreshToken() {
  return new Promise<any>((resolve, reject) => {

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/token/refresh`, {
      method: "POST",
      body: JSON.stringify({
        "refresh": window.localStorage.getItem("refresh_token")
      }),

      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if (!res.ok) {
        reject(new Error("Unauthorized, try logging in again"));
      }

      return res.json()
    })
    .then(data => {
      window.localStorage.setItem("access_token", data.access);
      return data.access
    })
  })
}

async function makeRequest(route: str, method: str, isRec: bool = false, body: any = {}) {
  return new Promise<any>((resolve, reject) => {
    if (window === null || window === undefined) {
      reject(new Error("api helpers should only be called from client"));
    }

    let fetchOptions = {
        method: method,
        headers: {
          "Authorization": `Bearer ${window.localStorage.getItem("access_token")}`
        }
    }

    if (method !== "GET" && body !== {} && body !== null && body !== undefined)  {
      fetchOptions.body = JSON.stringify(body)
      fetchOptions.headers["Content-Type"] = "application/json"
    }

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/${route}`, fetchOptions)
    .then(res => {
      console.log(res)
      if (res.ok) {
        resolve(res.json());
      }

      else if (res.status === 401 && isRec === false) {
        refreshToken()
        .catch(err => reject(err));
        resolve(makeRequest(route, method, true, body));
      }
    })
    .catch(err => {
      reject(new Error("something went wrong"))
    })

  });
}

export async function apiGet(route: str) {
  return makeRequest(route, "GET");
}

export async function apiPost(route: str, body: any) {
  return makeRequest(route, "POST",  false, body)
}