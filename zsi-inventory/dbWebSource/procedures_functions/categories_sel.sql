
CREATE PROCEDURE [dbo].[categories_sel]
(
    @category_id  INT = null
   ,@user_id INT = NULL
)
AS
BEGIN
	DECLARE @stmt		VARCHAR(4000);
 	SET @stmt = 'SELECT * FROM dbo.categories WHERE 1=1 ';

    
	IF @category_id <> '' 
	    SET @stmt = @stmt + ' AND id'+ @category_id;

	exec(@stmt);
 END;

