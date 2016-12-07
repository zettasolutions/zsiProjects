create PROCEDURE [dbo].[users_upd]
(
    @tt     users_tt READONLY
   ,@user_id int
)
AS
SET NOCOUNT ON
DECLARE @updated_count INT;

-- Update Process
   UPDATE a 
       SET role_id = b.role_id
	      ,logon = dbo.createUserLogon(b.user_id)
		  ,password = b.password
          ,updated_by   = @user_id
          ,updated_date = GETDATE()
       FROM dbo.users a INNER JOIN @tt b
        ON a.user_id = b.user_id 
       AND 
         (
          isnull(a.role_id,0)  <> isnull(b.role_id,0) 
         )
SET @updated_count = @@ROWCOUNT;

SET @updated_count = @updated_count + @@ROWCOUNT;
RETURN @updated_count;



 
