
CREATE PROCEDURE [dbo].[requests_sel](
  @request_id INT = NULL
 ,@status_id  INT = NULL
 ,@process_id INT = NULL
 ,@user_id    INT 
)
AS
BEGIN
SET NOCOUNT ON
DECLARE @stmt NVARCHAR(MAX)
DECLARE @client_id INT
DECLARE @table NVARCHAR(100)
CREATE TABLE #user_role_processes (
   process_id INT
)
   SELECT @client_id=client_id, @table = CONCAT('data_',client_id,'_requests') FROM dbo.users WHERE user_id=@user_id;
   SET @stmt ='SELECT process_id FROM dbo.role_processes_v WHERE client_id = ' + CAST(@client_id AS VARCHAR(20)) + ' AND role_id IN (SELECT role_id FROM dbo.user_roles where user_id =' + CAST(@user_id AS VARCHAR(20)) + ')'

   INSERT INTO #user_role_processes EXEC(@stmt);
   SET @stmt = ' SELECT a.*, b.icon, b.status_name, b.seq_no, c.process_title FROM ' + @table + 
                      ' a INNER JOIN dbo.statuses b ON a.status_id = b.status_id ' +
					  '  INNER JOIN dbo.processes c ON a.process_id = c.process_id'

   IF ISNULL(@request_id,0) <> 0
      SET @stmt = @stmt + ' AND request_id = ' + CAST(@request_id AS VARCHAR(20))

   IF ISNULL(@status_id,0) <> 0
      SET @stmt = @stmt + ' AND a.status_id = ' + CAST(@status_id AS VARCHAR(20)) + ' AND a.created_by = ' + CAST(@user_id AS VARCHAR(20))

   IF ISNULL(@process_id,0) <> 0
      SET @stmt = @stmt + ' AND a.process_id = ' + CAST(@process_id AS VARCHAR(20)) + ' AND a.process_id IN ( SELECT process_id FROM #user_role_processes)'
print @stmt;

EXEC(@stmt);
DROP TABLE #user_role_processes;
END

