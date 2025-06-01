import client from '~/supa-client';

export const getArtist = async ({ limit }: { limit: number }) => {
  const { data, error } = await client.from('artist').select('*').limit(limit);
  if (error) throw error;
  return data;
};
