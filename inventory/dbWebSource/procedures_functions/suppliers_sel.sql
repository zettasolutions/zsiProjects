
CREATE PROCEDURE [dbo].[suppliers_sel]
(
    @supplier_id  INT = null
   ,@is_active  varchar(200) = 'Y'
)
AS
BEGIN
	DECLARE @stmt		VARCHAR(4000);

	SET @stmt = 'SELECT * FROM dbo.suppliers_v WHERE is_active  = ''' + @is_active   + '''';
	IF @supplier_id <> '' 
		SET @stmt = @stmt + ' AND supplier_id='+ CAST(@supplier_id AS VARCHAR(50));
   exec (@stmt);
end
