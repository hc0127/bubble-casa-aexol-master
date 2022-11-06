export const role_enum = {
  user: 3,
  author: 2,
  admin: 1,
};

export const getRole = (role) => {
  const [name] = Object.entries(role_enum)
    .find(([, val]) => role === val);
  return name;
};
