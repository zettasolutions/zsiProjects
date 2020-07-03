CREATE PROCEDURE [dbo].[vehicle_sel]
(
   @user_id  int = null
  ,@is_active varchar(1)='Y'
  ,@searchVal VARCHAR(50) = null
)
AS
BEGIN
	SET NOCOUNT ON
	DECLARE @company_id nvarchar(20)=null
	DECLARE @stmt nvarchar(max)='';
		select @company_id = company_id FROM dbo.users where user_id=@user_id;
		SET @stmt = 'SELECT * FROM dbo.vehicles WHERE is_active = ''' + @is_active + '''  AND company_id = ''' + @company_id + '''';
	IF isnull(@searchVal,'') <>''
	 SET @stmt = @stmt + ' AND vehicle_plate_no like ''%'+@searchVal+'%''';

	EXEC(@stmt);
END


