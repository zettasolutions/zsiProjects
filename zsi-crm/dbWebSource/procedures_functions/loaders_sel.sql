
CREATE PROCEDURE [dbo].[loaders_sel]
( 
	@user_id INT = NULL
   ,@search_val nvarchar(100)=null
   ,@is_active char(1)='Y'
   ,@is_zload char(1)='Y'
)
AS
BEGIN
	SET NOCOUNT ON
	DECLARE @stmt NVARCHAR(MAX)

 	SET @stmt = 'SELECT * FROM dbo.clients_loader_v WHERE is_zload='''+ @is_zload + '''';

	IF @is_active <> ''
		SET @stmt = @stmt + ' AND is_active='''+ @is_active + '''';

	IF ISNULL(@search_val,'')<>''
       set @stmt = @stmt + ' AND client_code like ''%' + @search_val  + '%'' or client_name like ''%' + @search_val  + '%'''

	exec(@stmt);
 END;