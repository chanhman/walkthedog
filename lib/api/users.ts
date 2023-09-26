import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabase = createClientComponentClient();

export const usersAPI = {
  getUser: async function (userId: number) {
    const { data, error } = await supabase
      .from('users')
      .select()
      .eq('userId', userId);

    if (error) {
      return error;
    }
    return data;
  },
  updateUser: async function (
    userId: number,
    fullName: string,
    address: string
  ) {
    const { data, error } = await supabase
      .from('users')
      .update({
        fullName,
        address,
      })
      .eq('userId', userId);

    if (error) {
      return error;
    }
    return data;
  },
};
