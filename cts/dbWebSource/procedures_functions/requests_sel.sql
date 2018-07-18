
CREATE PROCEDURE [dbo].[requests_sel](
  @request_id INT = NULL
 ,@status_id  INT = NULL
 ,@user_id    INT 
)
AS
BEGIN
SET NOCOUNT ON
DECLARE @stmt NVARCHAR(MAX)
DECLARE @client_id INT
CREATE TABLE #user_role_processes (
   process_id INT
)
   SELECT @client_id=client_id FROM dbo.users WHERE user_id=@user_id;
   SET @stmt ='SELECT process_id FROM dbo.role_processes_v WHERE client_id = ' + CAST(@client_id AS VARCHAR(20)) + ' AND role_id IN (SELECT role_id FROM dbo.user_roles where user_id =' + CAST(@user_id AS VARCHAR(20)) + ')'

   INSERT INTO #user_role_processes EXEC(@stmt);
   SET @stmt = ' SELECT * FROM dbo.requests_v WHERE 1=1 '

   IF ISNULL(@request_id,0) <> 0
      SET @stmt = @stmt + ' AND request_id = ' + CAST(@request_id AS VARCHAR(20))

   IF ISNULL(@status_id,0) <> 0
      SET @stmt = @stmt + ' AND status_id = ' + CAST(@status_id AS VARCHAR(20)) + ' AND process_id IN ( SELECT process_id FROM #user_role_processes)'

EXEC(@stmt);
DROP TABLE #user_role_processes;
END


