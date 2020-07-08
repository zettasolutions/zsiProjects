

CREATE PROCEDURE [dbo].[client_contracts_sel]
( 
	@user_id INT = NULL
   ,@search_val nvarchar(100)=null
   ,@is_active VARCHAR(1)='Y'
)
AS
BEGIN
	SET NOCOUNT ON
	DECLARE @stmt NVARCHAR(MAX)

 	SET @stmt = 'SELECT * FROM dbo.client_contracts_v WHERE 1=1';

	IF @is_active <> ''
		SET @stmt = @stmt + ' AND is_active='''+ @is_active + '''';

	IF ISNULL(@search_val,'')<>''
       set @stmt = @stmt + ' AND client_name like ''%' + @search_val  + '%'' or contract_no like ''%' + @search_val  + '%'''

	exec(@stmt);
 END;
