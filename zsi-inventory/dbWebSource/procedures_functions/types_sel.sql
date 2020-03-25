
CREATE PROCEDURE [dbo].[types_sel]
(
    @type_id  INT = null
   ,@user_id INT = NULL
)
AS
BEGIN
	DECLARE @stmt		VARCHAR(4000);
 	SET @stmt = 'SELECT * FROM dbo.types WHERE 1=1 ';

    
	IF @type_id <> '' 
	    SET @stmt = @stmt + ' AND id'+ @type_id;

	exec(@stmt);
 END;

