
CREATE PROCEDURE [dbo].[classes_sel]
(
    @class_id  INT = null
   ,@user_id INT = NULL
)
AS
BEGIN
	DECLARE @stmt		VARCHAR(4000);
 	SET @stmt = 'SELECT * FROM dbo.classes WHERE 1=1 ';

    
	IF @class_id <> '' 
	    SET @stmt = @stmt + ' AND id'+ @class_id;

	exec(@stmt);
 END;

