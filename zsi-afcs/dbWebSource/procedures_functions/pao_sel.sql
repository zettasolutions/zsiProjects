CREATE PROCEDURE [dbo].[pao_sel]
(
    @user_id  int = null
   ,@client_id int 
   ,@is_active varchar(1)='Y'
   ,@pno INT = 1
   ,@rpp INT = 1000
   ,@col_no INT = 3
   ,@order_no INT = 0
   ,@searchVal VARCHAR(50) = null
)
AS
BEGIN
	SET NOCOUNT ON
	DECLARE @stmt nvarchar(max)='';
		SET @stmt = 'SELECT * FROM dbo.pao_active_v WHERE client_id = ' + cast(@client_id as varchar(20));
	
	IF isnull(@is_active,'') <>''
		SET @stmt = @stmt + ' AND is_active='''+@is_active+'''';

	IF isnull(@searchVal,'') <>''
	   SET @stmt = @stmt + ' AND first_name like ''%'+@searchVal+'%'' or last_name like ''%'+@searchVal+'%''';
	
	SET @stmt = @stmt + ' ORDER BY ' + cast(@col_no as varchar(20))

	IF isnull(@order_no,0) = 0
	   SET @stmt = @stmt + ' ASC'
     ELSE
	   SET @stmt = @stmt + ' DESC'

	EXEC(@stmt);
END

 
