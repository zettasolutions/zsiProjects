
CREATE PROCEDURE [dbo].[units_conv_sel]
(
    @conv_id  INT = null
  )
AS

 BEGIN
	DECLARE @stmt		VARCHAR(4000);
    SET @stmt = 'SELECT * FROM dbo.units_conv'
    
	IF @conv_id <> '' 
	    SET @stmt = @stmt + ' AND conv_id'+ @conv_id;

    exec(@stmt);
 END;
