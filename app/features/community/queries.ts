import client from '~/supa-client';

export const getTopics = async () => {
  const { data, error } = await client.from('topics').select('name,slug');
  if (error) throw error;
  return data;
};
