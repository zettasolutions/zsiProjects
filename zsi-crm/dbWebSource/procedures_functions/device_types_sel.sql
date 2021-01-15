
CREATE PROCEDURE [dbo].[device_types_sel]
( 
     @user_id INT = NULL
	,@is_active varchar(1)='Y'
	,@search_val nvarchar(100)=null
)
AS
BEGIN
	SET NOCOUNT ON
	DECLARE @stmt NVARCHAR(MAX)

 	SET @stmt = 'SELECT * FROM dbo.device_types WHERE 1=1';

	IF @is_active <> ''
		SET @stmt = @stmt + ' AND is_active='''+ @is_active + '''';

	IF ISNULL(@search_val,'')<>''
       set @stmt = @stmt + ' AND device_type_code like ''%' + @search_val  + '%'' or device_type like ''%' + @search_val  + '%'' or device_type_desc like ''%' + @search_val  + '%'''

	exec(@stmt);
 END;
