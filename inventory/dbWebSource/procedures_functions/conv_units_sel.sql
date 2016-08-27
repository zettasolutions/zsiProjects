CREATE PROCEDURE [dbo].[conv_units_sel]
(
    @conv_id  INT = null
  )
AS

 BEGIN
	DECLARE @stmt		VARCHAR(4000);
    SET @stmt = 'SELECT * FROM dbo.conv_units'
    
	IF @conv_id <> '' 
	    SET @stmt = @stmt + ' AND conv_id'+ @conv_id;

    exec(@stmt);
 END;