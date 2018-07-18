


CREATE PROCEDURE [dbo].[roles_upd]
(
    @tt    roles_tt READONLY
   ,@user_id int
)
AS
SET NOCOUNT ON
DECLARE @updated_count INT;
DECLARE @client_id int

   SELECT @client_id=client_id FROM dbo.users where user_id=@user_id;
-- Update Process
	UPDATE a 
		 SET role_name         = b.role_name		    
	   	    ,updated_by        = @user_id
			,updated_date      = GETDATE()
       FROM dbo.roles a INNER JOIN @tt b
	     ON a.role_id = b.role_id 
		WHERE b.role_name IS NOT NULL
	    AND isnull(b.is_edited,'N')='Y'


SET @updated_count = @@ROWCOUNT;

-- Insert Process
	INSERT INTO roles (
		 role_name
		,client_id
		,created_by
		,created_date
    )
	SELECT 
		 role_name
        ,@client_id
	    ,@user_id
	    ,GETDATE()
	FROM @tt 
	WHERE role_id IS NULL 
	  AND role_name IS NOT NULL;

SET @updated_count = @updated_count + @@ROWCOUNT;
RETURN @updated_count;





