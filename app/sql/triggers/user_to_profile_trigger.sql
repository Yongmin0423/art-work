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
        -- Kakao 로그인인지 확인
        if new.raw_app_meta_data ? 'provider' AND new.raw_app_meta_data ->> 'provider' = 'kakao' then
            -- Kakao 로그인 사용자 프로필 생성
            insert into public.profiles (
                profile_id, 
                name, 
                username, 
                role, 
                avatar_url
            )
            values (
                new.id,
                coalesce(new.raw_user_meta_data ->> 'name', 'Kakao User'),
                coalesce(new.raw_user_meta_data ->> 'preferred_username', 'kakao_user') || '_' || substr(md5(random()::text), 1, 5),
                'user',
                new.raw_user_meta_data ->> 'avatar_url'
            );
        elsif new.raw_user_meta_data ? 'name' and new.raw_user_meta_data ? 'username' then
            -- 일반적인 소셜 로그인 (GitHub 등)
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
            -- 기본 이메일 회원가입 또는 메타데이터가 없는 경우
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