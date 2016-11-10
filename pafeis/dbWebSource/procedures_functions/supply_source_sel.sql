
-- =============================================
-- Author:		Rogelio T. Novo Jr.
-- Create date: October 25, 2016 4:37 PM
-- Description:	Supply source select all or by id records.
-- =============================================
CREATE PROCEDURE [dbo].[supply_source_sel]
(
    @supply_source_id  INT = null
)
AS
BEGIN

SET NOCOUNT ON

  IF @supply_source_id IS NOT NULL  
	 SELECT * FROM dbo.supply_source WHERE supply_source_id = @supply_source_id; 
  ELSE
     SELECT * FROM dbo.supply_source
	 ORDER BY supply_source_name; 
	
END

