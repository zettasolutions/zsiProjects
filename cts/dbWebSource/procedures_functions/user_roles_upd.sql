


CREATE PROCEDURE [dbo].[user_roles_upd]
(
    @tt    user_roles_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- DELETE
    DELETE FROM dbo.user_roles where user_role_id IN (SELECT user_role_id FROM @tt where is_deleted = 'Y')


-- Insert Process

    INSERT INTO user_roles(
	     user_id
		,role_id
		,created_by
        ,created_date	
        )
    SELECT 
	     app_user_id
		,role_id
		,@user_id  
		,GETDATE()
    FROM @tt
    WHERE user_role_id IS NULL 
	AND app_user_id IS NOT NULL
	AND role_id IS NOT NULL;
END






