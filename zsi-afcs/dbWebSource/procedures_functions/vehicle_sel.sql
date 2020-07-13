CREATE PROCEDURE [dbo].[vehicle_sel]
(
   @user_id  int = null
  ,@client_id int = null
  ,@is_active varchar(1)='Y'
  ,@col_no INT = 3
  ,@order_no INT = 0
  ,@searchVal VARCHAR(50) = null
)
AS
BEGIN
	SET NOCOUNT ON
	DECLARE @stmt nvarchar(max)='';
	IF ISNULL(@is_active,'N')='Y'
       SET @stmt = 'SELECT * FROM dbo.active_vehicles_v WHERE company_id=' + cast(@client_id as varchar(20))
	ELSE
	   SET @stmt = 'SELECT * FROM dbo.inactive_vehicles_v WHERE company_id=' + cast(@client_id as varchar(20))

	IF isnull(@searchVal,'') <>''
	   SET @stmt = @stmt + ' AND vehicle_plate_no like ''%'+@searchVal+'%''';

	SET @stmt = @stmt + ' ORDER BY ' + cast(@col_no as varchar(20))

	IF isnull(@order_no,0) = 0
	   SET @stmt = @stmt + ' ASC'
     ELSE
	   SET @stmt = @stmt + ' DESC'


	EXEC(@stmt);
END

--vehicle_sel @is_active='N'
