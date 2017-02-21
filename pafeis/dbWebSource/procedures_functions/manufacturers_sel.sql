
-- =============================================
-- Author:		Rogelio T. Novo Jr.
-- Create date: October 24, 2016 10:01 PM
-- Description:	Manufacturer select all or by id records.
-- =============================================
CREATE PROCEDURE [dbo].[manufacturers_sel]
(
    @manufacturer_id  INT = null
   ,@is_local          char(1) = null
   ,@is_active         char(1) = 'Y'
)
AS
BEGIN

SET NOCOUNT ON
DECLARE @stmt NVARCHAR(MAX)
  SET @stmt = 'SELECT * FROM dbo.manufacturers WHERE is_active=''' + @is_active + ''''


  IF @manufacturer_id IS NOT NULL  
	 SET @stmt = @stmt + ' AND manufacturer_id = ' + cast(@manufacturer_id as varchar(20)); 
 
  IF @is_local IS NOT NULL
     SET @stmt = @stmt + ' AND is_local =''' + @is_local + '''';

  SET @stmt = @stmt + ' ORDER BY manufacturer_name '; 

  exec(@stmt);	
END


