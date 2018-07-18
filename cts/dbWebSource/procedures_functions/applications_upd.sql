


CREATE PROCEDURE [dbo].[applications_upd]
(
    @tt    applications_tt READONLY
   ,@user_id int
)
AS

BEGIN
   SET NOCOUNT ON
   DECLARE @client_id INT

   SELECT @client_id = client_id FROM dbo.users where user_id=@user_id;
-- Update Process
    UPDATE a 
        SET  app_name		=	upper(b.app_name)
			,app_desc		=	upper(b.app_desc)
		    ,is_active      =   b.is_active
			,updated_by		=	@user_id
            ,updated_date   =	GETDATE()
		FROM dbo.applications a INNER JOIN @tt b
        ON a.app_id = b.app_id 
		WHERE isnull(b.is_edited,'N')='Y'

-- Insert Process

    INSERT INTO applications(
	     client_id
		,app_name
		,app_desc
     	,is_active
		,created_by
        ,created_date	
        )
    SELECT 
		 @client_id			
		,app_name
		,app_desc
		,is_active
		,@user_id  
		,GETDATE()
    FROM @tt
    WHERE app_id IS NULL 
	AND app_name IS NOT NULL;
END






