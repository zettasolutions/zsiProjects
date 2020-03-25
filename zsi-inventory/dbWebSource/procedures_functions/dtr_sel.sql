CREATE PROCEDURE [dbo].[dtr_sel]
(
    @id  INT = null
   ,@user_id INT = NULL
   ,@col_no INT = 3
   ,@order_no INT = 0
)
AS
BEGIN
	DECLARE @stmt		VARCHAR(4000);
	DECLARE @order      VARCHAR(4000);
 	SET @stmt = 'SELECT * FROM dbo.dtr WHERE 1=1 ';
	SET @order = ' ORDER BY ' + CAST(@col_no + 1 AS VARCHAR(1)) + ' ' + IIF(@order_no=0,'ASC','DESC');  
    
	IF @id <> '' 
	    SET @stmt = @stmt + ' AND id'+ @id;

	exec(@stmt);
 END;



