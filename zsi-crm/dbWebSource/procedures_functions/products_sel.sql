


CREATE PROCEDURE [dbo].[products_sel]
( 
	@user_id INT = NULL
   ,@is_active char(1) = 'Y'
)
AS
BEGIN
	SET NOCOUNT ON
	DECLARE @stmt NVARCHAR(MAX)

 	SET @stmt = 'SELECT * FROM dbo.products_v WHERE 1=1';
	IF @is_active <> NULL
	   SET @stmt = CONCAT(@stmt,' AND is_active = ',@is_active); 

	exec(@stmt);
 END;
