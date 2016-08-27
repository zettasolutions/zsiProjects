CREATE PROCEDURE [dbo].[denomination_ref_sel]
(
    @denomination_id  INT = null
   ,@denomination VARCHAR(50) = NULL

)
AS
BEGIN
	DECLARE @stmt		VARCHAR(4000);
	SET @stmt = 'SELECT * FROM dbo.denomination_ref WHERE 1=1 ';

	IF @denomination_id <> '' 
	SET @stmt = @stmt + ' AND denomination_id' + CAST(@denomination_id AS VARCHAR);

	IF @denomination <> ''
		SET @stmt = @stmt + ' AND denomination'+ @denomination_id;
    set @stmt = @stmt + ' order by denomination'
	exec(@stmt);
 END;

