
CREATE PROCEDURE [dbo].[role_menus_upd]
(
     @tt    role_menus_tt READONLY
    ,@user_id int
)
AS
SET NOCOUNT ON
DECLARE @updated_count INT;
-- Update Process

    DELETE FROM dbo.role_menus WHERE role_menu_id IN (SELECT role_menu_id FROM @tt WHERE role_menu_id IS NOT NULL AND role_id IS NULL);

	UPDATE a 
		 SET role_id         = b.role_id
	 	    ,menu_id         = b.menu_id
	 		,is_write        = b.is_write
			,is_delete       = b.is_delete
	   	    ,updated_by      = @user_id
			,updated_date    = GETDATE()
       FROM dbo.role_menus a INNER JOIN @tt b
	     ON a.role_menu_id = b.role_menu_id 
	  WHERE isnull(b.is_edited,'N') = 'Y' ;

SET @updated_count = @@ROWCOUNT;

-- Insert Process
	INSERT INTO role_menus (
		 role_id
		,menu_id
		,is_write
		,is_delete
		,created_by
		,created_date
    )
	SELECT 
		 role_id
		,menu_id
		,is_write
		,is_delete
	    , @user_id
	    ,GETDATE()
	FROM @tt 
	WHERE role_menu_id IS NULL
	AND role_id IS NOT NULL AND menu_id IS NOT NULL;

SET @updated_count = @updated_count + @@ROWCOUNT;


RETURN @updated_count;


