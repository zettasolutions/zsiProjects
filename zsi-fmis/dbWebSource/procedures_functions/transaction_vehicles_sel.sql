


CREATE PROCEDURE [dbo].[transaction_vehicles_sel]
(
    @user_id INT = NULL
   ,@search_val nvarchar(100)=null
   ,@is_active VARCHAR(1)='Y'
)
AS
BEGIN
	SET NOCOUNT ON
	DECLARE @client_id nvarchar(20)=null
	DECLARE @stmt NVARCHAR(MAX)

	select @client_id = company_id FROM dbo.users_v where user_id=@user_id;
 	SET @stmt = 'SELECT * FROM dbo.vehicles_v WHERE company_id=''' + @client_id + '''';

	IF @is_active <> ''
		SET @stmt = @stmt + ' AND is_active='''+ @is_active + '''';

	IF ISNULL(@search_val,'')<>''
       set @stmt = @stmt + ' AND plate_no like ''%' + @search_val  + '%'' or conduction_no like ''%' + @search_val  + '%'' or chassis_no like ''%' + @search_val  + '%'' or engine_no like ''%' + @search_val  + '%'''

	exec(@stmt);
 END;



