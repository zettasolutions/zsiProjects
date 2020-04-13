
CREATE PROCEDURE [dbo].[clients_sel]
( 
	@user_id INT = NULL
   ,@search_val nvarchar(100)=null
   ,@is_active VARCHAR(1)='Y'
)
AS
BEGIN
	SET NOCOUNT ON
	DECLARE @stmt NVARCHAR(MAX)

 	SET @stmt = 'SELECT * FROM dbo.clients WHERE';

	IF @is_active <> ''
		SET @stmt = @stmt + ' is_active='''+ @is_active + '''';

	IF ISNULL(@search_val,'')<>''
       set @stmt = @stmt + ' AND client_code like ''%' + @search_val  + '%'' or client_name like ''%' + @search_val  + '%'''

	exec(@stmt);
 END;