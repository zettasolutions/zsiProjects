CREATE PROCEDURE [dbo].[dtr_sel]
(
    @id  INT = null
   ,@client_id int = null
   ,@user_id INT = NULL
   ,@col_no INT = 3
   ,@order_no INT = 0
)
AS
BEGIN
	DECLARE @stmt		VARCHAR(4000);
	DECLARE @order      VARCHAR(4000);
 	SET @stmt = 'SELECT * FROM dbo.dtr_v WHERE 1=1 ';
	SET @order = ' ORDER BY ' + CAST(@col_no + 1 AS VARCHAR(1)) + ' ' + IIF(@order_no=0,'ASC','DESC');  
    
	IF ISNULL(@id,0) <> 0 
	    SET @stmt = @stmt + ' AND id='+ CAST(@id AS VARCHAR(20));

	IF ISNULL(@client_id,0) <> 0 
	    SET @stmt = @stmt + ' AND client_id='+ CAST(@client_id AS VARCHAR(20));

	exec(@stmt);
 END;



