

CREATE PROCEDURE [dbo].[client_applications_sel]
( 
	@user_id INT = NULL
   ,@is_active VARCHAR(1)='Y'
   ,@client_id  INT = null
)
AS
BEGIN
	SET NOCOUNT ON
	DECLARE @stmt NVARCHAR(MAX)

 	SET @stmt = 'SELECT * FROM dbo.client_applications WHERE';

	IF @is_active <> ''
		SET @stmt = @stmt + ' is_active='''+ @is_active + '''';

	IF  ISNULL(@client_id,0) <> 0
	    SET @stmt = @stmt + ' AND client_id ='+ cast(@client_id as varchar(20));

	exec(@stmt);
 END;
