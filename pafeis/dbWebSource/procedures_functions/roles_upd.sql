


CREATE PROCEDURE [dbo].[roles_upd]
(
   @tt    roles_tt READONLY
   ,@user_id int
)
AS
SET NOCOUNT ON
DECLARE @updated_count INT;
-- Update Process
	UPDATE a 
		 SET role_name         = b.role_name
	 	    ,is_export_excel   = b.is_export_excel
	 		,is_export_pdf	   = b.is_export_pdf
			,is_import_excel   = b.is_import_excel
	   	    ,updated_by        = @user_id
			,updated_date      = GETDATE()
       FROM dbo.roles a INNER JOIN @tt b
	     ON a.role_id = b.role_id 
		WHERE b.role_name IS NOT NULL
	    AND (isnull(a.role_name,'')  <> isnull(b.role_name,'')   
		     OR isnull(a.is_export_excel,'') <> isnull(b.is_export_excel,'')
			 OR isnull(a.is_export_pdf,'') <> isnull(b.is_export_pdf,'') 
			 OR isnull(a.is_import_excel,'') <> isnull(b.is_import_excel,'') 
			)


SET @updated_count = @@ROWCOUNT;

-- Insert Process
	INSERT INTO roles (
		 role_name
		,is_export_excel
		,is_export_pdf
		,is_import_excel
		,created_by
		,created_date
    )
	SELECT 
		 role_name
		,is_export_excel
		,is_export_pdf
		,is_import_excel
	    ,@user_id
	    ,GETDATE()
	FROM @tt 
	WHERE role_id IS NULL 
	  AND role_name IS NOT NULL;

SET @updated_count = @updated_count + @@ROWCOUNT;
RETURN @updated_count;


