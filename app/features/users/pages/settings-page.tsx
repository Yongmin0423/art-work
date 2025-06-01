import { Form } from 'react-router';
import InputPair from '~/components/input-pair';
import { useState } from 'react';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import type { Route } from './+types/settings-page';
import SelectPair from '~/common/components/select-pair';

export const meta: Route.MetaFunction = () => {
  return [{ title: 'Settings | wemake' }];
};

export default function SettingsPage() {
  const [avatar, setAvatar] = useState<string | null>(null);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      setAvatar(URL.createObjectURL(file));
    }
  };

  return (
    <div className="space-y-20">
      <div className="grid grid-cols-6 gap-40">
        <div className="col-span-4 flex flex-col gap-10">
          <h2 className="text-2xl font-semibold">Edit profile</h2>
          <Form className="flex flex-col w-full max-w-lg gap-5">
            <InputPair
              label="Name"
              description="Your display name (shown on your profile)"
              required
              id="name"
              name="name"
              placeholder="John Doe"
              defaultValue="John Doe"
            />
            <InputPair
              label="Username"
              description="Your unique username (used in profile URL)"
              required
              id="username"
              name="username"
              placeholder="john_doe"
              defaultValue="john_doe"
            />
            <InputPair
              label="Job Title"
              description="Your professional title or specialty"
              id="jobTitle"
              name="jobTitle"
              placeholder="Product Designer"
              defaultValue="Product Designer"
            />
            <InputPair
              label="Bio"
              description="Tell others about yourself"
              id="bio"
              name="bio"
              placeholder="Passionate about creating beautiful and functional designs..."
              textArea
            />
            <SelectPair
              label="Work Status"
              description="Your current availability for work"
              name="workStatus"
              placeholder="Select your status"
              options={[
                { label: 'Available for work', value: 'available' },
                { label: 'Busy', value: 'busy' },
                { label: 'Not available', value: 'unavailable' },
              ]}
            />
            <div className="grid grid-cols-2 gap-3">
              <InputPair
                label="Location"
                description="Where you're based"
                id="location"
                name="location"
                placeholder="Seoul, South Korea"
              />
              <InputPair
                label="Website"
                description="Your personal website or portfolio"
                id="website"
                name="website"
                type="url"
                placeholder="https://johndoe.com"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
            >
              Update profile
            </Button>
          </Form>
        </div>

        <aside className="col-span-2 p-6 rounded-lg border shadow-md h-fit">
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Avatar</Label>
              <p className="text-xs text-muted-foreground mt-1">This is your public avatar.</p>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <Avatar className="size-32">
                <AvatarImage
                  src={avatar || 'https://github.com/shadcn.png'}
                  alt="Avatar preview"
                />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>

              <Input
                type="file"
                className="w-full"
                onChange={onChange}
                accept="image/png,image/jpeg,image/jpg"
                name="avatar"
              />

              <div className="text-xs text-muted-foreground space-y-1 text-center">
                <p>Recommended: 400x400px</p>
                <p>Formats: PNG, JPEG, JPG</p>
                <p>Max size: 2MB</p>
              </div>

              <Button
                type="button"
                className="w-full"
                size="sm"
              >
                Update avatar
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
