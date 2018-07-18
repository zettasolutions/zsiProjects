


create PROCEDURE [dbo].[types_sel]
(
    @category_id INT=NULL
   ,@is_active CHAR(1)='Y'
   ,@user_id int
)
AS

BEGIN
SET NOCOUNT ON
DECLARE @client_id int
DECLARE @stmt NVARCHAR(MAX)
   SELECT @client_id=client_id FROM dbo.users where user_id=@user_id;
   SET @stmt = 'SELECT * FROM dbo.types WHERE is_active=''' + @is_active + ''' AND client_id=' + CAST(@client_id AS VARCHAR(20));
   IF ISNULL(@category_id,0) <> 0
      SET @stmt = @stmt + ' AND category_id = ' + CAST(@category_id AS VARCHAR(20));
   
   EXEC(@stmt);
END






