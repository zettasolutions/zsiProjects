CREATE PROCEDURE [dbo].[dd_pilots_sel]
(
   @user_id INT = NULL
  ,@squadron_id INT = NULL
)
AS
BEGIN

SET NOCOUNT ON
  SET NOCOUNT ON
  DECLARE @stmt		VARCHAR(4000);

  SET @stmt = 'SELECT user_id, userFullName  FROM dbo.employees_v WHERE is_pilot=''Y''' 
  IF isnull(@squadron_id,'') <> ''
     SET @stmt = @stmt + ' and organization_id = ' + cast(@squadron_id as varchar(20));

  SET @stmt = @stmt + ' ORDER BY userFullName ' 
  EXEC(@stmt)
END

