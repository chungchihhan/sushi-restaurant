import { useState } from "react";

type UserProps = {
  email: string;
  phone: string;
  birthday: string;
};

export const editUser = async ({ email, phone, birthday }: UserProps) => {
  const response = await fetch("/api/USER", {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
    method: "PUT",
    body: JSON.stringify({
      email,
      phone,
      birthday,
    }),
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error);
  }

  const data = await response.json();
  return data;
};

export default function useUser() {
  const [user, setUser] = useState<UserProps | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/USER");
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }

      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      // console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (newUserData: UserProps) => {
    setLoading(true);
    try {
      const updatedData = await editUser(newUserData);
      setUser(updatedData);
    } catch (error) {
      // console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    fetchUser,
    updateUser,
  };
}
