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
    -- 예외 처리 추가
    begin
        if new.raw_user_meta_data ? 'name' and new.raw_user_meta_data ? 'username' then
            insert into public.profiles (
                profile_id, 
                username, 
                name
            )
            values (
                new.id,
                new.raw_user_meta_data ->> 'username',
                new.raw_user_meta_data ->> 'name'
            );
        else
            insert into public.profiles (
                profile_id, 
                username, 
                name
            )
            values (
                new.id,
                'user_' || substr(md5(random()::text), 1, 8),
                'Anonymous User'
            );
        end if;
    exception
        when others then
            -- 에러가 발생해도 사용자 생성은 계속 진행
            raise log 'Error creating profile for user %: %', new.id, SQLERRM;
    end;
    return new;
end;
$$;

-- trigger를 다시 생성
create trigger user_to_profile_trigger
after insert on auth.users
for each row execute function public.handle_new_user();