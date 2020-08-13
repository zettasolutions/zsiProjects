

CREATE PROCEDURE [dbo].[vehicles_sel]
(
    @client_id nvarchar(100)
   ,@user_id INT = NULL
   ,@searchval nvarchar(100)=null
   ,@is_active VARCHAR(1)='Y'
)
AS
BEGIN
	SET NOCOUNT ON
	DECLARE @stmt NVARCHAR(MAX)

	BEGIN
		IF @is_active = 'Y'
			SET @stmt = 'SELECT * FROM dbo.active_vehicles_v WHERE company_id=''' + @client_id + '''';
		ELSE
			SET @stmt = 'SELECT * FROM dbo.inactive_vehicles_v WHERE company_id=''' + @client_id + '''';
	END

	IF ISNULL(@searchval,'')<>''
       set @stmt = @stmt + ' AND plate_no like ''%' + @searchval  + '%'' or conduction_no like ''%' + @searchval  + '%'' or chassis_no like ''%' + @searchval  + '%'' or engine_no like ''%' + @searchval  + '%'''

	exec(@stmt);
 END;


 --[dbo].[vehicles_sel] @client_id=1