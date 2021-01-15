
CREATE PROCEDURE [dbo].[device_models_sel]
( 
     @user_id INT = NULL
	,@device_brand_id INT = NULL
	,@is_active varchar(1)='Y'
	,@search_val nvarchar(100)=null
)
AS
BEGIN
	SET NOCOUNT ON
	DECLARE @stmt NVARCHAR(MAX)

 	SET @stmt = 'SELECT * FROM dbo.device_models WHERE 1=1';

	IF @is_active <> ''
		SET @stmt = @stmt + ' AND is_active='''+ @is_active + '''';

	IF  ISNULL(@device_brand_id,0) <> 0
	    SET @stmt = @stmt + ' AND brand_id ='+ cast(@device_brand_id as varchar(20));

	IF ISNULL(@search_val,'')<>''
       set @stmt = @stmt + ' AND model_no like ''%' + @search_val  + '%'' or model_name like ''%' + @search_val  + '%'' or model_desc like ''%' + @search_val  + '%''';

	exec(@stmt);

 END;
