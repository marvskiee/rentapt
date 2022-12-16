export const authLogin = async (newData) => {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newData),
  });
  const result = await res.json();
  return result;
};

export const getUser = async () => {
  const res = await fetch("/api/auth/checkAuth", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  const result = await res.json();
  return result;
};

export const authLogout = async () => {
  const res = await fetch("/api/auth/logout", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  const result = await res.json();
  return result;
};

export const getTenant = async (id) => {
  const res = await fetch("/api/user/modify/" + id, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  const result = await res.json();
  return result;
};
export const createUser = async (newData) => {
  const res1 = await checkUnit(newData.unit);
  if (res1.success && res1.data.length == 0) {
    const res = await fetch("/api/user", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newData),
    });
    const result = await res.json();
    return result;
  } else {
    return {
      success: false,
      errors: { unitError: "is already active" },
    };
  }
};
export const updateUser = async (id, newData) => {
  const res = await fetch("/api/user/modify/" + id, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newData),
  });
  const result = await res.json();
  return result;
};
export const deleteUser = async (id) => {
  const res = await fetch("/api/user/modify/" + id, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  const result = await res.json();
  return result;
};
export const getAllUsers = async () => {
  const res = await fetch("/api/user", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  const result = await res.json();
  return result;
};
export const checkUnit = async (unit) => {
  const res = await fetch("/api/user/check/" + unit, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  const result = await res.json();
  return result;
};
