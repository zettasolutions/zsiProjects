


CREATE PROCEDURE [dbo].[products_sel]
( 
	@user_id INT = NULL
   --,@keyword nvarchar(100)=null
   --,@search_val nvarchar(100)=null
)
AS
BEGIN
	SET NOCOUNT ON
	DECLARE @stmt NVARCHAR(MAX)

 	SET @stmt = 'SELECT * FROM dbo.products WHERE 1=1';

	--IF ISNULL(@keyword,'')<>''
    --set @stmt = @stmt + ' AND '+ @keyword + ' like ''%' + @search_val  + '%'''

	exec(@stmt);
 END;
