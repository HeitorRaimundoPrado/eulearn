import Cookie from 'js-cookie'

interface RefreshTokenResponse {
  access: string
}

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
        throw new Error("Some error happened");
      }

      return res.json()

    })
    .then((data: RefreshTokenResponse) => {
      window.localStorage.setItem("access_token", data.access);
        resolve(data.access)
        return;
    })
    .catch(err => {
    })
  })
}

async function makeRequest(route: string, method: string, isRec: boolean = false, body: any = {}, isFormData: boolean = false) {
  return new Promise<any>((resolve, reject) => {
    if (window === null || window === undefined) {
      reject(new Error("api helpers should only be called from client"));
      return;
    }

    let fetchOptions: {
      method: string,
      headers: {
        "Authorization": string,
        "Content-Type"?: string
        "X-CSRFToken"?: string
      }
    
      body?: string,
      credentials?: RequestCredentials,
    } = {
        method: method,
        headers: {
          "Authorization": `Bearer ${window.localStorage.getItem("access_token")}`
        }
    }

    if (method !== "GET" && method != "DELETE" && body !== null && body !== undefined)  {
      fetchOptions.body = isFormData ? body : JSON.stringify(body);
      fetchOptions.credentials = "include";
      if (!isFormData) {
        fetchOptions.headers["Content-Type"] =  "application/json"
      }
      fetchOptions.headers['X-CSRFToken'] = Cookie.get('csrftoken')
    }

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/${route}`, fetchOptions)
    .then(res => {
      if (res.ok) {
        if (res.status === 205 || res.status === 204) {
          resolve(res.status);
          return;
        }
        resolve(res.json());
        return;
      }

      else if (res.status === 401 && isRec === false) {
        refreshToken()
        .catch(err => {
          reject(err)
          return;
        });
        resolve(makeRequest(route, method, true, body));
        return;
      }
    })
    .catch(err => {
      reject(new Error("something went wrong"))
      return;
    })

  });
}

export async function apiGet(route: string) {
  return makeRequest(route, "GET");
}

export async function apiPost(route: string, body: any, isFormData: boolean = true) {
  return makeRequest(route, "POST",  false, body, isFormData)
}

export async function apiDelete(route: string) {
  return makeRequest(route, "DELETE")
}
