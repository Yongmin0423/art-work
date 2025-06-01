import { Form, Link, NavLink, Outlet } from 'react-router';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Badge } from '~/components/ui/badge';
import { Button, buttonVariants } from '~/components/ui/button';
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from '~/components/ui/dialog';
import { Textarea } from '~/components/ui/textarea';
import { cn } from '~/lib/utils';

// 임시 데이터 - 실제로는 loader에서 가져올 것
const profileData = {
  name: 'John Doe',
  username: 'john_doe',
  jobTitle: 'Product Designer',
  bio: 'Passionate about creating beautiful and functional designs...',
  location: 'Seoul, South Korea',
  website: 'https://johndoe.com',
  avatarUrl: 'https://github.com/shadcn.png',
  workStatus: 'available',
  stats: {
    followers: 1234,
    following: 567,
    views: 8901,
  },
  isOwnProfile: false, // 본인 프로필인지 확인
  isFollowing: false, // 팔로우 중인지 확인
};

export default function ProfileLayout() {
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  return (
    <div className="space-y-10">
      {/* Profile Header */}
      <div className="flex items-start gap-6">
        <Avatar className="size-32">
          <AvatarImage
            src={profileData.avatarUrl}
            alt={profileData.name}
          />
          <AvatarFallback>
            {profileData.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{profileData.name}</h1>
            <Badge variant={profileData.workStatus === 'available' ? 'default' : 'secondary'}>
              {profileData.workStatus === 'available'
                ? 'Available'
                : profileData.workStatus === 'busy'
                ? 'Busy'
                : 'Not Available'}
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>@{profileData.username}</span>
            {profileData.jobTitle && (
              <>
                <span>•</span>
                <span>{profileData.jobTitle}</span>
              </>
            )}
            {profileData.location && (
              <>
                <span>•</span>
                <span>{profileData.location}</span>
              </>
            )}
          </div>

          {profileData.bio && <p className="text-foreground max-w-2xl">{profileData.bio}</p>}

          {profileData.website && (
            <a
              href={profileData.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              {profileData.website}
            </a>
          )}

          <div className="flex items-center gap-4 text-sm">
            <span>
              <strong>{formatNumber(profileData.stats.followers)}</strong> followers
            </span>
            <span>
              <strong>{formatNumber(profileData.stats.following)}</strong> following
            </span>
            <span>
              <strong>{formatNumber(profileData.stats.views)}</strong> profile views
            </span>
          </div>

          <div className="flex gap-3">
            {profileData.isOwnProfile ? (
              <Button
                variant="outline"
                asChild
              >
                <Link to="/my/settings">Edit profile</Link>
              </Button>
            ) : (
              <>
                <Button variant={profileData.isFollowing ? 'outline' : 'default'}>
                  {profileData.isFollowing ? 'Following' : 'Follow'}
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Message</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Send Message</DialogTitle>
                      <DialogDescription>Send a message to {profileData.name}</DialogDescription>
                    </DialogHeader>
                    <Form className="space-y-4">
                      <Textarea
                        placeholder="Write your message..."
                        className="resize-none"
                        rows={4}
                        name="message"
                        required
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                        >
                          Cancel
                        </Button>
                        <Button type="submit">Send Message</Button>
                      </div>
                    </Form>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b">
        <div className="flex gap-1">
          {[
            { label: 'About', to: `/users/${profileData.username}` },
            { label: 'Portfolio', to: `/users/${profileData.username}/portfolio` },
            { label: 'Posts', to: `/users/${profileData.username}/posts` },
            { label: 'Reviews', to: `/users/${profileData.username}/reviews` },
          ].map((item) => (
            <NavLink
              end
              key={item.label}
              className={({ isActive }) =>
                cn(
                  'px-4 py-2 text-sm font-medium border-b-2 border-transparent hover:border-border transition-colors',
                  isActive && 'border-primary text-primary'
                )
              }
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl">
        <Outlet />
      </div>
    </div>
  );
}
