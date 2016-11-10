
-- =============================================
-- Author:		Rogelio T. Novo Jr.
-- Create date: October 24, 2016 10:01 PM
-- Description:	Manufacturer select all or by id records.
-- =============================================
CREATE PROCEDURE [dbo].[manufacturer_sel]
(
    @manufacturer_id  INT = null
)
AS
BEGIN

SET NOCOUNT ON

  IF @manufacturer_id IS NOT NULL  
	 SELECT * FROM dbo.manufacturer WHERE manufacturer_id = @manufacturer_id; 
  ELSE
     SELECT * FROM dbo.manufacturer
	 ORDER BY manufacturer_name; 
	
END


