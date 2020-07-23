

CREATE PROCEDURE [dbo].[client_contracts_sel]
( 
	@user_id INT = NULL
   ,@keyword nvarchar(100)=null
   ,@search_val nvarchar(100)=null
   ,@is_active VARCHAR(1)='Y'
)
AS
BEGIN
	SET NOCOUNT ON
	DECLARE @stmt NVARCHAR(MAX)

 	SET @stmt = 'SELECT * FROM dbo.clients_v WHERE 1=1';

	IF @is_active <> ''
		SET @stmt = @stmt + ' AND is_active='''+ @is_active + '''';

	IF ISNULL(@keyword,'')<>''
    set @stmt = @stmt + ' AND '+ @keyword + ' like ''%' + @search_val  + '%'''

	exec(@stmt);
 END;
