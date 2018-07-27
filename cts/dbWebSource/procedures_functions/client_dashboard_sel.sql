
CREATE PROCEDURE [dbo].[client_dashboard_sel](
  @year       INT
 ,@user_id    INT 
)
AS
BEGIN
SET NOCOUNT ON
DECLARE @stmt NVARCHAR(MAX)
DECLARE @client_id INT
DECLARE @table NVARCHAR(100)

   SELECT @client_id=client_id, @table = CONCAT('dbo.data_',client_id,'_requests') FROM dbo.users WHERE user_id=@user_id;
   SET @stmt = 'SELECT COUNT(*) status_count, status_id FROM ' + @table + ' WHERE year(created_date)=' + cast(@year as varchar(20)) + ' GROUP BY status_id, month(created_date) '
   EXEC(@stmt);

END

--[client_dashboard_sel] @YEAR=2018,@USER_ID=2

