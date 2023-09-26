import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabase = createClientComponentClient();

export const dogsAPI = {
  getDogs: async function (userId: number) {
    const { data, error } = await supabase
      .from('dogs')
      .select()
      .eq('userId', userId);

    return { data, error };
  },
  getDog: async function (dogId: number) {
    const { data, error } = await supabase
      .from('dogs')
      .select()
      .eq('dogId', dogId);

    return { data, error };
  },
  addDog: async function (
    userId: number,
    name: string,
    breed?: string,
    avatarUri?: string
  ) {
    const { data, error } = await supabase
      .from('dogs')
      .insert({
        name,
        breed,
        avatarUri,
        userId,
      })
      .select();

    return { data, error };
  },
  deleteDog: async function (dogId: number) {
    const { data, error } = await supabase
      .from('dogs')
      .delete()
      .eq('dogId', dogId);

    return { data, error };
  },
};
