CREATE view users_v

 as

 select *, first_name + N' ' + CASE WHEN [middle_ini] IS NULL THEN '' ELSE middle_ini + '. ' END + last_name AS userFullName from users
