

CREATE PROCEDURE [dbo].[users_upd]
(
   @tt     users_tt READONLY
   ,@user_id int
)
AS
SET NOCOUNT ON
DECLARE @updated_count INT;

-- Update Process
   UPDATE a 
       SET logon        = LTRIM(b.logon) 
	      ,last_name    = b.last_name
		  ,first_name   = b.first_name
		  ,middle_ini   = b.middle_ini
		  ,plant_id     = b.plant_id
		  ,role_id      = b.role_id
		  ,position     = b.position
		  ,contact_nos  = b.contact_nos
		  ,is_contact   = b.is_contact
          ,is_active    = b.is_active
		  ,is_requestor = b.is_requestor
          ,updated_by   = @user_id
          ,updated_date = GETDATE()
       FROM dbo.users a INNER JOIN @tt b
        ON a.user_id = b.user_id 
       WHERE 
         (
          isnull(a.logon,'')  <> isnull(b.logon,'')   
		  OR isnull(a.last_name,'') <> isnull(b.last_name,'')
		  OR isnull(a.first_name,'') <> isnull(b.first_name,'')
		  OR isnull(a.middle_ini,'') <> isnull(b.middle_ini,'')
		  OR isnull(a.middle_ini,'') <> isnull(b.middle_ini,'')
		  OR isnull(a.plant_id,0) <> isnull(b.plant_id,0)
		  OR isnull(a.role_id,0) <> isnull(b.role_id,0)
		  OR isnull(a.is_requestor,'') <> isnull(b.is_requestor,'')
		  OR isnull(a.contact_nos,'') <> isnull(b.contact_nos,'')
		  OR isnull(a.position,'') <> isnull(b.position,'')
		  OR isnull(a.is_contact,'') <> isnull(b.is_contact,'')
          OR isnull(a.is_active,'') <> isnull(b.is_active,'')
         )
     AND b.logon IS NOT NULL
	 AND b.last_name IS NOT NULL
	 AND b.first_name IS NOT NULL
	 --AND b.role_id IS NOT NULL

SET @updated_count = @@ROWCOUNT;
 
-- Insert Process
   INSERT INTO users (
       logon
      ,last_name
	  ,first_name
	  ,middle_ini
	  ,plant_id
	  ,role_id
	  ,position
	  ,contact_nos
	  ,is_contact
      ,is_active
	  ,is_requestor
      ,created_by
      ,created_date
    )
   SELECT 
       LTRIM(logon)
      ,last_name
	  ,first_name
	  ,middle_ini
	  ,plant_id
	  ,role_id
	  ,position
	  ,contact_nos
	  ,is_contact
      ,is_active
	  ,is_requestor
      ,@user_id
      ,GETDATE()
   FROM @tt 
   WHERE user_id IS NULL
     AND logon IS NOT NULL
	 AND last_name IS NOT NULL
	 AND first_name IS NOT NULL
	-- AND role_id IS NOT NULL

SET @updated_count = @updated_count + @@ROWCOUNT;
RETURN @updated_count;



