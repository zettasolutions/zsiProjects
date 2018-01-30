
CREATE PROCEDURE [dbo].[organizations_dd_sel]
(
  @user_id INT 
 ,@organization_type_id INT = NULL
)
AS
BEGIN
  DECLARE @is_admin CHAR(1)
  DECLARE @stmt NVARCHAR(MAX)

  SELECT @is_admin = is_admin FROM dbo.users WHERE user_id=@user_id;
  

  IF @is_admin='Y'
     SET @stmt = 'SELECT * FROM dbo.organizations WHERE is_active=''Y'''
  ELSE
      SET @stmt = 'SELECT * FROM dbo.organizations_tree(' + CAST(@user_id AS VARCHAR(20)) + ')'

  IF ISNULL(@organization_type_id,0) <> 0
     SET @stmt = @stmt + ' WHERE organization_type_id='+ CAST(@organization_type_id AS VARCHAR(20))

  EXEC(@stmt);

 
END



