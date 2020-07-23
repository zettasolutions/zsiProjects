
CREATE PROCEDURE [dbo].[checkValueExistsEmail] 
(
    @table_name     VARCHAR(20)
   ,@colname  NVARCHAR(20)
   ,@keyword NVARCHAR(100)
   ,@user_id INT=null

)
AS
BEGIN
	DECLARE @stmt    NVARCHAR(4000);
    SET @stmt = 'SELECT * FROM dbo.' + @table_name + ' WHERE ' + @colname + '=''' + @keyword +''''; 

	exec(@stmt);
END




 





