import type { Route } from './+types/profile-page';
import { makeSSRClient } from '~/supa-client';
import { getUserProfile } from '../queries';

export const meta: Route.MetaFunction = () => {
  return [{ title: 'Profile | wemake' }];
};

export async function loader({ params, request }: Route.LoaderArgs) {
  const { client } = makeSSRClient(request);
  const username = params.username;
  
  if (!username) {
    throw new Error('Username is required');
  }

  const profile = await getUserProfile(client, { username });
  return { profile };
}

export default function ProfilePage({ loaderData }: Route.ComponentProps) {
  const { profile } = loaderData;

  return (
    <div className="max-w-screen-md flex flex-col space-y-10">
      <div className="space-y-2">
        <h4 className="text-lg font-bold">자기소개</h4>
        <p className="text-muted-foreground">
          {profile.bio || "아직 자기소개를 작성하지 않았습니다."}
        </p>
      </div>
    </div>
  );
}