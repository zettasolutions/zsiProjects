

CREATE PROCEDURE [dbo].[device_brands_sel]
( 
     @user_id INT = NULL
	--,@device_type_id INT = NULL
	,@is_active varchar(1)='Y' 
	,@search_val nvarchar(100)=null
)
AS
BEGIN
	SET NOCOUNT ON
	DECLARE @stmt NVARCHAR(MAX)

 	SET @stmt = 'SELECT * FROM dbo.device_brands WHERE 1=1';

	IF @is_active <> ''
		SET @stmt = @stmt + ' AND is_active='''+ @is_active + '''';

	--IF  ISNULL(@device_type_id,0) <> 0
	--    SET @stmt = @stmt + ' AND device_type_id ='+ cast(@device_type_id as varchar(20));

	IF ISNULL(@search_val,'')<>''
       set @stmt = @stmt + ' AND device_brand_code like ''%' + @search_val  + '%'' or device_brand_name like ''%' + @search_val  + '%''';

	 
	exec(@stmt);
 END;

