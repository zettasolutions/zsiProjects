
CREATE PROCEDURE [dbo].[organizations_dd_sel]
(
  @user_id INT 
 ,@organization_type_id INT = NULL
)
AS
BEGIN
  DECLARE @is_admin CHAR(1)

  SELECT @is_admin = is_admin FROM dbo.users WHERE user_id=@user_id;

  IF @is_admin='Y'
     SELECT * FROM dbo.organizations WHERE is_active='Y'
  ELSE
  BEGIN
	  IF ISNULL(@organization_type_id,0) <> 0
		SELECT * FROM dbo.organizations_tree(@user_id) WHERE organization_type_id=@organization_type_id
	  ELSE
		 SELECT * FROM dbo.organizations_tree(@user_id) 
  END
END


