-- 먼저 trigger를 삭제
drop trigger if exists user_to_profile_trigger on auth.users;

-- 함수를 수정
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    if new.raw_app_meta_data is not null then
        if new.raw_app_meta_data ? 'provider' AND new.raw_app_meta_data ->> 'provider' = 'email' then
            insert into public.profiles (
                profile_id, 
                username, 
                name, 
                job_title, 
                bio,
                work_status,
                location,
                website,
                avatar_url
            )
            values (
                new.id,
                'mr.' || substr(md5(random()::text), 1, 8),
                'Anonymous',
                'Digital Artist',
                'Professional digital artist specializing in character design and illustration',
                'available',
                null,
                null,
                null
            );
        end if;
    end if;
    return new;
end;
$$;

-- trigger를 다시 생성
create trigger user_to_profile_trigger
after insert on auth.users
for each row execute function public.handle_new_user();